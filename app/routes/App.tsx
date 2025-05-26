import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import App from "~/Pages/App";

export function meta({}: Route.MetaArgs) {
  return [
    { title: " Home" },
    { name: "description", content: "The ultimate project manager for freeflancers" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: "Hello from Vercel aaa" };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <App/>;
}
