import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <AdminHeader />
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
