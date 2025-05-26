import { useEffect, useState } from "react";
import spinners from "react-spinners";
import { reRouteTo } from "../Functions/commonFunctions";

export default function OrderComplete({}) {

    const [tokenValidated, setTokenValided] = useState(true);

    useEffect(() => {
    }, []);

    return (
        <div className="centerContainer">
        {tokenValidated ? 
        <div className="centerRow mediumFade">
            <div className="centerContainer">
            <h1 className="centerRow">Order complete!</h1>
            <h3 className="centerRow">You're signed up! Good luck!</h3>
            <button onClick={() => {reRouteTo("/home")}} className="accentButton">lets go!</button>
            </div>
        </div> : 
            <div className="loadingContainer mediumFade"> <spinners.ClimbingBoxLoader color="var(--primaryColor)"/></div>
        }
        </div>
    )
}