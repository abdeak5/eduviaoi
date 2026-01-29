"use client";

import { useEffect, useState } from "react";
import { WinWindow } from "@/components/win2k/WinWindow";
import { WinButton } from "@/components/win2k/WinButton";
import { useAuth } from "@/lib/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Award, User as UserIcon, BookOpen, Coins } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface UserProfile {
    displayName: string;
    photoURL: string;
    eduviaCoins: number;
    createdAt: string;
    academicProfile?: {
        university: string;
        fieldOfStudy: string;
        degree: string;
        interests: string[];
    };
}

export default function ProfilePage() {
    const params = useParams(); // For /profile/[id] support later, currently just checking self or hardcoded if needed
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;
            // In a real app we'd fetch params.id, but for now let's show current user
            const docRef = doc(db, "users", user.uid);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                setProfile(snap.data() as UserProfile);
            }
            setLoading(false);
        }
        fetchProfile();
    }, [user]);

    if (loading) return <div className="text-white p-4">Reading Profile Data...</div>;

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className="absolute top-4 left-4">
                <Link href="/">
                    <WinButton className="flex items-center gap-2">
                        <ArrowLeft size={14} /> Desktop
                    </WinButton>
                </Link>
            </div>

            <WinWindow title="System Properties (User Profile)" className="w-[600px] h-[450px]">
                <div className="p-4 bg-win-gray h-full flex flex-col gap-4">

                    {/* Header / Identity */}
                    <div className="flex gap-6 items-start">
                        <div className="w-24 h-24 bg-white border-2 border-[#808080] shadow-win-in flex items-center justify-center">
                            {/* Avatar */}
                            {profile?.photoURL ? (
                                <img src={profile.photoURL} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={48} className="text-gray-400" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="font-bold text-xl mb-1">{profile?.displayName || "Unknown Scholar"}</h1>
                            <p className="text-sm text-gray-700 font-bold">{profile?.academicProfile?.degree || "Researcher"}</p>
                            <p className="text-sm text-gray-600 mb-2">at {profile?.academicProfile?.university || "Independent"}</p>

                            <div className="flex gap-2 flex-wrap">
                                {profile?.academicProfile?.interests.map(tag => (
                                    <span key={tag} className="text-xs bg-white border border-gray-500 px-1 py-0.5 shadow-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-[2px] bg-white border-b border-[#808080]" />

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <fieldset className="border border-white border-l-[#808080] border-t-[#808080] p-2">
                            <legend className="text-xs px-1">Academic Performance</legend>
                            <div className="flex flex-col gap-2 p-2">
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2"><Coins size={14} className="text-yellow-600" /> Coins:</span>
                                    <span className="font-bold font-mono text-green-700">{profile?.eduviaCoins}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2"><BookOpen size={14} className="text-blue-600" /> Contributions:</span>
                                    <span className="font-bold">12</span> {/* Mock for now */}
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2"><Award size={14} className="text-red-600" /> Impact Factor:</span>
                                    <span className="font-bold">4.2</span> {/* Mock */}
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className="border border-white border-l-[#808080] border-t-[#808080] p-2">
                            <legend className="text-xs px-1">System Info</legend>
                            <div className="text-xs text-gray-600 flex flex-col gap-1 p-2">
                                <p>Registered: {new Date(profile?.createdAt || "").toLocaleDateString()}</p>
                                <p>ID: {user?.uid.substring(0, 8)}...</p>
                                <p>Status: Active</p>
                            </div>
                        </fieldset>
                    </div>

                    <div className="flex-1" />

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <WinButton className="w-24">Edit Info</WinButton>
                        <WinButton className="w-24 font-bold">OK</WinButton>
                    </div>

                </div>
            </WinWindow>
        </div>
    );
}
