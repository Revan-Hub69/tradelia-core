import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect alla homepage - dashboard principale non accessibile
  redirect("/");
}

