import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { TrendingUp, Users, Calendar, Target, FileText, Building, DollarSign, Award, Mail, Lightbulb, CheckCircle } from "lucide-react";
import axios from "axios";

// Professional, subdued color palette
const COLORS = ["#475569", "#64748b", "#94a3b8", "#cbd5e1", "#1e293b", "#334155"];

const StartupDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/dashboard-stats");
        // Flatten the nested structure for easier access
        const { startup, stats: apiStats } = res.data;
        setStats({
          ...startup,
          totalEvents: apiStats.totalEvents,
          totalAnnouncements: apiStats.totalAnnouncements,
          nextEvent: apiStats.nextEvent
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Generate monthly revenue data based on current revenue
  const generateMonthlyData = (revenue) => {
    if (!revenue) return [];
    
    const baseRevenue = revenue * 0.8;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const currentMonth = new Date().getMonth();
    
    return monthNames.slice(0, currentMonth + 1).map((month, index) => {
      const monthRevenue = baseRevenue + (revenue - baseRevenue) * (index / currentMonth);
      const expenses = monthRevenue * 0.65;
      
      return {
        month,
        revenue: Math.round(monthRevenue),
        expenses: Math.round(expenses)
      };
    });
  };

  // Generate industry distribution data
  const generateIndustryData = (industry) => {
    return [
      { name: industry || "Tech", value: 1 },
      { name: "Other Industries", value: 4 }
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-gray-600 border-b-gray-600 border-l-gray-200 border-r-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-xl font-medium text-red-700">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const monthlyRevenueData = generateMonthlyData(stats.revenue);
  const industryData = generateIndustryData(stats.industry);
  
  // Format dates
  const formattedJoinDate = stats.joinedOn ? new Date(stats.joinedOn).toLocaleDateString() : "N/A";
  const formattedEventDate = stats.nextEvent?.date ? new Date(stats.nextEvent.date).toLocaleDateString() : "N/A";
  
  // Get total funding amount
  const totalFunding = stats.previousFunding?.reduce((sum, funding) => sum + funding.amount, 0) || 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{stats.name} Dashboard</h1>
              <p className="text-gray-600 mt-2">Performance overview and key metrics</p>
            </div>
            {stats.isApproved && (
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Approved</span>
              </div>
            )}
          </div>
        </header>
        
        {/* Company Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Company Info</CardTitle>
              <Building className="text-gray-600 h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Industry:</span>
                  <span className="font-medium">{stats.industry || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Funding Stage:</span>
                  <span className="font-medium">{stats.fundingStage || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Team Size:</span>
                  <span className="font-medium">{stats.teamSize || 0} members</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Joined On:</span>
                  <span className="font-medium">{formattedJoinDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Contact</CardTitle>
              <Mail className="text-gray-600 h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Company Email:</span>
                  <p className="font-medium break-all">{stats.email}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Documents:</span>
                  <p className="font-medium">{stats.documents?.length || 0} uploaded</p>
                </div>
                {stats.pitchDeckURL && (
                  <a 
                    href={stats.pitchDeckURL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    View Pitch Deck
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Platform Activity</CardTitle>
              <Calendar className="text-gray-600 h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Events:</span>
                  <span className="font-medium">{stats.totalEvents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Announcements:</span>
                  <span className="font-medium">{stats.totalAnnouncements}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Annual Revenue</CardTitle>
              <DollarSign className="text-gray-600 h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold">${stats.revenue ? stats.revenue.toLocaleString() : "0"}</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">Current annual revenue</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Total Funding</CardTitle>
              <Award className="text-gray-600 h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${totalFunding.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">{stats.previousFunding?.length || 0} funding rounds</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Team Size</CardTitle>
              <Users className="text-gray-600 h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.teamSize || 0}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-gray-600 h-2 rounded-full" style={{ width: `${Math.min((stats.teamSize || 0) * 10, 100)}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Total team members</p>
            </CardContent>
          </Card>
        </div>

        {/* Business Summary & Innovation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Business Summary</CardTitle>
              <Target className="text-gray-600 h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm leading-relaxed">{stats.businessSummary || "No summary provided"}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Innovation Proof</CardTitle>
              <Lightbulb className="text-gray-600 h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm leading-relaxed">{stats.innovationProof || "No innovation proof provided"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Founders Information */}
        {stats.founders && stats.founders.length > 0 && (
          <Card className="shadow-sm hover:shadow-md transition-shadow mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Founders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.founders.map((founder) => (
                  <div key={founder._id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">
                        {founder.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{founder.name}</p>
                        <p className="text-sm text-gray-600">{founder.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Previous Funding Rounds */}
        {stats.previousFunding && stats.previousFunding.length > 0 && (
          <Card className="shadow-sm hover:shadow-md transition-shadow mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Previous Funding Rounds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.previousFunding.map((funding) => (
                  <div key={funding._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{funding.round}</p>
                      <p className="text-sm text-gray-600">{funding.investor}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-800">${funding.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Event Information */}
        {stats.nextEvent && (
          <Card className="shadow-sm hover:shadow-md transition-shadow mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Upcoming Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{stats.nextEvent.title}</h3>
                <p className="text-gray-700 mb-4">{stats.nextEvent.description}</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{formattedEventDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents */}
        {stats.documents && stats.documents.length > 0 && (
          <Card className="shadow-sm hover:shadow-md transition-shadow mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.documents.map((doc) => (
                  <div key={doc._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-800">{doc.type}</span>
                    </div>
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <Card className="shadow-sm hover:shadow-md transition-shadow col-span-2">
            <CardHeader>
              <CardTitle>Estimated Revenue vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#475569" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#475569" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#475569" fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="expenses" stroke="#94a3b8" fillOpacity={1} fill="url(#colorExpenses)" />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 mt-2 text-center">*Based on estimated monthly breakdown</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart - Industry Distribution */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Industry Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={industryData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100} 
                    fill="#8884d8" 
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 mt-2 text-center">Your industry compared to other startups</p>
            </CardContent>
          </Card>
          
          {/* Monthly Revenue Bar Chart */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Monthly Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenueData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#475569">
                    {monthlyRevenueData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === monthlyRevenueData.length - 1 ? '#1e293b' : '#475569'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 mt-2 text-center">*Based on estimated monthly breakdown</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StartupDashboard;