import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";
import { Users, DollarSign, Calendar, MessageSquare, Building, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/dashboard-stats", {
          headers: { 
            token: localStorage.getItem('adminToken') || ''
          },
        });
        const data = await res.json();
        
        if (data.stats) {
          setStats(data.stats);
        } else {
          setError("Invalid data format");
        }
      } catch (err) {
        setError("Failed to load dashboard stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-lg font-medium flex items-center gap-2 text-gray-700">
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading dashboard...
      </div>
    </div>
  );

  if (error || !stats) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-lg font-medium text-gray-600">{error || "No stats available"}</div>
    </div>
  );

  // Prepare data for charts
  const startupStatusData = [
    { name: "Approved", value: stats.approvedStartups, color: "#4B5563" },
    { name: "Pending", value: stats.pendingStartups, color: "#9CA3AF" }
  ];

  const fundingStageData = stats.fundingStageBreakdown.map((stage, index) => ({
    name: stage._id,
    value: stage.count,
    color: `hsl(${210 + index * 30}, 20%, ${45 + index * 5}%)`
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2 text-gray-800">Incubator Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back. Here's what's happening with your incubator today.</p>
      </div>
      
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="pt-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Startups</p>
                <h3 className="text-xl font-semibold mt-1 text-gray-800">{stats.totalStartups}</h3>
              </div>
              <div className="bg-gray-100 p-2 rounded-md">
                <Building className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="pt-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Revenue</p>
                <h3 className="text-xl font-semibold mt-1 text-gray-800">${stats.totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="bg-gray-100 p-2 rounded-md">
                <DollarSign className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="pt-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Team Members</p>
                <h3 className="text-xl font-semibold mt-1 text-gray-800">{stats.totalTeamSize}</h3>
              </div>
              <div className="bg-gray-100 p-2 rounded-md">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="pt-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Events</p>
                <h3 className="text-xl font-semibold mt-1 text-gray-800">{stats.totalEvents}</h3>
              </div>
              <div className="bg-gray-100 p-2 rounded-md">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Startup Status */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-800">Startup Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={startupStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {startupStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Startups`, 'Count']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Funding Stage Breakdown */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-800">Funding Stage Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={fundingStageData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [`${value} Startups`, 'Count']}
                    contentStyle={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                  <Bar dataKey="value" name="Startups">
                    {fundingStageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Stats & Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured Stats */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-800">Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-gray-100 rounded-md bg-gray-50">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Top Revenue Startup</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-gray-600 mr-2" />
                  <p className="font-medium text-gray-800">{stats.topRevenueStartup?.name}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">${stats.topRevenueStartup?.revenue.toLocaleString()}</p>
              </div>
              
              <div className="p-4 border border-gray-100 rounded-md bg-gray-50">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Largest Team</p>
                <div className="flex items-center mt-2">
                  <Users className="h-4 w-4 text-gray-600 mr-2" />
                  <p className="font-medium text-gray-800">{stats.largestTeam?.name}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">{stats.largestTeam?.teamSize} team members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-800">Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-md bg-gray-50">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Total Meetings</p>
                    <p className="text-xs text-gray-500">Scheduled meetings</p>
                  </div>
                </div>
                <p className="text-xl font-semibold text-gray-800">{stats.totalMeetings}</p>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-md bg-gray-50">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Announcements</p>
                    <p className="text-xs text-gray-500">Total announcements</p>
                  </div>
                </div>
                <p className="text-xl font-semibold text-gray-800">{stats.totalAnnouncements}</p>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-md bg-gray-50">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Total Admins</p>
                    <p className="text-xs text-gray-500">Platform administrators</p>
                  </div>
                </div>
                <p className="text-xl font-semibold text-gray-800">{stats.totalAdmins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;