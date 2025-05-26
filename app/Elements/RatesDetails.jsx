import { useEffect, useState } from "react";
import { fetchBusiness, updateRates } from "../Functions/DBAccess";
import spinners from "react-spinners";
import { useSearchParams } from "react-router-dom";

export default function RatesDetails() {

    const [ratesLoading, setRatesLoading] = useState(true);
    const [rate, setRate] = useState(0);
    const [businessId, setBusinessId] = useState(null);

    useEffect(() => {
        getRates();
    },[]);



    async function getRates() {
        let rates = await fetchBusiness();

        if (!rates) {
            alert("Error fetching details")
            return false;
        }

        setBusinessId(rates.id);
        setRate(rates.rate);
        setRatesLoading(false);
    }

    async function changeRate() {
      if(!businessId)
        return null;

      updateRates(businessId, rate)
    }

    return (
      <div className="centerContainer" name="rates" style={{width: "100%"}}>
      {ratesLoading ? <div style={{display: 'flex', justifyContent: "center", marginTop: '100px'}}> <spinners.HashLoader className="loader mediumFade" color="var(--primaryColor)"/> </div> : 
      <div className="mediumFade">
        <h2>Your default rate</h2>
          <div>
              <div className='leftRow' style={{alignItems: "center"}}>
                <h3>$</h3> 
                <input type="number" placeholder='0' value={rate || ''} onChange={(e) => setRate(e.target.value)}/>
              </div>
            </div>
            <br/>
            <button className="button block primary"  disabled={ratesLoading} onClick={() => changeRate()}>
              {ratesLoading ? 'Loading ...' : 'Update'}
            </button>
        </div>}
      </div>
    )
}