import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import App from "~/Pages/App";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "The ultimate project manager for freeflancers" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: "Hello from Vercel aaa" };
}

export async function clientAction({
  request,
}: Route.ClientActionArgs) {
  console.log(request);
  return {value: 'hi'}
}

export default function Home({ actionData }: Route.ComponentProps) {
  return <App/>;
}
