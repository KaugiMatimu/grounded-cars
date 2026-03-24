"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Listing {
  id: string;
  title: string;
  type: string;
  price: number | null;
  location: string;
  approved: boolean;
  featured: boolean;
  package: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

export default function ListingManager({ initialListings }: { initialListings: any[] }) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (id: string, action: string, value?: any) => {
    setLoading(id);
    try {
      const response = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, value }),
      });

      if (response.ok) {
        const updatedListing = await response.json();
        setListings(prev => prev.map(l => l.id === id ? updatedListing : l));
        router.refresh();
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    setLoading(id);
    try {
      const response = await fetch(`/api/admin/listings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setListings(prev => prev.filter(l => l.id !== id));
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
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Listing</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Owner</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Package</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {listings.map((listing) => (
              <tr key={listing.id} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{listing.title}</p>
                  <p className="text-xs text-gray-500 font-medium">{listing.type} • {listing.location}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{listing.user.name}</p>
                  <p className="text-xs text-gray-500 font-medium">{listing.user.email}</p>
                  <p className="text-xs text-gray-400">{listing.user.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest w-fit ${listing.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {listing.approved ? 'Approved' : 'Pending'}
                    </span>
                    {listing.featured && (
                      <span className="text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest w-fit bg-blue-100 text-blue-700">
                        Featured
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={listing.package}
                    onChange={(e) => handleAction(listing.id, "PACKAGE", e.target.value)}
                    disabled={loading === listing.id}
                    className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest border-none focus:ring-2 focus:ring-blue-500 ${
                      listing.package === 'PREMIUM' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <option value="FREE">FREE</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="DEALER">DEALER</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleAction(listing.id, "APPROVE", !listing.approved)}
                      disabled={loading === listing.id}
                      className={`text-[10px] font-black px-3 py-2 rounded-lg uppercase tracking-widest transition-all ${
                        listing.approved 
                          ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" 
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {listing.approved ? "Reject" : "Approve"}
                    </button>
                    <button
                      onClick={() => handleAction(listing.id, "FEATURE", !listing.featured)}
                      disabled={loading === listing.id}
                      className={`text-[10px] font-black px-3 py-2 rounded-lg uppercase tracking-widest transition-all ${
                        listing.featured 
                          ? "bg-gray-100 text-gray-600" 
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                    >
                      {listing.featured ? "Unfeature" : "Feature"}
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      disabled={loading === listing.id}
                      className="text-[10px] font-black px-3 py-2 bg-red-50 text-red-600 rounded-lg uppercase tracking-widest hover:bg-red-100 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
