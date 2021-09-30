import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";



export default function Header ({ navigation })  {
  const openMenu = () => {
    navigation.openDrawer();
  };
  return (
    <View >
      {/* icon for the menu */}
      <TouchableOpacity onPress={openMenu} style={{position: 'absolute', left: 16, top: 15}}>
        <Ionicons name="md-menu" size={28} color="grey" />
      </TouchableOpacity>
    </View>
  );
}