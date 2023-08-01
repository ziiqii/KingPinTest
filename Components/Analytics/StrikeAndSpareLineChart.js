import React from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const StrikeAndSpareLineChart = (
  props // data1, data2
) => {
  return (
    <View style={{ paddingLeft: 20, paddingBottom: 30 }}>
      <LineChart
        areaChart
        curved
        data={props.data1}
        data2={props.data2}
        // hideDataPoints
        isAnimated
        dataPointsColor={"#b19cd9"}
        spacing={68}
        color1="#77dd77"
        color2="#ffdab9"
        startFillColor1="#77dd77"
        startFillColor2="#ffdab9"
        endFillColor1="#77dd77"
        endFillColor2="#ffdab9"
        startOpacity={0.9}
        endOpacity={0.2}
        initialSpacing={30}
        noOfSections={4}
        maxValue={100}
        minValue={0}
        yAxisColor="white"
        yAxisThickness={0}
        rulesType="solid"
        rulesColor="gray"
        yAxisTextStyle={{ color: "gray" }}
        yAxisLabelSuffix="%"
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
                <Text style={{ color: "#77dd77", fontSize: 12 }}>
                  Strike rate:
                </Text>

                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {items[0].value}%
                </Text>

                <Text style={{ color: "#ffdab9", fontSize: 12, marginTop: 12 }}>
                  Spare rate:
                </Text>

                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {items[1].value}%
                </Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
};

export default StrikeAndSpareLineChart;
