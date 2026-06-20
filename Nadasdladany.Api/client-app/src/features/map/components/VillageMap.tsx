import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { villageMapService, type VillageLocation } from '../../../api/villageMapService';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Landmark, Cross, Building, MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

const getIconNode = (type: string) => {
    if (type === 'castle') return <Landmark size={20} />;
    if (type === 'church') return <Cross size={20} />;
    if (type === 'office') return <Building size={20} />;
    return <MapPin size={20} />;
};

const createCustomIcon = (type: string) => {
    const html = renderToStaticMarkup(
        <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md border-2 border-[#c5a35a] text-[#1a2e1a] hover:scale-110 transition-transform">
            {getIconNode(type)}
        </div>
    );

    return L.divIcon({
        html,
        className: 'custom-leaflet-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -45]
    });
};

// 🌟 JAVÍTÁS: Eltávolítva a hibás 'public' kulcsszó, így az export újra szabályos
export const VillageMap = () => {
    const [locations, setLocations] = useState<VillageLocation[]>([]);
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

    useEffect(() => {
        villageMapService.getLocations()
            .then((data: VillageLocation[]) => setLocations(data))
            .catch((err: unknown) => console.error("Térkép pontok betöltési hibája:", err));
    }, []);

    useEffect(() => {
        if (mapInstance) {
            setTimeout(() => { mapInstance.invalidateSize(); }, 200);
        }
    }, [mapInstance]);

    return (
        <div className="w-full h-[600px] rounded-[40px] overflow-hidden shadow-inner border border-gray-100 relative z-0">
            <MapContainer
                center={[47.136, 18.240]} zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false} ref={setMapInstance}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {locations.map(loc => (
                    <Marker
                        key={loc.id}
                        position={[loc.latitude, loc.longitude]}
                        icon={createCustomIcon(loc.iconType)}
                    >
                        <Popup className="custom-popup">
                            <div className="p-1.5 min-w-[180px] max-w-xs space-y-1">
                                <h4 className="font-serif font-bold text-primary text-sm leading-tight">{loc.name}</h4>

                                {loc.address && (
                                    <p className="text-gray-500 text-[11px] font-medium leading-tight">
                                        {loc.address}
                                    </p>
                                )}

                                {loc.description && (
                                    <p className="text-gray-400 text-[10px] italic leading-snug pt-1 border-t border-gray-100">
                                        {loc.description}
                                    </p>
                                )}

                                <button className="text-[#c5a35a] text-xs font-bold uppercase mt-3 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer pt-1">
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