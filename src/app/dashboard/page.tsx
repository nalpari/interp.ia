import DashboardOverview from "@/components/DashboardOverview";
import PerformanceLeaderboard from "@/components/PerformanceLeaderboard";
import RecentActivities from "@/components/RecentActivities";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <DashboardOverview />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>
              Our best performing sales representatives this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceLeaderboard />
          </CardContent>
        </Card>
        <RecentActivities />
      </div>
    </div>
  );
}
