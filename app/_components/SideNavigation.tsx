"use client";

import {
  CalendarDaysIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";

const navLinks = [
  {
    name: "Home",
    href: "/account",
    icon: HomeIcon,
  },
  {
    name: "Reservations",
    href: "/account/reservations",
    icon: CalendarDaysIcon,
  },
  {
    name: "Guest profile",
    href: "/account/profile",
    icon: UserIcon,
  },
];

function SideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col rounded-3xl border border-white/10 bg-primary-900/50 shadow-xl backdrop-blur-xl">
      {/* Brand */}
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-500 text-primary-950 shadow-md shadow-black/20">
            <span className="text-lg font-bold">S</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-primary-50">StayEase</p>
            <p className="text-sm text-primary-300">Guest area</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ul className="flex-1 space-y-2 p-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${isActive
                    ? "bg-white/10 text-primary-50 shadow-sm ring-1 ring-white/10"
                    : "text-primary-300 hover:bg-white/5 hover:text-primary-50"
                  }`}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? "text-accent-400" : "text-primary-500"
                    }`}
                />
                <span>{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <SignOutButton />
      </div>
    </nav>
  );
}

export default SideNavigation;