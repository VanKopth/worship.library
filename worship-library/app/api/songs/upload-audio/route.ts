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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let url: string;
    let key: string;

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
        
        await prisma.song.update({
          where: { id: parseInt(songId) },
          data: { audioUrl: url },
        });

        return NextResponse.json({
          success: true,
          url,
          key,
        });
        
        console.log('Database updated successfully');
        
      } catch (r2Error) {
        console.error('R2 upload failed', r2Error);
      }
    } else {
      console.log('R2 not configured, using local storage');

    }

    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
