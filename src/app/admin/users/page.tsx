import { prisma } from "@/lib/prisma";
import UserManager from "@/components/admin/UserManager";

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Manage Users</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">View and manage user roles</p>
      </div>

      <UserManager initialUsers={users as any[]} />
    </div>
  );
}
