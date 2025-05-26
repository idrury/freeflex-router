import IonIcon from "@reacticons/ionicons";

export default function ErrorLabel({
  active,
  text,
  color = "undefined",
}) {
  return (
    <div style={{ margin: "0 0 20px 0" }}>
      {active && (
        <div className="leftRow middle">
            <IonIcon name="alert-circle" className="basicIcon mr2" style={{color: color}}/>
            <label className="mediumFade m0" style={{ color: color }}>
              {text}
            </label>
        </div>
      )}
    </div>
  );
}
