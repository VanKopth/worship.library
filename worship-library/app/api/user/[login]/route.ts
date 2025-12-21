import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/lib/prisma";
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ login: string }> }
) {
    try {
        const { login } = await params;
        console.log("this is the user", login);
        const user = await prisma.user.findFirst({
            where: {
                login: login
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'user not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}