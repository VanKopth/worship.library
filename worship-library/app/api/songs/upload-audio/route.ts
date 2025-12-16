import { NextRequest, NextResponse } from "next/server";
import { uploadAudioToR2 } from "@/lib/r2-storage";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    console.log('Upload audio API route called');
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const songId = formData.get("songId") as string;
    
    console.log('Received file:', file?.name, 'size:', file?.size);
    console.log('Received songId:', songId);

    if (!file) {
      console.error('No file provided');
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!songId) {
      console.error('No songId provided');
      return NextResponse.json({ error: "No songId provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/m4a"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only audio files are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let url: string;
    let key: string;

    // Check if R2 is configured
    const isR2Configured = process.env.CLOUDFLARE_ACCESS_KEY_ID && 
                          process.env.CLOUDFLARE_SECRET_ACCESS_KEY && 
                          process.env.CLOUDFLARE_BUCKET_NAME &&
                          process.env.CLOUDFLARE_PUBLIC_URL;

    if (isR2Configured) {
      console.log('Using Cloudflare R2 storage');
      try {
        const result = await uploadAudioToR2(buffer, file.name, file.type);
        
        // Use public URL instead of storage URL
        // Format: https://pub-xxx.r2.dev/audio/filename.mp3
        const publicUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${result.key}`;
        
        url = publicUrl;
        key = result.key;
        
        console.log('Public URL:', publicUrl);
      } catch (r2Error) {
        console.error('R2 upload failed, falling back to local storage:', r2Error);
        // Fall back to local storage if R2 fails
        const localResult = await saveFileLocally(buffer, file.name);
        url = localResult.url;
        key = localResult.key;
      }
    } else {
      console.log('R2 not configured, using local storage');
      // Save file locally if R2 is not configured
      const localResult = await saveFileLocally(buffer, file.name);
      url = localResult.url;
      key = localResult.key;
    }

    console.log('File saved:', url);

    // Update song in database
    await prisma.song.update({
      where: { id: parseInt(songId) },
      data: { audioUrl: url },
    });

    console.log('Database updated successfully');

    return NextResponse.json({
      success: true,
      url,
      key,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Helper function to save file locally
async function saveFileLocally(buffer: Buffer, fileName: string): Promise<{ url: string; key: string }> {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `${timestamp}-${sanitizedFileName}`;
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'audio');
  await mkdir(uploadsDir, { recursive: true });
  
  // Save file
  const filePath = path.join(uploadsDir, key);
  await writeFile(filePath, buffer);
  
  // Return public URL
  const url = `/uploads/audio/${key}`;
  
  return { url, key };
}
