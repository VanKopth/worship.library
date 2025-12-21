'use server'

import React from "react";
import { cn } from "@/lib/utils";
import {Button} from "../ui";
import {CircleUserRound, Plus, SquarePlus} from "lucide-react";
import { SearchInput } from "@/components/shared/search-input";
import Link from "next/link";
import {verifySession} from "@/lib/dal";

interface Props {
    className?: string;
    isSearchBarActive?: boolean;
}

export const Header: React.FC<Props> = async ({ className, isSearchBarActive}) => {
    const session = await verifySession()
    const isAuth= session?.isAuth;
    
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
                    {isSearchBarActive && (
                        <div className='w-full max-w-[600px]'>
                            <SearchInput />
                        </div>
                    )}
                    <div className='relative flex items-center'>
                        {isAuth && (<Link href='/Song/New'>
                            <Button variant='ghost' size={"icon-lg"} className={cn("p-0 backdrop-blur-3xl bg-white/10 rounded-full max-sm:absolute max-sm:top-full max-sm:mt-3 max-sm:[-translate-x-1/2]", className)} >
                                <SquarePlus size={cn()} color={"black"} />
                            </Button>
                        </Link>)}
                        <Link href='/login'>
                            <Button  variant='outline' className="rounded-full size-[50px]" >
                                <CircleUserRound strokeWidth={1} color="#575757" absoluteStrokeWidth className="size-[40px]" />
                            </Button>
                        </Link>
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
