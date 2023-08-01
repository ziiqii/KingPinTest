import React from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const ScoreLineChart = (
  props // data
) => {
  return (
    <View style={{ paddingLeft: 20, paddingBottom: 30 }}>
      <LineChart
        areaChart
        curved
        data={props.data}
        // hideDataPoints
        isAnimated
        dataPointsColor={"#b19cd9"}
        spacing={68}
        color="#8a56ce"
        startFillColor="#8a56ce"
        endFillColor="#8a56ce"
        startOpacity={0.9}
        endOpacity={0.2}
        initialSpacing={30}
        noOfSections={4}
        maxValue={300}
        minValue={0}
        yAxisColor="white"
        yAxisThickness={0}
        rulesType="solid"
        rulesColor="gray"
        yAxisTextStyle={{ color: "gray" }}
        xAxisColor="lightgray"
        pointerConfig={{
          pointerStripUptoDataPoint: true,
          pointerStripColor: "lightgray",
          pointerStripWidth: 2,
          strokeDashArray: [2, 5],
          pointerColor: "lightgray",
          radius: 4,
          pointerLabelWidth: 100,
          pointerLabelHeight: 120,
          activatePointersOnLongPress: true, // to still enable scrolling

          pointerLabelComponent: (items) => {
            return (
              <View
                style={{
                  height: 120,
                  width: 100,
                  backgroundColor: "#282C3E",
                  borderRadius: 4,
                  justifyContent: "center",
                  paddingLeft: 16,
                }}
              >
                <Text style={{ color: "lightgray", fontSize: 12 }}>Score:</Text>

                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {items[0].value}
                </Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
};

export default ScoreLineChart;
