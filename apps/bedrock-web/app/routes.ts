import { index, layout, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("auth/sign-in", "routes/auth.sign-in.tsx"),
  route("auth/sign-up", "routes/auth.sign-up.tsx"),
  route("auth/sign-out", "routes/auth.sign-out.tsx"),
  route("api/auth/*", "routes/api.auth.$.tsx"),
  route("api/upload", "routes/api.upload.tsx"),
  layout("routes/app-layout.tsx", [
    route("dashboard", "routes/app.dashboard.tsx"),
    route("profile", "routes/app.profile.tsx"),
    route("settings", "routes/app.settings.tsx"),
    route("admin/users", "routes/admin.users.tsx"),
  ]),
] satisfies RouteConfig;
