import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, FontSizes } from '@/constants/Colors';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Email dan password harus diisi.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      // AuthGate in _layout.tsx will automatically redirect to (tabs)
    } catch (err: any) {
      const msg =
        err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
          ? 'Email atau password salah.'
          : err.code === 'auth/user-not-found'
          ? 'Akun tidak ditemukan.'
          : err.code === 'auth/too-many-requests'
          ? 'Terlalu banyak percobaan. Coba lagi nanti.'
          : 'Login gagal. Coba lagi.';
      Alert.alert('Login Gagal', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>DrivnBye</Text>
        <Text style={styles.tagline}>Komunitas car enthusiast Indonesia</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.grayText}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.grayText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.primaryBtnText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Lupa password?</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Belum punya akun?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.footerLink}> Daftar sekarang</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.white },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    paddingTop: 80,
  },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.black,
    letterSpacing: -1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: FontSizes.sm,
    color: Colors.grayText,
    marginBottom: 48,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.grayMid,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: FontSizes.md,
    color: Colors.black,
    marginBottom: 12,
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  forgotBtn: { marginTop: 16 },
  forgotText: { fontSize: FontSizes.sm, color: Colors.grayText },
  footer: { flexDirection: 'row', marginTop: 32 },
  footerText: { fontSize: FontSizes.sm, color: Colors.grayText },
  footerLink: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '700',
  },
});
