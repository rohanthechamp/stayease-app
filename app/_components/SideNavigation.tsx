"use client";

import {
  CalendarDaysIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import SignOutButton from "./SignOutButton";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
    <nav className="h-screen border-r border-primary-900 bg-primary-950 flex flex-col">
      
      {/* Scrollable Navigation */}
      <ul className="flex-1 overflow-y-auto text-lg flex flex-col gap-2 p-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`flex items-center gap-4 px-5 py-3 rounded-md font-semibold transition-all
                ${
                  isActive
                    ? "bg-primary-900 text-primary-100"
                    : "text-primary-300 hover:bg-primary-900 hover:text-primary-100"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive
                      ? "text-primary-100"
                      : "text-primary-500 group-hover:text-primary-100"
                  }`}
                />
                <span>{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Fixed Footer */}
      <div className="border-t border-primary-800 p-4 bg-primary-950">
        <SignOutButton />
      </div>
    </nav>
  );
}

export default SideNavigation;