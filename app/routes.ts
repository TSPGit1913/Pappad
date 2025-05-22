import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/dashboard", "routes/dashboard/dashboard-page.tsx"),
    route("/categories", "routes/categories/categories-page.tsx"),
    route("/categories/:categoryId", "routes/app-list/app-list-page.tsx"),
    route("/app-builder/:categoryId/:appId", "routes/app-builder/app-builder-page.tsx"),
    route("/settings", "routes/settings/settings-page.tsx")
] satisfies RouteConfig;
