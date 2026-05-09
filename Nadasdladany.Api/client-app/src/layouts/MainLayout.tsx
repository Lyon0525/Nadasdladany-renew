import { type ReactNode } from 'react'; // Fix: 'type' kulcsszó hozzáadva
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { DynamicBackground } from '../components/common/DynamicBackground';

interface Props {
    children: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
    return (
        <div className="flex flex-col min-h-screen">
            <DynamicBackground />
            <Navbar />
            <main className="flex-grow pt-24">
                {children}
            </main>
            <Footer />
        </div>
    );
};