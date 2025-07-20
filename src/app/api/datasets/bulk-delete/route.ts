import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/model/user.model";
import Dataset from "@/model/dataset.model";
import { deleteFromCloudinary } from "@/lib/cloudinary-server";

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

    // Get the dataset IDs from the request body
    const { datasetIds } = await request.json();

    if (!datasetIds || !Array.isArray(datasetIds) || datasetIds.length === 0) {
      return NextResponse.json(
        { error: "No dataset IDs provided" },
        { status: 400 }
      );
    }

    // Find all datasets that belong to the user
    const datasets = await Dataset.find({
      _id: { $in: datasetIds },
      userId: user._id
    });

    if (datasets.length === 0) {
      return NextResponse.json(
        { error: "No datasets found" },
        { status: 404 }
      );
    }

    // Delete from Cloudinary and database
    const deletePromises = datasets.map(async (dataset) => {
      try {
        // Delete from Cloudinary
        await deleteFromCloudinary(dataset.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error(`Cloudinary delete error for ${dataset._id}:`, cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }

      // Delete from database
      return Dataset.findByIdAndDelete(dataset._id);
    });

    await Promise.all(deletePromises);

    // Remove from user's datasets array
    await User.findByIdAndUpdate(user._id, {
      $pull: { datasets: { $in: datasetIds } }
    });

    return NextResponse.json(
      { 
        message: `${datasets.length} dataset(s) deleted successfully`,
        deletedCount: datasets.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Bulk delete datasets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 