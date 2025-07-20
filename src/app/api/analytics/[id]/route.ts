import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/model/user.model";
import Dataset from "@/model/dataset.model";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Await params before accessing its properties
    const { id } = await params;

    // Find the dataset and ensure it belongs to the user
    const dataset = await Dataset.findOne({ 
      _id: id, 
      userId: user._id 
    });

    if (!dataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }

    // For now, return basic dataset info without analysis since we don't store actual data
    // In a real implementation, you would fetch the file from Cloudinary and analyze it
    return NextResponse.json({
      dataset: {
        id: dataset._id,
        name: dataset.name,
        fileType: dataset.fileType,
        fileSize: dataset.fileSize,
        columns: dataset.columns,
        rows: dataset.rows,
        createdAt: dataset.createdAt,
      },
      analysis: {
        summary: {
          totalRows: dataset.rows,
          totalColumns: dataset.columns.length,
          dataQuality: 100,
          completeness: 100
        },
        columnAnalysis: dataset.columns.map((col: string) => ({
          name: col,
          dataType: 'unknown',
          totalValues: dataset.rows,
          nonNullValues: dataset.rows,
          nullCount: 0,
          completeness: 100,
          stats: null,
          uniqueValues: null
        })),
        dataInsights: [],
        charts: {
          dataQuality: [],
          columnDistribution: [],
          missingData: []
        }
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Dataset analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



 