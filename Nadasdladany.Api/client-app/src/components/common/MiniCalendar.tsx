import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';

interface VillageEvent {
    id: number;
    title: string;
    slug: string;
    startDate: string;
    location?: string;
    isAllDay: boolean;
}

export const MiniCalendar = () => {
    const [events, setEvents] = useState<VillageEvent[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const navigate = useNavigate();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        apiClient.get('/events')
            .then(res => {
                const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
                setEvents(items);
            })
            .catch(err => console.error("Hiba a naptár események betöltésekor:", err));
    }, []);

    const MONTHS = [
        "Január", "Február", "Március", "Április", "Május", "Június",
        "Július", "Augusztus", "Szeptember", "Október", "November", "December",
    ];
    const DOW_LABELS = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];
    const MONTH_NAMES_HU = [
        "január", "február", "március", "április", "május", "június",
        "július", "augusztus", "szeptember", "október", "november", "december",
    ];
    const DOW_NAMES_HU = ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"];

    const firstDow = new Date(year, month, 1).getDay();
    const startOffset = firstDow === 0 ? 6 : firstDow - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    const getEventsForDay = (day: number) =>
        events.filter(e => {
            const d = new Date(e.startDate);
            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
        });

    const selectedDayEvents = events.filter(e => {
        const d = new Date(e.startDate);
        return d.getFullYear() === selectedDate.getFullYear() &&
            d.getMonth() === selectedDate.getMonth() &&
            d.getDate() === selectedDate.getDate();
    });

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const selectedDow = selectedDate.getDay();
    const selectedDateLabel = `${selectedDate.getFullYear()}. ${MONTH_NAMES_HU[selectedDate.getMonth()]} ${selectedDate.getDate()}. — ${DOW_NAMES_HU[selectedDow]}`;

    return (
        <div className="rounded-[28px] overflow-hidden border border-gray-100 bg-white">

            {/* Dark header with month + grid */}
            <div className="bg-primary pb-4">

                {/* Month navigation */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <div>
                        <p className="text-white font-semibold text-lg leading-tight">{MONTHS[month]}</p>
                        <p className="text-white/40 text-xs mt-0.5">{year}</p>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={prevMonth}
                            className="w-8 h-8 rounded-lg border border-white/15 bg-white/5 hover:bg-white/12 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Előző hónap"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="w-8 h-8 rounded-lg border border-white/15 bg-white/5 hover:bg-white/12 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Következő hónap"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Day-of-week labels */}
                <div className="grid grid-cols-7 px-5 mb-1">
                    {DOW_LABELS.map((d, i) => (
                        <div
                            key={i}
                            className={`text-center text-[10px] font-medium uppercase tracking-widest pb-2 ${i >= 5 ? 'text-accent/50' : 'text-white/30'}`}
                        >
                            {d}
                        </div>
                    ))}
                </div>

                {/* Day grid */}
                <div className="grid grid-cols-7 gap-y-0.5 px-5">
                    {Array.from({ length: startOffset }).map((_, i) => <div key={`empty-${i}`} />)}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                        const dow = (startOffset + day - 1) % 7;
                        const isWeekend = dow >= 5;
                        const hasEvents = getEventsForDay(day).length > 0;
                        const isToday = isCurrentMonth && day === today.getDate();
                        const isSelected =
                            selectedDate.getFullYear() === year &&
                            selectedDate.getMonth() === month &&
                            selectedDate.getDate() === day;

                        return (
                            <div key={day} className="flex items-center justify-center aspect-square">
                                <button
                                    onClick={() => setSelectedDate(new Date(year, month, day))}
                                    className={[
                                        "w-8 h-8 rounded-full text-xs font-medium flex flex-col items-center justify-center relative transition-all cursor-pointer",
                                        isSelected
                                            ? "bg-accent text-primary font-semibold"
                                            : isWeekend
                                                ? "text-accent/60 hover:bg-white/10 hover:text-accent"
                                                : "text-white/65 hover:bg-white/10 hover:text-white",
                                        isToday && !isSelected ? "ring-1 ring-white/30" : "",
                                    ].join(" ")}
                                >
                                    {day}
                                    {hasEvents && !isSelected && (
                                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Events panel */}
            <div className="bg-white">
                <p className="px-5 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    {selectedDateLabel}
                </p>

                {selectedDayEvents.length > 0 ? (
                    <div>
                        {selectedDayEvents.map(e => (
                            <div
                                key={e.id}
                                onClick={() => navigate(`/esemenyek/${e.slug}`)}
                                className="flex gap-3 items-start px-5 py-3 hover:bg-gray-50 cursor-pointer border-t border-gray-50 transition-colors group"
                            >
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-primary group-hover:text-accent transition-colors leading-snug line-clamp-2">
                                        {e.title}
                                    </p>
                                    <div className="flex gap-3 mt-1 text-[11px] text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Clock size={10} />
                                            {e.isAllDay
                                                ? "Egész napos"
                                                : new Date(e.startDate).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }) + " óra"}
                                        </span>
                                        {e.location && (
                                            <span className="flex items-center gap-1 truncate">
                                                <MapPin size={10} />
                                                <span className="truncate">{e.location}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="px-5 pb-5 text-xs text-gray-400 italic">
                        Ezen a napon nincs tervezett program.
                    </p>
                )}

                <div className="px-5 py-3 border-t border-gray-50">
                    <button
                        onClick={() => navigate('/esemenyek')}
                        className="text-[11px] font-semibold uppercase tracking-widest text-accent hover:text-primary transition-colors cursor-pointer"
                    >
                        Összes program →
                    </button>
                </div>
            </div>
        </div>
    );
};