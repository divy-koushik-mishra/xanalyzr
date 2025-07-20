import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/model/user.model";
import Dataset from "@/model/dataset.model";
import { deleteFromCloudinary } from "@/lib/cloudinary-server";

export async function DELETE(
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

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(dataset.cloudinaryPublicId);
    } catch (cloudinaryError) {
      console.error("Cloudinary delete error:", cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await Dataset.findByIdAndDelete(id);

    // Remove from user's datasets array
    await User.findByIdAndUpdate(user._id, {
      $pull: { datasets: id }
    });

    return NextResponse.json(
      { message: "Dataset deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete dataset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // Return the dataset data for download
    return NextResponse.json({
      dataset: {
        id: dataset._id,
        name: dataset.name,
        fileType: dataset.fileType,
        fileSize: dataset.fileSize,
        columns: dataset.columns,
        rows: dataset.rows,
        cloudinaryUrl: dataset.cloudinaryUrl,
        createdAt: dataset.createdAt,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Get dataset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 