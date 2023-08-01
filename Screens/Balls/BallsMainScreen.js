import React from "react";
import { View } from "react-native";
import AppButton from "../../Components/Buttons/AppButton";

const BallsMainScreen = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#23232e",
      }}
    >
      <AppButton
        buttonTitle="View all balls"
        onPress={() => navigation.navigate("BallsScreen")}
      />
    </View>
  );
};

export default BallsMainScreen;
