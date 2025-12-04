import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
export async function GET() {
    try {
        const songs = await prisma.song.findMany({
            orderBy: {
                id: 'asc'
            }
        });
        return NextResponse.json(songs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
    }
}

