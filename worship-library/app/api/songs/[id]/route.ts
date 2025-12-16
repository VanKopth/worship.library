import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/lib/prisma";
import {Song} from "@/prisma/generated/client";
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const song = await prisma.song.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!song) {
            return NextResponse.json({ error: 'Song not found' }, { status: 404 });
        }

        return NextResponse.json(song);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch song' }, { status: 500 });
    }
}
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // ✅ Змінили тип на Promise
) {
    try {
        const params = await context.params;
        const songId = Number(params.id);

        if (isNaN(songId)) {
            return NextResponse.json({ error: 'Invalid song id' }, { status: 400 });
        }

        const body = await req.json();
        if (!body || !body.songText) {
            return NextResponse.json({ error: 'No songText provided' }, { status: 400 });
        }

        const updatedSong = await prisma.song.update({
            where: { id: songId },
            data: { 
                songTitle: body.songTitle,
                songText: body.songText,
            },
        });

        return NextResponse.json(updatedSong);
    } catch (error) {
        console.error('PUT /api/songs/[id] error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}