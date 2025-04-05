import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Startups = () => {
  const { admin } = useAuth();
  const [search, setSearch] = useState("");
  const [startups, setStartups] = useState([]);
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Startups</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {startups.map((startup) => (
            <Card key={startup._id}>
              <CardHeader>
                <CardTitle>{startup.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Email: {startup.email}</p>
                <p>Description: {startup.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Startups;
