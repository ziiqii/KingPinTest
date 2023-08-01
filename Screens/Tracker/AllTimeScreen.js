import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection } from "firebase/firestore";
import OSSPie from "../../Components/Analytics/OSSPie";
import ScoreLineChart from "../../Components/Analytics/ScoreLineChart";
import StrikeAndSpareLineChart from "../../Components/Analytics/StrikeAndSpareLineChart";
import FirstShotLineChart from "../../Components/Analytics/FirstShotLineChart";
import transformArray1dp from "../../Functions/transformArray1dp";
import transformArray from "../../Functions/transformArray";

const AllTimeScreen = () => {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const scrollViewRef = useRef(null);

  const fetchData = useCallback(async () => {
    const auth = getAuth();
    const userRef = doc(db, "users", auth.currentUser?.email);
    const analyticsRef = collection(userRef, "analytics");
    const allTimeStatsRef = doc(analyticsRef, "allTimeStats");

    try {
      const allTimeStatsDoc = await getDoc(allTimeStatsRef);
      if (allTimeStatsDoc.exists()) {
        const allTimeStats = allTimeStatsDoc.data();
        setUserStats(allTimeStats);
      } else {
        console.log("No such doc in AllTimeScreen");
      }
    } catch (error) {
      console.error("Could not get document", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // the following is to reload the page when user navigates away then back
  // onto the screen.
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0 });
    fetchData();
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
        <Text style={{ color: "white" }}>Start a bowling game first!</Text>
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
            All time games
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
            <Text style={{ color: "white" }}>Score across games:</Text>
          </View>
          <ScoreLineChart data={scoreAcrossGamesData} />
        </View>

        <View style={styles.chartContainer}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "white" }}>
              Strike and spare rate across games:
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
              First shot average across games:
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

export default AllTimeScreen;
