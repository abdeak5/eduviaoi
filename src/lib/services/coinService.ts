import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const awardCoin = async (uid: string, amount: number = 1) => {
    if (!uid) return;
    const userRef = doc(db, "users", uid);
    try {
        await updateDoc(userRef, {
            eduviaCoins: increment(amount)
        });
    } catch (error) {
        console.error("Error awarding coin:", error);
    }
};
