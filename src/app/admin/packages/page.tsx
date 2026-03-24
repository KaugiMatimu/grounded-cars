import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPackages() {
  const packages = await prisma.listing.groupBy({
    by: ['package'],
    _count: {
      _all: true
    },
    _avg: {
      price: true
    }
  });

  const listingsByPackage = await prisma.listing.findMany({
    orderBy: {
      package: 'asc'
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Listing Packages</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Monitor and manage listing tiers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['FREE', 'PREMIUM', 'DEALER'].map(pkgType => {
          const stats = packages.find(p => p.package === pkgType);
          return (
            <div key={pkgType} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">{pkgType} Package</p>
              <p className="text-4xl font-black mt-2 text-gray-900">{stats?._count._all || 0}</p>
              <p className="text-xs text-gray-500 font-bold uppercase mt-2">Active Listings</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-black uppercase tracking-tight">Listings by Package</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Listing</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Owner</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Current Package</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {listingsByPackage.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{listing.title}</p>
                    <p className="text-xs text-gray-500 font-medium">{listing.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{listing.user.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                      listing.package === 'PREMIUM' ? 'bg-blue-600 text-white' : 
                      listing.package === 'DEALER' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {listing.package}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href="/admin/listings" 
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                    >
                      Manage in Listings
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
