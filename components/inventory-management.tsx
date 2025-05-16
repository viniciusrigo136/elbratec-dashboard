"use client"

import { useState } from "react"
import {
  AlertCircle,
  ArrowDownUp,
  BarChart4,
  Download,
  FileText,
  Filter,
  Package,
  Plus,
  QrCode,
  Search,
  Trash,
  Upload,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Textarea } from "@/components/ui/textarea"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample inventory data
const inventoryData = [
  {
    id: 1,
    name: "Solar Panel - 400W Monocrystalline",
    category: "Panels",
    quantity: 45,
    threshold: 10,
    location: "Warehouse A",
    lastUpdated: "2024-05-01",
    price: 250,
    supplier: "SolarTech Inc.",
    status: "In Stock",
    serialNumber: "SP-400M-1234",
    description: "High-efficiency 400W monocrystalline solar panel with 20% efficiency rating.",
  },
  {
    id: 2,
    name: "Inverter - 5kW Grid-Tie",
    category: "Inverters",
    quantity: 12,
    threshold: 5,
    location: "Warehouse B",
    lastUpdated: "2024-04-28",
    price: 1200,
    supplier: "PowerConvert Ltd.",
    status: "In Stock",
    serialNumber: "INV-5KW-5678",
    description: "5kW grid-tie inverter with 97% efficiency and WiFi monitoring capabilities.",
  },
  {
    id: 3,
    name: "Battery - 10kWh Lithium",
    category: "Batteries",
    quantity: 8,
    threshold: 3,
    location: "Warehouse A",
    lastUpdated: "2024-05-02",
    price: 3500,
    supplier: "EnerStore Systems",
    status: "In Stock",
    serialNumber: "BAT-10KWH-9012",
    description: "10kWh lithium battery storage system with 10-year warranty and smart BMS.",
  },
  {
    id: 4,
    name: "Mounting Rail - 4m Aluminum",
    category: "Mounting",
    quantity: 120,
    threshold: 30,
    location: "Warehouse C",
    lastUpdated: "2024-04-15",
    price: 45,
    supplier: "MountPro Solutions",
    status: "In Stock",
    serialNumber: "MR-4M-3456",
    description: "4-meter aluminum mounting rail for roof installations, corrosion-resistant.",
  },
  {
    id: 5,
    name: "Solar Cable - 6mm² 100m",
    category: "Cables",
    quantity: 5,
    threshold: 2,
    location: "Warehouse B",
    lastUpdated: "2024-04-20",
    price: 180,
    supplier: "WireConnect Ltd.",
    status: "Low Stock",
    serialNumber: "SC-6MM-7890",
    description: "100-meter roll of 6mm² solar DC cable, UV-resistant and dual insulated.",
  },
  {
    id: 6,
    name: "Charge Controller - 60A MPPT",
    category: "Controllers",
    quantity: 7,
    threshold: 3,
    location: "Warehouse A",
    lastUpdated: "2024-05-03",
    price: 320,
    supplier: "ChargeMax Inc.",
    status: "In Stock",
    serialNumber: "CC-60A-2345",
    description: "60A MPPT charge controller with LCD display and multiple battery type settings.",
  },
  {
    id: 7,
    name: "Junction Box - Waterproof",
    category: "Accessories",
    quantity: 35,
    threshold: 10,
    location: "Warehouse C",
    lastUpdated: "2024-04-10",
    price: 25,
    supplier: "ConnectSafe Ltd.",
    status: "In Stock",
    serialNumber: "JB-WP-6789",
    description: "IP67 waterproof junction box for outdoor solar installations.",
  },
  {
    id: 8,
    name: "MC4 Connector Pair",
    category: "Accessories",
    quantity: 2,
    threshold: 20,
    location: "Warehouse B",
    lastUpdated: "2024-04-25",
    price: 8,
    supplier: "ConnectSafe Ltd.",
    status: "Low Stock",
    serialNumber: "MC4-PAIR-0123",
    description: "Pair of MC4 solar panel connectors, UV-resistant and waterproof.",
  },
  {
    id: 9,
    name: "Micro-Inverter - 300W",
    category: "Inverters",
    quantity: 18,
    threshold: 5,
    location: "Warehouse A",
    lastUpdated: "2024-04-30",
    price: 150,
    supplier: "PowerConvert Ltd.",
    status: "In Stock",
    serialNumber: "MI-300W-4567",
    description: "300W micro-inverter for individual panel optimization, 25-year warranty.",
  },
  {
    id: 10,
    name: "Solar Panel Cleaning Kit",
    category: "Tools",
    quantity: 4,
    threshold: 2,
    location: "Warehouse C",
    lastUpdated: "2024-04-05",
    price: 75,
    supplier: "CleanTech Solutions",
    status: "In Stock",
    serialNumber: "SPCK-8901",
    description: "Complete solar panel cleaning kit with extension pole and soft brush attachments.",
  },
]

// Category data for charts
const categoryData = [
  { name: "Panels", value: 45 },
  { name: "Inverters", value: 30 },
  { name: "Batteries", value: 8 },
  { name: "Mounting", value: 120 },
  { name: "Cables", value: 5 },
  { name: "Controllers", value: 7 },
  { name: "Accessories", value: 37 },
  { name: "Tools", value: 4 },
]

// Location data for charts
const locationData = [
  { name: "Warehouse A", value: 60 },
  { name: "Warehouse B", value: 19 },
  { name: "Warehouse C", value: 159 },
]

// Status data for charts
const statusData = [
  { name: "In Stock", value: 254 },
  { name: "Low Stock", value: 7 },
  { name: "Out of Stock", value: 0 },
]

// Colors for charts
const COLORS = ["#4CAF50", "#FFEB3B", "#FF5722", "#2196F3", "#9C27B0", "#00BCD4", "#FF9800", "#795548"]

export function InventoryManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [locationFilter, setLocationFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("inventory")

  // New item form state
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: 0,
    threshold: 0,
    location: "",
    price: 0,
    supplier: "",
    serialNumber: "",
    description: "",
  })

  // Get all categories and locations from inventory
  const allCategories = Array.from(new Set(inventoryData.map((item) => item.category)))

  const allLocations = Array.from(new Set(inventoryData.map((item) => item.location)))

  // Filter inventory based on search query and filters
  const filteredInventory = inventoryData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = !categoryFilter || item.category === categoryFilter
    const matchesLocation = !locationFilter || item.location === locationFilter
    const matchesStatus = !statusFilter || item.status === statusFilter

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus
  })

  // Sort inventory
  const sortedInventory = [...filteredInventory].sort((a, b) => {
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

  // Handle adding a new item
  const handleAddItem = () => {
    // In a real app, you would save the item to a database
    console.log("New item:", newItem)
    setIsAddItemOpen(false)

    // Reset form
    setNewItem({
      name: "",
      category: "",
      quantity: 0,
      threshold: 0,
      location: "",
      price: 0,
      supplier: "",
      serialNumber: "",
      description: "",
    })
  }

  // Get low stock items
  const lowStockItems = inventoryData.filter((item) => item.quantity <= item.threshold)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Control</h1>
        <p className="text-muted-foreground">Manage and track all equipment, tools, and supplies.</p>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock ({lowStockItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Search inventory..."
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
              <Select value={locationFilter || ""} onValueChange={(value) => setLocationFilter(value || null)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {allLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                    <DialogDescription>
                      Add a new item to your inventory. Fill in all the details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="item-name">Item Name</Label>
                      <Input
                        id="item-name"
                        placeholder="Enter item name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="item-category">Category</Label>
                        <Select
                          defaultValue="Panels"
                          onValueChange={(value) => setNewItem({ ...newItem, category: value })}
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
                        <Label htmlFor="item-location">Location</Label>
                        <Select
                          defaultValue="Warehouse A"
                          onValueChange={(value) => setNewItem({ ...newItem, location: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {allLocations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="item-quantity">Quantity</Label>
                        <Input
                          id="item-quantity"
                          type="number"
                          min="0"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="item-threshold">Low Stock Threshold</Label>
                        <Input
                          id="item-threshold"
                          type="number"
                          min="0"
                          value={newItem.threshold}
                          onChange={(e) => setNewItem({ ...newItem, threshold: Number.parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="item-price">Price (USD)</Label>
                        <Input
                          id="item-price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newItem.price}
                          onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="item-supplier">Supplier</Label>
                        <Input
                          id="item-supplier"
                          placeholder="Enter supplier name"
                          value={newItem.supplier}
                          onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="item-serial">Serial Number / SKU</Label>
                      <Input
                        id="item-serial"
                        placeholder="Enter serial number or SKU"
                        value={newItem.serialNumber}
                        onChange={(e) => setNewItem({ ...newItem, serialNumber: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="item-description">Description</Label>
                      <Textarea
                        id="item-description"
                        placeholder="Enter item description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddItem}>Add Item</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px] cursor-pointer" onClick={() => handleSort("name")}>
                        <div className="flex items-center gap-1">
                          Item Name
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
                      <TableHead className="cursor-pointer text-right" onClick={() => handleSort("quantity")}>
                        <div className="flex items-center justify-end gap-1">
                          Quantity
                          {sortField === "quantity" && (
                            <ArrowDownUp className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("location")}>
                        <div className="flex items-center gap-1">
                          Location
                          {sortField === "location" && (
                            <ArrowDownUp className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer text-right" onClick={() => handleSort("price")}>
                        <div className="flex items-center justify-end gap-1">
                          Price
                          {sortField === "price" && (
                            <ArrowDownUp className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                        <div className="flex items-center gap-1">
                          Status
                          {sortField === "status" && (
                            <ArrowDownUp className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedInventory.map((item) => (
                      <TableRow key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              item.status === "In Stock"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : item.status === "Low Stock"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                // QR code scanning functionality would go here
                                console.log("Scan QR code for", item.name)
                              }}
                            >
                              <QrCode className="h-4 w-4" />
                              <span className="sr-only">Scan QR</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Edit functionality would go here
                                setSelectedItem(item)
                              }}
                            >
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {sortedInventory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {sortedInventory.length} of {inventoryData.length} items
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventoryData.reduce((sum, item) => sum + item.quantity, 0)}</div>
                <p className="text-xs text-muted-foreground">Across {inventoryData.length} unique products</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <BarChart4 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${inventoryData.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Inventory replacement value</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lowStockItems.length}</div>
                <p className="text-xs text-muted-foreground">Items below threshold level</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allCategories.length}</div>
                <p className="text-xs text-muted-foreground">Different product categories</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Inventory by Category</CardTitle>
                <CardDescription>Distribution of items across categories</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#4CAF50">
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Inventory by Location</CardTitle>
                <CardDescription>Distribution of items by warehouse</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {locationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Current inventory status overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#4CAF50" />
                        <Cell fill="#FFEB3B" />
                        <Cell fill="#FF5722" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Top Value Items</CardTitle>
                <CardDescription>Highest value items in inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryData
                    .sort((a, b) => b.price * b.quantity - a.price * a.quantity)
                    .slice(0, 5)
                    .map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} units • {item.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm font-medium">${(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="low-stock" className="space-y-4">
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Low Stock Warning</AlertTitle>
            <AlertDescription>
              {lowStockItems.length} items are below their minimum threshold levels and need to be restocked.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
              <CardDescription>Items that need to be reordered soon</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Current Quantity</TableHead>
                    <TableHead className="text-center">Threshold</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium">{item.quantity}</span>
                          <Progress
                            value={(item.quantity / item.threshold) * 100}
                            className="h-2 w-20"
                            indicatorClassName="bg-yellow-500"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{item.threshold}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">Reorder</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {lowStockItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No low stock items found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Item Details Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedItem.name}</DialogTitle>
              <DialogDescription>{selectedItem.description}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge
                  variant="outline"
                  className={
                    selectedItem.status === "In Stock"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : selectedItem.status === "Low Stock"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }
                >
                  {selectedItem.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Category</h4>
                  <p className="text-sm">{selectedItem.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Location</h4>
                  <p className="text-sm">{selectedItem.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Quantity</h4>
                  <p className="text-sm">{selectedItem.quantity}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Low Stock Threshold</h4>
                  <p className="text-sm">{selectedItem.threshold}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Price</h4>
                  <p className="text-sm">${selectedItem.price.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Total Value</h4>
                  <p className="text-sm">${(selectedItem.price * selectedItem.quantity).toFixed(2)}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Serial Number / SKU</h4>
                <p className="text-sm">{selectedItem.serialNumber}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Supplier</h4>
                <p className="text-sm">{selectedItem.supplier}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Last Updated</h4>
                <p className="text-sm">{selectedItem.lastUpdated}</p>
              </div>
            </div>
            <DialogFooter className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="destructive" size="sm">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button variant="outline" size="sm">
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedItem(null)}>
                  Close
                </Button>
                <Button>Edit Item</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
