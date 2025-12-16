'use client';

import React, {ReactNode} from "react";
import {
    Button, Dialog, DialogContent, DialogTitle, Input,  
} from "@/components/ui";
import {cn} from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
    className?: string;
}

export const Login: React.FC<Props> = ({ className }) => {
    {
        const router = useRouter();
        
        return (
            <Dialog open={true} onOpenChange={() => router.back()}>
                   <DialogContent className={cn("m-auto w-[400px] max-w-[90%] h-[430px] max-h-1/2 bg-white overflow-hidden", className)}>
                       <DialogTitle className={cn("m-auto text-3xl font-light")}>Library</DialogTitle>
                       <form>
                           <div className="flex flex-col gap-6">
                                   <Input
                                       id="login"
                                       type="login"
                                       placeholder="Login"
                                       required
                                       className={cn("h-12 bg-[url(@/public/noise.png)]")}
                                   />
                                   <Input 
                                       id="password" 
                                       type="password" 
                                       placeholder="Password" 
                                       required
                                       className={cn("h-12 bg-[url(@/public/noise.png)]")}
                                   />
                               <Button type="submit" className="w-full h-12 mt-8">
                                   Login
                               </Button>
                           </div>
                       </form>
                   </DialogContent>
            </Dialog>
        )
    }
}