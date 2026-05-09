// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Publikus oldalak (ezek valószínűleg közvetlenül a /pages mappában vannak)
import { HomePage } from './pages/HomePage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { CastlePage } from './pages/CastlePage';
import { MunicipalityPage } from './pages/MunicipalityPage';
import { InstitutionsPage } from './pages/InstitutionsPage';
import { ContactPage } from './pages/ContactPage';
import { GalleryPage } from './pages/GalleryPage';
import { AlbumDetailPage } from './pages/AlbumDetailPage';
import { LoginPage } from './pages/LoginPage';

// Admin oldalak - JAVÍTÁS: elérési út kiegészítve az 'admin' mappával
import { DashboardPage } from './pages/admin/DashboardPage';
import { AdminNewsPage } from './pages/admin/AdminNewsPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';

import { ProtectedRoute } from './components/common/ProtectedRoute';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Publikus oldalak */}
          <Route path="/" element={<HomePage />} />
          <Route path="/hirek/:slug" element={<NewsDetailPage />} />
          <Route path="/kastely" element={<CastlePage />} />
          <Route path="/onkormanyzat" element={<MunicipalityPage />} />
          <Route path="/intezmenyek" element={<InstitutionsPage />} />
          <Route path="/kapcsolat" element={<ContactPage />} />
          <Route path="/galeria" element={<GalleryPage />} />
          <Route path="/galeria/:slug" element={<AlbumDetailPage />} />
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Védett admin oldalak */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/news" element={<AdminNewsPage />} />
            <Route path="/admin/events" element={<AdminEventsPage />} />
            <Route path="/admin/gallery" element={<AdminGalleryPage />} />
          </Route>
        </Routes>

        <Toaster position="bottom-right" reverseOrder={false} />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;