import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  if ((session.user as any).role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md">
          <h1 className="text-2xl font-black text-red-600 uppercase tracking-tight mb-4">Access Denied</h1>
          <p className="text-gray-600 font-bold mb-6">You do not have the necessary permissions to access the admin dashboard.</p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-black rounded-lg hover:bg-blue-700 transition-all uppercase tracking-wider text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-black uppercase tracking-tight text-blue-600">
            Grounded Admin
          </Link>
        </div>
        <nav className="mt-6 px-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center px-4 py-3 text-sm font-bold text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/listings"
            className="flex items-center px-4 py-3 text-sm font-bold text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
          >
            Manage Listings
          </Link>
          <Link
            href="/admin/packages"
            className="flex items-center px-4 py-3 text-sm font-bold text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
          >
            Manage Packages
          </Link>
          <Link
            href="/admin/service-requests"
            className="flex items-center px-4 py-3 text-sm font-bold text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
          >
            Service Requests
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center px-4 py-3 text-sm font-bold text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
          >
            Manage Users
          </Link>
          <Link
            href="/admin/payments"
            className="flex items-center px-4 py-3 text-sm font-bold text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
          >
            Track Payments
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12">
        {children}
      </main>
    </div>
  );
}
