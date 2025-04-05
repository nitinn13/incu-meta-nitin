"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Calendar, Clock, Info, Plus, Search, User, CalendarClock, Filter } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Schedule = {
  _id: string
  startupId: {
    _id: string
    name: string
  }
  date: string
  time: string
  description: string
  createdAt: string
}

type Startup = {
  _id: string
  name: string
}

const Schedules = () => {
  const { admin } = useAuth()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([])
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const navigate = useNavigate()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    startupId: "",
    date: "",
    time: "",
    description: "",
  })

  // Form validation
  const [formErrors, setFormErrors] = useState({
    startupId: false,
    date: false,
    time: false,
  })

  // Fetch startups
  const fetchStartups = async () => {
    if (!admin?.token) return

    try {
      const response = await fetch("http://localhost:3000/api/admin/all-startups", {
        headers: {
          token: admin.token,
        },
      })
      const data = await response.json()
      setStartups(data.startups || [])
    } catch (error) {
      console.error("Error fetching startups:", error)
      toast.error("Failed to load startups")
    }
  }

  // Fetch schedules
  const fetchSchedules = async () => {
    if (!admin?.token) return

    try {
      const response = await fetch("http://localhost:3000/api/admin/all-schedules", {
        headers: {
          token: admin.token,
        },
      })
      const data = await response.json()
      setSchedules(data.schedules || [])
      setFilteredSchedules(data.schedules || [])
    } catch (error) {
      console.error("Error fetching schedules:", error)
      toast.error("Failed to load schedules")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStartups()
    fetchSchedules()
  }, [admin?.token])

  useEffect(() => {
    // Filter schedules based on search term and active filter
    const today = new Date().toISOString().split("T")[0]

    let filtered = schedules

    // Apply text search
    if (searchTerm) {
      filtered = filtered.filter(
        (schedule) =>
          schedule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schedule.startupId?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply tab filter
    if (activeFilter === "upcoming") {
      filtered = filtered.filter((schedule) => schedule.date >= today)
    } else if (activeFilter === "past") {
      filtered = filtered.filter((schedule) => schedule.date < today)
    }

    setFilteredSchedules(filtered)
  }, [searchTerm, activeFilter, schedules])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if value exists
    if (value) {
      setFormErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (value) {
      setFormErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  const validateForm = () => {
    const errors = {
      startupId: !formData.startupId,
      date: !formData.date,
      time: !formData.time,
    }

    setFormErrors(errors)
    return !Object.values(errors).some(Boolean)
  }

  const handleSubmit = async () => {
    if (!admin?.token) return

    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/api/admin/schedule-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: admin.token,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Schedule created successfully")
        setIsModalOpen(false)
        setFormData({
          startupId: "",
          date: "",
          time: "",
          description: "",
        })
        fetchSchedules() // Refresh the list
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to create schedule")
      }
    } catch (error) {
      console.error("Error creating schedule:", error)
      toast.error("Error creating schedule")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const getRelativeDateLabel = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0]
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split("T")[0]

    if (dateString === today) return "Today"
    if (dateString === tomorrowStr) return "Tomorrow"
    return null
  }

  const renderSkeletons = () => {
    return Array(6)
      .fill(0)
      .map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))
  }

  const getScheduleStatusColor = (date: string) => {
    const today = new Date().toISOString().split("T")[0]
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split("T")[0]

    if (date < today) return "text-muted-foreground"
    if (date === today) return "text-emerald-500"
    if (date === tomorrowStr) return "text-amber-500"
    return "text-sky-500"
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-6 w-6 text-slate-700" />
              <h1 className="text-3xl font-bold text-slate-800">Meeting Schedules</h1>
            </div>
            <p className="text-slate-600 max-w-xl">
              Manage and schedule meetings with startups. Track upcoming and past meetings in one place.
            </p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 px-6 shadow-md">
                <Plus size={18} />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Schedule New Meeting</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="startup" className={formErrors.startupId ? "text-destructive" : ""}>
                    Startup <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.startupId} onValueChange={(value) => handleSelectChange("startupId", value)}>
                    <SelectTrigger className={formErrors.startupId ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a startup" />
                    </SelectTrigger>
                    <SelectContent>
                      {startups.map((startup) => (
                        <SelectItem key={startup._id} value={startup._id}>
                          {startup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.startupId && <p className="text-destructive text-sm">Please select a startup</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className={formErrors.date ? "text-destructive" : ""}>
                      Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={formErrors.date ? "border-destructive" : ""}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {formErrors.date && <p className="text-destructive text-sm">Required</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className={formErrors.time ? "text-destructive" : ""}>
                      Time <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={formErrors.time ? "border-destructive" : ""}
                    />
                    {formErrors.time && <p className="text-destructive text-sm">Required</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter meeting agenda or notes"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Create Schedule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by startup or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-200"
              />
            </div>

            <Tabs defaultValue="all" className="w-full md:w-auto" value={activeFilter} onValueChange={setActiveFilter}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{renderSkeletons()}</div>
          ) : filteredSchedules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchedules.map((schedule) => {
                const relativeDateLabel = getRelativeDateLabel(schedule.date)
                const isPast = new Date(schedule.date) < new Date(new Date().toDateString())
                const statusColor = getScheduleStatusColor(schedule.date)

                return (
                  <Card
                    key={schedule._id}
                    className={`overflow-hidden transition hover:shadow-md cursor-pointer group ${
                      isPast ? "bg-slate-50" : "bg-white"
                    }`}
                    onClick={() => navigate(`/schedule/${schedule._id}`)}
                  >
                    <CardHeader className={`pb-2 border-b ${isPast ? "bg-slate-50" : "bg-slate-50/50"}`}>
                      <div className="flex justify-between items-start">
                        <CardTitle className="line-clamp-1 group-hover:text-slate-700">
                          {schedule.description || "Untitled Meeting"}
                        </CardTitle>
                        {isPast ? (
                          <Badge variant="outline" className="bg-slate-100 text-slate-500">
                            Past
                          </Badge>
                        ) : relativeDateLabel ? (
                          <Badge variant="secondary" className={statusColor}>
                            {relativeDateLabel}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-100 text-sky-500">
                            Upcoming
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(schedule.date)}
                        <span className="mx-1">•</span>
                        <Clock className="h-3 w-3" />
                        {schedule.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="bg-slate-100 p-1.5 rounded-full">
                          <User className="h-4 w-4 text-slate-600" />
                        </div>
                        <span className="font-medium text-slate-700">
                          {schedule.startupId?.name || "Unknown Startup"}
                        </span>
                      </div>
                      {schedule.description && (
                        <div className="mt-3 text-sm text-slate-600 line-clamp-2">
                          <Info className="h-4 w-4 inline mr-2 opacity-70" />
                          {schedule.description}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-2 pb-3 text-xs text-slate-500 border-t bg-slate-50/50">
                      <span>Created {new Date(schedule.createdAt).toLocaleDateString()}</span>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              <div className="text-slate-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-1 text-slate-700">No meetings found</h3>
              <p className="text-slate-500 mb-6 text-center max-w-md">
                {searchTerm
                  ? "Try adjusting your search term or filter criteria"
                  : "Schedule your first meeting to get started with your startups"}
              </p>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setSearchTerm("")
                  setActiveFilter("all")
                  if (!schedules.length) {
                    setIsModalOpen(true)
                  }
                }}
              >
                {searchTerm || activeFilter !== "all" ? (
                  <>
                    <Filter className="h-4 w-4" />
                    Clear filters
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create your first schedule
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Schedules

