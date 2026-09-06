"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";

export default function AdminPortalHeader() {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-5">
      <nav className="flex gap-4 text-sm">
        <Link href="/admin" className="text-[var(--gold)]">Overview</Link>
        <Link href="/admin/bookings" className="text-gray-400 hover:text-[var(--gold)]">Bookings</Link>
        <Link href="/admin/fleet" className="text-gray-400 hover:text-[var(--gold)]">Fleet & Pricing</Link>
        <Link href="/en" className="text-gray-400 hover:text-[var(--gold)]">View Site</Link>
      </nav>
      <div className="flex items-center gap-3 text-sm">
        <Link href="/en/profile" className="inline-flex items-center gap-2 text-gray-300 hover:text-[var(--gold)]">
          <UserRound size={16} aria-hidden="true" />
          Profile
        </Link>
        <button type="button" onClick={() => signOut({ callbackUrl: "/en/login" })} className="inline-flex items-center gap-2 text-gray-300 hover:text-[var(--gold)]">
          <LogOut size={16} aria-hidden="true" />
          Log out
        </button>
      </div>
    </div>
  );
}
