import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/nothome", "routes/nothome.tsx"),
   route("/app", "routes/App.tsx"),
] satisfies RouteConfig;
