import { prisma } from "@/lib/prisma";
import ListingManager from "@/components/admin/ListingManager";

export default async function AdminListings() {
  const listings = await prisma.listing.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true
        }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Manage Listings</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Approve, feature or remove listings</p>
      </div>

      <ListingManager initialListings={listings} />
    </div>
  );
}
