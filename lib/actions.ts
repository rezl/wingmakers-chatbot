"use server";

import { sessionOptions, SessionData, defaultSession } from "./lib";
import { getIronSession } from "iron-session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";
import { supabase } from "./supabase-client";

let isPro = true;
let isBlocked = true;

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  // CHECK THE USER IN THE DB
  session.isBlocked = isBlocked;
  session.isPro = isPro;

  return session;
};

export const login = async (
  prevState: { error: undefined | string, success: boolean },
  formData: FormData
) => {
  const session = await getSession();

  const formUsername = formData.get("username") as string;
  const formPassword = formData.get("password") as string;

  console.log(formUsername);
  console.log(formPassword);

  // Check user in the DB
  const { data, error } = await supabase
    .from('auth-users')
    .select('id, username, password')
    .eq('username', formUsername)
    .single();


  if (error || !data) {
    return { error: "Wrong Credentials!" };
  }

  const { id, username, password } = data;

  if (formPassword !== password) {
    return { error: "Wrong Credentials!" };
  }

  session.userId = id;
  session.username = username;
  session.isLoggedIn = true;

  await session.save();
  redirect("/main/dashboard");
};

export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/login");
};

export const changePassword = async (
  prevState: { error: undefined | string; success: boolean },
  formData: FormData
) => {
  try {
    const session = await getSession(); // Ensure this is a promise
    const userId = session.userId;

    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    console.log(oldPassword);
    console.log(newPassword);

    // Fetch the current user's data
    const { data, error } = await supabase
      .from('auth-users')
      .select('password')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return { ...prevState, error: "User not found or error fetching user data.", success: false };
    }

    const { password: currentPassword } = data;

    // Verify the old password
    if (oldPassword !== currentPassword) {
      return { ...prevState, error: "Old password is incorrect.", success: false };
    }

    // Update the password to the new password
    const { error: updateError } = await supabase
      .from('auth-users')
      .update({ password: newPassword })
      .eq('id', userId);

    if (updateError) {
      return { ...prevState, error: "Error updating password.", success: false };
    }

    // Save the session (if necessary)
    await session.save(); // Ensure this is a promise

    return { ...prevState, error: undefined, success: true };
  } catch (e) {
    console.error(e);
    return { ...prevState, error: "An unexpected error occurred.", success: false };
  }
};