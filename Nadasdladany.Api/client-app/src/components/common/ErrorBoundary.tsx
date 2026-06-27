import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                    <div className="bg-white p-10 md:p-14 rounded-[40px] shadow-xl border border-gray-100 max-w-lg text-center animate-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[24px] flex items-center justify-center mx-auto mb-8 rotate-12">
                            <AlertTriangle size={40} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-primary mb-4">Hoppá! Hiba történt.</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                            Váratlan technikai hiba lépett fel az oldal megjelenítése közben. Elnézést kérünk a kellemetlenségért!
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-accent transition-all shadow-md cursor-pointer"
                            >
                                <RefreshCw size={18} />
                                Oldal frissítése
                            </button>
                            <a
                                href="/"
                                className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-500 font-bold px-8 py-4 rounded-2xl hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                <Home size={18} />
                                Vissza a főoldalra
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}