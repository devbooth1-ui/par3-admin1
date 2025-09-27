import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/LeafletCourseMap"), { ssr: false });

export default function CourseAdd() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [golfPro, setGolfPro] = useState("");
  const [employee, setEmployee] = useState("");
  const [holeNumber, setHoleNumber] = useState("");
  const [yardage, setYardage] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [foundAddress, setFoundAddress] = useState("");

  // Map state
  const [lat, setLat] = useState(37.7749);
  const [lng, setLng] = useState(-122.4194);
  const [radius, setRadius] = useState(1200); // 3/4 mile in meters
  const fullLocationQuery = `${name} ${city}`;

  function validate() {
    const errs: any = {};
    if (!name) errs.name = "Course name required";
    if (!city) errs.city = "City required";
    if (!holeNumber || Number(holeNumber) < 1 || Number(holeNumber) > 18) errs.holeNumber = "Hole number must be 1-18";
    if (!yardage || Number(yardage) < 50 || Number(yardage) > 600) errs.yardage = "Yardage must be 50-600";
    if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ""))) errs.phone = "Phone must be 10 digits";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) errs.email = "Invalid email";
    return errs;
  }

  function handleUseFoundAddress() {
    setAddress(foundAddress);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const course = {
      name,
      address,
      city,
      description,
      golfPro,
      employee,
      holeNumber,
      yardage,
      phone,
      email,
      location: { lat, lng },
      geofenceRadius: radius,
    };
    const stored = JSON.parse(localStorage.getItem("courses") || "[]");
    localStorage.setItem("courses", JSON.stringify([...stored, course]));
    router.push("/courses");
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6">Add New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Course Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
                   className={`w-full border px-3 py-2 rounded ${errors.name ? 'border-red-500' : ''}`} required />
            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Address (auto-filled if found)</label>
            <input value={address} onChange={e => setAddress(e.target.value)}
                   className={`w-full border px-3 py-2 rounded ${errors.address ? 'border-red-500' : ''}`} />
            {foundAddress && !address && (
              <button type="button" className="text-blue-600 text-xs mt-1 underline" onClick={handleUseFoundAddress}>
                Use found address: {foundAddress}
              </button>
            )}
            {errors.address && <div className="text-red-500 text-xs mt-1">{errors.address}</div>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">City</label>
            <input value={city} onChange={e => setCity(e.target.value)}
                   className={`w-full border px-3 py-2 rounded ${errors.city ? 'border-red-500' : ''}`} required />
            {errors.city && <div className="text-red-500 text-xs mt-1">{errors.city}</div>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)}
                   className="w-full border px-3 py-2 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Golf Pro</label>
            <input value={golfPro} onChange={e => setGolfPro(e.target.value)}
                   className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Employee</label>
            <input value={employee} onChange={e => setEmployee(e.target.value)}
                   className="w-full border px-3 py-2 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
                   className={`w-full border px-3 py-2 rounded ${errors.phone ? 'border-red-500' : ''}`} />
            {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)}
                   className={`w-full border px-3 py-2 rounded ${errors.email ? 'border-red-500' : ''}`} />
            {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Hole Number</label>
            <input
              type="number"
              value={holeNumber}
              min={1}
              max={18}
              onChange={e => setHoleNumber(e.target.value)}
              className={`w-full border px-2 py-1 rounded ${errors.holeNumber ? 'border-red-500' : ''}`}
              required
            />
            {errors.holeNumber && <div className="text-red-500 text-xs mt-1">{errors.holeNumber}</div>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Yardage</label>
            <input
              type="number"
              value={yardage}
              min={50}
              max={600}
              onChange={e => setYardage(e.target.value)}
              className={`w-full border px-2 py-1 rounded ${errors.yardage ? 'border-red-500' : ''}`}
              required
            />
            {errors.yardage && <div className="text-red-500 text-xs mt-1">{errors.yardage}</div>}
          </div>
        </div>
        <div>
          <label className="block mb-2 font-medium">Location & Geofence (3/4 mile radius default)</label>
          <Map
            lat={lat}
            lng={lng}
            radius={radius}
            address={fullLocationQuery}
            onChange={(newLat, newLng, newRadius, foundAddr) => {
              setLat(newLat);
              setLng(newLng);
              setRadius(newRadius);
              if (foundAddr) setFoundAddress(foundAddr);
            }}
          />
          <div className="mt-2 flex items-center space-x-4">
            <span className="text-sm font-medium">Latitude:</span><span>{lat.toFixed(6)}</span>
            <span className="text-sm font-medium">Longitude:</span><span>{lng.toFixed(6)}</span>
            <span className="text-sm font-medium">Radius (meters):</span>
            <input type="number" value={radius} min={100} max={2000}
                   onChange={e => setRadius(Number(e.target.value))}
                   className="border px-2 py-1 rounded w-24" />
          </div>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold w-full mt-4">
          Add Course
        </button>
      </form>
    </div>
  );
}
