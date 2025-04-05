import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const StartupDetails = () => {
  const { id } = useParams();
  const { admin } = useAuth();
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartupDetails = async () => {
      if (!admin?.token) {
        toast.error("Admin token missing");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/admin/all-startups/${id}`, {
          headers: {
            token: admin.token,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.message || "Failed to fetch startup details");
          return;
        }

        setStartup(data.startup);
      } catch (error) {
        console.error("Error fetching startup details:", error);
        toast.error("Error loading startup details");
      } finally {
        setLoading(false);
      }
    };

    fetchStartupDetails();
  }, [id, admin?.token]);

  if (loading) {
    return <div>Loading startup details...</div>;
  }

  if (!startup) {
    return <div>No startup details found.</div>;
  }

  return (
    <Card className="max-w-xl mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle>{startup.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Email:</strong> {startup.email}</p>
        <p><strong>Industry:</strong> {startup.industry}</p>
        <p><strong>Funding Stage:</strong> {startup.fundingStage}</p>
        <p><strong>Revenue:</strong> ${startup.revenue}</p>
        <p><strong>Team Size:</strong> {startup.teamSize}</p>
        <p><strong>Approved:</strong> {startup.isApproved ? "Yes" : "No"}</p>
        <p><strong>Created At:</strong> {new Date(startup.createdAt).toLocaleString()}</p>
      </CardContent>
    </Card>
  );
};

export default StartupDetails;
