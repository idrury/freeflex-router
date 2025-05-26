import { useEffect, useState } from "react";
import AddExpensePopup from "../Elements/Budget/AddExpensePopup";

import { fetchAllInvoices, fetchExpenses, fetchExpensesByCategory } from "../Functions/DBAccess";
import ExpenseEarningGraph from "../Elements/ExpenseEarningGraph";
import IncomePieChart from "../Elements/Charts/IncomePieChart"
import GearPieChart from "../Elements/GearPieChart";
import ProfitAreaChart from "../Elements/Charts/ProfitAreaChart"
import { createMonthString, formatDatestring, getValidYearMonths } from "../Functions/Dates";
import IncomeAreaChart from "../Elements/Charts/IncomeAreaChart";
import { getYearMonth } from "../Functions/Dates";
import { reRouteTo } from "../Functions/commonFunctions";
import spinners from "react-spinners";
import { Link } from "react-router-dom";
import IonIcon from "@reacticons/ionicons";
import ErrorPopup from "../Elements/ErrorPopup";
import { DateTime, Duration, Interval } from "luxon";

export default function BudgetV1({uid, role}) {

    const [loading, setLoading] = useState(true);

    const [allExpenses, setAllExpenses] = useState(null);
    const [allInvoices, setAllInvoices] = useState(null);

    const [expensesByCategory, setExpensesByCategory] = useState([]);
    const [invoiceData, setInvoiceData] = useState(null);
    const [expenseMonthData, setExpenseMonthData] = useState(null);
    const [clientTotals, setClientTotals] = useState([]);
    const [profitByMonth, setProfitByMonth] = useState([]);
    
    const [filteredExpenses, setFilteredExpenses] = useState(null);
    const [filteredInvoices, setFilteredInvoices] = useState(null);

    const [forecastMonths, setForecastMonths] = useState(1);

    const [recentTotal, setRecentTotal] = useState(null);
    const [recentAverage, setRecentAverage] = useState(null);
    const [annualPrediction, setAnnualPrediction] = useState(null);
    const [totalExpenses, setTotalExpenses] = useState(null);
    const [totalIncome, setTotalIncome] = useState(null);

    const [expensePopupActive, setExpensePopupActive] = useState(false);
    const [expLoadingSave, setExpLoadingSave] = useState(false);
    const [expenseId, setExpenseId] = useState(null);
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(null);
    const [amount, setAmount] = useState();
    const [url, setUrl] = useState(null);
    const [deductible, setDeductible]  = useState(false);
    const [isRecurring, setIsRecurring] = useState(false);
    const [endDate, setEndDate] = useState(new Date());
    const [recurringFrequency, setRecurringFrequency] = useState('daily');
    const [recurringExpenseId, setRecurringExpenseId] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [downloadFile, setDownloadFile] = useState(null);
    const [edited, setEdited] = useState(false);

    const [errorActive, setErrorActive] = useState(false);
    const [errorText, setErrorText] = useState(null);

    useEffect(() => {
        getData();
    },[])

    async function getData() {
        try {
            let exp = await getExpenses();
            let inv = await getInvoices();
            await getExpensesByCategory();
    
            groupProfitByMonth(inv, exp, forecastMonths);
            closeExpense();
            setLoading(false);


        } catch (error) {
            reRouteTo("/Error")
        }
    }

    async function getExpenses() {
        try {
            let exp = await fetchExpenses();
            setAllExpenses(exp);
            return exp;
        } catch (error) {
            throw error;
        }

    }

    async function getInvoices() {
        try {
            let invoices = await fetchAllInvoices();
            setAllInvoices(invoices);
            groupIncomeByClient(invoices);
    
            return invoices;
        } catch (error) {
            throw error;
        }

    }
    
    async function getExpensesByCategory() {
        try {
            setExpensesByCategory(await fetchExpensesByCategory());
        } catch (error) {
            throw error;
        }

        setLoading(false);
    }

    function calculateTotalExpenses() {
        let total = 0;
        
        if(expensesByCategory) {
            for(let i=0; i<expensesByCategory.length; i++) {
                total += expensesByCategory[i].total;
            }
        }
        
        return total;
    }

    function calculateTotalEarnings() {
        let total = 0;
        
        if(invoiceData) {
            for(let i=0; i<invoiceData.length; i++) {
                total += invoiceData[i].value;
            }
        }

        return total;
    }

    function groupIncomeByClient(invoices) {

        const groupedData = [];

        if(invoices) {
            for(let i=0; i<invoices.length; i++) {
                let clientFound = false;
                let name = invoices[i].projects?.clients?.name || 'NO CLIENT'
                let total = invoices[i].total_amount || 0

                for(let j=0; j<groupedData.length; j++) {
                    if(groupedData[j].name == name) {
                        groupedData[j].total += total;
                        clientFound = true;
                        break;
                    }
                }

            if(clientFound == false)
                groupedData.push({name: name, total: total})
            }

            setClientTotals(groupedData);
        }
    }

    function groupProfitByMonth(inv, exp, range) {

        let groupedProfit = [];
        let groupedInvoices = [];
        let groupedExpenses = [];
        let filteredInvoices = [];
        let filteredExpenses = [];

        let duration = Duration.fromObject({month: range})
        let intervalEnd = DateTime.now();
        let intervalStart = intervalEnd.minus(duration);
        let timeInterval = Interval.fromDateTimes(intervalStart, intervalEnd);

        let validInvoiceMonths = getValidYearMonths(range);
        let validExpenseMonths = getValidYearMonths(range);

        if(!validInvoiceMonths || !validExpenseMonths) {
            alert("invalid search period given");
            return;
        }

        if(inv) {
            for(let i=0; i<inv.length; i++) {
                let monthExists = false;
                let date = inv[i].date;
                let total = inv[i].total_amount;
                let yearMonthDate = getYearMonth(date);

                // Update profit array
                for(let j=0; j<groupedProfit.length; j++) {
                    if(groupedProfit[j].month == yearMonthDate) {
                        monthExists = true;
                        groupedProfit[j].total += total;
                        groupedInvoices[j].value += total;
                        break;
                    }
                }

                // Update filtered invoices
                for(let j=0; j<validInvoiceMonths.length; j++) {
                    if(validInvoiceMonths[j] == yearMonthDate) {
                        filteredInvoices.push(inv[i]);
                    }
                }

                if(monthExists == false) {
                    groupedProfit.push({month: getYearMonth(date), total: total})
                    groupedInvoices.push({date: getYearMonth(date), value: total})
                }
            }
        }

        // Process expenses
        for(let i=0; i<exp.length; i++) {
            let monthExists = false;
            let expMonthExists = false;
            let date = exp[i].date;
            let total = exp[i].amount;
            let yearMonthDate = getYearMonth(date);

            // Update profit array
            for(let j=0; j<groupedProfit.length; j++) {
                if(groupedProfit[j].month == yearMonthDate) {
                    monthExists = true;
                    groupedProfit[j].total -= total;
                    break;
                }
            }

            // Update expense array
            for(let j=0; j<groupedExpenses.length; j++) {
                if(groupedExpenses[j].month == yearMonthDate) {
                    expMonthExists = true;
                    groupedExpenses[j].total += total;
                    break;
                }
            }

            // Update filtered expenses 
            for(let j=0; j<validExpenseMonths.length; j++) {
                if(validExpenseMonths[j] == yearMonthDate) {
                    filteredExpenses.push(exp[i]);
                }
            }

            if(monthExists == false)
                groupedProfit.push({month: getYearMonth(date), total: 0-total});

            if(expMonthExists == false)
                groupedExpenses.push({month: getYearMonth(date), total: total})
        }

        groupedProfit = sortByMonth(groupedProfit);
        groupedExpenses = sortByMonth(groupedExpenses);
        groupedInvoices = sortInvoicesByMonth(groupedInvoices);

        for(let i=0; i<groupedProfit.length; i++) {
            groupedProfit[i].month = createMonthString(groupedProfit[i].month);
        }

        calculateForecast(groupedProfit, groupedInvoices, groupedExpenses, range)
        setInvoiceData(groupedInvoices);
        setExpenseMonthData(groupedExpenses);
        setFilteredInvoices(filteredInvoices);
        setFilteredExpenses(filteredExpenses);
        setProfitByMonth(groupedProfit);
    }

    function sortByMonth(arr) {
        return arr.sort((a, b) => {
          const dateA = new Date(a.month);
          const dateB = new Date(b.month);
      
        return dateA-dateB
        });
      }

      function sortInvoicesByMonth(arr) {
        return arr.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
      
        return dateA-dateB
        });
      }

      function calculateForecast(prof, income, expenses, range) {

        setForecastMonths(range);

        if(!prof) {
            return null;
        }

        let recentTotal = 0;
        let recentIncomeTotal = 0;
        let recentExpenseTotal = 0;
        let recentAvg = 0;
        let numMonthsCounted = 0;
        let validMonths = getValidYearMonths(range);

            for(let j=0; j<validMonths.length; j++) {
                for(let i=prof.length-1; i>=0; i--) {
                    if(getYearMonth(prof[i].month) == validMonths[j]) {
                        recentTotal += prof[i].total;
                        numMonthsCounted++;
                        break;
                    }
                }

                for(let i=0; i<income?.length; i++) {
                    if(getYearMonth(income[i].date) == validMonths[j]) {
                        recentIncomeTotal += income[i].value;
                        break;
                    }
                }

                for(let i=0; i<expenses?.length; i++) {
                    if(getYearMonth(expenses[i].month) == validMonths[j])
                        recentExpenseTotal += expenses[i].total;
                }
            }

        if(recentTotal > 0) {
            recentAvg = recentTotal/numMonthsCounted;
        }
        setRecentTotal(Math.round(recentTotal*100)/100);
        setRecentAverage(Math.round(recentAvg*100)/100);
        setAnnualPrediction(Math.round((recentAvg*12)*100)/100);
        setTotalIncome(Math.round(recentIncomeTotal*100)/100);
        setTotalExpenses(Math.round(recentExpenseTotal*100)/100);
        }

        function closeExpense() {
            setExpenseId(null);
            setDate(new Date());
            setDescription('');
            setCategory(null);
            setAmount('');
            setDeductible(false);
            setIsRecurring(false);
            setUrl(null);
            setRecurringFrequency('daily');
            setEndDate(new Date())
            setRecurringExpenseId(null);
            setExpensePopupActive(false);
            setExpLoadingSave(false);
            setDownloadFile(null);
            setUploadFile(null);
            setEdited(false);
        }

        function throwError(txt) {
            setErrorActive(true);
            setErrorText(txt);
        }

    return (
        <div className="centerContainer">
            <AddExpensePopup 
                isActive={expensePopupActive} 
                setIsActive={closeExpense} 
                loadingSave={expLoadingSave}
                setLoadingSave={setExpLoadingSave}
                onSubmit={getData} 
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
                setIsRecurring={setIsRecurring}
                setRecurringFrequency={setRecurringFrequency}
                edited={edited}
                setEdited={setEdited}
                downloadFile={downloadFile}
                setDownloadFile={setDownloadFile}
                setUploadFile={setUploadFile}
                uploadFile={uploadFile}
                throwError={throwError}
                userId={uid}
                id={expenseId}
                numExpenses={allExpenses?.length || 0}
                role={role}
                />
            {loading ? <div className="loadingContainer"> <spinners.ClimbingBoxLoader className="loader mediumFade" color="var(--primaryColor)"/> </div> : <div className="mediumFade">
            <ErrorPopup active={errorActive} setActive={setErrorActive} text={errorText} />
            <div className="row">

                <div className="leftRow" style={{alignItems: "center"}}>
                    <IonIcon name="card-sharp" size="large"/>
                    <h1 className="centerRow">Budget</h1>
                </div>
                
                <div className="rightRow">
                    <select className="boxedDark" onChange={(e) => groupProfitByMonth(allInvoices, allExpenses, e.target.value)}>
                        <option value={1}>last month</option>
                        <option value={3}>3 months</option>
                        <option value={6}>6 months</option>
                        <option value={12}>12 months</option>
                    </select>
                    <button className="boxedDark" onClick={() => setExpensePopupActive(true)}>+ Expense</button>
                </div>
            </div>
            <div className="row">
                <div className="centerRow dynamicSize hundred" style={{alignItems: "stretch"}}>
                    <div className="boxed hundred">
                        <h2 className="boldLabel" style={{padding: '0 15px'}}>Profit</h2>
                        <h2 className="leftRow">${recentTotal || 0}</h2>
                        <p className="subtitle" style={{margin: "0 20px"}}>${recentAverage || 0} per month</p>
                    </div>
                    
                    <div className="boxed hundred">
                        <h2 className="boldLabel" style={{padding: '0 15px'}}>Income</h2>
                        <h2 className="leftRow">${totalIncome || 0}</h2>
                    </div>
                </div>

                <div className="centerRow dynamicSize hundred" style={{alignItems: "stretch", textTransform: "uppercase"}}>
                    <div className="boxed hundred">
                        <h2 className="boldLabel" style={{padding: '0 15px'}}>Expenses</h2>
                        <h2 className="leftRow">${totalExpenses || 0}</h2>
                    </div>
                
                    <div className="boxed hundred">
                        <h2 className="boldLabel" style={{padding: '0 15px'}}>annual prediction</h2>
                        <h2 className="leftRow">${annualPrediction || 0}</h2>
                    </div>
                    </div>
                </div>
            <div className="row">
                <div className="leftContainer boxed hundred">
                    <h2 className="centerRow">Profit</h2>
                    <ProfitAreaChart data={profitByMonth}/>
                </div>
            </div>
            <div className="row fill">
                <div className="leftContainer boxed dynamicSize" style={{width: "30%"}}>
                    <h2  className="centerRow">YTD Income</h2>
                   <IncomePieChart data={clientTotals} />
                </div>

                <div className="leftContainer boxed dynamicSize" style={{width: "30%"}}>
                    <h2  className="centerRow">YTD Margin</h2>
                    <ExpenseEarningGraph data={[{name: "expenses", value: calculateTotalExpenses()},{name: "earnings", value: calculateTotalEarnings()}]} />
                </div>

                <div className="leftContainer boxed dynamicSize" style={{width: "33%"}}>
                    <h2  className="centerRow">YTD Spent</h2>
                    <GearPieChart data={expensesByCategory}/>
                </div>
            </div>

            <div className="row fill"  style={{marginTop: '1em'}}>
                <div className="leftContainer boxed dynamicSize" style={{width: "100%"}}>
                    <h2>Income</h2>
                    <IncomeAreaChart data={invoiceData}/>
                </div>


            </div>
            
            <div className="row" style={{marginTop: '1em', alignItems: "stretch"}}>
                <div className="leftContainer boxed dynamicSize" style={{width: "50%"}}>
                
                    <div className="row" style={{alignItems: "center", padding: 0}}>
                        <h2 className="row" style={{margin: '5px'}}>Expenses</h2>
                        <div className="leftRow" style={{alignItems: "center"}}>
                            <button className="boxedDark" onClick={() => setExpensePopupActive(true)}>+ Expense</button>
                        </div>
                    </div>
                {filteredExpenses?.length <=0 ? <div className="centerRow"><p>You haven't registered an expense yet</p></div> :
                    <div>
                        <div className="leftRow" style={{marginLeft: "20px"}}>
                            <h3 style={{width: "18%"}}>Date</h3>
                            <h3 style={{width: "32%"}}>Description</h3>
                            <h3 style={{width: "23%"}}>Category</h3>
                            <h3 style={{width: "10%"}}>Amount</h3>
                        </div>
                            {filteredExpenses?.map((exp) => (
                                <div key={exp.id} className="projectRow dark" onClick={() => {setExpenseId(exp.id); setDate(exp.date); setEndDate(new Date(exp.recurring_expenses?.end_date || new Date())); setDescription(exp.description); setCategory(exp.category); setAmount(exp.amount); setUrl(exp.url); setDeductible(exp.is_deductible); setExpensePopupActive(true); setRecurringExpenseId(exp.recurring_expenses?.id || null); setRecurringFrequency(exp.recurring_expenses?.frequency || 'daily'); setIsRecurring(exp.recurring_expenses ? true : false); setDownloadFile(exp.file)}}>
                                    <p style={{width: "15%"}}>{formatDatestring(exp.date) || "NO DATE"}</p>
                                    <p style={{width: "30%"}}>{exp.description || "No details"}</p>
                                    <p style={{width: "20%"}}>{exp.category || "No category"}</p>
                                    <p style={{width: "15%"}}>{`$${exp.amount || 0}`}</p>
                                    {exp.recurring_expenses?.id && <IonIcon name="repeat" style={{color: "var(--primaryColor)"}}/>}
                                </div>
                            ))}
                    </div>}
                </div>
                <div className="leftContainer boxed dynamicSize" style={{width: "50%"}}>
                
                <div className="row" style={{alignItems: "center"}}>
                    <h2 className="row" style={{marginLeft: 0}}>Invoices</h2>
                </div>
                {filteredInvoices?.length<=0 ? <div className="centerRow"><Link to="/projects" >Any invoices you create will appear here!</Link></div> :
                <div>
                    <div className="leftRow">
                        <h3 style={{width: "20%"}}>Date</h3>
                        <h3 style={{width: "30%"}}>Project</h3>
                        <h3 style={{width: "20%"}}>Client</h3>
                        <h3 style={{width: "10%"}}>Amount</h3>
                    </div>
                    <div>
                        {filteredInvoices?.map((inv) => (
                            inv.total_amount > 0 &&
                            <div key={inv?.id} className="projectRow dark" onClick={inv.invoice_number ? () => reRouteTo(`/projects/${inv.projects.id}/invoice?IID=${inv.id}`): () => {return}}>
                                <p style={{width: "20%"}}>{formatDatestring(inv.date) || "NO DATE"}</p>
                                <p style={{width: "30%"}}>{inv.projects?.name || "None"}</p>
                                <p style={{width: "20%"}}>{inv.projects?.clients?.name  || "None"}</p>
                                <p style={{width: "10%"}}>{`$${Math.round(inv.total_amount*100)/100 || 0}`}</p>
                            </div>
                            ))}
                        </div>
                        </div>}
                    </div>
                </div>
            </div>}
        </div>
    )
}
