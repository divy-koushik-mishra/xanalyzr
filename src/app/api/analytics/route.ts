import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/model/user.model";
import Dataset from "@/model/dataset.model";

export async function GET(request: NextRequest) {
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

    // Get all datasets for the user
    const datasets = await Dataset.find({ userId: user._id });

    // Calculate analytics metrics
    const totalFiles = datasets.length;
    const totalRecords = datasets.reduce((sum, dataset) => sum + (dataset.rows || 0), 0);
    const totalSize = datasets.reduce((sum, dataset) => sum + (dataset.fileSize || 0), 0);
    
    // File type breakdown
    const fileTypeBreakdown = datasets.reduce((acc, dataset) => {
      const type = dataset.fileType.toLowerCase();
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Recent uploads (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUploads = datasets.filter(dataset => 
      new Date(dataset.createdAt) > thirtyDaysAgo
    ).length;

    // Monthly upload trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrend = datasets
      .filter(dataset => new Date(dataset.createdAt) > sixMonthsAgo)
      .reduce((acc, dataset) => {
        const month = new Date(dataset.createdAt).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Convert to array format for charts
    const monthlyTrendData = Object.entries(monthlyTrend).map(([month, count]) => ({
      month,
      uploads: count
    }));

    // File size distribution
    const sizeDistribution = datasets.reduce((acc, dataset) => {
      const sizeInMB = dataset.fileSize / (1024 * 1024);
      if (sizeInMB < 1) acc.small++;
      else if (sizeInMB < 5) acc.medium++;
      else acc.large++;
      return acc;
    }, { small: 0, medium: 0, large: 0 });

    const analyticsData = {
      overview: {
        totalFiles,
        totalRecords,
        totalSize,
        recentUploads,
        processedFiles: totalFiles // All files are considered processed
      },
      fileTypeBreakdown,
      monthlyTrend: monthlyTrendData,
      sizeDistribution,
      datasets: datasets.map(dataset => ({
        id: dataset._id,
        name: dataset.name,
        fileType: dataset.fileType,
        fileSize: dataset.fileSize,
        records: dataset.rows || 0,
        columns: dataset.columns?.length || 0,
        createdAt: dataset.createdAt,
        status: 'processed'
      }))
    };

    return NextResponse.json(analyticsData, { status: 200 });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 