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
    
    return {
      columns: headers.filter(header => header && header.trim() !== ''),
      rows: dataRows.filter(row => row && (row as string[]).some(cell => cell !== null && cell !== undefined && cell !== '')).length,
      fileType: 'csv'
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
    
    return {
      columns: headers.filter(header => header && header.trim() !== ''),
      rows: dataRows.filter(row => row && (row as string[]).some(cell => cell !== null && cell !== undefined && cell !== '')).length,
      fileType: fileExtension
    }
  } 
  else {
    throw new Error('Unsupported file type. Please upload CSV or Excel files only.')
  }
}

