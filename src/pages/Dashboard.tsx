
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, Calendar, CalendarClock, Bell, LineChart } from "lucide-react";

interface Startup {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  stage: string;
  description: string;
}

interface StartupSummary {
  total: number;
  stages: {
    [key: string]: number;
  };
}

interface EventSummary {
  upcoming: number;
  total: number;
}

interface MeetingSummary {
  upcoming: number;
  total: number;
}

interface AnnouncementSummary {
  active: number;
  total: number;
}

const Dashboard = () => {
  const { admin } = useAuth();
  const [search, setSearch] = useState("");
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [startupSummary, setStartupSummary] = useState<StartupSummary>({
    total: 0,
    stages: {},
  });
  const [eventSummary, setEventSummary] = useState<EventSummary>({
    upcoming: 0,
    total: 0,
  });
  const [meetingSummary, setMeetingSummary] = useState<MeetingSummary>({
    upcoming: 0,
    total: 0,
  });
  const [announcementSummary, setAnnouncementSummary] = useState<AnnouncementSummary>({
    active: 0,
    total: 0,
  });

  // Fetch startups data
  useEffect(() => {
    const fetchStartups = async () => {
      if (!admin?.token) return;
      
      try {
        const response = await fetch("http://localhost:3000/api/admin/all-startups", {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch startups");
        }
        
        const data = await response.json();
        setStartups(data.startups || []);
        
        // Calculate startup summary
        const stages: {[key: string]: number} = {};
        data.startups.forEach((startup: Startup) => {
          stages[startup.stage] = (stages[startup.stage] || 0) + 1;
        });
        
        setStartupSummary({
          total: data.startups.length,
          stages,
        });
        
      } catch (error) {
        console.error("Error fetching startups:", error);
      } finally {
        setLoading(false);
      }
    };

    // For now, let's mock the other summary data
    // In a real app, you would fetch this from the API
    setEventSummary({
      upcoming: 5,
      total: 12,
    });
    
    setMeetingSummary({
      upcoming: 3,
      total: 8,
    });
    
    setAnnouncementSummary({
      active: 4,
      total: 10,
    });

    fetchStartups();
  }, [admin?.token]);

  // Filter startups based on search
  const filteredStartups = startups.filter((startup) => 
    startup.name.toLowerCase().includes(search.toLowerCase()) ||
    startup.industry.toLowerCase().includes(search.toLowerCase()) ||
    startup.stage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search startups..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{startupSummary.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across various growth stages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventSummary.upcoming}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {eventSummary.total} total events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Meetings</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meetingSummary.upcoming}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {meetingSummary.total} total meetings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Announcements</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcementSummary.active}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {announcementSummary.total} total announcements
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Startup Performance</CardTitle>
            <CardDescription>
              Funding status and KPI metrics of incubated startups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border border-dashed rounded-lg">
              <div className="flex flex-col items-center text-muted-foreground">
                <LineChart className="h-8 w-8 mb-2" />
                <p>Performance metrics chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Startups by Stage</CardTitle>
            <CardDescription>
              Distribution across growth stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(startupSummary.stages).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{stage}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div 
                        className="h-full bg-incumeta-600" 
                        style={{ 
                          width: `${(count / startupSummary.total) * 100}%` 
                        }} 
                      />
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Startups</CardTitle>
          <CardDescription>
            Showing {Math.min(4, filteredStartups.length)} of {filteredStartups.length} startups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 h-[200px] animate-pulse bg-gray-100" />
              ))
            ) : filteredStartups.length > 0 ? (
              filteredStartups.slice(0, 4).map((startup) => (
                <div 
                  key={startup.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="mb-2 h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                    {startup.logo ? (
                      <img 
                        src={startup.logo} 
                        alt={`${startup.name} logo`} 
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      startup.name.charAt(0)
                    )}
                  </div>
                  <h3 className="font-medium">{startup.name}</h3>
                  <div className="flex items-center mt-1 gap-2">
                    <span className="inline-flex items-center rounded-full bg-incumeta-100 px-2 py-1 text-xs font-medium text-incumeta-800">
                      {startup.stage}
                    </span>
                    <span className="text-xs text-gray-500">{startup.industry}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {startup.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No startups found matching your search
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
