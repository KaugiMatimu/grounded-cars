"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

export default function UserManager({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleRoleChange = async (id: string, newRole: string) => {
    setLoading(id);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
        router.refresh();
      }
    } catch (err) {
      console.error("Role change failed:", err);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoading(id);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">User</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Contact</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Role</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Joined</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{user.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                  <p className="text-xs text-gray-400">{user.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={loading === user.id}
                    className="text-[10px] font-black px-2 py-1 bg-gray-100 rounded uppercase tracking-widest border-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USER">User</option>
                    <option value="TECHNICIAN">Technician</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-gray-500 font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={loading === user.id}
                    className="text-[10px] font-black px-3 py-2 bg-red-50 text-red-600 rounded-lg uppercase tracking-widest hover:bg-red-100 transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
