"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  FileJson, 
  Trash2, 
  Download,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  HardDrive,
  Eye
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for uploaded files
const mockFiles = [
  {
    id: 1,
    name: "sales_data_2024.csv",
    type: "csv",
    size: "2.4 MB",
    uploadedAt: "2024-01-15",
    lastModified: "2024-01-15",
    status: "processed",
    records: 15420
  },
  {
    id: 2,
    name: "customer_analytics.xlsx",
    type: "excel",
    size: "1.8 MB",
    uploadedAt: "2024-01-14",
    lastModified: "2024-01-14",
    status: "processed",
    records: 8920
  },
  {
    id: 3,
    name: "product_inventory.json",
    type: "json",
    size: "856 KB",
    uploadedAt: "2024-01-13",
    lastModified: "2024-01-13",
    status: "processing",
    records: 3240
  },
  {
    id: 4,
    name: "marketing_campaign.csv",
    type: "csv",
    size: "3.1 MB",
    uploadedAt: "2024-01-12",
    lastModified: "2024-01-12",
    status: "processed",
    records: 21850
  },
  {
    id: 5,
    name: "financial_reports.xlsx",
    type: "excel",
    size: "4.2 MB",
    uploadedAt: "2024-01-11",
    lastModified: "2024-01-11",
    status: "error",
    records: 0
  }
]

const DataPage = () => {
  const [files, setFiles] = useState(mockFiles)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const [uploading, setUploading] = useState(false)

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'csv':
        return <FileText className="h-5 w-5 text-blue-500" />
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />
      case 'json':
        return <FileJson className="h-5 w-5 text-yellow-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Processed</Badge>
      case 'processing':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Processing</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploading(true)
      // Simulate upload process
      setTimeout(() => {
        const newFile = {
          id: Date.now(),
          name: file.name,
          type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          uploadedAt: new Date().toISOString().split('T')[0],
          lastModified: new Date().toISOString().split('T')[0],
          status: 'processing' as const,
          records: Math.floor(Math.random() * 20000) + 1000
        }
        setFiles([newFile, ...files])
        setUploading(false)
        // Simulate processing completion
        setTimeout(() => {
          setFiles(prev => prev.map(f => 
            f.id === newFile.id ? { ...f, status: 'processed' as const } : f
          ))
        }, 3000)
      }, 2000)
    }
  }

  const handleDeleteFile = (fileId: number) => {
    setFiles(files.filter(file => file.id !== fileId))
    setSelectedFiles(selectedFiles.filter(id => id !== fileId))
  }

  const handleBulkDelete = () => {
    setFiles(files.filter(file => !selectedFiles.includes(file.id)))
    setSelectedFiles([])
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
          <p className="text-muted-foreground">
            Upload, manage, and organize your data files
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button 
            variant="default" 
            size="sm"
            disabled={uploading}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload File'}
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {files.reduce((sum, file) => sum + file.records, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all files
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {files.filter(f => f.status === 'processed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for analysis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4 GB</div>
            <p className="text-xs text-muted-foreground">
              Of 50 GB available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* File Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Uploaded Files</CardTitle>
              <CardDescription>
                Manage your uploaded data files and view their status
              </CardDescription>
            </div>
            {selectedFiles.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedFiles.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              All Types
            </Button>
          </div>

          {/* Files Table */}
          <div className="space-y-2">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No files found. Upload your first file to get started.</p>
              </div>
            ) : (
              filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                    className="rounded"
                  />
                  
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{file.name}</h4>
                        {getStatusBadge(file.status)}
                      </div>
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

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteFile(file.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DataPage 