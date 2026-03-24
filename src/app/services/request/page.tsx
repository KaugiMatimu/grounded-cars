"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { KENYAN_CITIES } from "@/lib/constants";
import { useEffect } from "react";

export default function ServiceRequestPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [form, setForm] = useState({
    name: session?.user?.name || "",
    phoneNumber: "",
    serviceType: "Car Diagnostics",
    carDetails: "",
    location: "",
    locationType: "Home",
    preferredTime: "",
  });

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setForm(prev => ({ ...prev, serviceType: type }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (session?.user?.name) {
      setForm(prev => ({ ...prev, name: session.user.name }));
    }
  }, [session]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-3">Please login to request a service</h2>
          <button
            onClick={() => router.push('/login?callbackUrl=/services/request')}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const { name, phoneNumber, serviceType, carDetails, location, locationType, preferredTime } = form;

    if (!name || !phoneNumber || !carDetails || !location) {
      setError("Please fill in all required fields (Name, Phone, Car Details, Location)");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phoneNumber, serviceType, carDetails, location, locationType, preferredTime })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Unable to create service request');
      }

      setSuccess('Service request submitted successfully');
      setForm({ ...form, carDetails: '', preferredTime: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-xl bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4">Request a Service</h1>
        <p className="mb-6 text-slate-600">Book on-demand service for your vehicle at your home or office.</p>

        {error && <p className="mb-4 text-red-500">{error}</p>}
        {success && <p className="mb-4 text-green-600">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Your Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full Name"
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone Number</label>
              <input
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                placeholder="0712 345 678"
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Service</label>
            <select
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.serviceType}
              onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
            >
              <option>Car Diagnostics</option>
              <option>Car AC Refilling & Repair</option>
              <option>Car Alarm & Tracker Installation</option>
              <option>Paint Work</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Car Details</label>
            <input
              value={form.carDetails}
              onChange={(e) => setForm({ ...form, carDetails: e.target.value })}
              placeholder="Make, model, year, registration"
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">City/Area</label>
              <select
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select city/area</option>
                {KENYAN_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Location Type</label>
              <select
                value={form.locationType}
                onChange={(e) => setForm({ ...form, locationType: e.target.value })}
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Preferred Date/Time</label>
            <input
              value={form.preferredTime}
              onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
              placeholder="e.g. Wednesday 10:00 AM"
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Requesting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
