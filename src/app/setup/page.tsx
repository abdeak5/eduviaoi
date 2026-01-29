"use client";

import { useState, useEffect } from "react";
import { WinWindow } from "@/components/win2k/WinWindow";
import { WinButton } from "@/components/win2k/WinButton";
import { WinInput } from "@/components/win2k/WinInput";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SetupPage() {
    const { user, userData } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        displayName: "",
        university: "",
        fieldOfStudy: "",
        degree: "Undergraduate",
        interests: ""
    });

    useEffect(() => {
        if (userData?.displayName) {
            setFormData(prev => ({ ...prev, displayName: userData.displayName || "" }));
        }
    }, [userData]);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleFinish = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                displayName: formData.displayName,
                academicProfile: {
                    university: formData.university,
                    fieldOfStudy: formData.fieldOfStudy,
                    degree: formData.degree,
                    interests: formData.interests.split(",").map(s => s.trim())
                },
                setupCompleted: true
            });
            router.push("/");
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <div className="h-full flex items-center justify-center bg-[#008080]">
            <WinWindow title="Eduvia Setup Wizard" className="w-[500px] h-[400px]">
                <div className="flex flex-col h-full bg-win-gray p-4">

                    {/* Wizard Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <img src="/globe_icon_placeholder.png" alt="" className="w-16 h-16 bg-white border border-gray-500" />
                        {/* Note: In a real app I'd use a real asset, using div placeholder for now if image fails */}
                        <div>
                            <h2 className="font-bold text-lg">Welcome to Eduvia</h2>
                            <p className="text-sm">Please configure your academic identity.</p>
                        </div>
                    </div>

                    <div className="flex-1 border-t border-b border-white py-4 mb-4">
                        {step === 1 && (
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-bold">Step 1: Who are you?</label>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs">Full Name:</span>
                                    <WinInput
                                        value={formData.displayName}
                                        onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-bold">Step 2: Academic Background</label>

                                <div className="flex flex-col gap-1">
                                    <span className="text-xs">University / Institution:</span>
                                    <WinInput
                                        value={formData.university}
                                        onChange={e => setFormData({ ...formData, university: e.target.value })}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-xs">Field of Study (e.g., Physics, Law):</span>
                                    <WinInput
                                        value={formData.fieldOfStudy}
                                        onChange={e => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-xs">Current Degree:</span>
                                    <select
                                        className="bg-white border-2 border-[#808080] shadow-win-in px-2 py-1 text-sm outline-none"
                                        value={formData.degree}
                                        onChange={e => setFormData({ ...formData, degree: e.target.value })}
                                    >
                                        <option>High School</option>
                                        <option>Undergraduate</option>
                                        <option>Master's</option>
                                        <option>PhD</option>
                                        <option>Professor</option>
                                        <option>Independent Researcher</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-bold">Step 3: Research Interests</label>
                                <p className="text-xs text-gray-600">Separate keywords with commas. We use this to personalize your news feed.</p>
                                <textarea
                                    className="flex-1 bg-white border-2 border-[#808080] shadow-win-in p-2 text-sm outline-none resize-none"
                                    placeholder="e.g. Quantum Mechanics, Machine Learning, Roman History..."
                                    value={formData.interests}
                                    onChange={e => setFormData({ ...formData, interests: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Step {step} of 3</span>
                        <div className="flex gap-2">
                            <WinButton onClick={handleBack} disabled={step === 1} className="w-20"> &lt; Back</WinButton>
                            {step < 3 ? (
                                <WinButton onClick={handleNext} className="w-20">Next &gt;</WinButton>
                            ) : (
                                <WinButton onClick={handleFinish} disabled={loading} className="w-20 font-bold">Finish</WinButton>
                            )}
                        </div>
                    </div>

                </div>
            </WinWindow>
        </div>
    );
}
