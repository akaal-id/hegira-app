/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BusinessMatchingCardData } from '../BusinessMatchingCard'; // Ensure this path is correct

interface VendorMapProps {
  vendors: BusinessMatchingCardData[];
  center: [number, number];
  zoom: number;
  radius?: number; // in meters
  activeVendorId?: number | null;
  onMarkerClick?: (vendor: BusinessMatchingCardData) => void;
}

// Custom Hegira-themed icons
const hegraBaseIcon = L.Icon.extend({
  options: {
    iconSize: [28, 41], // Slightly smaller than default
    iconAnchor: [14, 41],
    popupAnchor: [0, -38],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png',
    shadowSize: [41, 41]
  }
});

const hegraTurquoiseIcon = new hegraBaseIcon({ iconUrl: 'https://img.icons8.com/ios-filled/50/4b998e/marker.png' }); // Turquoise color
const hegraYellowIcon = new hegraBaseIcon({ iconUrl: 'https://img.icons8.com/ios-filled/50/ebaf4c/marker.png' }); // Yellow for active


const VendorMap: React.FC<VendorMapProps> = ({ vendors, center, zoom, radius, activeVendorId, onMarkerClick }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
      markersRef.current = L.layerGroup().addTo(mapRef.current);
    }

    // Update map view if center or zoom props change
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }

  }, [center, zoom]); // Initial map setup and view updates

  useEffect(() => {
    if (mapRef.current && markersRef.current) {
      markersRef.current.clearLayers(); // Clear existing markers
      vendors.forEach(vendor => {
        if (vendor.lat && vendor.lng) {
          const iconToUse = vendor.id === activeVendorId ? hegraYellowIcon : hegraTurquoiseIcon;
          const marker = L.marker([vendor.lat, vendor.lng], { icon: iconToUse })
            .addTo(markersRef.current!)
            .bindPopup(`<b>${vendor.name}</b><br>${vendor.sector}<br><small>${vendor.location}</small>`);
          
          if (onMarkerClick) {
            marker.on('click', () => onMarkerClick(vendor));
          }
        }
      });
    }
  }, [vendors, activeVendorId, onMarkerClick]); // Update markers when vendors or activeVendorId changes


  useEffect(() => {
    if (mapRef.current) {
      if (radiusCircleRef.current) {
        mapRef.current.removeLayer(radiusCircleRef.current);
        radiusCircleRef.current = null;
      }
      if (radius && radius > 0) {
        radiusCircleRef.current = L.circle(mapRef.current.getCenter(), { // Use map's current center
          radius: radius,
          color: '#F5AF47', // Hegira Yellow/Accent
          fillColor: '#F5AF47',
          fillOpacity: 0.1,
          weight: 2
        }).addTo(mapRef.current);
      }
    }
  }, [radius, center]); // Update radius circle

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
};

export default VendorMap;