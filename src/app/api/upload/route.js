import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, error: "File size must be less than 5MB" },
                { status: 400 }
            );
        }

        // Generate unique filename
        const ext = path.extname(file.name) || ".jpg";
        const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`;

        // Save to public/uploads
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadsDir, { recursive: true });

        const buffer = Buffer.from(await file.arrayBuffer());
        const filepath = path.join(uploadsDir, filename);
        await fs.writeFile(filepath, buffer);

        // Return the public URL
        const imageUrl = `/uploads/${filename}`;

        return NextResponse.json({ success: true, imageUrl });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
