import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { windowHeight } from "../../utils/Dimensions";

const SmallButton = ({
  buttonTitle,
  color,
  width,
  textColor,
  disabled,
  ...rest
}) => {
  const buttonBackgroundColor = color;
  const widthPercentage = width || "100%";
  const buttonTextColor = textColor || "#ffffff";
  const buttonDisabled = disabled || false;
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        { backgroundColor: buttonBackgroundColor },
        { width: widthPercentage },
        { disabled: buttonDisabled },
        { opacity: buttonDisabled ? 0.3 : 1 },
      ]}
      {...rest}
    >
      <Text style={[styles.buttonText, { color: buttonTextColor }]}>
        {buttonTitle}
      </Text>
    </TouchableOpacity>
  );
};

export default SmallButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    height: windowHeight / 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#ffffff",
    // fontFamily: "Lato-Regular",
  },
});
