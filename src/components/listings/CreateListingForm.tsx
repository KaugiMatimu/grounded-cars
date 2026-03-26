"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { KENYAN_CITIES, CAR_FEATURES, LISTING_PACKAGES } from "@/lib/constants";

const schema = z.object({
  type: z.enum(["SALE", "HIRE"]),
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  mileage: z.string().optional(),
  condition: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  images: z.string().optional(), // Multiple URLs separated by commas
  features: z.array(z.string()),
  availability: z.string().optional(),
  pickupDelivery: z.string().optional(),
  package: z.enum(["FREE", "PREMIUM"]),
});

type ListingFormData = z.infer<typeof schema>;

export default function CreateListingForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "SALE",
      features: [],
      package: "FREE",
    }
  });

  const type = watch("type");
  const selectedFeatures = watch("features");

  const toggleFeature = (feature: string) => {
    const currentFeatures = [...selectedFeatures];
    const index = currentFeatures.indexOf(feature);
    if (index > -1) {
      currentFeatures.splice(index, 1);
    } else {
      currentFeatures.push(feature);
    }
    setValue("features", currentFeatures);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ListingFormData) => {
    setLoading(true);
    setError(null);

    let imageUrls = data.images 
      ? data.images.split(",").map(url => url.trim()).filter(url => url.length > 0)
      : [];

    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach(file => formData.append("files", file));

      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          const { urls } = await uploadResponse.json();
          imageUrls = [...imageUrls, ...urls];
        } else {
          setError("Failed to upload images");
          setLoading(false);
          return;
        }
      } catch (err) {
        setError("An error occurred during upload");
        setLoading(false);
        return;
      }
    }

    const formattedData = {
      ...data,
      images: JSON.stringify(imageUrls),
      features: JSON.stringify(data.features),
    };

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        router.push(type === "SALE" ? "/inventory" : "/hire");
      } else {
        const errorMsg = await response.text();
        setError(errorMsg || "Failed to create listing");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-black mb-8 text-gray-900 uppercase tracking-tight">Create a Listing</h2>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Listing Type</label>
            <select
              {...register("type")}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
            >
              <option value="SALE">For Sale</option>
              <option value="HIRE">For Hire</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Location (City/Area)</label>
            <select
              {...register("location")}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all ${errors.location ? 'border-red-500' : 'border-gray-200'}`}
            >
              <option value="">Select a city</option>
              {KENYAN_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="text-red-500 text-xs font-bold mt-1">{errors.location.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Listing Title</label>
          <input
            {...register("title")}
            className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all ${errors.title ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="e.g., 2020 Toyota Camry - Excellent Condition"
          />
          {errors.title && (
            <p className="text-red-500 text-xs font-bold mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Detailed Description</label>
          <textarea
            {...register("description")}
            rows={5}
            className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="Provide a detailed description of the vehicle, including features, history, and any issues..."
          />
          {errors.description && (
            <p className="text-red-500 text-xs font-bold mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">
              {type === "HIRE" ? "Price Per Day (KSh)" : "Price (KSh)"}
            </label>
            <input
              {...register("price")}
              type="number"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
              placeholder={type === "HIRE" ? "e.g., 5,000" : "e.g., 2,500,000"}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Make</label>
            <input
              {...register("make")}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
              placeholder="e.g., Toyota"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Model</label>
            <input
              {...register("model")}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
              placeholder="e.g., Camry"
            />
          </div>
        </div>

        {type === "HIRE" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Availability Status</label>
              <input
                {...register("availability")}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                placeholder="e.g., Available now, Booked until Monday"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Pickup / Delivery</label>
              <select
                {...register("pickupDelivery")}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
              >
                <option value="Pickup Only">Pickup Only</option>
                <option value="Delivery Available">Delivery Available</option>
                <option value="Both Options">Both Options</option>
              </select>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Vehicle Features</label>
          <div className="flex flex-wrap gap-2">
            {CAR_FEATURES.map((feature: string) => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  selectedFeatures.includes(feature)
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Year</label>
            <input
              {...register("year")}
              type="number"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
              placeholder="e.g., 2020"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Mileage (KM)</label>
            <input
              {...register("mileage")}
              type="number"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
              placeholder="e.g., 45,000"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Condition</label>
            <select
              {...register("condition")}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
            >
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Certified Used">Certified Used</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Transmission</label>
            <select
              {...register("transmission")}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
            >
              <option value="">Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="CVT">CVT</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Fuel Type</label>
            <select
              {...register("fuelType")}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
            >
              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Upload Images</label>
          <div className="flex flex-col gap-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group aspect-square">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      fill
                      unoptimized
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Select multiple images from your device.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Or Image URLs (separated by commas)</label>
          <textarea
            {...register("images")}
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Tip: You can add multiple image URLs separated by commas.</p>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Select Listing Package</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValue("package", "FREE")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                watch("package") === "FREE"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-100 bg-gray-50 hover:border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-black uppercase tracking-tight">Free</span>
                <span className="text-xs font-black bg-gray-200 px-2 py-1 rounded">KES 0</span>
              </div>
              <ul className="text-[10px] font-bold text-gray-500 space-y-1 uppercase tracking-wider">
                <li>• Up to 3 listings</li>
                <li>• Basic visibility</li>
                <li>• 30 days duration</li>
              </ul>
            </button>

            <button
              type="button"
              onClick={() => setValue("package", "PREMIUM")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                watch("package") === "PREMIUM"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-100 bg-gray-50 hover:border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-black uppercase tracking-tight text-blue-600">Premium</span>
                <span className="text-xs font-black bg-blue-600 text-white px-2 py-1 rounded">KES 2,000</span>
              </div>
              <ul className="text-[10px] font-bold text-gray-500 space-y-1 uppercase tracking-wider">
                <li>• Priority visibility</li>
                <li>• Up to 10 listings</li>
                <li>• 90 days duration</li>
                <li>• Featured badge</li>
              </ul>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg active:scale-95"
        >
          {loading ? "Posting..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}
