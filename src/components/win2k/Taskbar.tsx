"use client";

import { useState, useEffect } from "react";
import { WinButton } from "./WinButton";
import { MessageSquare, Monitor } from "lucide-react";

export function Taskbar() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-0 left-0 right-0 h-10 bg-win-gray border-t-2 border-white flex items-center px-1 gap-2 shadow-win-out z-50">
            <WinButton className="flex items-center gap-1 font-bold px-2 py-0.5" active>
                <div className="bg-black text-white p-0.5 rotate-45">
                    <div className="w-1 h-1 bg-red-500" />
                </div>
                Start
            </WinButton>

            <div className="flex-1 flex gap-1 items-center px-2 border-l border-[#808080] ml-1">
                <div className="w-full flex gap-1">
                    {/* Active Apps Area */}
                    <div className="bg-win-gray-light border-2 border-b-white border-r-white border-t-black border-l-black px-2 py-1 text-xs font-bold min-w-[100px] flex items-center gap-2 cursor-pointer bg-[#e0e0e0]">
                        <Monitor size={14} /> Eduvia OS
                    </div>
                </div>
            </div>

            <div className="border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white px-3 py-1 bg-win-gray text-xs font-mono">
                {time}
            </div>
        </div>
    );
}
