// src/pages/Schedules.tsx

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

type Schedule = {
  _id: string;
  startupId: {
    _id: string;
    name: string;
  };
  date: string;
  time: string;
  description: string;
  createdAt: string;
};

type Startup = {
  _id: string;
  name: string;
};

const Schedules = () => {
  const { admin } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    startupId: "",
    date: "",
    time: "",
    description: "",
  });

  // Fetch startups
  const fetchStartups = async () => {
    if (!admin?.token) return;

    try {
      const response = await fetch("http://localhost:3000/api/admin/all-startups", {
        headers: {
          token: admin.token,
        },
      });
      const data = await response.json();
      setStartups(data.startups || []);
    } catch (error) {
      console.error("Error fetching startups:", error);
      toast.error("Failed to load startups");
    }
  };

  // Fetch schedules
  const fetchSchedules = async () => {
    if (!admin?.token) return;

    try {
      const response = await fetch("http://localhost:3000/api/admin/all-schedules", {
        headers: {
          token: admin.token,
        },
      });
      const data = await response.json();
      setSchedules(data.schedules || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
    fetchSchedules();
  }, [admin?.token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!admin?.token) return;

    try {
      const response = await fetch("http://localhost:3000/api/admin/schedule-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: admin.token,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Schedule created successfully");
        setIsModalOpen(false);
        setFormData({
          startupId: "",
          date: "",
          time: "",
          description: "",
        });
        fetchSchedules(); // Refresh the list
      } else {
        toast.error("Failed to create schedule");
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast.error("Error creating schedule");
    }
  };

  if (loading) return <div>Loading schedules...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Scheduled Meetings</h1>

        {/* Create Schedule Button */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Create Schedule</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Schedule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Startup Selection */}
              <div>
                <label className="block mb-1 text-sm font-medium">Select Startup</label>
                <select
                  name="startupId"
                  value={formData.startupId}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Startup</option>
                  {startups.map((startup) => (
                    <option key={startup._id} value={startup._id}>
                      {startup.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block mb-1 text-sm font-medium">Date</label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              {/* Time */}
              <div>
                <label className="block mb-1 text-sm font-medium">Time</label>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 text-sm font-medium">Description</label>
                <Input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Meeting agenda or notes"
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                Create Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Schedule List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map((schedule) => (
          <Card
            key={schedule._id}
            className="cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate(`/schedule/${schedule._id}`)}
          >
            <CardHeader>
              <CardTitle>{schedule.description || "No Description"}</CardTitle>
              <CardDescription>
                {new Date(schedule.date).toLocaleDateString()} at {schedule.time}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Startup: {schedule.startupId?.name || "Unknown"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Schedules;
