"use client";

import { useState } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";

function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      localStorage.clear()
      sessionStorage.clear()
      // callbackUrl: "/" sends them home
      // redirect: true is the default, but we're being explicit
      await signOut({ callbackUrl: "/" });
   
    } catch (error) {
      console.error("Sign out failed", error);
      setIsSigningOut(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className={`py-3 px-5 transition-all duration-300 flex items-center gap-4 font-semibold w-full
        ${isSigningOut
          ? "bg-primary-800 text-primary-400 cursor-not-allowed"
          : "text-primary-200 hover:bg-primary-900 hover:text-primary-100"
        }`}
    >
      {isSigningOut ? (
        <>
          {/* A simple modern CSS spinner */}
          <div className="h-5 w-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
          <span>Signing out...</span>
        </>
      ) : (
        <>
          <ArrowRightOnRectangleIcon className="h-5 w-5 text-primary-600" />
          <span>Sign out</span>
        </>
      )}
    </button>
  );
}

export default SignOutButton;