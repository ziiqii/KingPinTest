import {
  doc,
  collection,
  getDoc,
  addDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

export default async function updateDatedGames(game) {
  const auth = getAuth();

  const update = async () => {
    const userRef = doc(db, "users", auth.currentUser?.email);
    // this is for todayGames collection of days; identified by dates.
    const datedGamesRef = collection(userRef, "datedGames");
    const gameDate = game["date"];
    const gameDateRef = doc(datedGamesRef, gameDate);

    try {
      const gameDateDoc = await getDoc(gameDateRef);
      if (!gameDateDoc.exists()) {
        console.log("gamedatedoc did not exist");
        // if the gameDate document does not exist yet, create an empty one first
        await setDoc(gameDateRef, { date: gameDate });
      }

      const gamesRef = collection(gameDateRef, "games");
      // Add a timestamp field to the game data for sorting when querying data
      const gameWithTimestamp = {
        ...game,
        timestamp: serverTimestamp(),
      };
      await addDoc(gamesRef, gameWithTimestamp);
      console.log("Document copied and pasted successfully in datedGames");
    } catch (error) {
      console.error("Error copying and pasting game document:", error);
      return null;
    }
  };

  return await update();
}
