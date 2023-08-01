import { doc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import generateGame from "./generateGame";
import getCurrentDate from "./getCurrentDate";

export default async function startGame() {
  const auth = getAuth();

  const newGame = async () => {
    const userRef = doc(db, "users", auth.currentUser?.email);
    const gamesRef = collection(userRef, "games"); // collection(reference, collectionName)

    try {
      const newGameRef = await addDoc(gamesRef, {
        date: getCurrentDate(),
        game: generateGame(),
      });
      console.log("Game written with ID: ", newGameRef.id);
      return newGameRef.id;
    } catch (error) {
      console.error("Error starting game:", error);
      return null;
    }
  };

  return await newGame();
}
