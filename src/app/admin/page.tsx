import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [listingCount, userCount, requestCount, paymentSum] = await Promise.all([
    prisma.listing.count(),
    prisma.user.count(),
    prisma.serviceRequest.count(),
    prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      where: {
        status: "COMPLETED"
      }
    })
  ]);

  const recentListings = await prisma.listing.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  });

  const recentRequests = await prisma.serviceRequest.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Admin Overview</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Manage the grounded ecosystem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total Listings</p>
          <p className="text-4xl font-black mt-2 text-gray-900">{listingCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Registered Users</p>
          <p className="text-4xl font-black mt-2 text-gray-900">{userCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Service Requests</p>
          <p className="text-4xl font-black mt-2 text-gray-900">{requestCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Revenue (KES)</p>
          <p className="text-4xl font-black mt-2 text-blue-600">{(paymentSum._sum.amount || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight">Recent Listings</h2>
            <Link href="/admin/listings" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {recentListings.map(listing => (
              <div key={listing.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">{listing.title}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase">By {listing.user.name}</p>
                </div>
                <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${listing.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {listing.approved ? 'Approved' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight">Service Requests</h2>
            <Link href="/admin/service-requests" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {recentRequests.map(request => (
              <div key={request.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">{request.serviceType}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase">{request.location}</p>
                </div>
                <div className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest bg-gray-200 text-gray-700">
                  {request.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
