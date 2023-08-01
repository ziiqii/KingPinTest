import React from "react";
import { Text, Button, SafeAreaView, Platform, StatusBar } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import AppButton from "../../Components/Buttons/AppButton";

const SettingsScreen = ({ navigation }) => {
  const auth = getAuth();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful
        navigation.replace("LoginScreen");
      })
      .catch((error) => alert(error.message));
    console.log("Signed out with: ", auth.currentUser?.email);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#23232e",
      }}
    >
      <Text style={{ color: "white" }}>Email: {auth.currentUser?.email}</Text>
      <AppButton buttonTitle="Sign out" onPress={handleSignOut}/>
    </SafeAreaView>
  );
};

export default SettingsScreen;
