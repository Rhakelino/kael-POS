export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";

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
        const ext = file.name.substring(file.name.lastIndexOf('.')) || ".jpg";
        const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`;

        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        const ctx = getRequestContext();
        const bucket = ctx?.env?.POS_BUCKET;

        if (!bucket) {
            // Local fallback logic if R2 isn't bound in dev
            console.warn("POS_BUCKET not bound. Simulated upload success.");
            return NextResponse.json({ success: true, imageUrl: `/uploads/${filename}` });
        }

        await bucket.put(filename, bytes, {
            httpMetadata: { contentType: file.type }
        });

        // The image will be accessible via R2 custom domain
        // Update this URL prefix once you configure a public bucket domain
        const imageUrl = `https://assets.kaelcafe.com/${filename}`;

        return NextResponse.json({ success: true, url: imageUrl }); // Settings form expects `url` 
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
