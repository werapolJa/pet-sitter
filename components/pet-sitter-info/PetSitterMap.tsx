import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import pinPetSitter from "@/public/assets/pet-sitter-info-page/pin-petsitter.svg";

const DefaultIcon = L.icon({
  iconUrl: pinPetSitter.src,
  shadowUrl: iconShadow.src,
  iconSize: [88, 88],
  iconAnchor: [40, 40],
  popupAnchor: [0, -40], // Adjusted popup anchor
  shadowSize: [40, 40],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PetSitterMapProps {
  latitude: number;
  longitude: number;
  tradename: string;
}

const PetSitterMap: React.FC<PetSitterMapProps> = ({
  latitude,
  longitude,
  tradename,
}) => {
  return (
    <div className="w-full h-[300px] md:h-[400px] mt-6 md:mt-10">
      <MapContainer
        center={[latitude, longitude]}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]}>
          <Popup>{tradename}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PetSitterMap;
