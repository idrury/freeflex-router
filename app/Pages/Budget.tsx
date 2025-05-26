import { useEffect, useState } from "react";
import {
  fetchAllInvoices,
  fetchExpenses,
  insertError,
} from "../Functions/DBAccess";
import { DateTime, Duration, Interval } from "luxon";

import spinners from "react-spinners";
import AddExpensePopup from "../Elements/Budget/AddExpensePopup";
import PageHeader from "../Elements/PageHeader";
import {
  FFExpense,
  FFProfile,
  FFSimpleInvoice,
  FFSimpleRecurringExpense,
  popSavedModalFn,
  SavedModalType,
} from "../assets/Types";
import React from "react";
import {
  filterExpenses,
  filterInvoices,
  groupExpensesByCategory,
  groupInvoicesByClient,
} from "../Elements/Budget/BudgetBL";
import BudgetSummaryCard from "../Elements/Budget/BudgetSummaryCard";
import ProfitInformation from "../Elements/Budget/ProfitInformation";
import IncomeSummary from "../Elements/Budget/IncomeSummary";
import ExpenseSummary from "../Elements/Budget/ExpenseSummary";
import PredictedProfitSummary from "../Elements/Budget/PredictedProfitSummary";
import BudgetMenu from "../Elements/Budget/BudgetMenu";
import IonIcon from "@reacticons/ionicons";
import BulkImportMenu from "../Elements/CsvImport/ImportMenu";

type BudgetParams = {
  profile: FFProfile;
  menuVisible: boolean;
  inShrink: boolean;
  popSavedModal: popSavedModalFn;
};

/****************************************************************
 * This component is the page where users can see
 * and overview of their budget, and perform
 * budget related tasks
 * @returns
 */
export default function Budget({
  profile,
  menuVisible,
  inShrink,
  popSavedModal,
}: BudgetParams) {
  const [rangeMonths, setRangeMonths] = useState<number>(6);
  const [selectedPanel, setSelectedPanel] = useState(0);

  // Expenses state
  const [expenses, setExpenses] = useState<FFExpense[]>();
  const [categorisedExpenses, setCategorisedExpenses] =
    useState<{ category: string; value: number }[]>();
  const [filteredExpenses, setFilteredExpenses] =
    useState<FFExpense[]>();
  const [expenseAmt, setExpenseAmt] = useState<number>();

  // Invoices state
  const [invoices, setInvoices] = useState<FFSimpleInvoice[]>();
  const [filteredInvoices, setFilteredInvoices] =
    useState<FFSimpleInvoice[]>();
  const [invoicesByClient, setInvoicesByClient] =
    useState<{ client: string; amount: number }[]>();
  const [income, setIncome] = useState<number>();

  // Profit state
  const [profit, setProfit] = useState<number>();
  const [profitAvg, setProfitAvg] = useState<number>();
  const [annualPrediction, setAnnualPrediction] = useState<number>();
  const [profitByMonth, setProfitByMonth] = useState<
    { period: string; amount: number }[]
  >([]);
  const [unpaidInvoiceSum, setUnpaidInvoiceSum] = useState<number>();

  // Expense popup state
  const [expensePopupActive, setExpensePopupActive] = useState(false);
  const [expLoadingSave, setExpLoadingSave] = useState(false);
  const [expenseId, setExpenseId] = useState<number | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>();
  const [amount, setAmount] = useState<string>();
  const [url, setUrl] = useState<string | null>();
  const [deductible, setDeductible] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [recurringFrequency, setRecurringFrequency] =
    useState("daily");
  const [recurringExpenseId, setRecurringExpenseId] = useState<
    number | null
  >();
  const [uploadFile, setUploadFile] = useState(null);
  const [downloadFile, setDownloadFile] = useState<string | null>();
  const [edited, setEdited] = useState(false);

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [menuActive, setMenuActive] = useState(false);
  const [importMenuActive, setImportMenuActive] = useState(false);

  useEffect(() => {
    getData();
  }, [rangeMonths]);

  /*****************************************************
   * Fetch the data required for this page from the database
   *
   * @param forceFetch Whether to get the data from the database
   * or use the current local version of the data
   */
  async function getData(forceFetch = false) {
    if (forceFetch == false && expenses && invoices) {
      filterData(expenses, invoices, rangeMonths);
      setLoading(false);
      return;
    }
    try {
      if (!forceFetch == true) setLoading(true);

      let exp = await fetchExpenses();
      let inv = await fetchAllInvoices();

      setExpenses(exp);
      setInvoices(inv);

      filterData(exp, inv, rangeMonths);
    } catch (error) {
      alert("An error has occured getting your data");
      insertError(error, Error().stack?.toString(), {}, null);
      setLoading(false);
    }

    setLoading(false);
  }

  /*******************************************************
   * Filter the expense and invoice data and perform
   * caculations and aggregations on it
   * @param exp The array of expenses to use
   * @param inv The array of invoices to use
   * @param range the time period
   */
  function filterData(
    exp: FFExpense[],
    inv: FFSimpleInvoice[],
    range: number
  ) {
    let duration = Duration.fromObject({ month: range });
    let intervalEnd = DateTime.now();
    let intervalStart = intervalEnd.minus(duration);
    let timeInterval = Interval.fromDateTimes(
      intervalStart,
      intervalEnd
    );

    const {
      totalExpenses,
      filteredExpenses,
      rangeExpenses,
      expenseGroupings,
    } = filterExpenses(exp, timeInterval);
    const {
      totalEarnings,
      filteredInvoices,
      rangeEarnings,
      paidInvoices,
      unpaidInvoices,
    } = filterInvoices(inv, timeInterval);

    let profitAvg = Math.round(
      (rangeEarnings - rangeExpenses) / range
    );

    setFilteredExpenses(filteredExpenses);
    setFilteredInvoices(filteredInvoices);
    setProfitAvg(profitAvg);
    setProfit(
      Math.round((rangeEarnings - rangeExpenses) * 100) / 100
    );
    setIncome(Math.round(rangeEarnings * 100) / 100);
    setExpenseAmt(Math.round(rangeExpenses * 100) / 100);
    setAnnualPrediction(Math.round(profitAvg * 12 * 100) / 100);
    setProfitByMonth(
      calculateProfitMonths(paidInvoices, expenseGroupings)
    );

    setCategorisedExpenses(groupExpensesByCategory(filteredExpenses));
    setInvoicesByClient(groupInvoicesByClient(filteredInvoices));
  }

  // Calcualte profit from invoice and expense arrays
  function calculateProfitMonths(invByMonth, expByMonth) {
    let profitMonths = new Array<{
      period: string;
      amount: number;
    }>();
    let expenseFound = false;

    // Assumes inv and exp have both been sorted by month
    for (let i = 0; i < invByMonth.length; i++) {
      if (
        expenseFound == false &&
        (invByMonth[i].amount != 0 || expByMonth[i].amount != 0)
      ) {
        expenseFound = true;
      }

      if (expenseFound == true)
        profitMonths.push({
          period: invByMonth[i].period,
          amount: invByMonth[i].amount - expByMonth[i].amount,
        });
    }

    return profitMonths;
  }

  /***************************
   * Close the expense panel
   */
  function closeExpense() {
    setExpenseId(null);
    setDate(new Date());
    setDescription("");
    setCategory(null);
    setAmount("");
    setDeductible(false);
    setIsRecurring(false);
    setUrl(null);
    setRecurringFrequency("daily");
    setEndDate(new Date());
    setRecurringExpenseId(null);
    setExpensePopupActive(false);
    setExpLoadingSave(false);
    setDownloadFile(null);
    setUploadFile(null);
    setEdited(false);
  }

  /*********************************************************
   * Refresh the data when expenses are updated
   * @param forceFetch Whether new data should be fetched
   * @param updated If the expense was updated not inserted
   */
  function onExpenseUpdate(forceFetch: boolean, updated = false) {
    popSavedModal(
      `Expense ${updated == true ? "created" : "updated"}`
    );
    getData(forceFetch);
  }

  /*************************************************
   * Show expense editing panel when an expense is clicked on
   * @param exp The expense to show
   */
  function onExpenseClick(exp?: FFExpense) {
    setExpensePopupActive(true);

    if (!exp) return;

    setExpenseId(exp.id);
    setDate(new Date(exp.date));
    setEndDate(
      new Date(
        (exp.recurring_expenses as FFSimpleRecurringExpense)
          ?.end_date || new Date()
      )
    );
    setDescription(exp.description);
    setCategory(exp.category);
    setAmount(exp.amount.toString());
    setUrl(exp.url);
    setDeductible(exp.is_deductible);

    setRecurringExpenseId(
      (exp.recurring_expenses as FFSimpleRecurringExpense)?.id || null
    );
    setRecurringFrequency(
      (exp.recurring_expenses as FFSimpleRecurringExpense)
        ?.frequency || "daily"
    );
    setIsRecurring(exp.recurring_expenses ? true : false);
    setDownloadFile(exp.file);
  }

  return (
    <div className="centerContainer hundred">
      <BudgetMenu
        active={menuActive}
        onClose={() => setMenuActive(false)}
        popSavedModal={popSavedModal}
        activateImportMenu={() => setImportMenuActive(true)}
      />

      <BulkImportMenu
        active={importMenuActive}
        onClose={() => setImportMenuActive(false)}
        popSavedModal={popSavedModal}
      />
      <AddExpensePopup
        isActive={expensePopupActive}
        close={closeExpense}
        loadingSave={expLoadingSave}
        setLoadingSave={setExpLoadingSave}
        onSubmit={onExpenseUpdate}
        date={date}
        setDate={setDate}
        endDate={endDate}
        setEndDate={setEndDate}
        description={description}
        deductible={deductible}
        isRecurring={isRecurring}
        recurringFrequency={recurringFrequency}
        recurringExpenseId={recurringExpenseId}
        setRecurringExpenseId={setRecurringExpenseId}
        setDescription={setDescription}
        url={url}
        setUrl={setUrl}
        amount={amount}
        setAmount={setAmount}
        category={category}
        setCategory={setCategory}
        setDeductible={setDeductible}
        setIsRecurring={(val) => {
          setIsRecurring(val);
          setDate(new Date());
        }}
        setRecurringFrequency={setRecurringFrequency}
        edited={edited}
        setEdited={setEdited}
        downloadFile={downloadFile}
        setDownloadFile={setDownloadFile}
        setUploadFile={setUploadFile}
        uploadFile={uploadFile}
        throwError={popSavedModal}
        userId={profile.id}
        id={expenseId}
        numExpenses={expenses?.length || 0}
        role={profile.role}
        activateImportMenu={() => setImportMenuActive(true)}
      />

      {loading ? (
        <div className="loadingContainer">
          {" "}
          <spinners.ClimbingBoxLoader
            className="loader mediumFade"
            color="var(--primaryColor)"
          />{" "}
        </div>
      ) : (
        <div className="mediumFade">
          <div className="row m0 middle">
            <div className="leftRow m0 p0">
              <PageHeader
                text="Budget"
                icon="card-sharp"
                menuVisible={menuVisible}
                inShrink={inShrink}
              />
              <select
                className="boxedDark"
                onChange={(e) =>
                  setRangeMonths(parseInt(e.target.value))
                }
                defaultValue={rangeMonths}
              >
                <option value={1}>last month</option>
                <option value={3}>3 months</option>
                <option value={6}>6 months</option>
                <option value={12}>12 months</option>
              </select>
            </div>
            <div className="rightRow">
              <button
                style={{ height: 45 }}
                className="accentButton"
                onClick={() => setExpensePopupActive(true)}
              >
                + Expense
              </button>
              <button
                onClick={() => setMenuActive(true)}
                className="leftRow middle center"
                style={{ height: 45, width: 45 }}
              >
                <IonIcon
                  name="ellipsis-horizontal"
                  style={{ display: "flex", height: 20, width: 20 }}
                />
              </button>
            </div>
          </div>

          <div className="row">
            <div
              className="centerRow dynamicSize hundred"
              style={{ alignItems: "stretch" }}
            >
              <BudgetSummaryCard
                title="profit"
                amount={profit || 0}
                subAmount={`${profitAvg} per month`}
                active={selectedPanel == 0}
                onClick={() => setSelectedPanel(0)}
              />

              <BudgetSummaryCard
                title="Income"
                amount={income || 0}
                active={selectedPanel == 1}
                onClick={() => setSelectedPanel(1)}
              />
            </div>

            <div
              className="centerRow dynamicSize hundred"
              style={{
                alignItems: "stretch",
                textTransform: "uppercase",
              }}
            >
              <BudgetSummaryCard
                title="Expenses"
                amount={expenseAmt || 0}
                active={selectedPanel == 2}
                onClick={() => setSelectedPanel(2)}
              />
              <BudgetSummaryCard
                title="Predicted annual profit"
                amount={annualPrediction || 0}
                active={selectedPanel == 3}
                onClick={() => setSelectedPanel(3)}
              />
            </div>
          </div>
          {selectedPanel == 0 && (
            <ProfitInformation
              profitByMonth={profitByMonth}
              expensesByCategory={categorisedExpenses}
              invoicesByClient={invoicesByClient}
              expenseSum={expenseAmt}
              incomeSum={income}
              onImportClick={() => setImportMenuActive(true)}
              onExpenseClick={() => onExpenseClick()}
            />
          )}

          {selectedPanel == 1 && (
            <IncomeSummary
              invoices={filteredInvoices}
              onImportClick={() => setImportMenuActive(true)}
            />
          )}

          {selectedPanel == 2 && (
            <ExpenseSummary
              expenses={filteredExpenses}
              onExpenseClick={onExpenseClick}
              expensesByCategory={categorisedExpenses}
              expenseSum={expenseAmt}
              onImportClick={() => {
                setImportMenuActive(true);
              }}
            />
          )}

          {selectedPanel == 3 && <PredictedProfitSummary />}
        </div>
      )}
    </div>
  );
}
