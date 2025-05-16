"use client"

import React from "react"

import { useState } from "react"
import {
  AlertCircle,
  ArrowDownUp,
  Calendar,
  Download,
  FileArchive,
  FileImage,
  FileIcon as FilePdf,
  FileSpreadsheet,
  FileText,
  Plus,
  Search,
  Tag,
  Trash,
  Upload,
  X,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"

// Sample documents data
const documentsData = [
  {
    id: 1,
    name: "Solar Panel Installation Guide v2.3.pdf",
    type: "PDF",
    size: "4.2 MB",
    category: "Technical",
    project: "Residential Installations",
    uploadedBy: "John Martinez",
    uploadDate: "2024-04-15",
    tags: ["installation", "guide", "residential"],
    description: "Comprehensive guide for installing residential solar panel systems.",
  },
  {
    id: 2,
    name: "Q1 2024 Financial Report.xlsx",
    type: "Spreadsheet",
    size: "1.8 MB",
    category: "Financial",
    project: "Company Reports",
    uploadedBy: "Sarah Johnson",
    uploadDate: "2024-04-02",
    tags: ["financial", "quarterly", "report"],
    description: "Quarterly financial report for Q1 2024.",
  },
  {
    id: 3,
    name: "Commercial Project Proposal Template.docx",
    type: "Document",
    size: "950 KB",
    category: "Sales",
    project: "Commercial Projects",
    uploadedBy: "David Chen",
    uploadDate: "2024-03-20",
    tags: ["proposal", "template", "commercial"],
    description: "Template for creating commercial solar project proposals.",
  },
  {
    id: 4,
    name: "Site Survey Photos - 123 Main St.zip",
    type: "Archive",
    size: "28.5 MB",
    category: "Inspection",
    project: "Residential Installations",
    uploadedBy: "Maria Garcia",
    uploadDate: "2024-04-10",
    tags: ["photos", "survey", "residential"],
    description: "Collection of site survey photos for the 123 Main St installation.",
  },
  {
    id: 5,
    name: "Safety Protocols 2024.pdf",
    type: "PDF",
    size: "2.1 MB",
    category: "Safety",
    project: "Company Policies",
    uploadedBy: "Robert Wilson",
    uploadDate: "2024-01-15",
    tags: ["safety", "protocols", "policy"],
    description: "Updated safety protocols for all installation and maintenance work.",
  },
  {
    id: 6,
    name: "Battery Integration Diagram.png",
    type: "Image",
    size: "1.2 MB",
    category: "Technical",
    project: "Battery Systems",
    uploadedBy: "James Thompson",
    uploadDate: "2024-03-05",
    tags: ["diagram", "battery", "technical"],
    description: "Technical diagram showing battery integration with solar systems.",
  },
  {
    id: 7,
    name: "Customer Satisfaction Survey Results.xlsx",
    type: "Spreadsheet",
    size: "3.4 MB",
    category: "Customer Service",
    project: "Customer Feedback",
    uploadedBy: "Emily Davis",
    uploadDate: "2024-02-28",
    tags: ["survey", "customer", "feedback"],
    description: "Results and analysis of the customer satisfaction survey.",
  },
  {
    id: 8,
    name: "Roof Assessment Checklist.pdf",
    type: "PDF",
    size: "850 KB",
    category: "Inspection",
    project: "Residential Installations",
    uploadedBy: "Michael Brown",
    uploadDate: "2024-03-12",
    tags: ["checklist", "roof", "assessment"],
    description: "Checklist for assessing roof conditions prior to solar installation.",
  },
  {
    id: 9,
    name: "Project Management Handbook.pdf",
    type: "PDF",
    size: "5.6 MB",
    category: "Management",
    project: "Company Policies",
    uploadedBy: "Lisa Rodriguez",
    uploadDate: "2024-01-30",
    tags: ["handbook", "management", "project"],
    description: "Comprehensive handbook for managing solar installation projects.",
  },
  {
    id: 10,
    name: "Inverter Troubleshooting Guide.pdf",
    type: "PDF",
    size: "3.2 MB",
    category: "Technical",
    project: "Maintenance",
    uploadedBy: "Alex Johnson",
    uploadDate: "2024-04-05",
    tags: ["troubleshooting", "inverter", "guide"],
    description: "Guide for diagnosing and resolving common inverter issues.",
  },
]

// File type icons
const fileTypeIcons: Record<string, React.ReactNode> = {
  PDF: <FilePdf className="h-4 w-4 text-red-500" />,
  Spreadsheet: <FileSpreadsheet className="h-4 w-4 text-green-500" />,
  Document: <FileText className="h-4 w-4 text-blue-500" />,
  Archive: <FileArchive className="h-4 w-4 text-yellow-500" />,
  Image: <FileImage className="h-4 w-4 text-purple-500" />,
}

export function DocumentsSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [projectFilter, setProjectFilter] = useState<string | null>(null)
  const [sortField, setSortField] = useState<string>("uploadDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null)
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false)
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])

  // New document form state
  const [newDocument, setNewDocument] = useState({
    name: "",
    category: "",
    project: "",
    tags: [] as string[],
    description: "",
  })

  // Get all categories and projects from documents
  const allCategories = Array.from(new Set(documentsData.map((doc) => doc.category)))

  const allProjects = Array.from(new Set(documentsData.map((doc) => doc.project)))

  // Filter documents based on search query and filters
  const filteredDocuments = documentsData.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !categoryFilter || doc.category === categoryFilter
    const matchesProject = !projectFilter || doc.project === projectFilter

    return matchesSearch && matchesCategory && matchesProject
  })

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let aValue = a[sortField as keyof typeof a]
    let bValue = b[sortField as keyof typeof b]

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle adding a new document
  const handleAddDocument = () => {
    // In a real app, you would save the document to a database
    console.log("New document:", newDocument)
    setIsAddDocumentOpen(false)

    // Reset form
    setNewDocument({
      name: "",
      category: "",
      project: "",
      tags: [],
      description: "",
    })
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewDocument({
        ...newDocument,
        name: e.target.files[0].name,
      })
    }
  }

  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim().toLowerCase()
      if (!newDocument.tags.includes(newTag)) {
        setNewDocument({
          ...newDocument,
          tags: [...newDocument.tags, newTag],
        })
      }
      e.currentTarget.value = ""
    }
  }

  // Handle select all documents
  const handleSelectAll = () => {
    if (selectedDocuments.length === sortedDocuments.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(sortedDocuments.map((doc) => doc.id))
    }
  }

  // Handle select document
  const handleSelectDocument = (id: number) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter((docId) => docId !== id))
    } else {
      setSelectedDocuments([...selectedDocuments, id])
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Internal Documents</h1>
        <p className="text-muted-foreground">Access and manage all company documents and files.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={categoryFilter || ""} onValueChange={(value) => setCategoryFilter(value || null)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={projectFilter || ""} onValueChange={(value) => setProjectFilter(value || null)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Projects</SelectItem>
                {allProjects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Upload New Document</DialogTitle>
                  <DialogDescription>Upload a new document and add relevant metadata.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="document-file">File</Label>
                    <Input id="document-file" type="file" onChange={handleFileUpload} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="document-name">Document Name</Label>
                    <Input
                      id="document-name"
                      placeholder="Enter document name"
                      value={newDocument.name}
                      onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="document-category">Category</Label>
                      <Select
                        defaultValue="default"
                        onValueChange={(value) => setNewDocument({ ...newDocument, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="document-project">Project</Label>
                      <Select
                        defaultValue="default"
                        onValueChange={(value) => setNewDocument({ ...newDocument, project: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {allProjects.map((project) => (
                            <SelectItem key={project} value={project}>
                              {project}
                            </SelectItem>
                          ))}
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="document-tags">Tags</Label>
                    <div className="flex flex-col gap-2">
                      <Input id="document-tags" placeholder="Type tag and press Enter" onKeyDown={handleTagInput} />
                      <div className="flex flex-wrap gap-2 mt-1">
                        {newDocument.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {tag}
                            <button
                              onClick={() => {
                                const updatedTags = [...newDocument.tags]
                                updatedTags.splice(index, 1)
                                setNewDocument({ ...newDocument, tags: updatedTags })
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
                    <Label htmlFor="document-description">Description</Label>
                    <Input
                      id="document-description"
                      placeholder="Enter document description"
                      value={newDocument.description}
                      onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDocumentOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDocument}>Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Documents</CardTitle>
                <CardDescription>{filteredDocuments.length} documents found</CardDescription>
              </div>
              {selectedDocuments.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">{selectedDocuments.length} selected</span>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedDocuments.length === sortedDocuments.length && sortedDocuments.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-[300px] cursor-pointer" onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-1">
                        Document Name
                        {sortField === "name" && (
                          <ArrowDownUp className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                      <div className="flex items-center gap-1">
                        Category
                        {sortField === "category" && (
                          <ArrowDownUp className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("project")}>
                      <div className="flex items-center gap-1">
                        Project
                        {sortField === "project" && (
                          <ArrowDownUp className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("uploadDate")}>
                      <div className="flex items-center gap-1">
                        Date
                        {sortField === "uploadDate" && (
                          <ArrowDownUp className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort("size")}>
                      <div className="flex items-center justify-end gap-1">
                        Size
                        {sortField === "size" && (
                          <ArrowDownUp className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedDocuments.map((doc) => (
                    <TableRow key={doc.id} onClick={() => setSelectedDocument(doc)} className="cursor-pointer">
                      <TableCell className="w-[40px]" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedDocuments.includes(doc.id)}
                          onCheckedChange={() => handleSelectDocument(doc.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {fileTypeIcons[doc.type]}
                          <span className="truncate">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted">
                          {doc.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{doc.project}</TableCell>
                      <TableCell>{format(new Date(doc.uploadDate), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">{doc.size}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Download functionality would go here
                              console.log("Download", doc.name)
                            }}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Preview functionality would go here
                              setSelectedDocument(doc)
                            }}
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Preview</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {sortedDocuments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <AlertCircle className="h-8 w-8 text-muted-foreground" />
                          <h3 className="mt-2 text-lg font-semibold">No documents found</h3>
                          <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {sortedDocuments.length} of {documentsData.length} documents
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export List
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Document Details Dialog */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {fileTypeIcons[selectedDocument.type]}
                {selectedDocument.name}
              </DialogTitle>
              <DialogDescription>{selectedDocument.description}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Category</h4>
                  <Badge variant="outline" className="bg-muted">
                    {selectedDocument.category}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Project</h4>
                  <p className="text-sm">{selectedDocument.project}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Upload Date</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(selectedDocument.uploadDate), "MMMM d, yyyy")}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">File Size</h4>
                  <p className="text-sm">{selectedDocument.size}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Uploaded By</h4>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      {selectedDocument.uploadedBy
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{selectedDocument.uploadedBy}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                  {selectedDocument.tags.length === 0 && <p className="text-sm text-muted-foreground">No tags</p>}
                </div>
              </div>

              {/* Document preview would go here */}
              <div className="border rounded-lg p-4 flex items-center justify-center bg-muted/50 h-[200px]">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    {fileTypeIcons[selectedDocument.type] ? (
                      React.cloneElement(fileTypeIcons[selectedDocument.type] as React.ReactElement, {
                        className: "h-12 w-12",
                      })
                    ) : (
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Preview not available</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Download className="mr-2 h-4 w-4" />
                    Download to View
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter className="flex items-center justify-between">
              <Button variant="destructive" size="sm">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                  Close
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
