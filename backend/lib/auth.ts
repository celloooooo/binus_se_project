import { supabase } from "./supabase";

// REGISTER
export async function signUp(
  email: string,
  password: string,
  username: string,
  firstName: string,
  lastName: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, firstName, lastName },
    },
  });

  if (error) throw error;
  return data;
}

// LOGIN
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// LOGOUT
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// GET CURRENT USER
export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// FORGOT PASSWORD
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}
