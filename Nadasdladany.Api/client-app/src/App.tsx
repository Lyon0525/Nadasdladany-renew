import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { HomePage } from './pages/HomePage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { CastlePage } from './pages/CastlePage';
import { MunicipalityPage } from './pages/MunicipalityPage';
import { InstitutionsPage } from './pages/InstitutionsPage';
import { InstitutionDetailPage } from './pages/InstitutionDetailPage';
import { ContactPage } from './pages/ContactPage';
import { GalleryPage } from './pages/GalleryPage';
import { AlbumDetailPage } from './pages/AlbumDetailPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { AdminNewsPage } from './pages/admin/AdminNewsPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminDocumentsPage } from './pages/admin/AdminDocumentsPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ProjectsPage } from './pages/ProjectsPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { ElectionsPage } from './pages/ElectionsPage';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { AdminInstitutionsPage } from './pages/admin/AdminInstitutionsPage';
import { AdminOrganizationsPage } from './pages/admin/AdminOrganizationsPage';
import { CareersPage } from './pages/CareersPage';
import { AdminCareersPage } from './pages/admin/AdminCareersPage';
import { EAdministrationPage } from './pages/admin/EAdministrationPage';
import { AdminNewsletterPage } from './pages/admin/AdminNewsletterPage';
import { PublicDataRequestPage } from './pages/PublicDataRequestPage';
import { AdminDataRequestsPage } from './pages/admin/AdminDataRequestsPage';
import { OfficePage } from './pages/OfficePage';
import { LegalPage } from './pages/LegalPage';
import { AdminWelcomePage } from './pages/admin/AdminWelcomePage';
import { NewsPage } from './pages/NewsPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { RepresentativeDetailPage } from './pages/RepresentativeDetailPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { AdminElectionsPage } from './pages/admin/AdminElectionsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AboutTownPage } from './pages/AboutTownPage';
import { AdminMapPage } from './pages/admin/AdminMapPage';
import { AdminRepresentativesPage } from './pages/admin/AdminRepresentativesPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminOfficePage } from './pages/admin/AdminOfficePage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

function App() {
    return (
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <ErrorBoundary>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/hirek/:slug" element={<NewsDetailPage />} />
                                <Route path="/hirek" element={<NewsPage />} />
                                <Route path="/kastely" element={<CastlePage />} />
                                <Route path="/onkormanyzat" element={<MunicipalityPage />} />
                                <Route path="/intezmenyek" element={<InstitutionsPage />} />
                                <Route path="/intezmenyek/:slug" element={<InstitutionDetailPage />} />
                                <Route path="/kapcsolat" element={<ContactPage />} />
                                <Route path="/onkormanyzat" element={<MunicipalityPage />} />
                                <Route path="/onkormanyzat/:id" element={<RepresentativeDetailPage />} />
                                <Route path="/galeria" element={<GalleryPage />} />
                                <Route path="/galeria/:slug" element={<AlbumDetailPage />} />
                                <Route path="/esemenyek" element={<EventsPage />} />
                                <Route path="/esemenyek/:slug" element={<EventDetailPage />} />
                                <Route path="/admin/login" element={<LoginPage />} />
                                <Route path="/palyazatok" element={<ProjectsPage />} />
                                <Route path="/valasztasok" element={<ElectionsPage />} />
                                <Route path="/kozossegek" element={<OrganizationsPage />} />
                                <Route path="/allasok" element={<CareersPage />} />
                                <Route path="/ugyintezes" element={<EAdministrationPage />} />
                                <Route path="/kozerdeku-adatigenyles" element={<PublicDataRequestPage />} />
                                <Route path="/hivatal" element={<OfficePage />} />
                                <Route path="/jogi-nyilatkozatok" element={<LegalPage />} />
                                <Route path="/dokumentumok" element={<DocumentsPage />} />
                                <Route path="/a-kozsegrol" element={<AboutTownPage />} />

                                <Route element={<ProtectedRoute />}>
                                    <Route path="/admin/dashboard" element={<DashboardPage />} />
                                    <Route path="/admin/news" element={<AdminNewsPage />} />
                                    <Route path="/admin/events" element={<AdminEventsPage />} />
                                    <Route path="/admin/documents" element={<AdminDocumentsPage />} />
                                    <Route path="/admin/gallery" element={<AdminGalleryPage />} />
                                    <Route path="/admin/projects" element={<AdminProjectsPage />} />
                                    <Route path="/admin/careers" element={<AdminCareersPage />} />
                                    <Route path="/admin/institutions" element={<AdminInstitutionsPage />} />
                                    <Route path="/admin/organizations" element={<AdminOrganizationsPage />} />
                                    <Route path="/admin/newsletter" element={<AdminNewsletterPage />} />
                                    <Route path="/admin/data-requests" element={<AdminDataRequestsPage />} />
                                    <Route path="/admin/welcome" element={<AdminWelcomePage />} />
                                    <Route path="/admin/elections" element={<AdminElectionsPage />} />
                                    <Route path="/admin/users" element={<AdminUsersPage />} />
                                    <Route path="/admin/map" element={<AdminMapPage />} />
                                    <Route path="/admin/representatives" element={<AdminRepresentativesPage />} />
                                    <Route path="/admin/messages" element={<AdminMessagesPage />} />
                                    <Route path="/admin/office" element={<AdminOfficePage />} />
                                </Route>
                            </Routes>

                            <Toaster position="bottom-right" reverseOrder={false} />
                        </BrowserRouter>
                    </ErrorBoundary>
                </AuthProvider>
            </QueryClientProvider>
        </HelmetProvider>
    );
}

export default App;