
import React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export default function AreaGraph({data}) {
   
    return (
       <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}>
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primaryColor)" stopOpacity={1}/>
            <stop offset="100%" stopColor="var(--primaryColor)" stopOpacity={0}/>
          </linearGradient>
        </defs>

          <Area type="monotone" dataKey="amount" stroke="var(--primaryColor)" strokeWidth={2} radius={20} fill="url(#color)" />

          <XAxis dataKey='period'
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            style={{fill: "var(--text)"}}
            padding={{left: 0, right: 0}}
            tickCount={10}
          />
          <YAxis dataKey="amount" 
            axisLine={false}
            tickLine={false}
            tickCount={3}
            tickMargin={10}
            tickFormatter={number => `$${number}`}
            style={{fill: "var(--text)"}}
            />
          <Tooltip content={CustomTooltip}/>
          <CartesianGrid strokeDasharray="2 5" vertical={false}/>
        </AreaChart>
       </ResponsiveContainer>
      );
}

function CustomTooltip({active, payload, label}) {
  if(active){
    return (
    <div className="boxedDark">
    <p className="boldLabel">{label}</p>
      <p>{`$${Math.round(payload[0]?.value*100)/100}`}</p>
    </div>
  )}
  return null;
}