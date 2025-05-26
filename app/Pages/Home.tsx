import { useEffect, useState } from "react";
import {
  fetchActiveProjects,
  fetchExpensesByCategory,
  fetchMonthInvoices,
} from "../Functions/DBAccess";
import IncomeAreaChart from "../Elements/Charts/IncomeAreaChart";
import ProfitWidget from "../Elements/ProfitWidget";
import ProjectWidget from "../Elements/ProjectWidget";
import GearPieChart from "../Elements/GearPieChart";
import spinners from "react-spinners";
import BudgetBarChart from "../Elements/BudgetBarChart";
import { DateTime, Duration } from "luxon";
import ErrorPopup from "../Elements/ErrorPopup";
import PageHeader from "../Elements/PageHeader";
import React from "react";
import {
  FFInvoice,
  FFProject,
  SavedModalType,
} from "../assets/Types";
import { Link } from "react-router-dom";
import IonIcon from "@reacticons/ionicons";
import { reRouteTo } from "../Functions/commonFunctions";

export default function Home({ menuVisible, inShrink }) {
  const [loading, setLoading] = useState(true);

  const [invoiceData, setInvoiceData] =
    useState<{ date: any; value: number }[]>();
  const [expensesByCategory, setExpensesByCategory] =
    useState<{ category: any; value: number }[]>();
  const [activeProjects, setActiveProjects] = useState<FFProject[]>();

  const [projectsDue, setProjectsDue] = useState<number>();
  const [totalExpenses, setTotalExpenses] = useState<number>();
  const [totalIncome, setTotalIncome] = useState<number>();

  const TEMP_EXPENSES = [
    { date: "Jan 5", value: 0 },
    { date: "Jan 5", value: 300 },
    { date: "Jan 7", value: 100 },
    { date: "Jan 8", value: 200 },
    { date: "Jan 10", value: 50 },
    { date: "Jan 15", value: 400 },
    { date: "Jan 15", value: 0 },
  ];
  const TEMP_INVOICES = [
    { name: "Equipment", value: 100 },
    { name: "Travel", value: 200 },
  ];

  const [error, setError] = useState<SavedModalType>({
    visible: false,
    header: undefined,
    body: undefined,
  });

  useEffect(() => {
    loadPage();
  }, []);

  useEffect(() => {}, []);

  async function loadPage() {
    setLoading(true);
    await getActiveProjects();
    await getInvoices();
    await getExpenses();

    setLoading(false);
  }

  async function getInvoices() {
    try {
      let invoices = await fetchMonthInvoices();
      setTotalIncome(calculateTotalEarnings(invoices));
      setInvoiceData(invoices);
    } catch (error) {
      setError({
        visible: true,
        header: "Error retrieving invoice data.",
        body: "Something went wrong while attempting to get your invoice data. Try refreshing the page!",
      });
    }
  }

  async function getExpenses() {
    try {
      const expenses = await fetchExpensesByCategory();
      setTotalExpenses(calculateTotalExpenses(expenses));
      setExpensesByCategory(expenses);
    } catch (error) {
      setError({
        visible: true,
        header: "Error retrieving expenses.",
        body: "Something went wrong while attempting to get your expense data. Try refreshing the page!",
      });
    }

    setLoading(false);
  }

  async function getActiveProjects() {
    try {
      let activeProjects = await fetchActiveProjects();
      setActiveProjects(await fetchActiveProjects());
      setProjectsDue(getProjectsDueThisweek(activeProjects));
    } catch (error) {
      setError({
        visible: true,
        header: "Error retrieving projects.",
        body: "Something went wrong while attempting to get your project information. Try refreshing the page!",
      });
    }
  }

  function calculateTotalExpenses(expensesByCategory) {
    let total = 0;

    if (expensesByCategory) {
      for (let i = 0; i < expensesByCategory.length; i++) {
        total += expensesByCategory[i].value;
      }
    }

    return total;
  }

  function calculateTotalEarnings(invoiceData) {
    let total = 0;

    if (invoiceData) {
      for (let i = 0; i < invoiceData.length; i++) {
        total += invoiceData[i].value;
      }
    }

    return total;
  }

  function getProjectsDueThisweek(activeProjects: FFProject[]) {
    const now = DateTime.now();
    const weekFromNow = now.plus(Duration.fromObject({ weeks: 1 }));

    let projectCount = 0;

    if (!activeProjects) return -1;

    if (activeProjects.length <= 0) {
      return 0;
    }

    // Get the different in days to calculate projects due this week
    for (let i = 0; i < activeProjects.length; i++) {
      if (
        activeProjects[i].project_delivery_date.date &&
        isDateInRange(
          activeProjects[i].project_delivery_date.date,
          weekFromNow
        ) == true
      ) {
        projectCount++;
      }
    }

    return projectCount;
  }

  function isDateInRange(date, weekFromNow) {
    let projectDate = DateTime.fromISO(date);
    let dif = weekFromNow.diff(projectDate).toFormat("d");

    if (dif >= 0 && dif <= 7) {
      return true;
    }

    return false;
  }

  return (
    <div>
      {loading ? (
        <div className="loadingContainer">
          {" "}
          <spinners.ClimbingBoxLoader
            className="loader mediumFade"
            color="var(--primaryColor)"
          />{" "}
        </div>
      ) : (
        <div className="centerContainer mediumFade" style={{}}>
          <ErrorPopup
            active={error.visible}
            setActive={() =>
              setError({
                visible: false,
                header: undefined,
                body: undefined,
              })
            }
            /*@ts-ignore */
            headerText={error.header || ""}
            text={error.body}
            hideOops
          />

          <PageHeader
            text="Home"
            icon="home-sharp"
            inShrink={inShrink}
            menuVisible={menuVisible}
          />

          <div className="row">
            <ProjectWidget
              data={[
                {
                  name: "activeProjects",
                  value: activeProjects?.length,
                },
                {
                  name: "dueProjects",
                  value: projectsDue,
                },
              ]}
            />
            <div className="dynamicSize boxed fifty boxedOutline">
              {totalExpenses || totalIncome ? (
                <BudgetBarChart
                  data={[
                    {
                      name: "expenses",
                      value: totalExpenses,
                    },
                    {
                      name: "earnings",
                      value: totalIncome,
                    },
                  ]}
                />
              ) : (
                <div
                  style={{ height: 300 }}
                  className="col center middle m2 p2 slowFade"
                >
                  <IonIcon
                    name="pie-chart"
                    style={{
                      width: 200,
                      height: 200,
                      color: "var(--smallAccent)",
                    }}
                  />
                  <p className="m0 mb2 mt2 textCenter boxedDark">
                    Your budget data will appear here once you're up and running.
                  </p>
                  <button className="accentButton" onClick={() => reRouteTo("/projects")}>
                    <p className="m0">Start by creating a project</p>
                  </button>
                </div>
              )}
            </div>
            <ProfitWidget
              data={[
                {
                  name: "earnings",
                  value: totalIncome,
                },
                {
                  name: "expenses",
                  value: totalExpenses,
                },
              ]}
            />
          </div>

          <div className="row">
            <div className="fifty boxed boxedOutline">
              <h2 className="m2">Daily Income</h2>
              <IncomeAreaChart
                data={
                  (invoiceData && invoiceData?.length > 0) ||
                  (totalExpenses && totalExpenses > 0)
                    ? invoiceData
                    : TEMP_EXPENSES
                }
              />
            </div>
            <div className="fifty boxed boxedOutline">
              <h2 className="m2">Expenses</h2>
              <GearPieChart
                data={
                  (expensesByCategory &&
                    expensesByCategory?.length > 0) ||
                  (totalIncome && totalIncome > 0)
                    ? expensesByCategory
                    : TEMP_INVOICES
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
