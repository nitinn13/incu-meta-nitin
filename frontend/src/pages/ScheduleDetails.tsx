// src/pages/ScheduleDetails.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import styled from 'styled-components';
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
        {/* <a href="https://localhost:5000/" target="_blank" rel="noreferrer"></a> */}
        <div className="m-4 flex justify-center" >
          
            <VCButton />
          
        </div>

      </Card>
    </div>
  );
};
const VCButton = () => {
  return (
    <StyledWrapper>
      <a href="http://localhost:5000/" target="_blank" rel="noreferrer">
      <button> Start Video Chat
      </button>
      </a>
      
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
   border: none;
   color: #fff;
   background-image: linear-gradient(30deg, #0400ff, #4ce3f7);
   border-radius: 20px;
   background-size: 100% auto;
   font-family: inherit;
   font-size: 17px;
   padding: 0.6em 1.5em;
  }

  button:hover {
   background-position: right center;
   background-size: 200% auto;
   -webkit-animation: pulse 2s infinite;
   animation: pulse512 1.5s infinite;
  }

  @keyframes pulse512 {
   0% {
    box-shadow: 0 0 0 0 #05bada66;
   }

   70% {
    box-shadow: 0 0 0 10px rgb(218 103 68 / 0%);
   }

   100% {
    box-shadow: 0 0 0 0 rgb(218 103 68 / 0%);
   }
  }`;



export default ScheduleDetails;
