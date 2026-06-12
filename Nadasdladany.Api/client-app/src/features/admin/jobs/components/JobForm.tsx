import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { RichTextEditor } from '../../../../components/ui/RichTextEditor';

interface Props {
    onClose: () => void;
    onSubmit: (jobData: any) => void;
    loading: boolean;
}

export const JobForm = ({ onClose, onSubmit, loading }: Props) => {
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [employmentType, setEmploymentType] = useState('Közalkalmazotti jogviszony');
    const [location, setLocation] = useState('8145 Nádasdladány, Fő utca 1.');
    const [applicationDeadline, setApplicationDeadline] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('<p>Írja ide a pályázati felhívást, az elvárt végzettségeket, és a benyújtandó dokumentumok listáját...</p>');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSubmit({
            title,
            department: department || null,
            employmentType: employmentType || null,
            location: location || null,
            applicationDeadline: applicationDeadline ? new Date(applicationDeadline).toISOString() : null,
            excerpt: excerpt || null,
            content
        });
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-end bg-primary/40 backdrop-blur-md">
            <div className="w-full max-w-3xl h-full bg-white shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary">Új álláshirdetés rögzítése</h2>
                        <p className="text-gray-400 text-sm mt-1">Hirdessen meg új intézményi vagy hivatali pozíciót.</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 hover:bg-secondary rounded-full text-primary/50 hover:text-primary transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Munkakör megnevezése</label>
                        <input
                            type="text" required
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium"
                            placeholder="Pl. Óvodapedagógus / Hivatali ügyintéző"
                            value={title} onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Intézmény / Szervezeti egység</label>
                            <input
                                type="text" placeholder="Pl. Nádasdladányi Sün Balázs Óvoda"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                value={department} onChange={(e) => setDepartment(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Foglalkoztatás formája / Jogviszony</label>
                            <input
                                type="text" placeholder="Pl. Közalkalmazotti jogviszony / Teljes munkaidő"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Munkavégzés helye</label>
                            <input
                                type="text"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                value={location} onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Jelentkezési határidő (Opcionális)</label>
                            <input
                                type="date"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm text-primary"
                                value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Rövid kivonat (Összefoglaló a listaoldalra)</label>
                        <textarea
                            rows={2} maxLength={300}
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                            placeholder="A pozíció lényegének egy-két mondatos összefoglalása..."
                            value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Részletes pályázati kiírás és feltételek</label>
                        <RichTextEditor content={content} onChange={(html: string) => setContent(html)} />
                    </div>

                    <div className="fixed bottom-0 right-0 w-full max-w-3xl p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-colors">Mégse</button>
                        <button
                            type="submit" disabled={loading}
                            className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Pályázat közzététele</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};