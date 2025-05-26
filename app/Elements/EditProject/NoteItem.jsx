import IonIcon from "@reacticons/ionicons";

export default function NoteItem({ type, isChecked, setValue, innerRef, onKeyPress, onPaste, onClick }) {

    if (type == "dotPoint") {
        return (
            <div className="leftRow middle" style={{margin: "5px 5px 5px 12px"}}>
                <IonIcon name="ellipse" size="small" />
                <span contentEditable ref={innerRef} style={{ padding: "10px 0px 0 22px" }} className="inputSpan hundred" onInput={(e) => setValue(e)} onKeyDown={(e) => onKeyPress(e)}  onPaste={e => onPaste(e)} onClick={onClick}/>
            </div>
        )
    }
    else if (type == "h1") {
        return (
            <span contentEditable ref={innerRef} style={{ padding: "5px 5px", fontFamily: "montserrat, sans-serif", fontSize: '32px', fontWeight: '500' }} className="inputSpan" onInput={(e) => setValue(e)} onKeyDown={(e) => onKeyPress(e)}  onPaste={e => onPaste(e)} onClick={onClick}/>
        )
    }
    else if (type == "h2") {
        return (
            <span contentEditable ref={innerRef} style={{ padding: "5px 0", fontFamily: "montserrat, sans-serif", fontSize: '23px' }} className="inputSpan" onInput={(e) => setValue(e)} onKeyDown={(e) => onKeyPress(e)}  onPaste={e => onPaste(e)} onClick={onClick}/>
        )
    }
    else if (type == "checkbox") {
        return (
            <div className="leftRow middle m1" >
                <input className="p2" type="checkbox" style={{width: 10, marginRight: 10}} onChange={(e) => setValue(e)} checked={isChecked || false}/>
                <span contentEditable ref={innerRef} style={{ padding: "5px 0", marginLeft: "5px" }}  className="inputSpan hundred" onInput={(e) => setValue(e)} onKeyDown={(e) => onKeyPress(e)}  onPaste={e => onPaste(e)}  onClick={onClick}/>
            </div>
        )
    }
    return (
        <span contentEditable ref={innerRef} style={{ padding: "5px 0", marginLeft: "10px" }} className="inputSpan" onInput={(e) => setValue(e)} onKeyDown={(e) => onKeyPress(e)} onPaste={e => onPaste(e)} onClick={onClick}/>
    )
}