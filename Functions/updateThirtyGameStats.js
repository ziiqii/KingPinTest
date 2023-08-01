import { doc, collection, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import sumArray from "./sumArray";

// Object {
//   framesAcrossGames: array of numbers
//   scoreAcrossGames: array of numbers
//   strikesAcrossGames: array of numbers
//   strikePercentageAcrossGames: array of numbers
//   sparesAcrossGames: array of numbers
//   sparePercentageAcrossGames: array of numbers
//   firstShotAverageAcrossGames: array of numbers

//   games: number
//   frames: number
//   spares: number
//   strikes: number
//   totalScore: number

//   highestScore: number
//   totalStrikePercentage: number
//   totalSparePercentage: number
//   firstShotAverage: number
// }

export default async function updateThirtyGameStats(
  parsedStats // parsedStats = [score, strikes, spares, frames, firstShotAverage] in the latest game.
) {
  const auth = getAuth();

  const update = async () => {
    const userRef = doc(db, "users", auth.currentUser?.email);
    const analyticsRef = collection(userRef, "analytics"); // collection(reference, collectionName)
    const thirtyGameStatsRef = doc(analyticsRef, "thirtyGameStats");

    // calculations for percentages:
    const strikePercentage = (parsedStats[1] / parsedStats[3]) * 100;
    let sparePercentage = 0;
    if (parsedStats[3] !== parsedStats[1]) {
      sparePercentage =
        (parsedStats[2] / (parsedStats[3] - parsedStats[1])) * 100;
    }

    try {
      const thirtyGameStatsDoc = await getDoc(thirtyGameStatsRef);
      // Check if "thirtyGameStats" document exists in "analytics" collection
      if (thirtyGameStatsDoc.exists()) {
        const thirtyGameStats = thirtyGameStatsDoc.data();
        // thirtyGameStats document exists, update stats
        // parsedStats = [score, strikes, spares, frames, firstShotAverage] in the latest game.

        // make all the changes to the necessary arrays first, then calc the rest of the stuff

        // update the framesAcrossGames
        const framesAcrossGamesArray = thirtyGameStats["framesAcrossGames"];
        framesAcrossGamesArray.push(parsedStats[3]);

        // update the scoreAcrossGames
        const scoreAcrossGamesArray = thirtyGameStats["scoreAcrossGames"];
        scoreAcrossGamesArray.push(parsedStats[0]);

        // update the strikeAcrossGames
        const strikesAcrossGamesArray = thirtyGameStats["strikesAcrossGames"];
        strikesAcrossGamesArray.push(parsedStats[1]);

        // update the strikePercentageAcrossGames
        const strikePercentageAcrossGamesArray =
          thirtyGameStats["strikePercentageAcrossGames"];
        strikePercentageAcrossGamesArray.push(strikePercentage);

        // update the sparesAcrossGames
        const sparesAcrossGamesArray = thirtyGameStats["sparesAcrossGames"];
        sparesAcrossGamesArray.push(parsedStats[2]);

        // update the sparePercentageAcrossGames
        const sparePercentageAcrossGamesArray =
          thirtyGameStats["sparePercentageAcrossGames"];
        sparePercentageAcrossGamesArray.push(sparePercentage);

        // update the firstShotAverageAcrossGames
        const firstShotAverageAcrossGamesArray =
          thirtyGameStats["firstShotAverageAcrossGames"];
        firstShotAverageAcrossGamesArray.push(parsedStats[4]);

        if (thirtyGameStats["games"] === 30) {
          framesAcrossGamesArray.shift();
          scoreAcrossGamesArray.shift();
          strikesAcrossGamesArray.shift();
          strikePercentageAcrossGamesArray.shift();
          sparesAcrossGamesArray.shift();
          sparePercentageAcrossGamesArray.shift();
          firstShotAverageAcrossGamesArray.shift();
        }

        // calculations for other fields

        const games = framesAcrossGamesArray.length;
        const frames = sumArray(framesAcrossGamesArray);
        const spares = sumArray(sparesAcrossGamesArray);

        const strikes = sumArray(strikesAcrossGamesArray);
        const totalScore = sumArray(scoreAcrossGamesArray);
        const highestScore = Math.max(...scoreAcrossGamesArray);
        const totalStrikePercentage = (strikes / frames) * 100;
        const totalSparePercentage = parseFloat(
          ((parsedStats[2] + thirtyGameStats["spares"]) /
            (thirtyGameStats["frames"] +
              parsedStats[3] -
              parsedStats[1] -
              thirtyGameStats["strikes"])) *
            100
        );

        let firstShotSum = 0;
        for (let i = 0; i < games; i++) {
          firstShotSum +=
            firstShotAverageAcrossGamesArray[i] * framesAcrossGamesArray[i];
        }
        const firstShotAverage = firstShotSum / frames;

        const updatedData = {
          games: games,
          frames: frames,
          spares: spares,
          strikes: strikes,
          totalScore: totalScore,

          highestScore: highestScore,
          totalStrikePercentage: totalStrikePercentage,
          totalSparePercentage: totalSparePercentage,
          firstShotAverage: firstShotAverage,
        };

        updatedData.framesAcrossGames = framesAcrossGamesArray;
        updatedData.scoreAcrossGames = scoreAcrossGamesArray;
        updatedData.strikesAcrossGames = strikesAcrossGamesArray;
        updatedData.strikePercentageAcrossGames =
          strikePercentageAcrossGamesArray;
        updatedData.sparesAcrossGames = sparesAcrossGamesArray;
        updatedData.sparePercentageAcrossGames =
          sparePercentageAcrossGamesArray;
        updatedData.firstShotAverageAcrossGames =
          firstShotAverageAcrossGamesArray;

        await updateDoc(thirtyGameStatsRef, updatedData);
      } else {
        // parsedStats = [score, strikes, spares, frames, firstShotAverage] in the latest game.
        await setDoc(thirtyGameStatsRef, {
          framesAcrossGames: [parsedStats[3]],
          scoreAcrossGames: [parsedStats[0]],
          strikesAcrossGames: [parsedStats[1]],
          strikePercentageAcrossGames: [strikePercentage],
          sparesAcrossGames: [parsedStats[2]],
          sparePercentageAcrossGames: [sparePercentage],
          firstShotAverageAcrossGames: [parsedStats[4]],

          games: 1,
          frames: parsedStats[3],
          spares: parsedStats[2],
          strikes: parsedStats[1],
          totalScore: parsedStats[0],

          highestScore: parsedStats[0],
          totalStrikePercentage: strikePercentage,
          totalSparePercentage: sparePercentage,
          firstShotAverage: parsedStats[4],
        });
      }
    } catch (error) {
      console.error("Error updating thirtyGameStats:", error);
      return null;
    }
  };

  return await update();
}
