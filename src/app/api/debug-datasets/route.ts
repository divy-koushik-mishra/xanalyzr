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
    
    const debugInfo = datasets.map(dataset => ({
      id: dataset._id,
      name: dataset.name,
      fileType: dataset.fileType,
      rowsType: typeof dataset.rows,
      rowsLength: Array.isArray(dataset.rows) ? dataset.rows.length : 'N/A',
      columnsLength: Array.isArray(dataset.columns) ? dataset.columns.length : 'N/A',
      sampleRows: Array.isArray(dataset.rows) ? dataset.rows.slice(0, 2) : dataset.rows
    }));

    return NextResponse.json({ 
      totalDatasets: datasets.length,
      datasets: debugInfo
    }, { status: 200 });
  } catch (error) {
    console.error("Debug datasets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 