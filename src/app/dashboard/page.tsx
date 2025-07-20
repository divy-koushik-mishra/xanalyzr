"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,

  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,

} from "recharts"
import { 

  TrendingUp,

  FileText,
  FileSpreadsheet,
  FileJson,
  Upload,
  Download,
  Eye,
  Calendar,
  Clock,
  HardDrive,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react"
import axios from 'axios'

// Mock data for dashboard
const mockFiles = [
  {
    id: 1,
    name: "sales_data_2024.csv",
    type: "csv",
    size: "2.4 MB",
    uploadedAt: "2024-01-15",
    status: "processed",
    records: 15420,
    lastAnalyzed: "2024-01-15 14:30"
  },
  {
    id: 2,
    name: "customer_analytics.xlsx",
    type: "excel",
    size: "1.8 MB",
    uploadedAt: "2024-01-14",
    status: "processed",
    records: 8920,
    lastAnalyzed: "2024-01-14 09:15"
  },
  {
    id: 3,
    name: "product_inventory.json",
    type: "json",
    size: "856 KB",
    uploadedAt: "2024-01-13",
    status: "processing",
    records: 3240,
    lastAnalyzed: null
  },
  {
    id: 4,
    name: "marketing_campaign.csv",
    type: "csv",
    size: "3.1 MB",
    uploadedAt: "2024-01-12",
    status: "processed",
    records: 21850,
    lastAnalyzed: "2024-01-12 16:45"
  }
]

// Analytics data
const dataUsageData = [
  { month: 'Jan', files: 12, records: 45000, storage: 45 },
  { month: 'Feb', files: 18, records: 67000, storage: 67 },
  { month: 'Mar', files: 15, records: 52000, storage: 52 },
  { month: 'Apr', files: 22, records: 89000, storage: 89 },
  { month: 'May', files: 28, records: 120000, storage: 120 },
  { month: 'Jun', files: 35, records: 156000, storage: 156 },
]

const fileTypeData = [
  { name: 'CSV Files', value: 45, color: '#3b82f6' },
  { name: 'Excel Files', value: 35, color: '#10b981' },
  { name: 'JSON Files', value: 20, color: '#f59e0b' },
]

const processingTrendData = [
  { day: 'Mon', processed: 12, failed: 1, pending: 3 },
  { day: 'Tue', processed: 15, failed: 0, pending: 2 },
  { day: 'Wed', processed: 18, failed: 2, pending: 5 },
  { day: 'Thu', processed: 14, failed: 1, pending: 4 },
  { day: 'Fri', processed: 20, failed: 0, pending: 1 },
  { day: 'Sat', processed: 8, failed: 1, pending: 2 },
  { day: 'Sun', processed: 6, failed: 0, pending: 1 },
]

const recentActivity = [
  {
    id: 1,
    type: 'upload',
    file: 'financial_reports.xlsx',
    user: 'John Doe',
    time: '2 minutes ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'analysis',
    file: 'customer_data.csv',
    user: 'Jane Smith',
    time: '15 minutes ago',
    status: 'success'
  },
  {
    id: 3,
    type: 'upload',
    file: 'inventory.json',
    user: 'Mike Johnson',
    time: '1 hour ago',
    status: 'processing'
  },
  {
    id: 4,
    type: 'analysis',
    file: 'sales_data.xlsx',
    user: 'Sarah Wilson',
    time: '2 hours ago',
    status: 'success'
  },
  {
    id: 5,
    type: 'upload',
    file: 'marketing.csv',
    user: 'Alex Brown',
    time: '3 hours ago',
    status: 'failed'
  }
]

const dataSets = await axios.get('/api/datasets')

console.log(dataSets)

const DashboardPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'csv':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'excel':
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />
      case 'json':
        return <FileJson className="h-4 w-4 text-yellow-500" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const totalFiles = mockFiles.length
  const processedFiles = mockFiles.filter(f => f.status === 'processed').length
  const totalRecords = mockFiles.reduce((sum, file) => sum + file.records, 0)
  const storageUsed = mockFiles.reduce((sum, file) => {
    const size = parseFloat(file.size.replace(/[^\d.]/g, ''))
    return sum + (file.size.includes('MB') ? size : size / 1024)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your data.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFiles}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed Files</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processedFiles}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-full bg-muted rounded-full h-2 mr-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(processedFiles / totalFiles) * 100}%` }}
                ></div>
              </div>
              {Math.round((processedFiles / totalFiles) * 100)}% success rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +8.2% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageUsed.toFixed(1)} MB</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-full bg-muted rounded-full h-2 mr-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(storageUsed / 50) * 100}%` }}
                ></div>
              </div>
              {Math.round((storageUsed / 50) * 100)}% of 50 GB
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-7">
            {/* Data Usage Trend */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Data Usage Trend</CardTitle>
                <CardDescription>
                  Monthly growth in files, records, and storage usage
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={dataUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="files" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      name="Files"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="records" 
                      stackId="2" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      name="Records (K)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* File Type Distribution */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>File Types</CardTitle>
                <CardDescription>
                  Distribution of uploaded file types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fileTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fileTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Processing Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Performance</CardTitle>
              <CardDescription>
                Daily file processing statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="processed" fill="#10b981" name="Processed" />
                  <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Files</CardTitle>
                  <CardDescription>
                    Your recently uploaded and processed files
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New File
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getFileIcon(file.type)}
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{file.size}</span>
                          <span>{file.records.toLocaleString()} records</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {file.uploadedAt}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={file.status === 'processed' ? 'default' : file.status === 'processing' ? 'secondary' : 'destructive'}
                      >
                        {file.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Processing Efficiency</CardTitle>
                <CardDescription>
                  Success rate and processing time metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Average Processing Time</span>
                      <span className="text-sm text-muted-foreground">2.3s</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Data Quality Score</span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                  Current system performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CPU Usage</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Memory Usage</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                      <span className="text-sm font-medium">62%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Usage</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Network Status</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Online
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest file uploads, analyses, and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-3 border rounded-lg"
                  >
                    {getStatusIcon(activity.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-muted-foreground">
                          {activity.type === 'upload' ? 'uploaded' : 'analyzed'}
                        </span>
                        <span className="font-medium">{activity.file}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                    <Badge 
                      variant={activity.status === 'success' ? 'default' : activity.status === 'processing' ? 'secondary' : 'destructive'}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardPage