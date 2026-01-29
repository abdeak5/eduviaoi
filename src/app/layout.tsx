import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { Taskbar } from "@/components/win2k/Taskbar";

export const metadata: Metadata = {
    title: "Eduvia - AI Platform",
    description: "Independent AI Knowledge Platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="h-screen w-screen overflow-hidden flex flex-col bg-[#008080]">
                <AuthProvider>
                    <div className="flex-1 overflow-hidden relative p-2 sm:p-4 pb-12">
                        {/* Main Desktop Area */}
                        {children}
                    </div>
                    <Taskbar />
                </AuthProvider>
            </body>
        </html>
    );
}
