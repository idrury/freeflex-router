import { Route } from "../+types/root";
import Landing from "~/Pages/Landing";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "The ultimate project manager for freeflancers" },
  ];
}

export default function LoadLanding() {
  return <Landing width={100} currentJob={"Freelancer"} />;
}
