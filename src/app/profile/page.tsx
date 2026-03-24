import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/profile");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      listings: {
        orderBy: { createdAt: 'desc' }   
      },
      services: {
        include: {
          assignedTo: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    redirect("/login?callbackUrl=/profile");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-5xl bg-white p-8 shadow rounded-lg">
        <h1 className="text-3xl font-bold mb-4">My Account</h1>
        <p className="text-gray-600 mb-6">Logged in as <strong>{user.email}</strong></p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Profile</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Location:</strong> {user.location}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Listings</h2>
            <p>Total listings: {user.listings.length}</p>
            <ul className="mt-2 space-y-2 text-sm">
              {user.listings.slice(0, 5).map((listing) => (
                <li key={listing.id} className="rounded bg-slate-100 p-3 flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{listing.title}</div>
                    <div className="text-slate-600 text-xs">{listing.type} – {listing.location}</div>
                    <div className="text-slate-500 text-xs mt-1">{listing.price ? `KES ${listing.price.toLocaleString()}` : 'Price not set'}</div>
                  </div>
                  <div className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${listing.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {listing.approved ? 'Approved' : 'Pending Approval'}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Service Requests</h2>
          <ul className="space-y-3">
            {user.services.map((service) => (
              <li key={service.id} className="rounded border p-3 bg-slate-50">
                <p className="font-semibold">{service.serviceType}</p>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-600">{service.carDetails}</p>
                    <p className="text-sm text-slate-600">{service.location} ({service.locationType})</p>
                    <p className="text-xs text-slate-500 mt-1">Requested: {new Date(service.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm ${
                      service.status === 'APPROVED' ? 'bg-green-500 text-white' : 
                      service.status === 'IN_PROGRESS' ? 'bg-blue-500 text-white' : 
                      service.status === 'COMPLETED' ? 'bg-green-500 text-white' : 
                      service.status === 'CANCELLED' ? 'bg-red-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {service.status.replace('_', ' ')}
                    </span>
                    {service.assignedTo && (
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600 border border-blue-200 uppercase">
                          {service.assignedTo.name?.[0] || 'T'}
                        </div>
                        <p className="text-[11px] font-bold text-gray-500">{service.assignedTo.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
