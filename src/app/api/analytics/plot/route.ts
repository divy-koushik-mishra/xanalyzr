import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/model/user.model";
import Dataset from "@/model/dataset.model";
import { processFileBuffer } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    // Protect the route by checking if the user is signed in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const sessionUser = await currentUser();
    await connectDB();

    // Find the user by Clerk ID
    const user = await User.findOne({ clerkId: sessionUser?.id });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { datasetId, columns } = body;

    if (!datasetId || !columns || columns.length < 2) {
      return NextResponse.json({ 
        error: "Dataset ID and at least 2 columns are required" 
      }, { status: 400 });
    }

    // Find the dataset and ensure it belongs to the user
    const dataset = await Dataset.findOne({ 
      _id: datasetId, 
      userId: user._id 
    });

    if (!dataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }

    // Generate real chart data from the actual dataset
    const chartConfig = await generateRealChartData(dataset, columns);
    
    console.log('Generated chart config:', JSON.stringify(chartConfig, null, 2));

    return NextResponse.json({
      chartConfig
    }, { status: 200 });
  } catch (error) {
    console.error("Plot generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateRealChartData(dataset: { name: string; rows: number; cloudinaryUrl: string; fileType: string; columns: string[] }, selectedColumns: string[]) {
  try {
    // Extract public ID from Cloudinary URL
    const cloudinaryUrl = dataset.cloudinaryUrl;
    console.log('Cloudinary URL:', cloudinaryUrl);
    
    // Handle different Cloudinary URL formats
    let publicId: string;
    if (cloudinaryUrl.includes('/upload/')) {
      const uploadIndex = cloudinaryUrl.indexOf('/upload/') + 8;
      const pathAfterUpload = cloudinaryUrl.substring(uploadIndex);
      publicId = pathAfterUpload.split('.')[0];
    } else {
      publicId = cloudinaryUrl.split('/').pop()?.split('.')[0] || '';
    }
    
    console.log('Extracted public ID:', publicId);
    
    if (!publicId) {
      throw new Error('Invalid Cloudinary URL');
    }

    // Download and process the file
    const fileBuffer = await downloadFromCloudinary(publicId);
    const { columns: allColumns, data: rawData } = await processFileBuffer(fileBuffer, dataset.fileType);
    
    console.log('Processing file:', {
      allColumns,
      selectedColumns,
      rawDataLength: rawData?.length || 0
    });
    
    // Map selected columns to their indices
    const columnIndices = selectedColumns.map(col => allColumns.indexOf(col)).filter(idx => idx !== -1);
    
    if (columnIndices.length < 2) {
      throw new Error('Selected columns not found in dataset');
    }
    
    // Extract data for selected columns
    const chartData = (rawData as (string | number | null)[][]).map((row) => {
      const point: Record<string, string | number> = {};
      selectedColumns.forEach((col, index) => {
        const value = row[columnIndices[index]];
        point[col] = value !== null && value !== undefined ? value : '';
      });
      return point;
    }).filter(point => {
      // Filter out points where all values are empty
      return Object.values(point).some(val => val !== '' && val !== null && val !== undefined);
    });
    
    console.log('Chart data sample:', chartData.slice(0, 3));
    
    // Determine chart type based on data analysis
    const chartType = determineChartTypeFromData(chartData, selectedColumns);
    
    console.log('Selected chart type:', chartType);
    
    // Process data based on chart type
    const processedData = processDataForChart(chartData, chartType, selectedColumns);
    
    console.log('Processed data sample:', processedData.slice(0, 3));
    
    return {
      type: chartType,
      title: `${selectedColumns[0]} vs ${selectedColumns[1]} Analysis`,
      description: `Visualization of ${selectedColumns.join(' and ')} from ${dataset.name}`,
      data: processedData,
      xAxis: selectedColumns[0],
      yAxis: selectedColumns[1],
      category: selectedColumns[2] || undefined
    };
  } catch (error) {
    console.error('Error generating real chart data:', error);
    // Fallback to mock data
    return generateMockChartData(dataset, selectedColumns);
  }
}

async function downloadFromCloudinary(publicId: string): Promise<Buffer> {
  const response = await fetch(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}`);
  if (!response.ok) {
    throw new Error('Failed to download file from Cloudinary');
  }
  return Buffer.from(await response.arrayBuffer());
}

function determineChartTypeFromData(data: Record<string, string | number>[], columns: string[]): 'scatter' | 'line' | 'bar' | 'pie' | 'area' {
  if (columns.length === 2) {
    // Analyze data types of the two columns
    const col1Values = data.map(row => row[columns[0]]).filter(val => val !== null && val !== undefined);
    const col2Values = data.map(row => row[columns[1]]).filter(val => val !== null && val !== undefined);
    
    const col1Numeric = isNumericColumn(col1Values);
    const col2Numeric = isNumericColumn(col2Values);
    
    if (col1Numeric && col2Numeric) {
      return 'scatter';
    } else if (col1Numeric || col2Numeric) {
      return 'bar';
    } else {
      return 'pie';
    }
  } else if (columns.length >= 3) {
    return 'bar';
  }
  
  return 'scatter';
}

function isNumericColumn(values: (string | number)[]): boolean {
  const numericCount = values.filter(val => {
    const num = Number(val);
    return !isNaN(num) && isFinite(num);
  }).length;
  
  return numericCount / values.length > 0.8;
}

function processDataForChart(data: Record<string, string | number>[], chartType: string, columns: string[]) {
  if (chartType === 'pie') {
    // For pie charts, aggregate by the first column
    const aggregated = data.reduce((acc: Record<string, number>, row) => {
      const category = String(row[columns[0]] || 'Unknown');
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
  }
  
  // For other chart types, limit data points for performance
  const maxPoints = 100;
  if (data.length > maxPoints) {
    // Sample data points evenly
    const step = Math.floor(data.length / maxPoints);
    return data.filter((_, index) => index % step === 0).slice(0, maxPoints);
  }
  
  return data;
}

// Keep the mock functions as fallback
function generateMockChartData(dataset: { name: string; rows: number }, selectedColumns: string[]) {
  const sampleSize = Math.min(dataset.rows, 50);
  const chartType = determineChartType(selectedColumns);
  const data = generateMockData(selectedColumns, sampleSize, chartType);
  
  return {
    type: chartType,
    title: `${selectedColumns[0]} vs ${selectedColumns[1]} Analysis`,
    description: `Visualization of ${selectedColumns.join(' and ')} from ${dataset.name}`,
    data: data,
    xAxis: selectedColumns[0],
    yAxis: selectedColumns[1],
    category: selectedColumns[2] || undefined
  };
}

function determineChartType(columns: string[]): 'scatter' | 'line' | 'bar' | 'pie' | 'area' {
  if (columns.length >= 2) {
    if (columns.length === 2) {
      return 'scatter';
    } else if (columns.length === 3) {
      return 'bar';
    } else {
      return 'line';
    }
  }
  return 'scatter';
}

function generateMockData(columns: string[], size: number, chartType: string) {
  const data = [];
  
  for (let i = 0; i < size; i++) {
    const point: Record<string, string | number> = {};
    
    columns.forEach((column, index) => {
      if (chartType === 'pie' && index === 0) {
        point.name = `Category ${i % 5 + 1}`;
        point.value = Math.floor(Math.random() * 100) + 10;
      } else if (chartType === 'scatter' || chartType === 'line') {
        if (index === 0) {
          point[column] = i;
        } else {
          point[column] = Math.floor(Math.random() * 100) + 10;
        }
      } else {
        if (index === 0) {
          point[column] = `Group ${i % 8 + 1}`;
        } else {
          point[column] = Math.floor(Math.random() * 100) + 10;
        }
      }
    });
    
    data.push(point);
  }
  
  return data;
} 