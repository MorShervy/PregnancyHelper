import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Final Project - React Native with Expo</Text>
      <Button title="hello"></Button>
      <TouchableOpacity
        style={{ height: 35, width: "auto", backgroundColor: "#faa" }}
      >
        <Text>I`m Touchableopacity stam</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
