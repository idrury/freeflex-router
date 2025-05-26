import HelpPage from "~/Elements/Help/HelpPage";
import { Route } from "../+types/root";
import Landing from "~/Pages/Landing";
import HelpLanding from "~/Elements/Help/HelpLanding";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "The ultimate project manager for freeflancers" },
  ];
}

export default function LoadHelpHome() {
  return <HelpPage />;
}
