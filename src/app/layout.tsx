import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";

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
                    <div className="flex-1 overflow-hidden relative p-2 sm:p-4">
                        {/* Main Desktop Area */}
                        {children}
                    </div>
                    {/* Taskbar placeholder - will be added as a component later */}
                </AuthProvider>
            </body>
        </html>
    );
}
