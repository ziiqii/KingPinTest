import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import getCurrentDate from "../../Functions/getCurrentDate";
import parseStats from "../../Functions/parseStats";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import OSSPie from "../../Components/Analytics/OSSPie";
// import ScoreLineChart from "../../Components/Analytics/ScoreLineChart";
// import StrikeAndSpareLineChart from "../../Components/Analytics/StrikeAndSpareLineChart";
// import FirstShotLineChart from "../../Components/Analytics/FirstShotLineChart";
// import transformArray1dp from "../../Functions/transformArray1dp";
// import transformArray from "../../Functions/transformArray";

// stats:

// firstShotAverageAcrossGames: array of numbers
// firstShotAverage: number
// frames: number
// games: number
// highestScore: number
// scoreAcrossGames: array of numbers
// sparePercentageAcrossGames: array of numbers
// spares: number
// strikePercentageAcrossGames: array of numbers
// strikes: number
// totalScore: number
// totalSparePercentage: number
// totalStrikePercentage: number

const TodayScreen = () => {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const scrollViewRef = useRef(null);

  const fetchGamesAndCalculateStats = async () => {
    const todayDate = getCurrentDate();
    const auth = getAuth();
    const userRef = doc(db, "users", auth.currentUser?.email);
    const datedGamesRef = collection(userRef, "datedGames");

    const gameDateRef = doc(datedGamesRef, todayDate);

    try {
      const gameDateDoc = await getDoc(gameDateRef);

      if (gameDateDoc.exists()) {
        // all stats
        const framesAcrossGames = [];
        const firstShotAverageAcrossGames = [];
        let firstShotAverage = 0;
        let frames = 0;
        let games = 0;
        let highestScore = 0;
        const scoreAcrossGames = [];
        const sparePercentageAcrossGames = [];
        let spares = 0;
        const strikePercentageAcrossGames = [];
        let strikes = 0;
        let totalScore = 0;
        let totalSparePercentage = 0;
        let totalStrikePercentage = 0;

        const gamesRef = collection(gameDateRef, "games");
        const q = query(gamesRef, orderBy("timestamp", "asc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // Process EACH game document here
          const game = doc.data();
          const parsedStats = parseStats(game);
          // parsedStats = [score, strikes, spares, frames, firstShotAverage] in the latest game.
          framesAcrossGames.push(parsedStats[3]);
          firstShotAverageAcrossGames.push(parsedStats[4]);
          frames += parsedStats[3];
          games += 1;
          highestScore =
            highestScore < parsedStats[0] ? parsedStats[0] : highestScore;
          scoreAcrossGames.push(parsedStats[0]);
          totalScore += parsedStats[0];

          // the following is for spares and strikes
          const strikePercentage = (parsedStats[1] / parsedStats[3]) * 100;
          let sparePercentage = 0;
          if (parsedStats[3] !== parsedStats[1]) {
            sparePercentage =
              (parsedStats[2] / (parsedStats[3] - parsedStats[1])) * 100;
          }
          sparePercentageAcrossGames.push(sparePercentage);
          spares += parsedStats[2];
          strikePercentageAcrossGames.push(strikePercentage);
          strikes += parsedStats[1];
        });
        // other calculations
        let firstShotSum = 0;
        for (let i = 0; i < games; i++) {
          firstShotSum += firstShotAverageAcrossGames[i] * framesAcrossGames[i];
        }
        firstShotAverage = firstShotSum / frames;

        totalStrikePercentage = (strikes / frames) * 100;
        totalSparePercentage = (spares / (frames - strikes)) * 100;

        const updatedStats = {
          firstShotAverageAcrossGames: firstShotAverageAcrossGames,
          firstShotAverage: firstShotAverage,
          frames: frames,
          games: games,
          highestScore: highestScore,
          scoreAcrossGames: scoreAcrossGames,
          sparePercentageAcrossGames: sparePercentageAcrossGames,
          spares: spares,
          strikePercentageAcrossGames: strikePercentageAcrossGames,
          strikes: strikes,
          totalScore: totalScore,
          totalSparePercentage: totalSparePercentage,
          totalStrikePercentage: totalStrikePercentage,
        };
        setUserStats(updatedStats);
      } else {
        console.log("No such doc in TodayScreen");
      }
    } catch (error) {
      console.error("Could not get document", error);
    } finally {
      setLoading(false);
    }
  };

  // the following is to reload the page when user navigates away then back
  // onto the screen.
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
    fetchGamesAndCalculateStats();
  }, [isFocused]);

  // Check if userStats is null before accessing its properties.
  // If so, give a loading screen first.
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#23232e",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Check if all userStats is null, then prompt
  // first time users to start a bowling game first

  if (!userStats) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#23232e",
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          You haven't played any games today yet.
          {"\n"}
          Start a new game by heading to Bowl!
        </Text>
      </View>
    );
  }

  const totalGames = userStats["games"];
  const highestScore = userStats["highestScore"];
  const averageGameScore = Math.round(
    userStats["totalScore"] / userStats["games"]
  );
  const strikeRate = userStats["totalStrikePercentage"].toFixed(1);
  const spareRate = userStats["totalSparePercentage"].toFixed(1);
  const firstShotAverage = userStats["firstShotAverage"].toFixed(1);
  const strikes = parseInt(userStats["strikes"]);
  const spares = parseInt(userStats["spares"]);
  const opens = parseInt(
    userStats["frames"] - userStats["strikes"] - userStats["spares"]
  );
  const scoreAcrossGames = userStats["scoreAcrossGames"];
  const strikePercentageAcrossGames = userStats["strikePercentageAcrossGames"];
  const sparePercentageAcrossGames = userStats["sparePercentageAcrossGames"];
  const firstShotAverageAcrossGames = userStats["firstShotAverageAcrossGames"];

  // line chart data:
  const scoreAcrossGamesData = transformArray(scoreAcrossGames);

  const strikePercentageAcrossGamesData = transformArray1dp(
    strikePercentageAcrossGames
  );
  const sparePercentageAcrossGamesData = transformArray1dp(
    sparePercentageAcrossGames
  );
  const firstShotAverageAcrossGamesData = transformArray1dp(
    firstShotAverageAcrossGames
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={{ backgroundColor: "#23232e" }}
    >
      <View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#ff99dd", paddingTop: 30 }}>
            Today's Games
          </Text>

          <Text style={{ color: "white" }}>
            Total games played: {totalGames}
          </Text>
          <Text style={{ color: "white" }}>
            Highest game score: {highestScore}
          </Text>
          <Text style={{ color: "white" }}>
            Average game score: {averageGameScore}
          </Text>
          <Text style={{ color: "white" }}>Strike rate: {strikeRate}%</Text>
          <Text style={{ color: "white" }}>Spare rate: {spareRate}%</Text>
          <Text style={{ color: "white" }}>
            First shot average: {firstShotAverage}
          </Text>

          <OSSPie open={opens} spare={spares} strike={strikes} />
          <Text
            style={{ color: "#ff99dd", textAlign: "center", marginBottom: 10 }}
          >
            Tap and hold below the data points in the following charts for more
            accurate information.
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "white" }}>Score across today's games:</Text>
          </View>
          <ScoreLineChart data={scoreAcrossGamesData} />
        </View>

        <View style={styles.chartContainer}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "white" }}>
              Strike and spare rate across today's games:
            </Text>
          </View>
          <StrikeAndSpareLineChart
            data1={strikePercentageAcrossGamesData}
            data2={sparePercentageAcrossGamesData}
          />
        </View>

        <View style={styles.chartContainer}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "white" }}>
              First shot average across today's games:
            </Text>
          </View>
          <FirstShotLineChart data={firstShotAverageAcrossGamesData} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default TodayScreen;
