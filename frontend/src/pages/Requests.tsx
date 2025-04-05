
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import fetchWithMock, { Startup } from "@/utils/mockApiService";

interface StartupRequest {
  id: string;
  startupId: string;
  startupName: string;
  type: 'mentorship' | 'resource' | 'meeting' | 'funding' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  createdAt: string;
}

const Requests = () => {
  const { admin } = useAuth();
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<StartupRequest[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!admin?.token) return;
      
      try {
        // Get startups to use their data for mocking requests
        const startupsResponse = await fetchWithMock("http://localhost:3000/api/admin/all-startups", {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        });
        
        setStartups(startupsResponse.startups || []);
        
        // Generate mock requests based on startups
        const mockRequests: StartupRequest[] = [];
        const requestTypes: ('mentorship' | 'resource' | 'meeting' | 'funding' | 'other')[] = 
          ['mentorship', 'resource', 'meeting', 'funding', 'other'];
        
        const statuses: ('pending' | 'approved' | 'rejected')[] = 
          ['pending', 'pending', 'pending', 'approved', 'rejected'];
        
        const getRandomDescription = (type: string) => {
          switch(type) {
            case 'mentorship':
              return 'We are looking for mentorship in marketing and business development.';
            case 'resource':
              return 'We need access to cloud computing resources for our development team.';
            case 'meeting':
              return 'We would like to schedule a meeting with potential investors.';
            case 'funding':
              return 'We are looking for guidance on our upcoming funding round.';
            default:
              return 'We have a special request for the incubator management.';
          }
        };
        
        startupsResponse.startups.slice(0, 10).forEach((startup: Startup, index: number) => {
          const type = requestTypes[index % requestTypes.length];
          mockRequests.push({
            id: `request-${index + 1}`,
            startupId: startup.id,
            startupName: startup.name,
            type,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            description: getRandomDescription(type),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
          });
        });
        
        setRequests(mockRequests);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [admin?.token]);

  const handleUpdateRequestStatus = (requestId: string, newStatus: 'approved' | 'rejected') => {
    setRequests(
      requests.map(request => 
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );
    
    toast.success(`Request ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
  };

  // Filter requests based on search and get only pending ones for the main section
  const filteredRequests = requests.filter((request) =>
    (request.startupName.toLowerCase().includes(search.toLowerCase()) ||
    request.description.toLowerCase().includes(search.toLowerCase()) ||
    request.type.toLowerCase().includes(search.toLowerCase()))
  );
  
  const pendingRequests = filteredRequests.filter(r => r.status === 'pending');
  const processedRequests = filteredRequests.filter(r => r.status !== 'pending');

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mentorship':
        return 'Mentorship';
      case 'resource':
        return 'Resource Access';
      case 'meeting':
        return 'Meeting Request';
      case 'funding':
        return 'Funding Support';
      case 'other':
      default:
        return 'Other Request';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'mentorship':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resource':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'meeting':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'funding':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'other':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
        <h1 className="text-2xl font-bold tracking-tight">Startup Requests</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search requests..."
            className="pl-8 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>
            {pendingRequests.length} requests waiting for your response
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse bg-gray-100 h-24" />
              ))}
            </div>
          ) : pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 bg-incumeta-100 rounded-md flex items-center justify-center text-incumeta-600">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{request.startupName}</h3>
                        <div className="flex items-center mt-1 gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(request.type)}`}>
                            {getTypeLabel(request.type)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleUpdateRequestStatus(request.id, 'approved')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleUpdateRequestStatus(request.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                    {request.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No pending requests found
            </div>
          )}
        </CardContent>
      </Card>

      {processedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Requests</CardTitle>
            <CardDescription>
              {processedRequests.length} requests have been processed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedRequests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white opacity-80"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{request.startupName}</h3>
                        <div className="flex items-center mt-1 gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(request.type)}`}>
                            {getTypeLabel(request.type)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {request.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Requests;
