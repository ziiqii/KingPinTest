import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  tabBar: {
    marginBottom: 5,
    paddingBottom: Platform.OS === "android" ? 0 : 25,
    borderBottomWidth: 0,
    elevation: 0,
    position: "relative",
    backgroundColor: "#23232e",
    borderTopWidth: 0.2,
    borderTopColor: "#555566",
  },
  tabBarItem: {
    paddingBottom: 0,
    position: "relative",
  },
  tabBarLabel: {
    fontSize: 12,
  },
  focusedIconColor: "#ccffdd",
  inactiveIconColor: "#d9d9d9",
  focusedIconSize: 28,
  inactiveIconSize: 22,
});
