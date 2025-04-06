import { createRoot } from 'react-dom/client'
import { AnnouncementsProvider } from './contexts/AnnouncementContext.tsx';
import { EventsProvider } from './contexts/EventsContext.tsx';
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx';
import { StartupAuthProvider } from './contexts/StartupAuthContext.tsx';

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
        
        <AnnouncementsProvider>
            <EventsProvider>
                <App />
            </EventsProvider>
        </AnnouncementsProvider>
        
    </AuthProvider>
);
