import React from "react";
import { Text } from "react-native";
import { FONTS } from "../constants/fonts";

/**
 * Text component with Google Sans as default font.
 * Use instead of Text for app-wide typography.
 */
export default function AppText({ style, ...props }) {
  return (
    <Text
      style={[{ fontFamily: FONTS.regular }, style]}
      {...props}
    />
  );
}
