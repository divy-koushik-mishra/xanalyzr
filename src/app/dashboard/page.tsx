"use client"

import React, { useState, useEffect } from 'react'
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

// Types for analytics data
interface Dataset {
  id: string
  name: string
  fileType: string
  fileSize: number
  records: number
  columns: number
  createdAt: string
  status: string
}

interface AnalyticsData {
  overview: {
    totalFiles: number
    totalRecords: number
    totalSize: number
    recentUploads: number
    processedFiles: number
  }
  fileTypeBreakdown: Record<string, number>
  monthlyTrend: Array<{ month: string; uploads: number }>
  sizeDistribution: {
    small: number
    medium: number
    large: number
  }
  datasets: Dataset[]
}



const DashboardPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch analytics data on component mount
  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/analytics')
      setAnalyticsData(response.data)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAnalyticsData()
    setIsRefreshing(false)
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'csv':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />
      case 'json':
        return <FileJson className="h-4 w-4 text-yellow-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No data available</div>
      </div>
    )
  }

  const totalFiles = analyticsData.overview.totalFiles
  const processedFiles = analyticsData.overview.processedFiles
  const totalRecords = analyticsData.overview.totalRecords
  const storageUsed = analyticsData.overview.totalSize / (1024 * 1024) // Convert to MB

  // Empty state for new users
  if (totalFiles === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-8">
        {/* Beautiful SVG illustration */}
        <svg width="260" height="180" viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="40" width="220" height="120" rx="16" fill="#23272f"/>
          <rect x="40" y="60" width="180" height="80" rx="12" fill="#2d323d"/>
          <rect x="60" y="90" width="40" height="20" rx="4" fill="#3b82f6"/>
          <rect x="110" y="90" width="40" height="20" rx="4" fill="#10b981"/>
          <rect x="160" y="90" width="40" height="20" rx="4" fill="#f59e0b"/>
          <circle cx="130" cy="70" r="10" fill="#fff" fillOpacity="0.08"/>
          <rect x="90" y="120" width="80" height="8" rx="4" fill="#fff" fillOpacity="0.08"/>
        </svg>
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Xanalyzr!</h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Get started by uploading your first data file. Xanalyzr helps you visualize and analyze your data effortlessly. Click below to begin your data journey!
          </p>
          <Button 
            size="lg" 
            className="mt-2 px-8 py-4 text-base font-semibold"
            onClick={() => window.location.href = '/dashboard/data'}
          >
            Upload Your First File
          </Button>
        </div>
      </div>
    )
  }

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
                  <AreaChart data={analyticsData.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="uploads" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      name="Uploads"
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
                      data={Object.entries(analyticsData.fileTypeBreakdown).map(([type, count]) => ({
                        name: type.toUpperCase(),
                        value: count,
                        color: type === 'csv' ? '#3b82f6' : type === 'xlsx' ? '#10b981' : '#f59e0b'
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(analyticsData.fileTypeBreakdown).map(([type, count], index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={type === 'csv' ? '#3b82f6' : type === 'xlsx' ? '#10b981' : '#f59e0b'} 
                        />
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
              <div className="text-center py-8 text-muted-foreground">
                <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Processing performance data will be available soon.</p>
              </div>
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
                {analyticsData.datasets.slice(0, 5).map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getFileIcon(file.fileType)}
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.fileSize)}</span>
                          <span>{file.records.toLocaleString()} records</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(file.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="default">
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
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Recent activity data will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardPage