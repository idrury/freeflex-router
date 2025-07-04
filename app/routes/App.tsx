import App from "~/Pages/App";
import { Route } from "../+types/root";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "The ultimate project manager for freeflancers" },
  ];
}

export default function LoadApp() {
  return <App />;
}
