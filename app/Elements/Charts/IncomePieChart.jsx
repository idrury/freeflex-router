import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function IncomePieChart({ data }) {
  const baseColor =  localStorage.getItem("accentColor") || "#ebc273ff"; 

  // Extract RGB values from the base color
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  const a = parseInt(baseColor.slice(7, 9), 16);

  const colors = [];

  for (let i = 0; i < data?.length; i++) {
    let offsetAmount = 255 / data.length;
    // Generate a random offset within a specified range
    const offset = Math.floor(offsetAmount * (i / 2));

    // Calculate new Alpha values, ensuring they stay within the valid range (0-255)
    const newA = Math.max(0, Math.min(255, a - offset));

    // Create the new color string
    const newColor = `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}${newA
      .toString(16)
      .padStart(2, "0")}`;

    colors.push(newColor);
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="client"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={160}
          label={(entry) => {
            return returnLabel(entry);
          }}
          labelLine={false}
          cornerRadius={5}
          paddingAngle={2}
        >
          {data?.map((entry, index) => (
            <Cell key={index} fill={colors[index % colors.length]} stroke={0} />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function returnLabel(entry) {
  const offset = 50;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * entry.midAngle);
  const cos = Math.cos(-RADIAN * entry.midAngle);
  const sx = entry.cx + (entry.outerRadius - offset) * cos;
  const sy = entry.cy + (entry.outerRadius - offset) * sin;
  const mx = entry.cx + (entry.outerRadius - offset) * cos;
  const my = entry.cy + (entry.outerRadius - offset) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1);
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  let size = entry.endAngle - entry.startAngle;

  if (entry?.name?.length > 10) {
    let splitEntries = entry.name.trimStart().split(" ");
    entry.name = "";

    if (splitEntries.length > 1) {
      for (let i = 0; i < splitEntries.length; i++) {
        entry.name = entry.name.concat(splitEntries[i][0]).concat(".");
      }
    } else {
      entry.name = splitEntries[0]
        .slice(0, 5)
        .concat("...")
        .concat(splitEntries[0].slice(-1));
    }
  }

  if (size > 50) {
    return (
      <g>
        <text
          style={{ fontSize: "0.8em", wordWrap: "break-word", fill: '#222222' }}
          className="boldLabel"
          x={ex + (cos >= 0 ? 1 : -1)}
          y={ey}
          textAnchor="middle"
        >{`${entry.name || "none"}`}</text>
        <text
          style={{ fontSize: "0.8em", fill: '#222222' }}
          className="smallLabel"
          x={ex + (cos >= 0 ? 1 : -1)}
          y={ey + 20}
          textAnchor="middle"
        >{`$${Math.round(entry.value)}`}</text>
      </g>
    );
  }
}

function CustomTooltip({ active, payload, label }) {
  if (active) {
    return (
      <div className="boxedDark mediumFade">
        <h3 className="boldLabel">{`${payload[0].name}`}</h3>
        <p className="smallLabel">{`$${Math.round(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
}
