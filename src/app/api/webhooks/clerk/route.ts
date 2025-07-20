import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/model/user.model";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const evt = await verifyWebhook(request);
        if (evt.type === "user.created") {
            const userData = evt.data;            
            // Safely extract email from email_addresses array
            const email = userData.email_addresses?.[0]?.email_address;
            if (!email) {
                throw new Error("User must have at least one email address");
            }
            
            // Safely extract phone number (optional)
            const phone = userData.phone_numbers?.[0]?.phone_number || undefined;
            
            // Prefer image_url, fallback to profile_image_url
            const imageUrl = userData.image_url || (userData as { profile_image_url?: string }).profile_image_url || undefined;
            
            // Create user in DB
            await User.create({
                clerkId: userData.id,
                plan: "free",
                username: userData.username || `user_${userData.id.slice(-8)}`, // Fallback username if none provided
                email: email,
                phone: phone,
                src: imageUrl,
                datasets: [],
            });
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("Error handling Clerk webhook:", err);
        return NextResponse.json({ error: "Webhook error" }, { status: 400 });
    }
}