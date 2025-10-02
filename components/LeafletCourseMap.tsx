import React, { useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

interface MapProps {
  lat: number;
  lng: number;
  radius: number;
  address: string; // usually course name + city
  onChange: (lat: number, lng: number, radius: number, foundAddress?: string) => void;
}

export default function LeafletCourseMap({ lat, lng, radius, address, onChange }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView([lat, lng], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(leafletMapRef.current);

      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(leafletMapRef.current);
      markerRef.current.on("dragend", function() {
        if (markerRef.current && circleRef.current && onChange) {
          const newLatLng = markerRef.current.getLatLng();
          onChange(newLatLng.lat, newLatLng.lng, circleRef.current.getRadius());
          circleRef.current.setLatLng(newLatLng);
        }
      });

      circleRef.current = L.circle([lat, lng], { radius, color: "blue", fillOpacity: 0.2 }).addTo(leafletMapRef.current);
    }

    if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
    if (circleRef.current) {
      circleRef.current.setLatLng([lat, lng]);
      circleRef.current.setRadius(radius);
    }
    // eslint-disable-next-line
  }, [lat, lng, radius]);

  useEffect(() => {
    if (!address || address.length < 3) return;
    async function geocode() {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
        const res = await axios.get(url);
        if (res.data && res.data.length > 0) {
          const { lat, lon, display_name } = res.data[0];
          if (
            leafletMapRef.current &&
            markerRef.current &&
            circleRef.current &&
            onChange
          ) {
            leafletMapRef.current.setView([parseFloat(lat), parseFloat(lon)], 15);
            markerRef.current.setLatLng([parseFloat(lat), parseFloat(lon)]);
            circleRef.current.setLatLng([parseFloat(lat), parseFloat(lon)]);
            onChange(parseFloat(lat), parseFloat(lon), radius, display_name);
          }
        }
      } catch (e) {
        // fail silently (still allow manual entry)
      }
    }
    geocode();
    // eslint-disable-next-line
  }, [address]);

  return (
    <div style={{ height: "240px", width: "100%", marginBottom: "8px" }} ref={mapRef} />
  );
}
