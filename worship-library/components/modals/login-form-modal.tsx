'use client';

import React, {ReactNode, useActionState, useEffect} from "react";
import { Button, Dialog, DialogContent, DialogTitle, Input,} from "@/components/ui";
import {cn} from "@/lib/utils";
import { useRouter } from "next/navigation";
import {login} from "@/app/login/actions";
import Form from "next/form";

interface Props {
    className?: string;
}

export const Login: React.FC<Props> = ({ className }) => {
    {
        const router = useRouter();
        const [state, loginAction] = useActionState(login, undefined);

        useEffect(() => {
            if (state?.success) {
                router.push("/");
            }
        }, [state, router]);
        
        return (
            <Dialog open={true} onOpenChange={() => router.back()}>
                   <DialogContent className={cn("mx-auto w-[400px] max-w-[90%] h-[430px] max-h-1/2 bg-white overflow-hidden", className)}>
                       <DialogTitle className={cn("m-auto text-3xl font-light")}>Library</DialogTitle>
                       <Form action={loginAction}>
                           <div className="flex flex-col gap-6">
                               {state?.errors?.login && (
                                   <p className="text-red-500 text-xm mx-auto font-medium mt-2">
                                       {state.errors.login}
                                   </p>
                               )}
                               <div>
                                   <Input
                                       id="login"
                                       name="login"
                                       type="text"
                                       placeholder="Login"
                                       required
                                       className={cn(
                                           "h-12 bg-[url(@/public/noise.png)]"
                                       )}
                                   />
                               </div>

                               <div>
                                   <Input
                                       id="password"
                                       name="password"
                                       type="password"
                                       placeholder="Password"
                                       required
                                       className={cn(
                                           "h-12 bg-[url(@/public/noise.png)]"
                                       )}
                                   />
                               </div>

                               <Button type="submit" className="w-full h-12 mt-8">
                                   Login
                               </Button>
                               
                           </div>
                       </Form>
                   </DialogContent>
            </Dialog>
        )
    }
}