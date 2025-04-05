import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!admin?.token) {
        toast.error("Admin token missing");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/admin/dashboard-stats", {
          headers: { token: admin.token },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [admin?.token]);

  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>No stats available</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">

        {/* Startups */}
        <Card><CardHeader><CardTitle>Total Startups</CardTitle></CardHeader><CardContent>{stats.totalStartups}</CardContent></Card>
        <Card><CardHeader><CardTitle>Approved Startups</CardTitle></CardHeader><CardContent>{stats.approvedStartups}</CardContent></Card>
        <Card><CardHeader><CardTitle>Pending Startups</CardTitle></CardHeader><CardContent>{stats.pendingStartups}</CardContent></Card>

        {/* Revenue / Team */}
        <Card><CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader><CardContent>${stats.totalRevenue}</CardContent></Card>
        <Card><CardHeader><CardTitle>Total Team Size</CardTitle></CardHeader><CardContent>{stats.totalTeamSize}</CardContent></Card>
        <Card><CardHeader><CardTitle>Largest Team</CardTitle></CardHeader><CardContent>{stats.largestTeam?.name} ({stats.largestTeam?.teamSize})</CardContent></Card>

        {/* Top Startup */}
        <Card><CardHeader><CardTitle>Top Revenue Startup</CardTitle></CardHeader><CardContent>{stats.topRevenueStartup?.name} (${stats.topRevenueStartup?.revenue})</CardContent></Card>

        {/* Events / Meetings */}
        <Card><CardHeader><CardTitle>Upcoming Events</CardTitle></CardHeader><CardContent>{stats.upcomingEvents}</CardContent></Card>
        <Card><CardHeader><CardTitle>Meetings Today</CardTitle></CardHeader><CardContent>{stats.meetingsToday}</CardContent></Card>

        {/* Announcements */}
        <Card><CardHeader><CardTitle>Announcements (30 days)</CardTitle></CardHeader><CardContent>{stats.announcementsLast30Days}</CardContent></Card>

        {/* New Startups */}
        <Card><CardHeader><CardTitle>Startups This Month</CardTitle></CardHeader><CardContent>{stats.startupsThisMonth}</CardContent></Card>

        {/* Admins */}
        <Card><CardHeader><CardTitle>Total Admins</CardTitle></CardHeader><CardContent>{stats.totalAdmins}</CardContent></Card>

        {/* Funding Breakdown */}
        <Card className="col-span-3">
          <CardHeader><CardTitle>Funding Stage Breakdown</CardTitle></CardHeader>
          <CardContent>
            {stats.fundingStageBreakdown.map(stage => (
              <p key={stage._id}>{stage._id}: {stage.count}</p>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AdminDashboard;
