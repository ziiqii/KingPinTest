import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BowlScreen from "../Screens/Bowl/BowlScreen";
import SettingsScreen from "../Screens/Settings/SettingsScreen";
import GuideScreen from "../Screens/Guide/GuideScreen";
import AnalyticsTab from "./AnalyticsTab";
import BallsMainScreen from "../Screens/Balls/BallsMainScreen";
import styles from "./HomeTab.style.js";

import SuitcaseIcon from "../assets/suitcase-rolling-solid.svg";
import BookIcon from "../assets/book-solid.svg";
import BowlingBallIcon from "../assets/bowling-ball-solid.svg";
import ChartIcon from "../assets/chart-line-solid.svg";
import GearIcon from "../assets/gear-solid.svg";

const Tab = createBottomTabNavigator();

const iconComponents = {
  Balls: SuitcaseIcon,
  Guide: BookIcon,
  Bowl: BowlingBallIcon,
  Analytics: ChartIcon,
  Settings: GearIcon,
};

const getTabScreenOptions = ({ route }) => {
  const IconComponent = iconComponents[route.name];
  return {
    tabBarIcon: ({ focused }) => (
      <IconComponent
        width={focused ? styles.focusedIconSize : styles.inactiveIconSize}
        height={focused ? styles.focusedIconSize : styles.inactiveIconSize}
        fill={focused ? styles.focusedIconColor : styles.inactiveIconColor}
      />
    ),
  };
};

export default HomeTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Bowl"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: styles.focusedIconColor,
        tabBarInactiveTintColor: styles.inactiveIconColor,
        tabBarActiveBackgroundColor: "#23232e",
        tabBarInactiveBackgroundColor: "#23232e",
        tabBarItemStyle: styles.tabBarItem,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Balls"
        component={BallsMainScreen}
        options={getTabScreenOptions}
      />
      <Tab.Screen
        name="Guide"
        component={GuideScreen}
        options={getTabScreenOptions}
      />
      <Tab.Screen
        name="Bowl"
        component={BowlScreen}
        options={getTabScreenOptions}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsTab}
        options={getTabScreenOptions}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={getTabScreenOptions}
      />
    </Tab.Navigator>
  );
};
