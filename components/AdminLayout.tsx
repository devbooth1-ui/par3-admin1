import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-100">
      {/* Sidebar + Main Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 shadow-lg py-8 px-4">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-extrabold text-2xl">P3</div>
            <span className="text-xl font-bold text-blue-900 tracking-wide">Par 3 Admin</span>
          </div>
          <nav className="flex flex-col gap-2 text-base">
            <Link href="/dashboard" className="px-3 py-2 rounded hover:bg-blue-50 text-blue-900 font-semibold transition">Dashboard</Link>
            <Link href="/accounting" className="px-3 py-2 rounded hover:bg-blue-50 text-blue-900 font-semibold transition">Accounting</Link>
            <Link href="/claims" className="px-3 py-2 rounded hover:bg-blue-50 text-blue-900 font-semibold transition">Claims</Link>
            <Link href="/courses" className="px-3 py-2 rounded hover:bg-blue-50 text-blue-900 font-semibold transition">Courses</Link>
            <Link href="/crm" className="px-3 py-2 rounded hover:bg-blue-50 text-blue-900 font-semibold transition">CRM</Link>
            <Link href="/events" className="px-3 py-2 rounded hover:bg-blue-50 text-blue-900 font-semibold transition">Events</Link>
            <Link href="/notifications" className="px-3 py-2 rounded hover:bg-blue-50 text-blue-900 font-semibold transition">Notifications</Link>
            <Link href="/players" className="px-3 py-2 rounded hover:bg-blue-50 text-blue-900 font-semibold transition">Players</Link>
            <Link href="/specials" className="px-3 py-2 rounded hover:bg-blue-50 text-blue-900 font-semibold transition">Specials</Link>
            <Link href="/tournaments" className="px-3 py-2 rounded hover:bg-blue-50 text-blue-900 font-semibold transition">Tournaments</Link>
            <Link href="/verification" className="px-3 py-2 rounded hover:bg-blue-50 text-blue-900 font-semibold transition">Verification</Link>
          </nav>
          <div className="mt-auto pt-10">
            <Link href="/login" className="block px-3 py-2 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition">Logout</Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Topbar */}
          <header className="bg-white shadow flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <button className="md:hidden text-blue-700 focus:outline-none">
                {/* Hamburger icon for mobile sidebar (not implemented) */}
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              <span className="text-2xl font-bold text-blue-900 tracking-wide">Admin Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-gray-700 font-medium">Admin User</span>
              <Image src="https://i.pravatar.cc/40?img=3" alt="User Avatar" width={40} height={40} className="rounded-full border-2 border-blue-200 shadow" />
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-4 sm:p-8 md:p-12 bg-transparent">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
