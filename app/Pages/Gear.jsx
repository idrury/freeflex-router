import { useEffect, useState } from "react";
import GearMenu from "../Elements/GearMenu";
import { deleteGear, fetchGear, insertGear, updateGear } from "../Functions/DBAccess";
import { formatDatestring } from "../Functions/Dates";
import DeletePopup from "../Elements/DeletePopup";

export default function Gear() {

    const [gear, setGear] = useState([]);
    const [name, setName] = useState(null);
    const [costPerHour, setCostPerHour] = useState(null);
    const [dateBought, setDateBought] = useState(new Date());
    const [updateId, setUpdateId] = useState(null);

    const [errorText, setErrorText] = useState(null);

    const [deletePopup, setDeletePopup] = useState(false);

    useEffect(() => {
        getGear();
    }, [])


    async function getGear() {
        setGear(await fetchGear());
    }

    function submitGear() {

        if(!name) {
            setErrorText("Add a valid name");
            return false;
        }

        if(!dateBought) {
            setErrorText("Enter a valid date");
            return false;
        }

        if(costPerHour < 0) {
            setErrorText("The cost must be above 0")
            return false;
        }

        if(updateId) {
            updateGearItem();
            return
        } 

        addGear();
    }

    async function addGear() {
       
        let res = await insertGear(name, costPerHour, dateBought, true);

        if(res) {
            resetIO();
            return true;
        }

        setErrorText("Sorry, we've encountered an error")

        return false;
    }

    async function updateGearItem() {
        let res = await updateGear(updateId, name, costPerHour, dateBought, true);

        if(res) {
            resetIO();
            return true;
        }

        setErrorText("Sorry, we've encountered an error")

        return false;
    }

    async function deleteGearItem() {
        let res = await deleteGear(updateId);

        if(res) {
            resetIO();
        }

        setDeletePopup(false);
    }

    function resetIO() {
        setErrorText("");
        setName(null);
        setDateBought(new Date());
        setCostPerHour(null);
        setUpdateId(false);
        getGear();
    }

    function setGearUpdate(id, name, cph, dte) {
        setName(name);
        setCostPerHour(cph)
        setDateBought(new Date(dte));
        setUpdateId(id);
    }

    return (
        <div>
            <h1>Gear</h1>
            <GearMenu 
                onSubmit={() => submitGear()}
                name={name}
                setName={setName}
                costPerHour={costPerHour}
                setCostPerHour={setCostPerHour}
                dateBought={dateBought}
                setDateBought={setDateBought}
                errorText={errorText}
                updating={updateId}
                onCancel={resetIO}
                onDelete={() => setDeletePopup(true)}
                />

            <div>
                <table>
                    <thead>
                        <tr>
                            <th style={{width: '7em'}}><h3>name</h3></th>
                            <th style={{width: '10em'}}><h3>date bought</h3></th>
                            <th style={{width: '7em'}}><h3>cost per hour</h3></th>
                        </tr>
                    </thead>
                    <tbody>
                    {gear?.map((item) => (
                        <tr key={item.id}>
                            <td style={{width: '7em'}}><p>{item.name || "none"}</p></td>
                            <td style={{width: '10em'}}><p>{item.date_bought ? formatDatestring(item.date_bought) : "-"}</p></td>
                            <td style={{width: '7em'}}><p>${item.cost_per_hour}</p></td>
                            <td style={{width: '3em'}}><button onClick={() => setGearUpdate(item.id, item.name, item.cost_per_hour, item.date_bought)}>Edit</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {deletePopup && <DeletePopup onCancel={() => setDeletePopup(false)} onDelete={() => deleteGearItem()} type="gear"/> }
        </div>
    )
}