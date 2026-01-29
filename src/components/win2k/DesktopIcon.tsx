import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface DesktopIconProps {
    label: string;
    icon: React.ReactNode;
    href: string;
}

export function DesktopIcon({ label, icon, href }: DesktopIconProps) {
    return (
        <Link href={href}>
            <div className="group flex flex-col items-center gap-1 w-20 cursor-pointer p-1 border border-transparent hover:bg-[#000080]/20 hover:border-white/20 select-none">
                <div className="w-10 h-10 flex items-center justify-center">
                    {/* Clone icon with larger size if needed, or just render */}
                    <div className="text-white drop-shadow-[1px_1px_0_rgba(0,0,0,1)]">
                        {icon}
                    </div>
                </div>
                <span className={cn(
                    "text-white text-xs text-center leading-tight",
                    "drop-shadow-[1px_1px_0_rgba(0,0,0,1)]", // Harsh pixel shadow
                    "group-hover:bg-[#000080] group-hover:text-white"
                )}>
                    {label}
                </span>
            </div>
        </Link>
    );
}
