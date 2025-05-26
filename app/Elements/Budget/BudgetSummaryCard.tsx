import React from "react";

interface BudgetSummaryCardProps {
  title: string;
  amount: number;
  subAmount?: string;
  active?: boolean;
  onClick?: () => void;
}

export default function BudgetSummaryCard({
  title,
  amount,
  subAmount,
  active,
  onClick,
}: BudgetSummaryCardProps) {
  return (
    <div
    onClick={onClick}
      className={`${active ? "boxedAccent" : "boxed" } boxedOutline hundred ${
        onClick && "clickable"
      }`}
    >
      <h2 className="boldLabel" style={{ padding: "0 15px" }}>
        {title}
      </h2>
      <h2 className="leftRow">${amount || 0}</h2>
      {subAmount && <p className="subtitle" style={{ margin: "0 20px" }}>
        ${subAmount || 0}
      </p>}
    </div>
  );
}
