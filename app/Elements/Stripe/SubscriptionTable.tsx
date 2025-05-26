import IonIcon from "@reacticons/ionicons";
import React from "react";
import { LIMITS } from "../../assets/data";

export default function SubscriptionTable() {

    return (
        <div>
             <div className="mt2">
          <h3 className="textCenter">What's the difference?</h3>
        </div>

        <div className="m2">
          <table className="w100">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free plan</th>
                <th>Paid plan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  <div className="middle">
                    <IonIcon name="person" className="mr1" />
                    Clients
                  </div>
                </th>
                <td>{LIMITS.clients}</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <th>
                  <div className="middle">
                    <IonIcon name="document-sharp" className="mr1" />
                    Projects
                  </div>
                </th>
                <td>{LIMITS.projects}</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <th>
                  <div className="middle">
                    <IonIcon
                      name="document-text-sharp"
                      className="mr1"
                    />
                    Contracts
                  </div>
                </th>
                <td>{LIMITS.contracts}</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <th>
                  <div className="middle">
                    <IonIcon name="card-sharp" className="mr1" />
                    Invoices
                  </div>
                </th>
                <td>{LIMITS.invoices}</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <th>
                  <div className="middle">
                    <IonIcon name="pricetag-sharp" className="mr1" />
                    Expenses
                  </div>
                </th>
                <td>{LIMITS.expenses}</td>
                <td>Unlimited</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
    )
}