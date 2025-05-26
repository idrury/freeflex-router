import { useState } from "react"
import { formatDatestring } from "../Functions/Dates";
import DatePicker from "./DatePicker";
import AddDateModal from "./AddDateModal";
import { insertGear } from "../Functions/DBAccess";

export default function GearMenu({onSubmit, onCancel, onDelete, name, setName, costPerHour, setCostPerHour, dateBought, setDateBought, errorText, updating}) {
    
    return (
        <div className="leftMenu">
        <h2>Add item</h2>

        <p className="leftAlign">Item name</p>
        <input placeholder="name" value={name || ""} onChange={(v) => setName(v.target.value)}/>

        <p className="leftAlign">Cost per hour</p>
        <input placeholder="cost" type="number" value={costPerHour || ''} onChange={(v) => setCostPerHour(v.target.value)}/>

        <p className="leftAlign">Date bought</p>
        <AddDateModal date={dateBought} setDate={setDateBought} label={formatDatestring(dateBought)} />

        {errorText && <p>{errorText}</p>}

        <button onClick={() => onSubmit()}>{updating ? "+ Update" : "+ Item"}</button>
        {updating && 
            <button onClick={() => onDelete()}>Delete</button>
        }

        {updating && 
            <button onClick={() => onCancel()} style={{position: "fixed", top: '90%'}}>Cancel</button>
        }
        </div>
    )
}