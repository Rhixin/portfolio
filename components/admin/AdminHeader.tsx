"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0f]">
      <Link href="/admin" className="text-white font-bold text-lg">
        Portfolio Admin
      </Link>
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
      >
        Log out
      </button>
    </header>
  );
}
