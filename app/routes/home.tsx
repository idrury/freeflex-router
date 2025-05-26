import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: " FreeFlex" },
    { name: "description", content: "The ultimate project manager for freeflancers" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: "Hello from Vercel aaa" };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome message={loaderData.message} />;
}
