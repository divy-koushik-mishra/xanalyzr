"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { TrendingUp, TrendingDown, Activity, Eye, FileText, BarChart3, RefreshCw } from "lucide-react"

// Mock files data (same as in data page)
const mockFiles = [
  {
    id: 1,
    name: "sales_data_2024.csv",
    type: "csv",
    size: "2.4 MB",
    uploadedAt: "2024-01-15",
    status: "processed",
    records: 15420
  },
  {
    id: 2,
    name: "customer_analytics.xlsx",
    type: "excel",
    size: "1.8 MB",
    uploadedAt: "2024-01-14",
    status: "processed",
    records: 8920
  },
  {
    id: 3,
    name: "product_inventory.json",
    type: "json",
    size: "856 KB",
    uploadedAt: "2024-01-13",
    status: "processed",
    records: 3240
  },
  {
    id: 4,
    name: "marketing_campaign.csv",
    type: "csv",
    size: "3.1 MB",
    uploadedAt: "2024-01-12",
    status: "processed",
    records: 21850
  }
]

// Sample analytics data
const revenueData = [
  { month: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
  { month: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
  { month: 'Mar', revenue: 5000, expenses: 2800, profit: 2200 },
  { month: 'Apr', revenue: 4780, expenses: 2908, profit: 1872 },
  { month: 'May', revenue: 5890, expenses: 3800, profit: 2090 },
  { month: 'Jun', revenue: 6390, expenses: 3800, profit: 2590 },
]

const trafficData = [
  { date: '1/1', organic: 2400, paid: 1400, social: 800, direct: 1200 },
  { date: '1/2', organic: 1398, paid: 2210, social: 600, direct: 1100 },
  { date: '1/3', organic: 3800, paid: 2290, social: 900, direct: 1400 },
  { date: '1/4', organic: 3908, paid: 2000, social: 700, direct: 1300 },
  { date: '1/5', organic: 4800, paid: 2181, social: 1000, direct: 1500 },
  { date: '1/6', organic: 3800, paid: 2500, social: 850, direct: 1200 },
]

const conversionData = [
  { name: 'Homepage', visitors: 8547, conversions: 234, rate: 2.74 },
  { name: 'Product Page', visitors: 5432, conversions: 876, rate: 16.12 },
  { name: 'Checkout', visitors: 2108, conversions: 1890, rate: 89.66 },
  { name: 'Thank You', visitors: 1890, conversions: 1890, rate: 100 },
]

const deviceBreakdown = [
  { name: 'Desktop', value: 45, color: '#8884d8' },
  { name: 'Mobile', value: 40, color: '#82ca9d' },
  { name: 'Tablet', value: 15, color: '#ffc658' },
]

const AnalyticsPage = () => {
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = () => {
    if (!selectedFile) return
    setIsAnalyzing(true)
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 2000)
  }

  const processedFiles = mockFiles.filter(file => file.status === 'processed')

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Analytics</h1>
          <p className="text-muted-foreground">
            Select a file to analyze and view insights
          </p>
        </div>
        <Button 
          onClick={handleAnalyze} 
          disabled={!selectedFile || isAnalyzing}
          className="flex items-center gap-2"
        >
          {isAnalyzing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <BarChart3 className="h-4 w-4" />
          )}
          {isAnalyzing ? 'Analyzing...' : 'Analyze Data'}
        </Button>
      </div>

      {/* File Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select File for Analysis
          </CardTitle>
          <CardDescription>
            Choose a processed file to generate analytics and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedFile} onValueChange={setSelectedFile}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a file to analyze..." />
              </SelectTrigger>
              <SelectContent>
                {processedFiles.map((file) => (
                  <SelectItem key={file.id} value={file.id.toString()}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                      <Badge variant="outline" className="ml-auto">
                        {file.records.toLocaleString()} records
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFile && (
              <div className="text-sm text-muted-foreground">
                Selected: {processedFiles.find(f => f.id.toString() === selectedFile)?.name}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!selectedFile && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No File Selected</h3>
            <p className="text-muted-foreground text-center">
              Please select a file from the dropdown above to view analytics and insights.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedFile && (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54,231</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5%
              </span>
              from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23,456</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8.2%
              </span>
              from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.24%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" />
                -0.4%
              </span>
              from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.1%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" />
                -2.1%
              </span>
              improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Monthly revenue, expenses, and profit analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="expenses" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="profit" stackId="3" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Total Revenue</p>
                      <p className="text-2xl font-bold">$126,240</p>
                    </div>
                    <div className="text-green-600">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Average Order Value</p>
                      <p className="text-2xl font-bold">$87.30</p>
                    </div>
                    <div className="text-green-600">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Customer Lifetime Value</p>
                      <p className="text-2xl font-bold">$420</p>
                    </div>
                    <div className="text-green-600">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  Traffic breakdown by source over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="organic" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="paid" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="social" stroke="#ffc658" strokeWidth={2} />
                    <Line type="monotone" dataKey="direct" stroke="#ff7300" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>
                  Visitor distribution by device type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>
                Step-by-step conversion analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={conversionData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visitors" fill="#8884d8" name="Visitors" />
                  <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </>
      )}
    </div>
  )
}

export default AnalyticsPage 