import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import LoginPage from "./login/login-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pappad" },
    { name: "description", content: "Welcome to Pappad!" },
  ];
}

export default function Home() {
  return <LoginPage />;
}
