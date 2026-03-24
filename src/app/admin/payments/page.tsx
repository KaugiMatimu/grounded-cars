import { prisma } from "@/lib/prisma";
import PaymentManager from "@/components/admin/PaymentManager";

export default async function AdminPayments() {
  const payments = await prisma.payment.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  const totalRevenue = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Payment Tracking</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Monitor revenue and transaction status</p>
        </div>
        <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg border border-blue-500">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Revenue (KES)</p>
          <p className="text-2xl font-black">{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <PaymentManager 
        initialPayments={payments as any[]} 
      />
    </div>
  );
}
