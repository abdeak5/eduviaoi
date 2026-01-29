import React from 'react';

function clsx(...inputs: (string | undefined | null | false)[]) {
    return inputs.filter(Boolean).join(" ");
}

interface WinInputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export function WinInput({ className, ...props }: WinInputProps) {
    return (
        <input
            className={clsx(
                "bg-white text-black px-2 py-1 shadow-win-in outline-none font-sans text-sm placeholder:text-gray-400",
                className
            )}
            {...props}
        />
    );
}
