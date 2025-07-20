"use client"

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Cell,
  ScatterChart,
  Scatter,
  ComposedChart
} from "recharts"
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  PieChart as PieChartIcon,
  ScatterChart as ScatterChartIcon,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  RefreshCw,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react"

// Types
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

interface Column {
  name: string
  dataType: 'numeric' | 'categorical' | 'date' | 'unknown'
  sampleValues: string[]
}

interface ChartData {
  x: string | number
  y: string | number
  category?: string
  [key: string]: string | number | undefined
}

interface ChartConfig {
  type: 'scatter' | 'line' | 'bar' | 'pie' | 'area'
  title: string
  description: string
  data: ChartData[]
  xAxis: string
  yAxis: string
  category?: string
}

const AnalyticsPage = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [selectedDataset, setSelectedDataset] = useState<string>("")
  const [columns, setColumns] = useState<Column[]>([])
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch datasets on component mount
  useEffect(() => {
    fetchDatasets()
  }, [])

  const fetchDatasets = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get('/api/analytics')
      setDatasets(response.data.datasets || [])
    } catch (error) {
      console.error('Error fetching datasets:', error)
      setError('Failed to load datasets')
    } finally {
      setLoading(false)
    }
  }

  const fetchColumns = async (datasetId: string) => {
    try {
      setError(null)
      const response = await axios.get(`/api/analytics/columns/${datasetId}`)
      setColumns(response.data.columns || [])
    } catch (error) {
      console.error('Error fetching columns:', error)
      setError('Failed to load column information')
    }
  }

  const handleDatasetChange = (datasetId: string) => {
    setSelectedDataset(datasetId)
    setSelectedColumns([])
    setChartConfig(null)
    if (datasetId) {
      fetchColumns(datasetId)
    } else {
      setColumns([])
    }
  }

  const handleColumnSelection = (columnName: string, checked: boolean) => {
    if (checked) {
      if (selectedColumns.length < 4) { // Limit to 4 columns
        setSelectedColumns([...selectedColumns, columnName])
      }
    } else {
      setSelectedColumns(selectedColumns.filter(col => col !== columnName))
    }
  }

  const generateChart = async () => {
    if (selectedColumns.length < 2) {
      setError('Please select at least 2 columns')
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      const response = await axios.post('/api/analytics/plot', {
        datasetId: selectedDataset,
        columns: selectedColumns
      })

      console.log('Chart response:', response.data);
      setChartConfig(response.data.chartConfig)
    } catch (error) {
      console.error('Error generating chart:', error)
      setError('Failed to generate chart')
      
      // Fallback to a simple test chart
      setChartConfig({
        type: 'bar',
        title: 'Test Chart',
        description: 'Fallback chart for testing',
        data: [
          { x: 'Test 1', y: 10, [selectedColumns[0]]: 'Test 1', [selectedColumns[1]]: 10 },
          { x: 'Test 2', y: 20, [selectedColumns[0]]: 'Test 2', [selectedColumns[1]]: 20 },
          { x: 'Test 3', y: 15, [selectedColumns[0]]: 'Test 3', [selectedColumns[1]]: 15 }
        ],
        xAxis: selectedColumns[0],
        yAxis: selectedColumns[1]
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const getSuggestedChartType = () => {
    if (selectedColumns.length < 2) return null

    const numericColumns = selectedColumns.filter(col => 
      columns.find(c => c.name === col)?.dataType === 'numeric'
    )
    const categoricalColumns = selectedColumns.filter(col => 
      columns.find(c => c.name === col)?.dataType === 'categorical'
    )
    const dateColumns = selectedColumns.filter(col => 
      columns.find(c => c.name === col)?.dataType === 'date'
    )

    // If we have date columns, suggest line chart for time series
    if (dateColumns.length >= 1 && numericColumns.length >= 1) {
      return { type: 'line', icon: <LineChartIcon className="h-4 w-4" />, label: 'Time Series' }
    }
    
    // If we have 2+ numeric columns, suggest scatter plot
    if (numericColumns.length >= 2) {
      return { type: 'scatter', icon: <ScatterChartIcon className="h-4 w-4" />, label: 'Scatter Plot' }
    } 
    
    // If we have 1 numeric + 1+ categorical, suggest bar chart
    else if (numericColumns.length === 1 && categoricalColumns.length >= 1) {
      return { type: 'bar', icon: <BarChartIcon className="h-4 w-4" />, label: 'Bar Chart' }
    } 
    
    // If we have 2+ categorical, suggest pie chart
    else if (categoricalColumns.length >= 2) {
      return { type: 'pie', icon: <PieChartIcon className="h-4 w-4" />, label: 'Pie Chart' }
    } 
    
    // Default fallback
    else {
      return { type: 'line', icon: <LineChartIcon className="h-4 w-4" />, label: 'Line Chart' }
    }
  }

  const renderChart = () => {
    if (!chartConfig) return null

    console.log('Rendering chart with config:', chartConfig);

    const commonProps = {
      width: "100%",
      height: 400,
      data: chartConfig.data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }

    switch (chartConfig.type) {
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartConfig.xAxis} name={chartConfig.xAxis} />
              <YAxis dataKey={chartConfig.yAxis} name={chartConfig.yAxis} />
              <Tooltip />
              <Legend />
              <Scatter name={chartConfig.yAxis} data={chartConfig.data} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        )

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartConfig.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartConfig.xAxis} name={chartConfig.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(chartConfig.data[0] || {})
                .filter(key => key !== chartConfig.xAxis)
                .map((key, idx) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={['#8884d8', '#82ca9d', '#ffc658', '#ff7300'][idx % 4]}
                    name={key}
                    strokeWidth={2}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartConfig.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={chartConfig.yAxis} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={chartConfig.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartConfig.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartConfig.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey={chartConfig.yAxis} stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        )

      default:
        return <div>Unsupported chart type</div>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Analytics</h1>
          <p className="text-muted-foreground">
            Select a dataset and columns to create visualizations
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchDatasets}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Dataset Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select Dataset
          </CardTitle>
          <CardDescription>
            Choose a dataset to analyze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedDataset} onValueChange={handleDatasetChange}>
            <SelectTrigger className="w-[400px]">
              <SelectValue placeholder="Select a dataset..." />
            </SelectTrigger>
            <SelectContent>
              {datasets.map((dataset) => (
                <SelectItem key={dataset.id} value={dataset.id}>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{dataset.name}</span>
                    <Badge variant="outline" className="ml-auto">
                      {dataset.records.toLocaleString()} records
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Column Selection */}
      {selectedDataset && columns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Select Columns (2-4 columns)
            </CardTitle>
            <CardDescription>
              Choose columns to visualize. Select at least 2 columns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {columns.map((column) => (
                <div
                  key={column.name}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedColumns.includes(column.name)
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleColumnSelection(
                    column.name, 
                    !selectedColumns.includes(column.name)
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column.name)}
                    onChange={() => {}}
                    className="rounded"
                  />
                  <div className="flex-1">
                                         <div className="flex items-center gap-2">
                       <span className="font-medium">{column.name}</span>
                       <Badge 
                         variant="outline" 
                         className={`text-xs ${
                           column.dataType === 'numeric' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                           column.dataType === 'categorical' ? 'border-green-200 text-green-700 bg-green-50' :
                           column.dataType === 'date' ? 'border-purple-200 text-purple-700 bg-purple-50' :
                           'border-gray-200 text-gray-700 bg-gray-50'
                         }`}
                       >
                         {column.dataType}
                       </Badge>
                     </div>
                    <div className="text-sm text-muted-foreground">
                      Sample: {column.sampleValues.slice(0, 3).join(', ')}
                      {column.sampleValues.length > 3 && '...'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedColumns.length > 0 && (
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Selected:</span>
                  <div className="flex gap-2">
                    {selectedColumns.map((col) => (
                      <Badge key={col} variant="secondary">
                        {col}
                      </Badge>
                    ))}
                  </div>
                </div>

                {getSuggestedChartType() && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Suggested:</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getSuggestedChartType()?.icon}
                      {getSuggestedChartType()?.label}
                    </Badge>
                  </div>
                )}

                <Button 
                  onClick={generateChart}
                  disabled={selectedColumns.length < 2 || analyzing}
                  className="ml-auto"
                >
                  {analyzing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <BarChart3 className="h-4 w-4 mr-2" />
                  )}
                  {analyzing ? 'Generating...' : 'Generate Chart'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Chart Display */}
      {chartConfig && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{chartConfig.title}</CardTitle>
                <CardDescription>{chartConfig.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Fullscreen
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderChart()}
          </CardContent>
        </Card>
      )}

      {/* No Selection State */}
      {!selectedDataset && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Dataset Selected</h3>
            <p className="text-muted-foreground text-center">
              Please select a dataset from the dropdown above to start creating visualizations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AnalyticsPage 