"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Payment {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  amount: number;
  currency: string;
  method: string;
  transactionId: string | null;
  status: string;
  createdAt: string;
}

export default function PaymentManager({ 
  initialPayments 
}: { 
  initialPayments: Payment[] 
}) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = async (id: string, status: string) => {
    setLoading(id);
    try {
      const response = await fetch(`/api/admin/payments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updated = await response.json();
        setPayments(prev => prev.map(p => p.id === id ? updated : p));
        router.refresh();
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'FAILED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Transaction ID</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">User</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Amount</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Date</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{payment.transactionId || 'N/A'}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">{payment.method}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{payment.user.name}</p>
                  <p className="text-xs text-gray-500 font-medium">{payment.user.email}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{payment.currency} {payment.amount.toLocaleString()}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-gray-500 font-medium">{new Date(payment.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <select
                    value={payment.status}
                    onChange={(e) => handleUpdate(payment.id, e.target.value)}
                    disabled={loading === payment.id}
                    className="text-[10px] font-black px-2 py-1 bg-gray-100 rounded uppercase tracking-widest border-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
