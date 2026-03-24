import CreateListingForm from "@/components/listings/CreateListingForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CreateListingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/listings/create");
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto mb-6">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Post Your Vehicle</h1>
        <p className="text-gray-500 font-medium">Reach thousands of potential buyers in Kenya</p>
      </div>
      <CreateListingForm />
    </div>
  );
}
