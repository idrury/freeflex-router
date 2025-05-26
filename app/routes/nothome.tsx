import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FreeFlex | nothome" },
    { name: "description", content: "The ultimate project manager for freeflancers" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: "Hello from Vercel no aaas" };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <div>hi</div>;
}
