import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Startups = () => {
  const { admin } = useAuth();
  const [search, setSearch] = useState("");
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      if (!admin?.token) {
        console.warn("Admin token missing", admin);
        toast.error("Admin token missing");
        return;
      }

      setLoading(true);

      try {
        const response = await fetch("http://localhost:3000/api/admin/all-startups", {
          headers: {
            token: admin.token,
          },
        });

        const data = await response.json();
        console.log("Fetched startups:", data);

        // ✅ Filter only approved startups
        const approvedStartups = (data.startups || []).filter(
          (startup: any) => startup.isApproved
        );

        setStartups(approvedStartups);
      } catch (error) {
        console.error("Error fetching startups:", error);
        toast.error("Failed to load startups");
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, [admin?.token]);

  // ✅ Optional: add search filter (if you want to enable search functionality later)
  const filteredStartups = startups.filter((startup) =>
    startup.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Incubated Startups</h1>

      <Input
        placeholder="Search startups..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      {loading ? (
        <p>Loading...</p>
      ) : filteredStartups.length === 0 ? (
        <p>No approved startups found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredStartups.map((startup) => (
            <Link key={startup._id} to={`/startups/${startup._id}`}>
              <Card className="mb-4 cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{startup.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Email: {startup.email}</p>
                  <p>Funding Stage: {startup.fundingStage}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Startups;
