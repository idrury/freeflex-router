const live_prices = {
  annual: "price_1QPMIpJxUCBk5vjO8ZibQWfL",
  monthly: "price_1QPMIpJxUCBk5vjO4SQqdDYW",
};

const test_prices = {
  annual: "price_1RQGtPFTbG2b7fZThvcocu6T",
  monthly: "price_1RQGu0FTbG2b7fZThRDLEwne",
};

export const stripe_live_public =
  "pk_live_51QJ8GXJxUCBk5vjOHV3NP4p9hb8EqXgW8VbHThL7opNuPjtuYxcQoSUtUE5OdDyUcbJDWEuuFJgBIFM8BAy2s7V000NKhk5SoT";
export const stripe_test_public =
  "pk_test_51RQGbTFTbG2b7fZT5C2WJMYu7iQ2b1lkrTlblIFic1m4iu1OvH0jiXP20KVZ46aE743gNSPi2pXxO07oF7yDrHg600QewbBSyu";

export const SUB_OPTIONS = [
  {
    id: 0,
    name: "FreeFlex Basic (annual)",
    cost: 120,
    frequency: "per year",
    items: [
      {
        price: live_prices.annual,
      },
    ],
    discounts: [],
  },
  {
    id: 1,
    name: "FreeFlex Basic (monthly)",
    cost: 12,
    frequency: "per month",
    items: [
      {
        price: live_prices.monthly,
      },
    ],
    discounts: [],
  },
];
