import React from "react";
import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import styles from "./SignupScreen.style";
import FormInput from "../../Components/Inputs/FormInput";
import FormButton from "../../Components/Buttons/FormButton";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const SignupScreen = ({ navigation }) => {
  const auth = getAuth();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        // Signed in
        const user = userCredentials.user;
        console.log("Signed up with: ", user.email);
      })
      .catch((error) => alert(error.code + ": " + error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create an account</Text>
      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />
      <FormInput
        labelValue={confirmPassword}
        onChangeText={(userPassword) => setConfirmPassword(userPassword)}
        placeholderText="Confirm Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormButton buttonTitle={"Sign Up"} onPress={handleSignUp}></FormButton>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("LoginScreen")}
      >
        <Text style={styles.navButtonText}>Have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;