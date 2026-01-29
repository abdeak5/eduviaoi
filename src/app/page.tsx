"use client";

import { useState, useRef, useEffect } from "react";
import { WinWindow } from "@/components/win2k/WinWindow";
import { WinButton } from "@/components/win2k/WinButton";
import { WinInput } from "@/components/win2k/WinInput";
import { useAuth } from "@/lib/contexts/AuthContext";
import { awardCoin } from "@/lib/services/coinService";
import { Send, GraduationCap, MessagesSquare, Coins, Library } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Message {
    role: "user" | "ai";
    content: string;
    id: string;
}

export default function Home() {
    const { user, userData, signInWithGoogle, loading } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Welcome to Eduvia. How can I assist you today?", id: "welcome" }
    ]);
    const [input, setInput] = useState("");
    const [mode, setMode] = useState<"normal" | "academic">("normal");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && user && userData && !(userData as any).setupCompleted) {
            router.push("/setup");
        }
    }, [user, userData, loading, router]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        if (!user) {
            signInWithGoogle();
            return;
        }

        const newMessage = input;
        const userMsg: Message = { role: "user", content: newMessage, id: Date.now().toString() };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Initial placeholder for AI response
        const aiMsgId = "ai-" + Date.now();
        setMessages(prev => [...prev, { role: "ai", content: "", id: aiMsgId }]);

        try {
            // Award Coin
            await awardCoin(user.uid, 5);

            const history = messages.map(m => ({ role: m.role, content: m.content })).slice(-10); // Last 10 context

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: newMessage,
                    history: history,
                    mode: mode
                }),
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let streamedText = "";

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value, { stream: true });
                streamedText += chunkValue;

                // Update the last message (AI) with new text
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMsgId ? { ...msg, content: streamedText } : msg
                ));
            }

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => prev.map(msg =>
                msg.id === aiMsgId ? { ...msg, content: "Error: Could not connect to Eduvia Network." } : msg
            ));
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-4 max-w-4xl mx-auto">

            {/* Top Utility Bar (Desktop Icons style or just buttons) */}
            <div className="flex justify-between items-center text-white">
                <div className="flex gap-4">
                    <Link href="/library">
                        <div className="flex flex-col items-center cursor-pointer hover:opacity-80 group">
                            <div className="w-10 h-10 mb-1 bg-white/10 border border-white/30 flex items-center justify-center group-hover:bg-[#000080]/50">
                                <Library />
                            </div>
                            <span className="text-xs shadow-black drop-shadow-md bg-[#008080] px-1">Library</span>
                        </div>
                    </Link>
                    <Link href="/community">
                        <div className="flex flex-col items-center cursor-pointer hover:opacity-80 group">
                            <div className="w-10 h-10 mb-1 bg-white/10 border border-white/30 flex items-center justify-center group-hover:bg-[#000080]/50">
                                <MessagesSquare />
                            </div>
                            <span className="text-xs shadow-black drop-shadow-md bg-[#008080] px-1">Common Room</span>
                        </div>
                    </Link>
                </div>

                {/* User Status */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <Link href="/profile">
                            <div className="flex items-center gap-2 bg-win-gray p-1 border-2 border-white border-b-[#404040] border-r-[#404040] cursor-pointer hover:bg-gray-300">
                                <img src={user.photoURL || ""} alt="avatar" className="w-6 h-6 border border-gray-600" />
                                <span className="text-black text-sm px-1">{userData?.displayName}</span>
                                <div className="flex items-center gap-1 bg-black px-2 py-0.5 text-green-400 font-mono text-xs border border-gray-500 inset-shadow">
                                    <Coins size={10} />
                                    {userData?.eduviaCoins || 0}
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <WinButton onClick={() => signInWithGoogle()}>Login</WinButton>
                    )}
                </div>
            </div>

            {/* Main Chat Window */}
            <WinWindow
                title={`Eduvia Chat - [${mode === 'academic' ? 'Academic Mode' : 'Normal Mode'}]`}
                className="flex-1 min-h-0"
                icon={<MessagesSquare size={14} />}
            >
                <div className="flex flex-col h-full bg-white">

                    {/* Toolbar */}
                    <div className="bg-win-gray p-1 border-b border-[#808080] flex gap-2">
                        <WinButton
                            variant={mode === 'normal' ? 'flat' : 'normal'}
                            className={mode === 'normal' ? 'font-bold bg-white' : ''}
                            onClick={() => setMode('normal')}
                        >
                            Normal
                        </WinButton>
                        <WinButton
                            variant={mode === 'academic' ? 'flat' : 'normal'}
                            className={mode === 'academic' ? 'font-bold bg-white flex items-center gap-2' : 'flex items-center gap-2'}
                            onClick={() => setMode('academic')}
                        >
                            <GraduationCap size={14} />
                            Academic
                        </WinButton>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-white" style={{ boxShadow: 'inset 2px 2px #404040' }}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`
                            max-w-[80%] p-3 text-sm
                            ${msg.role === 'user'
                                        ? 'bg-[#000080] text-white border-2 border-[#404040] shadow-win-out'
                                        : 'bg-win-gray text-black border-2 border-white shadow-win-out'}
                        `}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="text-xs text-gray-500 animate-pulse">Eduvia is thinking...</div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-2 bg-win-gray border-t border-white flex gap-2">
                        <WinInput
                            className="flex-1"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <WinButton onClick={handleSend} className="w-20 font-bold">Send</WinButton>
                    </div>
                </div>
            </WinWindow>
        </div>
    );
}
