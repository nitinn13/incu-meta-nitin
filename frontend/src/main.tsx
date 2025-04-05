import { createRoot } from 'react-dom/client'
import { AnnouncementsProvider } from './contexts/AnnouncementContext.tsx';
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx';

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
        <AnnouncementsProvider>
        <App />
        </AnnouncementsProvider>
    </AuthProvider>
);
