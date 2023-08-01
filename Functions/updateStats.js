import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import parseStats from "./parseStats";
import updateAllTimeStats from "./updateAllTimeStats";
import updateThirtyGameStats from "./updateThirtyGameStats";
import updateDatedGames from "./updateDatedGames";

/*
1. Parses the game to get stats.
2. Access and update the analytics document.
*/

export default async function updateStats(
  gameId // to get to the document of the finished game
) {
  const auth = getAuth();
  const userRef = doc(db, "users", auth.currentUser?.email);
  const gameRef = doc(userRef, "games", gameId);

  try {
    // Get the game document and user document
    const gameDoc = await getDoc(gameRef);
    const userDoc = await getDoc(userRef);
    if (gameDoc.exists() && userDoc.exists()) {
      const game = gameDoc.data();
      const parsedStats = parseStats(game);

      // here is where we seperate the stat updating into three different places.
      // stats for All Time and Thirty Games can immediately be calculated and stored
      // in the firestore but Today Games stats are handled differently.
      updateAllTimeStats(parsedStats);
      updateThirtyGameStats(parsedStats);
      updateDatedGames(game);
    } else {
      console.log("No such doc");
    }
  } catch (error) {
    console.error("Could not get document", error);
  }
}
