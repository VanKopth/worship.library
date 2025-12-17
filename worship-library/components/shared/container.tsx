import React from "react";
import {cn} from "@/lib/utils";

interface Props {
  className?: string;
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({ className, children }) => {
    return <div className={cn('mx-auto px-3 w-[900px] max-w-[95%] md:max-w-[60%]', className)}>{children}</div>
}