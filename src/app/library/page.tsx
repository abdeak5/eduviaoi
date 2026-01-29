"use client";

import { useState, useEffect } from "react";
import { WinWindow } from "@/components/win2k/WinWindow";
import { WinButton } from "@/components/win2k/WinButton";
import { WinInput } from "@/components/win2k/WinInput";
import { Search, FileText, Download, ExternalLink, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Author {
    author: {
        id: string;
        display_name: string;
    };
    raw_affiliation_string: string;
}

interface Paper {
    id: string;
    title: string;
    publication_year: number;
    open_access: {
        is_oa: boolean;
        oa_url: string;
    };
    authorships: Author[];
    display_name: string;
    cited_by_count: number;
    abstract_inverted_index?: Record<string, number[]>; // OpenAlex stores abstracts this way
}

// Helper to reconstruct abstract from inverted index (simplified)
function reconstructAbstract(invertedIndex: Record<string, number[]> | undefined): string {
    if (!invertedIndex) return "No abstract available.";
    const words: string[] = [];
    Object.entries(invertedIndex).forEach(([word, positions]) => {
        positions.forEach(pos => {
            words[pos] = word;
        });
    });
    return words.join(" ");
}

export default function LibraryPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Paper[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            // Redirect or show lock screen
        }
    }, [user, authLoading]);

    const searchOpenAlex = async () => {
        if (!query) return;
        setLoading(true);
        try {
            // Include abstract in request
            const res = await fetch(`https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=20`);
            const data = await res.json();
            setResults(data.results);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    if (authLoading) return <div className="text-white p-4">Loading System...</div>;

    if (!user) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-4">
                <WinWindow title="Access Denied" className="w-96 max-w-full">
                    <div className="flex flex-col items-center p-8 gap-4 text-center">
                        <Lock size={48} className="text-red-600" />
                        <p>You must be logged in to access the Eduvia Library.</p>
                        <Link href="/">
                            <WinButton>Return to Login</WinButton>
                        </Link>
                    </div>
                </WinWindow>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col max-w-5xl mx-auto relative">
            <div className="mb-4">
                <Link href="/">
                    <WinButton className="flex items-center gap-2">
                        <ArrowLeft size={14} /> Back to Desktop
                    </WinButton>
                </Link>
            </div>

            <WinWindow
                title="Eduvia Library - [Connected to OpenAlex]"
                className="flex-1"
                icon={<FileText size={14} />}
            >
                <div className="h-full flex flex-col bg-win-gray">
                    {/* Search Bar */}
                    <div className="p-2 border-b border-[#808080] flex gap-2 items-center">
                        <label className="text-sm">Search:</label>
                        <WinInput
                            className="flex-1"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && searchOpenAlex()}
                            placeholder="Search for papers, topics, authors..."
                        />
                        <WinButton onClick={searchOpenAlex} disabled={loading}>
                            {loading ? 'Searching...' : 'Find'}
                        </WinButton>
                    </div>

                    {/* Results Area (File Explorer Style) */}
                    <div className="flex-1 bg-white m-1 border-2 border-[#808080] overflow-auto shadow-win-in p-1">
                        <table className="w-full text-sm font-sans collapse">
                            <thead className="bg-win-gray sticky top-0 shadow-win-out">
                                <tr>
                                    <th className="border border-[#808080] px-2 py-1 text-left w-[50%]">Title</th>
                                    <th className="border border-[#808080] px-2 py-1 text-left">Authors</th>
                                    <th className="border border-[#808080] px-2 py-1 text-center w-20">Year</th>
                                    <th className="border border-[#808080] px-2 py-1 text-center w-20">Citations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((paper) => (
                                    <tr
                                        key={paper.id}
                                        className="hover:bg-[#000080] hover:text-white group cursor-pointer"
                                        onClick={() => setSelectedPaper(paper)}
                                    >
                                        <td className="border border-gray-200 px-2 py-1 truncate max-w-md" title={paper.title || paper.display_name}>
                                            <div className="flex items-center gap-2">
                                                <FileText size={12} className="text-blue-600 group-hover:text-white" />
                                                {paper.title || paper.display_name}
                                            </div>
                                        </td>
                                        <td className="border border-gray-200 px-2 py-1 truncate max-w-xs">
                                            {paper.authorships.map(a => a.author.display_name).slice(0, 2).join(", ")}
                                        </td>
                                        <td className="border border-gray-200 px-2 py-1 text-center">
                                            {paper.publication_year}
                                        </td>
                                        <td className="border border-gray-200 px-2 py-1 text-center">
                                            {paper.cited_by_count}
                                        </td>
                                    </tr>
                                ))}
                                {results.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-10 text-gray-500">
                                            No items to display.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Status Bar */}
                    <div className="border-t border-white p-1 text-xs px-2 flex gap-4">
                        <span>{results.length} object(s)</span>
                        {loading && <span>Searching OpenAlex...</span>}
                    </div>
                </div>
            </WinWindow>

            {/* Details Modal (Properties Window) */}
            {selectedPaper && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <WinWindow
                        title="Doc Properties"
                        className="w-[600px] h-[500px] shadow-2xl"
                        onClose={() => setSelectedPaper(null)}
                        isActive={true}
                    >
                        <div className="p-4 bg-win-gray h-full flex flex-col gap-4 text-sm">

                            {/* Tabs (Fake) */}
                            <div className="flex gap-1 border-b border-white -mb-[1px]">
                                <div className="bg-win-gray px-3 py-1 border-t border-l border-r border-white relative top-[1px] -ml-[1px] z-10">General</div>
                                <div className="px-3 py-1 border border-t-0 border-[#808080] text-[#404040]">Details</div>
                            </div>

                            <div className="flex-1 border border-white border-r-[#404040] border-b-[#404040] p-4 flex flex-col gap-4 overflow-y-auto">
                                <div className="flex gap-4 items-start">
                                    <FileText size={32} className="text-blue-800 shrink-0" />
                                    <div>
                                        <h2 className="font-bold text-base mb-1">{selectedPaper.title}</h2>
                                        <p className="text-gray-600 italic">{selectedPaper.authorships.map(a => a.author.display_name).join(", ")}</p>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-white border-b border-[#808080]" />

                                <div className="grid grid-cols-[80px_1fr] gap-2">
                                    <span className="text-[#404040]">Published:</span>
                                    <span>{selectedPaper.publication_year}</span>

                                    <span className="text-[#404040]">Citations:</span>
                                    <span>{selectedPaper.cited_by_count}</span>

                                    <span className="text-[#404040]">Access:</span>
                                    <span>{selectedPaper.open_access.is_oa ? "Open Access (Free)" : "Paywalled"}</span>
                                </div>

                                <div className="h-[1px] bg-white border-b border-[#808080]" />

                                <div className="flex-1">
                                    <h3 className="font-bold mb-1">Abstract:</h3>
                                    <div className="bg-white border-2 border-[#808080] shadow-win-in p-2 h-32 overflow-y-auto select-text text-black">
                                        {/* Note: Inverted index reconstruction is complex, for speed usually display abstract if available or link. 
                                         OpenAlex API usually returns an inverted index. I'll use a placeholder or partial reconstruction if needed.*/}
                                        {/* Note: The 'abstract_inverted_index' is not always present in the list view. We might need a separate fetch or just show what we have. 
                                         Ideally, we fetch details on click. But for now, let's assume standard field or just link. 
                                         Wait, `works` endpoint DOES return abstract_inverted_index. 
                                     */}
                                        {reconstructAbstract(selectedPaper.abstract_inverted_index)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                {selectedPaper.open_access.oa_url && (
                                    <a href={selectedPaper.open_access.oa_url} target="_blank" rel="noopener noreferrer">
                                        <WinButton className="w-24">Open PDF</WinButton>
                                    </a>
                                )}
                                <WinButton className="w-24" onClick={() => setSelectedPaper(null)}>Close</WinButton>
                            </div>
                        </div>
                    </WinWindow>
                </div>
            )}
        </div>
    );
}
