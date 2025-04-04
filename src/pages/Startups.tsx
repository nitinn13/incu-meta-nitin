
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, ChevronDown } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

interface Startup {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  stage: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const Startups = () => {
  const { admin } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("Error fetching startups:", error);
        toast.error("Failed to load startups");
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, [admin?.token]);

  const handleApproveStartup = async (id: string) => {
    if (!admin?.token) return;
    
    try {
      const response = await fetch("http://localhost:3000/api/admin/approve-startup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
        body: JSON.stringify({ startupId: id }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to approve startup");
      }
      
      // Update the local state
      setStartups(startups.map(startup => 
        startup.id === id ? { ...startup, status: 'approved' } : startup
      ));
      
      toast.success("Startup approved successfully");
    } catch (error) {
      console.error("Error approving startup:", error);
      toast.error("Failed to approve startup");
    }
  };

  // Filter startups based on search and filter
  const filteredStartups = startups.filter((startup) => {
    const matchesSearch = 
      startup.name.toLowerCase().includes(search.toLowerCase()) ||
      startup.industry.toLowerCase().includes(search.toLowerCase()) ||
      startup.description.toLowerCase().includes(search.toLowerCase());
      
    const matchesFilter = 
      filter === "all" || 
      startup.stage.toLowerCase() === filter.toLowerCase() ||
      startup.status === filter;
      
    return matchesSearch && matchesFilter;
  });

  // Get all unique stages for filter
  const stages = [...new Set(startups.map(startup => startup.stage))];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="text-yellow-600 border-yellow-400">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Incubated Startups</h1>
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search startups..."
              className="pl-8 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All Startups
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("pending")}>
                Pending Approval
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("approved")}>
                Approved
              </DropdownMenuItem>
              {stages.map((stage) => (
                <DropdownMenuItem 
                  key={stage} 
                  onClick={() => setFilter(stage)}
                >
                  {stage} Stage
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Startup
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Startup List</CardTitle>
          <CardDescription>
            {filteredStartups.length} startups found
            {filter !== "all" && ` (filtered by: ${filter})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse bg-gray-100 h-24" />
              ))}
            </div>
          ) : filteredStartups.length > 0 ? (
            <div className="space-y-4">
              {filteredStartups.map((startup) => (
                <div
                  key={startup.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white flex flex-col md:flex-row gap-4 md:items-center"
                >
                  <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
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
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <h3 className="font-medium">{startup.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {startup.stage}
                        </Badge>
                        {getStatusBadge(startup.status)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {startup.industry}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {startup.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 space-x-2 mt-2 md:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-incumeta-600 border-incumeta-200 hover:bg-incumeta-50"
                    >
                      View Details
                    </Button>
                    {startup.status === 'pending' && (
                      <Button 
                        size="sm"
                        className="bg-incumeta-600 hover:bg-incumeta-700"
                        onClick={() => handleApproveStartup(startup.id)}
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No startups found matching your search criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Startups;
