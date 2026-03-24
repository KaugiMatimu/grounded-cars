import { prisma } from "@/lib/prisma";
import ServiceRequestManager from "@/components/admin/ServiceRequestManager";

export default async function AdminServiceRequests() {
  const [requests, technicians] = await Promise.all([
    prisma.serviceRequest.findMany({
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
        },
        assignedTo: {
          select: {
            name: true
          }
        }
      }
    }),
    prisma.user.findMany({
      where: {
        role: "TECHNICIAN"
      },
      select: {
        id: true,
        name: true
      }
    })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Service Requests</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Manage and assign service requests to technicians</p>
      </div>

      <ServiceRequestManager 
        initialRequests={requests as any[]} 
        technicians={technicians} 
      />
    </div>
  );
}
