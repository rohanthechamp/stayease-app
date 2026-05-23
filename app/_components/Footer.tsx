import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-900 border-t border-primary-800 py-16 px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        
        {/* Brand Section */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-8 h-8 bg-accent-500 rounded-lg shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-4 h-4 text-primary-950 stroke-[2.5]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 12h16.5m-16.5 0a2.25 2.25 0 0 1 2.25-2.25h12a2.25 2.25 0 0 1 2.25 2.25m-16.5 0v3.75m16.5-3.75v3.75m-12-3.75V9.75A2.25 2.25 0 0 1 8.25 7.5h7.5a2.25 2.25 0 0 1 2.25 2.25v2.25m-10.5 3.75h10.5"
                />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-primary-100">
              Stay<span className="text-accent-500">Ease</span>
            </span>
          </Link>
          <p className="text-primary-300 max-w-sm text-sm leading-relaxed">
            A thoughtfully curated selection of architectural cabin sanctuaries. Experience minimalist living in the heart of the Dolomites.
          </p>
        </div>

        {/* Column 1: Explore */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-wider text-primary-50 uppercase">
            Explore
          </h4>
          <ul className="space-y-2 text-sm text-primary-300">
            <li>
              <Link href="/cabins" className="hover:text-accent-500 transition-colors">
                Our Cabins
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-accent-500 transition-colors">
                About The Place
              </Link>
            </li>
            <li>
              <span className="cursor-not-allowed opacity-50">Local Guide</span>
            </li>
          </ul>
        </div>

        {/* Column 2: Dashboard */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-wider text-primary-50 uppercase">
            Dashboard
          </h4>
          <ul className="space-y-2 text-sm text-primary-300">
            <li>
              <Link href="/account" className="hover:text-accent-500 transition-colors">
                Guest Dashboard
              </Link>
            </li>
            <li>
              <Link href="/account/reservations" className="hover:text-accent-500 transition-colors">
                Manage Bookings
              </Link>
            </li>
            <li>
              <span className="cursor-not-allowed opacity-50">Contact Support</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto border-t border-primary-800/60 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-primary-400">
        <p>
          &copy; {new Date().getFullYear()} StayEase Inc. All rights reserved.
        </p>
        <div className="flex gap-6">
          <span className="cursor-not-allowed hover:text-accent-500">Terms of Service</span>
          <span className="cursor-not-allowed hover:text-accent-500">Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}
