"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ServiceRequest {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  phoneNumber: string | null;
  serviceType: string;
  carDetails: string;
  location: string;
  status: string;
  assignedToId: string | null;
  assignedTo: {
    name: string;
  } | null;
  createdAt: string;
}

interface Technician {
  id: string;
  name: string;
}

export default function ServiceRequestManager({ 
  initialRequests, 
  technicians 
}: { 
  initialRequests: ServiceRequest[], 
  technicians: Technician[] 
}) {
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = async (id: string, body: any) => {
    setLoading(id);
    try {
      const response = await fetch(`/api/admin/service-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const updated = await response.json();
        setRequests(prev => prev.map(r => r.id === id ? updated : r));
        router.refresh();
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    setLoading(id);
    try {
      const response = await fetch(`/api/admin/service-requests/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRequests(prev => prev.filter(r => r.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'APPROVED': return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Request Details</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Client</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Assigned To</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{request.serviceType}</p>
                  <p className="text-xs text-gray-500 font-medium">{request.carDetails}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{request.location}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{request.user.name}</p>
                  <p className="text-xs text-gray-500 font-medium">{request.user.email}</p>
                  <p className="text-xs text-gray-400">{request.phoneNumber || request.user.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={request.status}
                    onChange={(e) => handleUpdate(request.id, { status: e.target.value })}
                    disabled={loading === request.id}
                    className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest border-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(request.status)}`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={request.assignedToId || "null"}
                    onChange={(e) => handleUpdate(request.id, { assignedToId: e.target.value })}
                    disabled={loading === request.id}
                    className="text-[10px] font-black px-2 py-1 bg-gray-100 rounded uppercase tracking-widest border-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="null">Unassigned</option>
                    {technicians.map(tech => (
                      <option key={tech.id} value={tech.id}>{tech.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(request.id)}
                    disabled={loading === request.id}
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
