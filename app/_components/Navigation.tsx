import { getServerSession } from "next-auth";
import Link from "next/link";

import {
  UserPlusIcon,
} from "@heroicons/react/24/outline";

import {
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { authOptions } from "../_lib/auth";
import default_user_profile from "@/public/user_profile.png"
import Image from "next/image";


export default async function Navigation() {
  const session = await getServerSession(authOptions);
  console.log( 'Navigation' ,session)

  return (
    <nav className="z-10 text-sm">
      <ul className="flex gap-8 items-center">

        {/* Cabins */}
        <li>
          <Link
            href="/cabins"
            className="font-medium text-primary-200 hover:text-accent-500 transition-colors"
          >
            Cabins
          </Link>
        </li>

        {/* About */}
        <li>
          <Link
            href="/about"
            className="font-medium text-primary-200 hover:text-accent-500 transition-colors"
          >
            About
          </Link>
        </li>

        {/* Auth Navigation */}
        {session?.user ? (
          <li>
            <Link
              href="/account"
              className="flex items-center gap-2.5 group bg-primary-900 border border-primary-800 rounded-xl px-3 py-2 hover:border-accent-500/40 transition-all"
            >
              <Image
                className="h-7 w-7 rounded-full border border-primary-800 group-hover:border-accent-500/50 transition-all"
                src={session?.user?.image || default_user_profile}
                alt={session?.user?.name || "Guest profile"}
                width={28}
                height={28}
                referrerPolicy="no-referrer"
              />
              <span className="font-medium text-primary-200 group-hover:text-accent-500 transition-colors">
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
                className="flex items-center gap-2 group text-primary-300 hover:text-accent-500 transition-colors"
              >
                <UserPlusIcon className="h-4 w-4 text-primary-400 group-hover:text-accent-500 transition-colors" />
                <span className="font-medium">Sign Up</span>
              </Link>
            </li>

            {/* Sign In */}
            <li>
              <Link
                href="/signin"
                className="flex items-center gap-2 group text-primary-300 hover:text-accent-500 transition-colors"
              >
                <ArrowRightStartOnRectangleIcon className="h-4 w-4 text-primary-400 group-hover:text-accent-500 transition-colors" />
                <span className="font-medium">Sign In</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}