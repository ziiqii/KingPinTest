import { Text, View } from 'react-native';

export default function BlankScreen() {
  return (
    <View style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}>
      <Text>hi!</Text>
    </View>
  );
}