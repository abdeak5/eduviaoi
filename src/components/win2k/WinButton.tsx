import React from 'react';

function clsx(...inputs: (string | undefined | null | false)[]) {
    return inputs.filter(Boolean).join(" ");
}

interface WinButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'normal' | 'flat';
}

export function WinButton({ children, className, variant = 'normal', ...props }: WinButtonProps) {
    return (
        <button
            className={clsx(
                "px-4 py-1 active:translate-y-[1px] select-none",
                "text-black font-sans text-sm",
                "bg-win-gray shadow-win-out active:shadow-win-in focus:outline-dotted focus:outline-1 focus:outline-black focus:-outline-offset-2",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
