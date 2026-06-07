import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

interface LoginScreenProps {
  loginForm: any;
  setLoginForm: (val: any) => void;
  handleLogin: () => void;
  setScreen: (screen: string) => void;
}

export const LoginScreen = ({
  loginForm,
  setLoginForm,
  handleLogin,
  setScreen,
}: LoginScreenProps) => (
  <View style={styles.authContainer}>
    <Text style={styles.authLogo}>DriveTribe</Text>
    <Text style={styles.authSubtext}>Where drivers connect.</Text>
    <TextInput
      placeholder="Username"
      style={styles.authInput}
      placeholderTextColor="#999"
      value={loginForm.username}
      onChangeText={(text) => setLoginForm({ ...loginForm, username: text })}
      autoCapitalize="none"
    />
    <TextInput
      placeholder="Password"
      style={styles.authInput}
      secureTextEntry
      placeholderTextColor="#999"
      value={loginForm.password}
      onChangeText={(text) => setLoginForm({ ...loginForm, password: text })}
      autoCapitalize="none"
    />
    <TouchableOpacity style={styles.authPrimaryBtn} onPress={handleLogin}>
      <Text style={styles.authBtnText}>Sign in</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => alert("Reset link sent to your email!")}>
      <Text style={styles.authLinkSmall}>Forgot Password?</Text>
    </TouchableOpacity>
    <View style={styles.authFooter}>
      <Text style={styles.authFooterText}>Don't have an account?</Text>
      <TouchableOpacity onPress={() => setScreen("signup")}>
        <Text style={styles.authLinkBlue}> Sign up</Text>
      </TouchableOpacity>
    </View>
  </View>
);

interface SignUpScreenProps {
  signupForm: any;
  setSignupForm: (val: any) => void;
  handleSignup: () => void;
  setScreen: (screen: string) => void;
}

export const SignUpScreen = ({
  signupForm,
  setSignupForm,
  handleSignup,
  setScreen,
}: SignUpScreenProps) => (
  <ScrollView contentContainerStyle={styles.authContainer}>
    <Text style={styles.authLogo}>DriveTribe</Text>
    <View style={styles.authRow}>
      <TextInput
        placeholder="First Name"
        style={[styles.authInput, { flex: 1, marginRight: 10 }]}
        value={signupForm.firstName}
        onChangeText={(text) =>
          setSignupForm({ ...signupForm, firstName: text })
        }
      />
      <TextInput
        placeholder="Last Name"
        style={[styles.authInput, { flex: 1 }]}
        value={signupForm.lastName}
        onChangeText={(text) =>
          setSignupForm({ ...signupForm, lastName: text })
        }
      />
    </View>
    <TextInput
      placeholder="Username"
      style={styles.authInput}
      value={signupForm.username}
      onChangeText={(text) => setSignupForm({ ...signupForm, username: text })}
      autoCapitalize="none"
    />
    <TextInput
      placeholder="Email"
      style={styles.authInput}
      value={signupForm.email}
      onChangeText={(text) => setSignupForm({ ...signupForm, email: text })}
      keyboardType="email-address"
      autoCapitalize="none"
    />
    <TextInput
      placeholder="Password"
      style={styles.authInput}
      secureTextEntry
      value={signupForm.password}
      onChangeText={(text) => setSignupForm({ ...signupForm, password: text })}
      autoCapitalize="none"
    />
    <TextInput
      placeholder="Confirm Password"
      style={styles.authInput}
      secureTextEntry
      value={signupForm.confirmPassword}
      onChangeText={(text) =>
        setSignupForm({ ...signupForm, confirmPassword: text })
      }
      autoCapitalize="none"
    />
    <TouchableOpacity style={styles.authPrimaryBtn} onPress={handleSignup}>
      <Text style={styles.authBtnText}>Sign Up</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.authSecondaryBtn}
      onPress={() => setScreen("login")}
    >
      <Text style={styles.authSecondaryText}>← Back to Login</Text>
    </TouchableOpacity>
  </ScrollView>
);
