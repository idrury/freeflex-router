import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/help", "routes/help.tsx", [
    index("routes/help-home.tsx"),
    route("privacy-policy", "routes/privacy-policy.tsx")
  ]),
  route("/home", "routes/App.tsx", [
    index("routes/Landing.tsx")
  ]),
] satisfies RouteConfig;
