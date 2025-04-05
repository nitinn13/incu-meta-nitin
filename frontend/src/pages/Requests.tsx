// src/pages/Requests.tsx

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type Startup = {
  _id: string;
  name: string;
  email: string;
  isApproved: boolean;
  idea: string;
};

const Requests = () => {
  const { admin } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStartups = async () => {
      if (!admin?.token) return;

      try {
        const response = await fetch("http://localhost:3000/api/admin/all-startups", {
          headers: {
            token: admin.token,
          },
        });
        const data = await response.json();
        const unapprovedStartups = (data.startups || []).filter((startup: Startup) => !startup.isApproved);
        setStartups(unapprovedStartups);
      } catch (error) {
        console.error("Error fetching startups:", error);
        toast.error("Failed to load startups");
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, [admin?.token]);

  const handleApproveClick = (startup: Startup) => {
    setSelectedStartup(startup);
    setIsDialogOpen(true);
  };

  const approveStartup = async () => {
    if (!admin?.token || !selectedStartup) return;

    try {
      const response = await fetch("http://localhost:3000/api/admin/approve-startup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: admin.token,
        },
        body: JSON.stringify({ id: selectedStartup._id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setStartups((prev) => prev.filter((startup) => startup._id !== selectedStartup._id));
      } else {
        toast.error(data.message || "Failed to approve startup");
      }
    } catch (error) {
      console.error("Error approving startup:", error);
      toast.error("Server error");
    } finally {
      setIsDialogOpen(false);
      setSelectedStartup(null);
    }
  };

  if (loading) return <div>Loading requests...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Approval Requests {startups.length > 0 && <span className="text-sm text-gray-500">({startups.length})</span>}
      </h1>

      {startups.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {startups.map((startup) => (
            <Card key={startup._id} className="hover:shadow-xl transition relative">
              <div
                className="absolute inset-0 z-0 cursor-pointer"
                onClick={() => navigate(`/startup/${startup._id}`)}
              />
              <CardHeader>
                <CardTitle>{startup.name}</CardTitle>
                <CardDescription>{startup.email}</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="mb-4">{startup.idea || "No idea description"}</p>
                <Button variant="outline" onClick={(e) => { e.stopPropagation(); handleApproveClick(startup); }}>
                  Approve
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Approval Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to approve <strong>{selectedStartup?.name}</strong>?</p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={approveStartup}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Requests;
