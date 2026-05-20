import { getServerSession } from "next-auth";
import Link from "next/link";

import {
  UserPlusIcon,
} from "@heroicons/react/24/outline";

import {
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { authOptions } from "../_lib/auth";



export default async function Navigation() {
  const session = await getServerSession(authOptions);
  console.log( 'Navigation' ,session)

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">

        {/* Cabins */}
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>

        {/* About */}
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>

        {/* Auth Navigation */}
        {session?.user ? (
          <li>
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors flex items-center gap-4 group"
            >
              <img
                className="h-8 w-8 rounded-full border border-accent-900 group-hover:border-accent-400 transition-all shadow-sm"
                src={session.user.image}
                alt={session.user.name || "Guest profile"}
                referrerPolicy="no-referrer"
              />

              <span className="font-medium">
                Guest area
              </span>
            </Link>
          </li>
        ) : (
          <>
            {/* Sign Up */}
            <li>
              <Link
                href="/signup"
                className="hover:text-accent-400 transition-colors flex items-center gap-3 group"
              >
                <UserPlusIcon className="h-6 w-6 text-primary-600 group-hover:text-accent-400 transition-colors" />

                <span className="font-medium text-accent-100 group-hover:text-accent-400 transition-colors">
                  Sign Up
                </span>
              </Link>
            </li>

            {/* Sign In */}
            <li>
              <Link
                href="/signin"
                className="hover:text-accent-400 transition-colors flex items-center gap-3 group"
              >
                <ArrowRightStartOnRectangleIcon className="h-6 w-6 text-primary-600 group-hover:text-accent-400 transition-colors" />

                <span className="font-medium text-accent-100 group-hover:text-accent-400 transition-colors">
                  Sign In
                </span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}