"use client"

import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Types for dataset
interface Dataset {
  _id: string
  name: string
  fileType: string
  fileSize: number
  columns: string[]
  rows: number
  cloudinaryUrl: string
  createdAt: string
}

const DataPage = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)

  // Fetch datasets on component mount
  useEffect(() => {
    fetchDatasets()
  }, [])

  const fetchDatasets = async () => {
    try {
      const response = await axios.get('/api/datasets')
      setDatasets(response.data.datasets || [])
    } catch (error) {
      console.error('Error fetching datasets:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'csv':
        return <FileText className="h-5 w-5 text-blue-500" />
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />
      case 'json':
        return <FileJson className="h-5 w-5 text-yellow-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = () => {
    // For now, all datasets are considered processed since they're in the database
    return <Badge variant="default" className="bg-green-100 text-green-800">Processed</Badge>
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploading(true)
      
      try {
        const formData = new FormData()
        formData.append('file', file)

        await axios.post('/api/datasets', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        // Refresh the datasets list
        await fetchDatasets()
      } catch (error) {
        console.error('Upload error:', error)
        if (axios.isAxiosError(error) && error.response?.data?.error) {
          alert(`Upload failed: ${error.response.data.error}`)
        } else {
          alert('Upload failed. Please try again.')
        }
      } finally {
        setUploading(false)
        // Clear the input
        event.target.value = ''
      }
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    setFileToDelete(fileId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return

    try {
      await axios.delete(`/api/datasets/${fileToDelete}`)
      
      // Remove from local state
      setDatasets(datasets.filter(dataset => dataset._id !== fileToDelete))
      setSelectedFiles(selectedFiles.filter(id => id !== fileToDelete))
    } catch (error) {
      console.error('Delete error:', error)
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        alert(`Delete failed: ${error.response.data.error}`)
      } else {
        alert('Delete failed. Please try again.')
      }
    } finally {
      setDeleteDialogOpen(false)
      setFileToDelete(null)
    }
  }

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true)
  }

  const confirmBulkDelete = async () => {
    try {
      await axios.post('/api/datasets/bulk-delete', {
        datasetIds: selectedFiles
      })
      
      // Remove from local state
      setDatasets(datasets.filter(dataset => !selectedFiles.includes(dataset._id)))
      setSelectedFiles([])
    } catch (error) {
      console.error('Bulk delete error:', error)
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        alert(`Bulk delete failed: ${error.response.data.error}`)
      } else {
        alert('Bulk delete failed. Please try again.')
      }
    } finally {
      setBulkDeleteDialogOpen(false)
    }
  }

  const filteredDatasets = datasets.filter(dataset =>
    dataset.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleDownloadFile = async (dataset: Dataset) => {
    try {
      // For all file types, download the original file from Cloudinary
      const cloudinaryResponse = await fetch(dataset.cloudinaryUrl)
      const blob = await cloudinaryResponse.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = dataset.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        alert(`Download failed: ${error.response.data.error}`)
      } else {
        alert('Download failed. Please try again.')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading datasets...</div>
      </div>
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
            <div className="text-2xl font-bold">{datasets.length}</div>
            <p className="text-xs text-muted-foreground">
              Uploaded datasets
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
              {datasets.reduce((sum, dataset) => sum + (dataset.rows || 0), 0).toLocaleString()}
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
            <div className="text-2xl font-bold">{datasets.length}</div>
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
            <div className="text-2xl font-bold">
              {formatFileSize(datasets.reduce((sum, dataset) => sum + (dataset.fileSize || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Total file size
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
            {filteredDatasets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No files found. Upload your first file to get started.</p>
              </div>
            ) : (
              filteredDatasets.map((dataset) => (
                <div
                  key={dataset._id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(dataset._id)}
                    onChange={() => toggleFileSelection(dataset._id)}
                    className="rounded"
                  />
                  
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(dataset.fileType)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{dataset.name}</h4>
                        {getStatusBadge()}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatFileSize(dataset.fileSize || 0)}</span>
                        <span>{(dataset.rows || 0).toLocaleString()} records</span>
                        <span>{dataset.columns?.length || 0} columns</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(dataset.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadFile(dataset)}
                    >
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
                        <DropdownMenuItem onClick={() => handleDownloadFile(dataset)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteFile(dataset._id)}
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

      {/* Delete File Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteFile}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Alert Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Files</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedFiles.length} file(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DataPage 