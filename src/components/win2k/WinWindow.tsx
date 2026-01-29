import React from 'react';
import { X, Minus, Square } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming standard cn utility is added later, or I'll implement it now inline if needed, but standard practice is to have it.

// Minimal class merger since I haven't created utils.ts yet
function clsx(...inputs: (string | undefined | null | false)[]) {
    return inputs.filter(Boolean).join(" ");
}

interface WinWindowProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    isActive?: boolean;
    onClose?: () => void;
    icon?: React.ReactNode;
}

export function WinWindow({ title, children, className, isActive = true, onClose, icon }: WinWindowProps) {
    return (
        <div className={clsx(
            "bg-win-gray p-1 shadow-win-out flex flex-col",
            className
        )}>
            {/* Title Bar */}
            <div className={clsx(
                "flex items-center justify-between px-1 py-0.5 mb-1",
                isActive ? "bg-win-gradient text-white" : "bg-win-gray-dark text-win-gray-light"
            )}>
                <div className="flex items-center gap-2 font-bold select-none truncate text-sm">
                    {icon && <span className="w-4 h-4">{icon}</span>}
                    <span>{title}</span>
                </div>

                <div className="flex gap-1">
                    <button className="bg-win-gray w-5 h-5 flex items-center justify-center shadow-win-out active:shadow-win-in text-black">
                        <Minus size={10} strokeWidth={4} />
                    </button>
                    <button className="bg-win-gray w-5 h-5 flex items-center justify-center shadow-win-out active:shadow-win-in text-black">
                        <Square size={10} strokeWidth={3} />
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-win-gray w-5 h-5 flex items-center justify-center shadow-win-out active:shadow-win-in text-black"
                    >
                        <X size={12} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
}
