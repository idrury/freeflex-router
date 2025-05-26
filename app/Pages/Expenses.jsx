import { useEffect, useState } from "react";
import AddExpensePopup from "../Elements/Budget/AddExpensePopup";
import { fetchExpenses } from "../Functions/DBAccess";
import spinners from "react-spinners";

export default function Expenses() {

    const [loading, setLoading] = useState(true);

    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        getExpenses();
    },[])

    async function getExpenses() {
        try {
            setExpenses(await fetchExpenses());
        } catch (error) {
            console.log("Error fetching expenses")
        }
        setLoading(false);
    }
    return (
        <div>
            {loading ? <div className="loadingContainer"> <spinners.ClimbingBoxLoader color="var(--primaryColor)"/> </div> : <div>
            <h1>Expenses</h1>

            <div>
                <AddExpensePopup onSubmit={getExpenses}/>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses?.map((exp) => (
                            <tr key={exp?.id}>
                                <td><p>{exp.date || "NO DATE"}</p></td>
                                <td><p>{exp.description || "No details"}</p></td>
                                <td><p>{exp.category || "No category"}</p></td>
                                <td><p>{`$${exp.amount || 0}`}</p></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>}
        </div>
    )
}