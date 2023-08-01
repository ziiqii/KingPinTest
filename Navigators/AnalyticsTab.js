import React from "react";
import { Animated, SafeAreaView, Platform, StatusBar } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import TodayScreen from "../Screens/Tracker/TodayScreen";
import ThirtyGameScreen from "../Screens/Tracker/ThirtyGameScreen";
import AllTimeScreen from "../Screens/Tracker/AllTimeScreen";

const Tab = createMaterialTopTabNavigator();

const av = new Animated.Value(0);
av.addListener(() => {
  return;
});

export default MyTabs = () => {
  const navigation = useNavigation(); // Get the navigation object using the useNavigation hook

  const setTodayAsDefaultTab = () => {
    // Programmatically set the TodayScreen as the active tab
    navigation.navigate("TodayScreen");
  };

  // Use the useFocusEffect hook to set TodayScreen as the default tab on focus
  useFocusEffect(
    React.useCallback(() => {
      setTodayAsDefaultTab();
    }, [])
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "powderblue",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <Tab.Navigator
        screenListeners={{
          focus: () => {
            Animated.timing(av, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
          },
        }}
        screenOptions={{
          // activeTintColor: "",
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: "powderblue" },
          swipeEnabled: false,
        }}
      >
        <Tab.Screen
          name="TodayScreen"
          component={TodayScreen}
          options={{ tabBarLabel: "Today's Games" }}
        />
        <Tab.Screen
          name="ThirtyGameScreen"
          component={ThirtyGameScreen}
          options={{ tabBarLabel: "Past 30 Games" }}
        />
        <Tab.Screen
          name="AllTimeScreen"
          component={AllTimeScreen}
          options={{ tabBarLabel: "All Time Games" }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};
