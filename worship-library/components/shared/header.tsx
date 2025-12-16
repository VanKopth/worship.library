import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import { Button } from "../ui";
import { CircleUserRound } from "lucide-react";
import { SearchInput } from "@/components/shared/search-input";
import Link from "next/link";

interface Props {
    className?: string;
    isSerachBarActive?: boolean;
}

export const Header: React.FC<Props> = ({ className, isSerachBarActive}) => {
    if (isSerachBarActive) {
        return (
            <header className="sticky top-15 z-15">
                <Container className={cn('flex items-center justify-between py-4 gap-5')}>
                    <div>
                        <Link href={'/'}>
                            <h1 className='text-2xl font-black'>Worship</h1>
                            <p className='text-xs font-black leading-3'>.library</p>
                        </Link>
                    </div>
                    <div className='w-full max-w-[500px]'>
                        <SearchInput />
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button  variant='outline' className="rounded-full size-[50px]" >
                            <Link href='/login'>
                                <CircleUserRound strokeWidth={1} color="#575757" absoluteStrokeWidth className="size-[40px]" />
                            </Link>
                        </Button>
                    </div>
                </Container>
            </header>
        )
    }
    else return (
        <header className="pt-5 z-10">
            <Container className={cn('flex items-center justify-between py-4 gap-5')}>
                <div>
                    <Link href={'/'}>
                        <h1 className='text-2xl font-black'>Worship</h1>
                        <p className='text-xs font-black leading-3'>.library</p>
                    </Link>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='outline' className="rounded-full size-[50px]" >
                        <Link href='/login'>
                            <CircleUserRound strokeWidth={1} color="#575757" absoluteStrokeWidth className="size-[40px]" />
                        </Link>
                    </Button>
                </div>
            </Container>
        </header>
    )
}