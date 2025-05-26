import { useEffect } from "react"
import { parseInvoiceNumber } from "../Functions/commonFunctions";
import IonIcon from "@reacticons/ionicons";
import { calculateInvoiceItemCost, calculateUnitCost } from "./Invoices/InvoiceBL";

export default function QuoteItems({ qItems, setQ }) {


    useEffect(() => {
        splitQuoteItems();
    }, [])

    function splitQuoteItems() {
        const returnArray = [];

        for (let i = 0; i < qItems.length; i++) {
            const currentItem = qItems[i]

            if (currentItem[0] == '' && currentItem[1] == '' && currentItem[2] == '') {
            }
            else {
                returnArray.push([currentItem[0], currentItem[1], currentItem[2], currentItem[3]])
            }
        }

        if (returnArray.length == 0) {
            returnArray.push(['', '', '', ''])
        }

        setQ(returnArray);
    }

    function addItem() {
        if (!qItems || qItems.length > 10) {
            return;
        }

        setQ([...qItems, ["", "", "", 0]])
    }

    function removeItem(i) {
        if (!qItems || qItems.length == 1) {
            return;
        }

        const newQuoteItems = [...qItems];
        let deletedRow = newQuoteItems.splice(i, 1);
        calculateUnitCost(deletedRow);
        updateTotalCost(newQuoteItems)
        setQ(newQuoteItems);
        return;
    }

    function updateTextItem(r, v) {
        const newQuoteItems = [...qItems];
        newQuoteItems[r][0] = v.target.value;
        setQ(newQuoteItems);
    }

    function updateNumberItem(r, c, v) {

        let value = parseInvoiceNumber(v.target.value)
        let newItems = null;

        if (!value) {
            newItems = calculateInvoiceItemCost(r, c, 0, qItems);
        } else {
            newItems = calculateInvoiceItemCost(r, c, value, qItems)
        }

        setQ(newItems);
        updateTotalCost(newItems)

        return newItems[r];
    }

    function updateTotalCost(quoteItems) {
        let tc = 0;

        for (let r = 0; r < quoteItems.length; r++) {
            tc += parseInvoiceNumber(quoteItems[r][3]);
        }
    }

    return (
        <div className="hundred">
            <div className="leftRow m1 hiddenOnShrink">
                <label className="fifty">Description</label>
                <label className="thirty">Qty</label>
                <label className="thirty">Unit cost</label>
                <label className="thirty">Total</label>
                <label className="ten"></label>
            </div>
            {qItems?.map((item, r) => (
                <div key={r} className="leftRow dynamicRow middle" style={{margin: "0 0 0 10px"}}>
                    <div className="fifty pr2" style={{margin: "0 20px 0 0"}}>
                        <input   placeholder="description" type="text" value={item[0] ?? ""} onChange={(v) => updateTextItem(r, v)} />
                    </div>
                    <div className="leftRow hundred middle m0">
                        <div className="thirty pr2" style={{margin: "0 10px 0 0"}}>
                        <input placeholder="qty" type="number" value={item[1] == 0 ? "" : item[1]} onChange={(v) => updateNumberItem(r, 1, v)} />
                        </div>
                        <div className="thirty m2 pr2">
                        <input  placeholder="unit cost" type="number" value={item[2] == 0 ? "" : item[2]} onChange={(v) => updateNumberItem(r, 2, v)} />
                        </div>
                        <input disabled value={item[3] || 0} className={`thirty ${item[3] && "boxedAccent" || "boxed"}`}/>
                    </div>
                    <div className="centerRow ten">
                        <IonIcon className="buttonIcon" onClick={() => removeItem(r)} size="medium" name="close-circle-outline" />
                    </div>

                </div>
            ))}
            <div className="pr2">
                <button className="hundred" onClick={addItem}>+ Item</button>
            </div>


        </div>
    )
}