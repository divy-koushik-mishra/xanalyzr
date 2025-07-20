import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as XLSX from "xlsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function processFileBuffer(buffer: Buffer, filename: string) {
  const fileExtension = filename.split('.').pop()?.toLowerCase()
  
  if (fileExtension === 'csv') {
    // For CSV files
    const csvData = buffer.toString('utf-8')
    const workbook = XLSX.read(csvData, { type: 'string' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    // Convert to JSON to get data structure
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    
    if (!jsonData || jsonData.length === 0) {
      throw new Error('File appears to be empty')
    }
    
    const headers = jsonData[0] as string[]
    const dataRows = jsonData.slice(1)
    
    // Count non-empty rows
    const rowCount = dataRows.filter(row => row && (row as string[]).some(cell => cell !== null && cell !== undefined && cell !== '')).length
    
    return {
      columns: headers.filter(header => header && header.trim() !== ''),
      rows: rowCount,
      fileType: 'csv',
      data: dataRows.filter(row => row && (row as string[]).some(cell => cell !== null && cell !== undefined && cell !== ''))
    }
  } 
  else if (['xlsx', 'xls'].includes(fileExtension || '')) {
    // For Excel files
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    // Convert to JSON to get data structure
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    
    if (!jsonData || jsonData.length === 0) {
      throw new Error('File appears to be empty')
    }
    
    const headers = jsonData[0] as string[]
    const dataRows = jsonData.slice(1)
    
    // Count non-empty rows
    const rowCount = dataRows.filter(row => row && (row as string[]).some(cell => cell !== null && cell !== undefined && cell !== '')).length
    
    return {
      columns: headers.filter(header => header && header.trim() !== ''),
      rows: rowCount,
      fileType: fileExtension,
      data: dataRows.filter(row => row && (row as string[]).some(cell => cell !== null && cell !== undefined && cell !== ''))
    }
  } 
  else if (fileExtension === 'json') {
    // For JSON files
    try {
      const jsonString = buffer.toString('utf-8')
      const jsonData = JSON.parse(jsonString)
      
      // Handle different JSON structures
      let rowCount: number
      let columns: string[]
      
      if (Array.isArray(jsonData)) {
        // If it's an array of objects
        if (jsonData.length === 0) {
          throw new Error('JSON file appears to be empty')
        }
        
        // Get columns from the first object
        columns = Object.keys(jsonData[0] || {})
        rowCount = jsonData.filter(row => row && typeof row === 'object').length
      } else if (typeof jsonData === 'object' && jsonData !== null) {
        // If it's an object with numeric keys (like {0: {...}, 1: {...}})
        const keys = Object.keys(jsonData).sort((a, b) => parseInt(a) - parseInt(b))
        if (keys.length === 0) {
          throw new Error('JSON file appears to be empty')
        }
        
        const firstKey = keys[0]
        columns = Object.keys(jsonData[firstKey] || {})
        rowCount = keys.filter(key => jsonData[key] && typeof jsonData[key] === 'object').length
      } else {
        throw new Error('Invalid JSON structure')
      }
      
      return {
        columns: columns.filter(header => header && header.trim() !== ''),
        rows: rowCount,
        fileType: 'json',
        data: Array.isArray(jsonData) ? jsonData : Object.values(jsonData).filter(row => row && typeof row === 'object')
      }
    } catch (error) {
      throw new Error('Invalid JSON file format')
    }
  }
  else {
    throw new Error('Unsupported file type. Please upload CSV, Excel, or JSON files only.')
  }
}

