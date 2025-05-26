import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  route("/", "routes/home.tsx", [
     index("routes/Landing.tsx")
  ]),
  route("/help", "routes/help.tsx", [
    index("routes/help-home.tsx"),
    route("privacy-policy", "routes/privacy-policy.tsx")
  ])
] satisfies RouteConfig;
