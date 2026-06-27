import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { villageMapService, type VillageLocation } from '../../api/villageMapService';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import {
    Landmark, Cross, Building, MapPin, Trash2, Plus, Save, Loader2,
    HeartPulse, Pill, Baby, GraduationCap, Trophy, Home, Edit3, X
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';

const MAP_ICONS: Record<string, { label: string; icon: React.ReactNode }> = {
    default: { label: 'Általános tű', icon: <MapPin size={20} /> },
    castle: { label: 'Kastély / Turizmus', icon: <Landmark size={20} /> },
    church: { label: 'Templom / Vallás', icon: <Cross size={20} /> },
    office: { label: 'Hivatal / Intézmény', icon: <Building size={20} /> },
    medical: { label: 'Orvosi rendelő', icon: <HeartPulse size={20} /> },
    pharmacy: { label: 'Gyógyszertár', icon: <Pill size={20} /> },
    dental: { label: 'Fogászat', icon: <HeartPulse size={20} className="text-blue-500" /> },
    school: { label: 'Iskola / Óvoda', icon: <GraduationCap size={20} /> },
    playground: { label: 'Játszótér', icon: <Baby size={20} /> },
    sport: { label: 'Sport / Focipálya', icon: <Trophy size={20} /> },
    community: { label: 'Közösségi Ház', icon: <Home size={20} /> }
};

const createMapIcon = (type: string) => {
    const iconObj = MAP_ICONS[type] || MAP_ICONS.default;
    const html = renderToStaticMarkup(
        <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md border-2 border-[#c5a35a] text-[#1a2e1a]">
            {iconObj.icon}
        </div>
    );
    return L.divIcon({ html, className: 'custom-map-icon', iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -40] });
};

const MapEvents = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
    useMapEvents({ click(e) { onMapClick(e.latlng.lat, e.latlng.lng); } });
    return null;
};

const mapFormSchema = z.object({
    name: z.string().min(1, "A megnevezés kötelező!"),
    address: z.string().min(1, "A pontos cím kötelező!"),
    description: z.string().optional(),
    iconType: z.string().default('default')
});

type MapFormData = z.infer<typeof mapFormSchema>;

export const AdminMapPage = () => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

    const { data: locations = [], refetch, isLoading } = useQuery({
        queryKey: ['adminMapLocations'],
        queryFn: () => villageMapService.getLocations()
    });

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<MapFormData>({
        resolver: zodResolver(mapFormSchema) as any,
        defaultValues: { name: '', address: '8145 Nádasdladány, ', description: '', iconType: 'default' }
    });

    const watchedName = watch('name');
    const watchedIconType = watch('iconType');

    useEffect(() => { if (mapInstance) { setTimeout(() => mapInstance.invalidateSize(), 250); } }, [mapInstance]);

    const handleMapClick = (lat: number, lng: number) => {
        setCoords({ lat, lng });
        if (!editingId) reset({ name: '', address: '8145 Nádasdladány, ', description: '', iconType: 'default' });
        toast.success("Kattintási pont rögzítve!");
    };

    const startEdit = (loc: VillageLocation) => {
        setEditingId(loc.id);
        reset({
            name: loc.name,
            address: loc.address || '8145 Nádasdladány, ',
            description: loc.description || '',
            iconType: loc.iconType
        });
        setCoords({ lat: loc.latitude, lng: loc.longitude });
        if (mapInstance) mapInstance.flyTo([loc.latitude, loc.longitude], 16);
    };

    const cancelEditOrCreation = () => {
        setEditingId(null);
        setCoords(null);
        reset({ name: '', address: '8145 Nádasdladány, ', description: '', iconType: 'default' });
    };

    const onValidSubmit = async (data: MapFormData) => {
        if (!coords) return;
        try {
            await villageMapService.saveLocation({
                id: editingId || undefined,
                name: data.name, address: data.address, description: data.description || '', iconType: data.iconType,
                latitude: coords.lat, longitude: coords.lng
            });
            toast.success(editingId ? "Helyszín sikeresen módosítva!" : "Új helyszín elmentve az adatbázisba!");
            cancelEditOrCreation();
            refetch();
        } catch {
            toast.error("Hiba történt a mentés során.");
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Biztosan törölni szeretné ezt a helyszínt?")) return;
        try {
            await villageMapService.deleteLocation(id);
            toast.success("Helyszín eltávolítva.");
            if (editingId === id) cancelEditOrCreation();
            refetch();
        } catch {
            toast.error("Nem sikerült törölni a helyszínt.");
        }
    };

    const handleMarkerDragEnd = async (loc: VillageLocation, newLat: number, newLng: number) => {
        try {
            await villageMapService.saveLocation({
                id: loc.id, name: loc.name, address: loc.address, description: loc.description,
                iconType: loc.iconType, latitude: newLat, longitude: newLng
            });
            toast.success(`"${loc.name}" pozíciója frissítve!`);
            if (editingId === loc.id) setCoords({ lat: newLat, lng: newLng });
            refetch();
        } catch {
            toast.error("Nem sikerült elmenteni az új pozíciót.");
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="h-96 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="animate-spin text-accent" size={36} />
                    <span className="font-serif italic text-gray-400 text-lg">Térképi pontok betöltése...</span>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-4xl font-serif font-bold text-primary">Térképszerkesztő (Interaktív)</h1>
                <p className="text-gray-400 mt-1">Kattintson a térképre új pont felvételéhez vagy a kijelölt elem áthelyezéséhez.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-serif font-bold text-primary text-lg flex items-center gap-2">
                            {editingId ? <Edit3 size={18} className="text-accent" /> : <Plus size={18} className="text-accent" />}
                            {editingId ? 'Helyszín módosítása' : 'Új helyszín rögzítése'}
                        </h3>

                        {coords ? (
                            <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4 animate-in fade-in duration-200">
                                <div className="p-2.5 bg-gray-50 border rounded-xl text-[11px] text-gray-500 font-mono">
                                    Szélesség: {coords.lat.toFixed(5)} <br />
                                    Hosszúság: {coords.lng.toFixed(5)}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Megnevezés *</label>
                                    <input type="text" className={`w-full bg-secondary/30 border p-3 rounded-xl text-sm outline-none focus:border-accent text-primary font-medium ${errors.name ? 'border-red-400' : 'border-gray-200/60'}`} placeholder="pl. Faluház" {...register('name')} />
                                    {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Pontos cím *</label>
                                    <input type="text" className={`w-full bg-secondary/30 border p-3 rounded-xl text-sm outline-none focus:border-accent text-primary font-medium ${errors.address ? 'border-red-400' : 'border-gray-200/60'}`} placeholder="8145 Nádasdladány, Fő utca 1." {...register('address')} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Rövid leírás / Nyitvatartás</label>
                                    <textarea rows={3} className="w-full bg-secondary/30 border border-gray-200/60 p-3 rounded-xl text-sm outline-none focus:border-accent text-primary leading-tight" placeholder="Opcionális leírás..." {...register('description')} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Ikon és kategória</label>
                                    <select className="w-full bg-secondary/30 border border-gray-200/60 p-3 rounded-xl text-sm outline-none focus:border-accent text-primary font-medium" {...register('iconType')}>
                                        {Object.entries(MAP_ICONS).map(([key, obj]) => <option key={key} value={key}>{obj.label}</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-accent transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                                    <Save size={14} /> {editingId ? 'Változtatások mentése' : 'Mentés az adatbázisba'}
                                </button>
                                <button type="button" onClick={cancelEditOrCreation} className="w-full border text-gray-500 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-gray-50 flex items-center justify-center gap-1 cursor-pointer">
                                    <X size={12} /> Mégse
                                </button>
                            </form>
                        ) : (
                            <p className="text-gray-400 text-xs italic leading-relaxed">
                                Kattintson a térképen tetszőleges pontra az új hely felvételéhez, vagy válasszon ki egy meglévőt az alábbi listából a szerkesztéshez!
                            </p>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                        <h3 className="font-serif font-bold text-primary text-sm border-b pb-2">Helyszínek kezelése ({locations.length})</h3>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                            {locations.map(loc => (
                                <div key={loc.id} onClick={() => startEdit(loc)} className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${editingId === loc.id ? 'border-accent bg-accent/5' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}>
                                    <div className="flex items-center gap-2 truncate flex-1">
                                        <div className="text-primary flex-shrink-0">{(MAP_ICONS[loc.iconType] || MAP_ICONS.default).icon}</div>
                                        <div className="flex flex-col truncate">
                                            <span className="text-xs font-bold text-primary truncate">{loc.name}</span>
                                            <span className="text-[10px] text-gray-400 truncate">{loc.address || 'Nincs cím megadva'}</span>
                                        </div>
                                    </div>
                                    <button onClick={(e) => handleDelete(loc.id, e)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors ml-2 flex-shrink-0 cursor-pointer"><Trash2 size={13} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-3 w-full h-[680px] rounded-[36px] overflow-hidden shadow-inner border border-gray-100 z-0 relative">
                    <MapContainer center={[47.136, 18.240]} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true} ref={setMapInstance}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                        <MapEvents onMapClick={handleMapClick} />

                        {coords && !locations.some(l => l.id === editingId) && (
                            <Marker position={[coords.lat, coords.lng]} icon={createMapIcon(watchedIconType || 'default')}>
                                <Popup><span className="text-xs font-bold">Új pont helye: {watchedName || 'Töltse ki a formot'}</span></Popup>
                            </Marker>
                        )}

                        {locations.map(loc => {
                            const isCurrentEdit = editingId === loc.id;
                            const currentLat = isCurrentEdit && coords ? coords.lat : loc.latitude;
                            const currentLng = isCurrentEdit && coords ? coords.lng : loc.longitude;

                            return (
                                <Marker key={loc.id} position={[currentLat, currentLng]} icon={createMapIcon(isCurrentEdit ? (watchedIconType || loc.iconType) : loc.iconType)} draggable={true} eventHandlers={{ dragend: (e) => { const marker = e.target; const position = marker.getLatLng(); handleMarkerDragEnd(loc, position.lat, position.lng); }, click: () => { startEdit(loc); } }}>
                                    <Popup>
                                        <div className="p-1 max-w-xs space-y-1">
                                            <h4 className="font-serif font-bold text-primary text-sm leading-tight">{isCurrentEdit ? watchedName : loc.name}</h4>
                                            {loc.address && <p className="text-gray-500 text-[11px] font-medium">{loc.address}</p>}
                                            {loc.description && <p className="text-gray-400 text-[10px] italic leading-snug pt-0.5 border-t border-gray-100">{loc.description}</p>}
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            </div>
        </AdminLayout>
    );
};