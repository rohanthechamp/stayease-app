"use server";

import { signIn, signOut } from "next-auth/react";

export async function login() {
    await signIn("google");
}

export async function logOut() {
    await signOut();
}