import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash2, CalendarDays } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEvents } from "@/contexts/EventsContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Events = () => {
  const { admin } = useAuth();
  const { events, loading, deleteEvent, refreshEvents } = useEvents();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    type: "workshop",
  });

  const handleCreateEvent = async () => {
    if (
      !newEvent.title.trim() ||
      !newEvent.description.trim() ||
      !newEvent.location.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/admin/create-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${admin?.token}`,
        },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description,
          location: newEvent.location,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create event");
      }

      toast.success("Event created successfully");

      // ✅ Refetch updated events list
      await refreshEvents();

      setNewEvent({ title: "", description: "", date: "", location: "", type: "workshop" });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
    await refreshEvents(); // Optionally refresh after delete as well
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase()) ||
    event.description.toLowerCase().includes(search.toLowerCase()) ||
    event.location.toLowerCase().includes(search.toLowerCase()) ||
    event.type.toLowerCase().includes(search.toLowerCase())
  );

  const sortedEvents = [...filteredEvents].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Upcoming Events</h1>
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
                <DialogDescription>
                  Create a new event for startups. This will be visible to all incubated startups.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="event-title" className="text-right text-sm font-medium col-span-1">
                    Title
                  </label>
                  <Input
                    id="event-title"
                    placeholder="Enter event title"
                    className="col-span-3"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="event-date" className="text-right text-sm font-medium col-span-1">
                    Date
                  </label>
                  <Input
                    id="event-date"
                    type="date"
                    className="col-span-3"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="event-location" className="text-right text-sm font-medium col-span-1">
                    Location
                  </label>
                  <Input
                    id="event-location"
                    placeholder="Enter event location"
                    className="col-span-3"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="event-type" className="text-right text-sm font-medium col-span-1">
                    Type
                  </label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="pitch">Pitch Day</SelectItem>
                      <SelectItem value="demo">Demo Day</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label htmlFor="event-description" className="text-right text-sm font-medium col-span-1">
                    Description
                  </label>
                  <Textarea
                    id="event-description"
                    placeholder="Enter event details"
                    className="col-span-3"
                    rows={5}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent}>
                  Create Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events Management</CardTitle>
          <CardDescription>
            {filteredEvents.length} events found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse bg-gray-100 h-32" />
              ))}
            </div>
          ) : sortedEvents.length > 0 ? (
            <div className="space-y-4">
              {sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 bg-incumeta-100 rounded-md flex items-center justify-center text-incumeta-600">
                        <CalendarDays className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500">
                          <span>{formatEventDate(event.date)}</span>
                          <span>•</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border-blue-200">
                        {event.type}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        title="Delete"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No events found matching your search criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;
