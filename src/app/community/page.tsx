"use client";

import { useState, useEffect } from "react";
import { WinWindow } from "@/components/win2k/WinWindow";
import { WinButton } from "@/components/win2k/WinButton";
import { useAuth } from "@/lib/contexts/AuthContext";
import { MessageSquare, Plus, ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { collection, query, orderBy, limit, onSnapshot, addDoc, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { awardCoin } from "@/lib/services/coinService";

interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    category: string;
    createdAt: any;
    likes: number;
}

const CATEGORIES = ["General", "Science", "Technology", "Humanities", "Arts"];

export default function CommunityPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", content: "", category: "General" });

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(20));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
            setPosts(postsData);
        });
        return () => unsubscribe();
    }, []);

    const handleCreatePost = async () => {
        if (!user || !newPost.title || !newPost.content) return;

        await addDoc(collection(db, "posts"), {
            title: newPost.title,
            content: newPost.content,
            category: newPost.category,
            authorId: user.uid,
            authorName: user.displayName || "Anonymous Scholar",
            createdAt: new Date(),
            likes: 0
        });

        // Reward for contribution
        await awardCoin(user.uid, 10);
        setIsCreating(false);
        setNewPost({ title: "", content: "", category: "General" });
    };

    return (
        <div className="h-full flex flex-col max-w-5xl mx-auto">
            <div className="mb-4 flex justify-between items-center">
                <Link href="/">
                    <WinButton className="flex items-center gap-2">
                        <ArrowLeft size={14} /> Back to Desktop
                    </WinButton>
                </Link>
                <WinButton onClick={() => setIsCreating(true)} className="flex items-center gap-2 font-bold">
                    <Plus size={14} /> New Discussion
                </WinButton>
            </div>

            <div className="flex gap-4 h-full overflow-hidden">
                {/* Sidebar: Categories */}
                <WinWindow title="Boards" className="w-64">
                    <div className="bg-win-gray p-2 h-full flex flex-col gap-1">
                        {CATEGORIES.map(cat => (
                            <div key={cat} className="flex items-center px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer border border-transparent hover:border-white border-dotted">
                                <span className="w-2 h-2 bg-gray-500 mr-2 rounded-full" />
                                {cat}
                            </div>
                        ))}
                    </div>
                </WinWindow>

                {/* Main Feed */}
                <div className="flex-1 flex flex-col">
                    <WinWindow title="The Common Room - Recent Discussions" className="flex-1" icon={<MessageSquare size={14} />} >
                        <div className="h-full bg-white p-2 overflow-y-auto">
                            <table className="w-full text-sm font-sans collapse">
                                <thead className="bg-win-gray sticky top-0 shadow-win-out text-xs">
                                    <tr>
                                        <th className="border border-[#808080] px-2 py-1 text-left w-16">Cat</th>
                                        <th className="border border-[#808080] px-2 py-1 text-left">Topic</th>
                                        <th className="border border-[#808080] px-2 py-1 text-left w-32">Author</th>
                                        <th className="border border-[#808080] px-2 py-1 text-center w-16">Likes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map(post => (
                                        <tr key={post.id} className="hover:bg-[#000080] hover:text-white cursor-pointer group">
                                            <td className="border border-gray-200 px-2 py-1 text-xs text-center bg-gray-100 group-hover:bg-transparent group-hover:text-white text-gray-600 truncate">
                                                {post.category}
                                            </td>
                                            <td className="border border-gray-200 px-2 py-1 font-bold truncate max-w-sm">
                                                {post.title}
                                            </td>
                                            <td className="border border-gray-200 px-2 py-1 truncate">
                                                {post.authorName}
                                            </td>
                                            <td className="border border-gray-200 px-2 py-1 text-center">
                                                {post.likes}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </WinWindow>
                </div>
            </div>

            {/* Create Modal */}
            {isCreating && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <WinWindow title="Post New Thread" className="w-[500px]" onClose={() => setIsCreating(false)}>
                        <div className="p-4 bg-win-gray flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs">Category:</label>
                                <select
                                    className="p-1 border shadow-win-in"
                                    value={newPost.category}
                                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                                >
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs">Title:</label>
                                <input
                                    className="p-1 border shadow-win-in outline-none"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs">Content:</label>
                                <textarea
                                    className="p-1 border shadow-win-in h-32 outline-none resize-none"
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <WinButton onClick={() => setIsCreating(false)}>Cancel</WinButton>
                                <WinButton onClick={handleCreatePost} className="font-bold">Post</WinButton>
                            </div>
                        </div>
                    </WinWindow>
                </div>
            )}
        </div>
    );
}
