import {
  doc,
  collection,
  setDoc,
  updateDoc,
  getDoc,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

// What allTimeStatsDoc.data() should look like:

// Object {
//   firstShotAverageAcrossGames: array of numbers
//   firstShotAverage: number
//   frames: number
//   games: number
//   highestScore: number
//   scoreAcrossGames: array of numbers
//   spares: number
//   strikes: number
//   totalScore: number

//   // the following are calculated values/using calculated values:
//   totalStrikePercentage: number
//   totalSparePercentage: number
//
//   strikePercentageAcrossGames: array of numbers
//   sparePercentageAcrossGames: array of numbers
// }

export default async function updateAllTimeStats(
  parsedStats // parsedStats = [score, strikes, spares, frames, firstShotAverage] in the latest game.
) {
  const auth = getAuth();

  const update = async () => {
    const userRef = doc(db, "users", auth.currentUser?.email);
    const analyticsRef = collection(userRef, "analytics"); // collection(reference, collectionName)
    const allTimeStatsRef = doc(analyticsRef, "allTimeStats");

    // calculations for percentages:
    const strikePercentage = (parsedStats[1] / parsedStats[3]) * 100;
    let sparePercentage = 0;
    // handle cases when all frames are strikes
    if (parsedStats[3] !== parsedStats[1]) {
      sparePercentage =
        (parsedStats[2] / (parsedStats[3] - parsedStats[1])) * 100;
    }

    try {
      const allTimeStatsDoc = await getDoc(allTimeStatsRef);
      // Check if "allTimeStats" document exists in "analytics" collection
      if (allTimeStatsDoc.exists()) {
        const allTimeStats = allTimeStatsDoc.data();
        // allTimeStats document exists, update stats
        // parsedStats = [score, strikes, spares, frames, firstShotAverage] in the latest game.
        const updatedData = {
          frames: increment(parsedStats[3]),
          games: increment(1),
          spares: increment(parsedStats[2]),
          strikes: increment(parsedStats[1]),
          totalScore: increment(parsedStats[0]),
        };

        // updating the first shot average overall
        updatedData.firstShotAverage = parseFloat(
          (parsedStats[4] * parsedStats[3] +
            allTimeStats["firstShotAverage"] * allTimeStats["frames"]) /
            (allTimeStats["frames"] + parsedStats[3])
        );

        // update the highestScore conditionally
        if (parsedStats[0] >= allTimeStats["highestScore"]) {
          updatedData.highestScore = parsedStats[0];
        }

        // update the firstShotAverageAcrossGames
        const firstShotAverageAcrossGamesArray =
          allTimeStats["firstShotAverageAcrossGames"];
        firstShotAverageAcrossGamesArray.push(parsedStats[4]);
        updatedData.firstShotAverageAcrossGames =
          firstShotAverageAcrossGamesArray;

        // update the scoreAcrossGames
        const scoreAcrossGamesArray = allTimeStats["scoreAcrossGames"];
        scoreAcrossGamesArray.push(parsedStats[0]);
        updatedData.scoreAcrossGames = scoreAcrossGamesArray;

        // update the strikePercentageAcrossGames
        const strikePercentageAcrossGamesArray =
          allTimeStats["strikePercentageAcrossGames"];
        strikePercentageAcrossGamesArray.push(strikePercentage);
        updatedData.strikePercentageAcrossGames =
          strikePercentageAcrossGamesArray;

        // update the sparePercentageAcrossGames
        const sparePercentageAcrossGamesArray =
          allTimeStats["sparePercentageAcrossGames"];
        sparePercentageAcrossGamesArray.push(sparePercentage);
        updatedData.sparePercentageAcrossGames =
          sparePercentageAcrossGamesArray;

        // update totalStrikePercentage
        // new total number of strikes / new total number of frames
        updatedData.totalStrikePercentage = parseFloat(
          ((parsedStats[1] + allTimeStats["strikes"]) /
            (allTimeStats["frames"] + parsedStats[3])) *
            100
        );

        // update totalSparePercentage
        // new total number of spares / (new total number of frames - new total number of strikes)
        updatedData.totalSparePercentage = parseFloat(
          ((parsedStats[2] + allTimeStats["spares"]) /
            (allTimeStats["frames"] +
              parsedStats[3] -
              parsedStats[1] -
              allTimeStats["strikes"])) *
            100
        );

        await updateDoc(allTimeStatsRef, updatedData);
      } else {
        // parsedStats = [score, strikes, spares, frames, firstShotAverage] in the latest game.

        await setDoc(allTimeStatsRef, {
          firstShotAverageAcrossGames: [parsedStats[4]],
          firstShotAverage: parsedStats[4],
          frames: parsedStats[3],
          games: 1,
          highestScore: parsedStats[0],
          scoreAcrossGames: [parsedStats[0]],
          spares: parsedStats[2],
          strikes: parsedStats[1],
          totalScore: parsedStats[0],

          totalStrikePercentage: strikePercentage,
          totalSparePercentage: sparePercentage,

          strikePercentageAcrossGames: [strikePercentage],
          sparePercentageAcrossGames: [sparePercentage],
        });
      }
    } catch (error) {
      console.error("Error updating allTimeStats:", error);
      return null;
    }
  };

  return await update();
}
