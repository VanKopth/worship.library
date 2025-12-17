import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import { Button } from "../ui";
import { CircleUserRound } from "lucide-react";
import { SearchInput } from "@/components/shared/search-input";
import Link from "next/link";

interface Props {
    className?: string;
    isSearchBarActive?: boolean;
}

export const Header: React.FC<Props> = ({ className, isSearchBarActive}) => {
    if (isSearchBarActive) {
        return (
            <header className="sticky top-5 md:top-10 px-5 md:px-15 z-15">
                <div className={cn('flex items-center justify-between gap-5', className)}>
                    <div >
                        <Link href={'/'}>
                            <h1 className='text-sm md:text-2xl font-black'>Worship</h1>
                            <p className='text-xs  md:text-xl font-normal leading-3'>.library</p>
                        </Link>
                    </div>
                    <div className='w-full max-w-[600px]'>
                        <SearchInput />
                    </div>
                    <div className='flex items-center'>
                        <Button  variant='outline' className="rounded-full size-[50px]" >
                            <Link href='/login'>
                                <CircleUserRound strokeWidth={1} color="#575757" absoluteStrokeWidth className="size-[40px]" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>
        )
    }
    else return (
        <header className="md:fixed items-center justify-between w-full  pt-4 md:pt-10 z-10">
            <div className={cn('flex items-center justify-between px-10', className)}>
                <div >
                    <Link href={'/'} className={cn("flex",className)}>
                        <p className='text-2xl md:text-2xl font-black'>Worship</p>
                        <p className='text-md md:text-xl leading-9 font-bold'>.library</p>
                    </Link>
                </div>
                <div className='flex items-center'>
                    <Button  variant='outline' className="rounded-full size-[50px]" >
                        <Link href='/login'>
                            <CircleUserRound strokeWidth={1} color="#575757" absoluteStrokeWidth className="size-[40px]" />
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
