
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Startups from "@/pages/Startups";
import Announcements from "@/pages/Announcements";
import Events from "@/pages/Events";
import Meetings from "@/pages/Meetings";
import RecordMOM from "@/pages/RecordMOM";
import Requests from "@/pages/Requests";
import NotFound from "@/pages/NotFound";
import LandingPage from "@/pages/LandingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <SonnerToaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/startups" element={<Startups />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/events" element={<Events />} />
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/record-mom" element={<RecordMOM />} />
              <Route path="/requests" element={<Requests />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
