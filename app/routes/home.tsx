import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import Landing from "~/Pages/Landing";

export function meta({}: Route.MetaArgs) {
  return [
    { title: " FreeFlex" },
    { name: "description", content: "The ultimate project manager for freeflancers" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: "Hello from Vercel aaa" };
}

export default function LoadWelcome({ loaderData }: Route.ComponentProps) {
  return <Landing width={0} currentJob={"Freelancers"} />;
}
