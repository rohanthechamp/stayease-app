import Link from "next/link";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 z-10 group">
      <div className="relative flex items-center justify-center w-10 h-10 bg-accent-500 rounded-xl transition-all duration-300 group-hover:bg-accent-600 shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-5 h-5 text-primary-950 stroke-[2.5]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 12h16.5m-16.5 0a2.25 2.25 0 0 1 2.25-2.25h12a2.25 2.25 0 0 1 2.25 2.25m-16.5 0v3.75m16.5-3.75v3.75m-12-3.75V9.75A2.25 2.25 0 0 1 8.25 7.5h7.5a2.25 2.25 0 0 1 2.25 2.25v2.25m-10.5 3.75h10.5"
          />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight text-primary-100 group-hover:text-accent-500 transition-colors">
        Stay<span className="text-accent-500">Ease</span>
      </span>
    </Link>
  );
}

export default Logo;
