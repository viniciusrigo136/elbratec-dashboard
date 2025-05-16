"use client"

import type React from "react"

import { useState } from "react"
import {
  AlertCircle,
  CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Search,
  PenToolIcon as Tool,
  X,
  FileText,
} from "lucide-react"
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Sample project data
const projectsData = [
  {
    id: 1,
    title: "Residential Solar Installation",
    description: "Installation of 10kW solar system for residential property",
    startDate: new Date(2024, 4, 15),
    endDate: new Date(2024, 4, 18),
    status: "In Progress",
    team: ["John Doe", "Maria Garcia"],
    files: ["site-survey.pdf", "electrical-diagram.pdf"],
    location: "123 Main St, Anytown",
  },
  {
    id: 2,
    title: "Commercial Solar Project",
    description: "50kW system for office building with battery backup",
    startDate: new Date(2024, 4, 20),
    endDate: new Date(2024, 4, 25),
    status: "Planned",
    team: ["Alex Johnson", "Sarah Williams", "David Chen"],
    files: ["proposal.pdf"],
    location: "456 Business Ave, Commerce City",
  },
  {
    id: 3,
    title: "Solar Panel Maintenance",
    description: "Quarterly maintenance and cleaning of existing installation",
    startDate: new Date(2024, 4, 10),
    endDate: new Date(2024, 4, 10),
    status: "Completed",
    team: ["Maria Garcia", "James Wilson"],
    files: ["maintenance-report.pdf", "inspection-photos.zip"],
    location: "789 Park Rd, Greenville",
  },
  {
    id: 4,
    title: "Battery System Upgrade",
    description: "Adding battery storage to existing solar installation",
    startDate: new Date(2024, 4, 22),
    endDate: new Date(2024, 4, 23),
    status: "Planned",
    team: ["David Chen", "Lisa Rodriguez"],
    files: ["upgrade-plan.pdf"],
    location: "321 Energy Ln, Powertown",
  },
  {
    id: 5,
    title: "Solar Farm Inspection",
    description: "Annual inspection of 2MW solar farm",
    startDate: new Date(2024, 4, 12),
    endDate: new Date(2024, 4, 14),
    status: "Under Maintenance",
    team: ["Alex Johnson", "James Wilson", "Sarah Williams"],
    files: ["inspection-checklist.pdf", "drone-footage.mp4"],
    location: "Solar Farm #3, Rural County",
  },
]

// Status badge colors
const statusColors = {
  Planned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "In Progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Under Maintenance": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

// Status icons
const statusIcons = {
  Planned: <Calendar className="h-4 w-4" />,
  "In Progress": <Clock className="h-4 w-4" />,
  Completed: <Check className="h-4 w-4" />,
  "Under Maintenance": <Tool className="h-4 w-4" />,
}

export function ProjectCalendar() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"week" | "month">("week")
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [teamFilter, setTeamFilter] = useState<string | null>(null)

  // New project form state
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    status: "Planned",
    team: [],
    files: [],
    location: "",
  })

  // Get all team members from projects
  const allTeamMembers = Array.from(new Set(projectsData.flatMap((project) => project.team)))

  // Filter projects based on search query and filters
  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !statusFilter || project.status === statusFilter
    const matchesTeam = !teamFilter || project.team.includes(teamFilter)

    return matchesSearch && matchesStatus && matchesTeam
  })

  // Get days for week view
  const weekDays = eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  })

  // Get projects for the current view (week or month)
  const getProjectsForView = () => {
    if (view === "week") {
      return filteredProjects.filter((project) => {
        return weekDays.some((day) => project.startDate <= day && project.endDate >= day)
      })
    } else {
      // Month view - show all projects in the current month
      return filteredProjects.filter(
        (project) => isSameMonth(project.startDate, date) || isSameMonth(project.endDate, date),
      )
    }
  }

  // Get projects for a specific day
  const getProjectsForDay = (day: Date) => {
    return filteredProjects.filter((project) => project.startDate <= day && project.endDate >= day)
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files).map((file) => file.name)
      setNewProject({
        ...newProject,
        files: [...newProject.files, ...fileNames],
      })
    }
  }

  // Handle adding a new project
  const handleAddProject = () => {
    // In a real app, you would save the project to a database
    console.log("New project:", newProject)
    setIsAddProjectOpen(false)

    // Reset form
    setNewProject({
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      status: "Planned",
      team: [],
      files: [],
      location: "",
    })
  }

  // Navigation functions
  const nextPeriod = () => {
    if (view === "week") {
      setDate(addDays(date, 7))
    } else {
      setDate(addMonths(date, 1))
    }
  }

  const prevPeriod = () => {
    if (view === "week") {
      setDate(addDays(date, -7))
    } else {
      setDate(subMonths(date, 1))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Project Timeline</h1>
        <p className="text-muted-foreground">Manage and track all solar installation projects.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevPeriod}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextPeriod}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {view === "week"
                ? `${format(weekDays[0], "MMM d")} - ${format(weekDays[6], "MMM d, yyyy")}`
                : format(date, "MMMM yyyy")}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <TabsList>
                <TabsTrigger
                  value="week"
                  onClick={() => setView("week")}
                  className={view === "week" ? "bg-primary text-primary-foreground" : ""}
                >
                  Week
                </TabsTrigger>
                <TabsTrigger
                  value="month"
                  onClick={() => setView("month")}
                  className={view === "month" ? "bg-primary text-primary-foreground" : ""}
                >
                  Month
                </TabsTrigger>
              </TabsList>
            </div>
            <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                  <DialogDescription>
                    Create a new solar installation project. Fill in all the details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="project-title">Project Title</Label>
                    <Input
                      id="project-title"
                      placeholder="Enter project title"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      placeholder="Enter project description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(newProject.startDate, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newProject.startDate}
                            onSelect={(date) => date && setNewProject({ ...newProject, startDate: date })}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(newProject.endDate, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newProject.endDate}
                            onSelect={(date) => date && setNewProject({ ...newProject, endDate: date })}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="project-status">Status</Label>
                      <Select
                        onValueChange={(value) => setNewProject({ ...newProject, status: value })}
                        defaultValue="Planned"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Planned">Planned</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="project-team">Team Members</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Add team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {allTeamMembers.map((member) => (
                            <SelectItem key={member} value={member}>
                              {member}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newProject.team.map((member, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {member}
                            <button
                              onClick={() => {
                                const updatedTeam = [...newProject.team]
                                updatedTeam.splice(index, 1)
                                setNewProject({ ...newProject, team: updatedTeam })
                              }}
                              className="ml-1 rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project-location">Location</Label>
                    <Input
                      id="project-location"
                      placeholder="Enter project location"
                      value={newProject.location}
                      onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project-files">Upload Files</Label>
                    <Input id="project-files" type="file" multiple onChange={handleFileUpload} />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newProject.files.map((file, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {file}
                          <button
                            onClick={() => {
                              const updatedFiles = [...newProject.files]
                              updatedFiles.splice(index, 1)
                              setNewProject({ ...newProject, files: updatedFiles })
                            }}
                            className="ml-1 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddProjectOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProject}>Create Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={teamFilter || ""} onValueChange={(value) => setTeamFilter(value || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Team Members</SelectItem>
                {allTeamMembers.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Week View */}
        {view === "week" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
            {weekDays.map((day, i) => (
              <Card key={i} className={`${isSameDay(day, new Date()) ? "border-primary" : ""}`}>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium">{format(day, "EEE")}</CardTitle>
                  <CardDescription className="text-xs">{format(day, "MMM d")}</CardDescription>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {getProjectsForDay(day).map((project) => (
                      <Button
                        key={project.id}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => setSelectedProject(project)}
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <span className="font-medium truncate">{project.title}</span>
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className={`text-xs ${statusColors[project.status as keyof typeof statusColors]}`}
                            >
                              <span className="flex items-center gap-1">
                                {statusIcons[project.status as keyof typeof statusIcons]}
                                {project.status}
                              </span>
                            </Badge>
                          </div>
                        </div>
                      </Button>
                    ))}
                    {getProjectsForDay(day).length === 0 && (
                      <div className="text-center py-2 text-sm text-muted-foreground">No projects</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Month View */}
        {view === "month" && (
          <Card>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border"
                components={{
                  DayContent: ({ day }) => {
                    const dayProjects = getProjectsForDay(day)
                    return (
                      <div className="flex flex-col h-full">
                        <div className="text-center">{format(day, "d")}</div>
                        {dayProjects.length > 0 && (
                          <div className="mt-auto">
                            {dayProjects.length <= 2 ? (
                              dayProjects.map((project, idx) => (
                                <div
                                  key={idx}
                                  className={`text-xs px-1 py-0.5 truncate rounded-sm mt-0.5 ${statusColors[project.status as keyof typeof statusColors]}`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedProject(project)
                                  }}
                                >
                                  {project.title}
                                </div>
                              ))
                            ) : (
                              <div
                                className="text-xs px-1 py-0.5 bg-muted rounded-sm mt-0.5 text-center cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Show a dialog with all projects for this day
                                  const dayProjects = getProjectsForDay(day)
                                  // For simplicity, just show the first project
                                  setSelectedProject(dayProjects[0])
                                }}
                              >
                                {dayProjects.length} projects
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  },
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Project List View */}
        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>{filteredProjects.length} projects found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getProjectsForView().map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription className="mt-1">{project.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className={statusColors[project.status as keyof typeof statusColors]}>
                        <span className="flex items-center gap-1">
                          {statusIcons[project.status as keyof typeof statusIcons]}
                          {project.status}
                        </span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Timeline</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(project.startDate, "MMM d, yyyy")} - {format(project.endDate, "MMM d, yyyy")}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Location</h4>
                        <p className="text-sm text-muted-foreground">{project.location}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between p-4 bg-muted/50">
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member, i) => (
                        <Avatar key={i} className="border-2 border-background">
                          <AvatarFallback>
                            {member
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.team.length > 3 && (
                        <Avatar className="border-2 border-background">
                          <AvatarFallback>+{project.team.length - 3}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <Button variant="outline" onClick={() => setSelectedProject(project)}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {getProjectsForView().length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-semibold">No projects found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Details Dialog */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedProject.title}</DialogTitle>
              <DialogDescription>{selectedProject.description}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant="outline" className={statusColors[selectedProject.status as keyof typeof statusColors]}>
                  <span className="flex items-center gap-1">
                    {statusIcons[selectedProject.status as keyof typeof statusIcons]}
                    {selectedProject.status}
                  </span>
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Start Date</h4>
                  <p className="text-sm">{format(selectedProject.startDate, "PPP")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">End Date</h4>
                  <p className="text-sm">{format(selectedProject.endDate, "PPP")}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Location</h4>
                <p className="text-sm">{selectedProject.location}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Team Members</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedProject.team.map((member: string, i: number) => (
                    <Badge key={i} variant="secondary">
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Files</h4>
                <div className="space-y-2 mt-1">
                  {selectedProject.files.map((file: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>{file}</span>
                      <Button variant="ghost" size="sm" className="ml-auto h-7 px-2">
                        Download
                      </Button>
                    </div>
                  ))}
                  {selectedProject.files.length === 0 && (
                    <p className="text-sm text-muted-foreground">No files attached</p>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <Label htmlFor="add-file">Add File</Label>
                <div className="flex gap-2 mt-1">
                  <Input id="add-file" type="file" />
                  <Button>Upload</Button>
                </div>
              </div>
            </div>
            <DialogFooter className="flex items-center justify-between">
              <Select defaultValue={selectedProject.status || "Planned"}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedProject(null)}>
                  Close
                </Button>
                <Button>Save Changes</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
