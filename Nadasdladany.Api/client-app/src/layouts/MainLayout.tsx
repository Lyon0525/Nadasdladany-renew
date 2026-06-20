import { type ReactNode } from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { DynamicBackground } from '../components/common/DynamicBackground';
import { CookieBanner } from '../components/common/CookieBanner';

interface Props {
    children: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <DynamicBackground />
            <Navbar />
            <main className="flex-grow pt-24 w-full">
                {children}
            </main>
            <CookieBanner />
            <Footer />
        </div>
    );
};