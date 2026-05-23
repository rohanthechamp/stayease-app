import SideNavigation from "@/app/_components/SideNavigation";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-primary-950 text-primary-100">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-4 py-4 lg:grid-cols-[18rem_1fr] lg:px-6 lg:py-6">
        <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <SideNavigation />
        </aside>

        <main className="min-w-0">
          <div className="rounded-3xl border border-white/10 bg-primary-900/40 p-4 shadow-xl backdrop-blur-xl sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}