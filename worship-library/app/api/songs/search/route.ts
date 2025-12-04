import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/lib/prisma";
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || '';

        const songs = await prisma.song.findMany({
            where: {
                OR: [
                    {
                        songTitle: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        songText: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        });

        return NextResponse.json(songs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to search songs' }, { status: 500 });
    }
}
