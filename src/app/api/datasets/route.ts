import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/dbConnect";
import { processFileBuffer } from "@/lib/utils";
import User from "@/model/user.model";
import Dataset from "@/model/dataset.model";
import { uploadToCloudinary } from "@/lib/cloudinary-server";

export async function GET() {
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
    return NextResponse.json({ datasets: [] }, { status: 200 });
  }

  // Now query datasets by the user's ObjectId
  const datasets = await Dataset.find({ userId: user._id });

  return NextResponse.json({ datasets }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    // Protect the route by checking if the user is signed in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const sessionUser = await currentUser();

    await connectDB();

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload CSV or Excel files only." },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Process file with SheetJS
    const { columns, rows, fileType } = processFileBuffer(buffer, file.name);

    if (columns.length === 0) {
      return NextResponse.json(
        { error: "No valid columns found in the file" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const { url: cloudinaryUrl, publicId: cloudinaryPublicId } =
      await uploadToCloudinary(buffer, file.name);

    // Find or create user in database
    let user = await User.findOne({ clerkId: sessionUser?.id });

    if (!user) {
      user = new User({
        clerkId: sessionUser?.id,
        plan: "free", // Default plan
        datasets: [],
      });
      await user.save();
    }

    const dataset = new Dataset({
      userId: user._id,
      name: file.name,
      fileType,
      fileSize: file.size,
      columns,
      rows,
      cloudinaryUrl,
      cloudinaryPublicId,
    });

    await dataset.save();

    // Add dataset to user's datasets array
    user.datasets.push(dataset._id);
    await user.save();

    return NextResponse.json(
      {
        message: "File uploaded and processed successfully",
        dataset: {
          id: dataset._id,
          name: dataset.name,
          fileType: dataset.fileType,
          fileSize: dataset.fileSize,
          columns: dataset.columns,
          rows: dataset.rows,
          cloudinaryUrl: dataset.cloudinaryUrl,
          createdAt: dataset.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("File upload error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 