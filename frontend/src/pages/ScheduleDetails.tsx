// src/pages/ScheduleDetails.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const ScheduleDetails = () => {
  const { id } = useParams();
  const { admin } = useAuth();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      if (!admin?.token || !id) return;

      try {
        const response = await fetch(`http://localhost:3000/api/admin/all-schedules`, {
          headers: {
            token: admin.token,
          },
        });

        const data = await response.json();

        const foundSchedule = data.schedules.find((sched: Schedule) => sched._id === id);

        if (!foundSchedule) {
          toast.error("Schedule not found");
        } else {
          setSchedule(foundSchedule);
        }
      } catch (error) {
        console.error("Error fetching schedule details:", error);
        toast.error("Failed to load schedule details");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleDetails();
  }, [admin?.token, id]);

  if (loading) return <div>Loading schedule details...</div>;

  if (!schedule) return <div>Schedule not found.</div>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Details</CardTitle>
          <CardDescription>{schedule.description || "No Description"}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            <strong>Date:</strong> {new Date(schedule.date).toLocaleDateString()}
          </p>
          <p className="mb-2">
            <strong>Time:</strong> {schedule.time}
          </p>
          <p className="mb-2">
            <strong>Startup Name:</strong> {schedule.startupId?.name || "Unknown"}
          </p>
          <p className="mb-2">
            <strong>Created At:</strong> {new Date(schedule.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleDetails;
