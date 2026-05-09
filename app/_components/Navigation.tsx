import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
export default async function Navigation() {
  const session = await getServerSession(authOptions);
  

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>

        <li>
          {session?.user?.image ? (
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
              <span className="font-medium">Guest area</span>
            </Link>
          ) : (
            <Link
              href="/signin"
              className="hover:text-accent-400 transition-colors flex items-center gap-3 group"
            >
              {/* The Sign In Icon - Arrow entering the box */}
              <ArrowRightStartOnRectangleIcon className="h-6 w-6 text-primary-600 group-hover:text-accent-400 transition-colors" />
              <span className="font-medium text-accent-100 group-hover:text-accent-400 transition-colors">
                Sign In
              </span>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
