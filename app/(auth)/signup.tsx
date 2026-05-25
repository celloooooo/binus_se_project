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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSignup = async () => {
    const { firstName, lastName, username, email, password, confirmPassword } = form;

    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Semua field harus diisi.');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      Alert.alert('Error', 'Format email tidak valid.');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'Username minimal 3 karakter.');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      Alert.alert('Error', 'Username hanya boleh mengandung huruf, angka, dan underscore.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password minimal 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
      });
      // AuthGate will redirect automatically
    } catch (err: any) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'Email sudah digunakan. Coba login.'
          : err.code === 'auth/weak-password'
          ? 'Password terlalu lemah.'
          : 'Registrasi gagal. Coba lagi.';
      Alert.alert('Registrasi Gagal', msg);
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
        <Text style={styles.subtitle}>Buat akun baru</Text>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputHalf, { marginRight: 8 }]}
            placeholder="First Name"
            placeholderTextColor={Colors.grayText}
            value={form.firstName}
            onChangeText={set('firstName')}
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
          />
          <TextInput
            style={[styles.input, styles.inputHalf]}
            placeholder="Last Name"
            placeholderTextColor={Colors.grayText}
            value={form.lastName}
            onChangeText={set('lastName')}
            autoCapitalize="words"
            autoComplete="family-name"
            textContentType="familyName"
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Username (huruf, angka, underscore)"
          placeholderTextColor={Colors.grayText}
          value={form.username}
          onChangeText={set('username')}
          autoCapitalize="none"
          autoComplete="username-new"
          textContentType="username"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.grayText}
          value={form.email}
          onChangeText={set('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />

        <TextInput
          style={styles.input}
          placeholder="Password (min. 8 karakter)"
          placeholderTextColor={Colors.grayText}
          value={form.password}
          onChangeText={set('password')}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={Colors.grayText}
          value={form.confirmPassword}
          onChangeText={set('confirmPassword')}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          onSubmitEditing={handleSignup}
        />

        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.btnDisabled]}
          onPress={handleSignup}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.primaryBtnText}>Daftar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Kembali ke Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.white },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 32,
    paddingTop: 70,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.black,
    letterSpacing: -1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.grayText,
    marginBottom: 32,
  },
  row: { flexDirection: 'row', width: '100%' },
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
  inputHalf: { flex: 1 },
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
  backBtn: {
    marginTop: 20,
    padding: 10,
  },
  backText: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
