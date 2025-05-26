import { PureComponent } from "react";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";


class CustomizedAxisTick extends PureComponent {
    render() {
      const { x, y, stroke, payload } = this.props;
  
      return (
        <g transform={`translate(${x || 0},${y || 0})`}>
            <text className="lightFill boldLabel" x={0} y={0} dy={16} textAnchor="middle">
            {payload.value}
          </text>
        </g>
      );
    }
  }

  class CustomizedLabel extends PureComponent {
    render() {
      const { x, y, stroke, value } = this.props;
  
      return (
        <text className='boldLabel' style={{fill: '#222222'}} x={x || 0} y={y || 0} dx={"20%"} dy={"10%"} fontSize={10} textAnchor="middle">
        {`$${Math.round(value*100)/100}`}
      </text>
      );
    }
  }


export default function BudgetBarChart({data}) {

    return (
        <ResponsiveContainer height={400}>
            <BarChart data={data}>
                <Bar dataKey="value" fill="var(--primaryColor)" radius={5} label={<CustomizedLabel/>}/>
                <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />}/>
            </BarChart>
        </ResponsiveContainer>
    )
}

function CustomTooltip({active, payload, label}) {
  if(active){
    return (
    <div className="boxed mediumFade">
      <h3 className="boldLabel">{`${payload[0].name}`}</h3>
      <p className="smallLabel">{`$${Math.round(payload[0].value)}`}</p>
    </div>
  )}
  return null;
}