import DashboardPage from "@/components/dashboard-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Sleep Guide",
  description: "Your sleep tracking dashboard",
};

export default function Dashboard() {
  return <DashboardPage />;
} 