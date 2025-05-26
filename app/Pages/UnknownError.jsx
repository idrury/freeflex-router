export default function UnknownError() {

    return (
        <div style={{marginTop: 100, minHeight: "100vh"}} className="mediumFade" >
        <div className="m2">
            <h1 className="centerRow textCenter">Well that's strange...</h1>
            <p className="centerRow"> Something unexpected has happened and we couldn't do what you asked. Refresh the page and try again...</p>
            <div style={{height: 20}}/>
            <div className="boxed">
                <h2 className="centerRow">Onging issues?</h2>
                <p className="centerRow textCenter">contact isaac@freeflex.com.au for support</p>
            </div>

        </div>
        </div>
    )
}