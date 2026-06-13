import { type ReactNode } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Landmark, Cross, Building } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

const createCustomIcon = (iconNode: ReactNode) => {
    const html = renderToStaticMarkup(
        <div className="p-2 bg-white rounded-full shadow-lg border-2 border-[#c5a35a] text-[#1a2e1a]">
            {iconNode}
        </div>
    );
    return L.divIcon({ 
        html, 
        className: '', 
        iconSize: [40, 40], 
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

const locations = [
    { id: 1, pos: [47.136, 18.238] as [number, number], name: "Nádasdy-kastély", icon: <Landmark size={20} /> },
    { id: 2, pos: [47.137, 18.241] as [number, number], name: "Polgármesteri Hivatal", icon: <Building size={20} /> },
    { id: 3, pos: [47.135, 18.242] as [number, number], name: "Római Katolikus Templom", icon: <Cross size={20} /> },
];

export const VillageMap = () => {
    return (
        <div className="w-full h-[600px] rounded-[40px] overflow-hidden shadow-inner border border-gray-100 z-0">
            <MapContainer
                center={[47.136, 18.240]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {locations.map(loc => (
                    <Marker
                        key={loc.id}
                        position={loc.pos}
                        icon={createCustomIcon(loc.icon)}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2">
                                <h4 className="font-serif font-bold text-[#1a2e1a]">{loc.name}</h4>
                                <button className="text-[#c5a35a] text-xs font-bold uppercase mt-2 hover:underline">
                                    Részletek →
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};