import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import ScoreBoard from "../../Components/Tables/ScoreBoard";
import updateStats from "../../Functions/updateStats";
import AppButton from "../../Components/Buttons/AppButton";

const GameOverScreen = ({ navigation, route }) => {
  const { gameId } = route.params;
  const [statsUpdated, setStatsUpdated] = useState(false);

  useEffect(() => {
    const delay = 2000; // 2 seconds delay before retrieving score and updating stats

    const updateStatsAndSetFlag = async () => {
      try {
        await updateStats(gameId);
        console.log("Stats updated");
      } catch (error) {
        console.error("Error updating stats in GameOverScreen:", error);
      } finally {
        setStatsUpdated(true);
      }
    };

    const timer = setTimeout(updateStatsAndSetFlag, delay);

    return () => clearTimeout(timer); // Cleanup function to clear the timer if the component unmounts before the delay is over
  }, []);

  if (!statsUpdated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#23232e",
        }}
      >
        <Text style={{ fontSize: 20, color: "white", textAlign: "center" }}>
          Retrieving final score and calculating stats...
        </Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#23232e",
      }}
    >
      <Text style={{ fontSize: 50, color: "white", textAlign: "center" }}>
        GAME OVER
      </Text>
      <View style={{ alignItems: "stretch" }}>
        <ScoreBoard Id={gameId} />
        <View style={{ alignItems: "center" }}>
          <AppButton
            buttonTitle="Back to home screen"
            onPress={() => {
              navigation.replace("HomeTab");
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default GameOverScreen;
