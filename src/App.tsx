import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MobileLayout } from './layouts/MobileLayout';
import DashboardView from './features/dashboard/DashboardView';
import LoginView from './features/auth/LoginView';
import { AuthProvider, useAuth } from './context/AuthContext';
import TrainingView from './features/training/TrainingView';
import ProfileView from './features/profile/ProfileView';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    // Simple loading state
    if (loading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-blue-600 font-bold uppercase tracking-widest animate-pulse">Loading Proxy297...</div>;
    if (!user) return <Navigate to="/login" />;
    return <>{children}</>;
};

const AppRoutes = () => {
    const location = useLocation();

    return (
        <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <MobileLayout />
                </ProtectedRoute>
            }>
                {/* Key forces remount on navigation - BRUTE FORCE STABILITY */}
                <Route index element={<DashboardView key={location.pathname} />} />
                <Route path="training" element={<TrainingView key={location.pathname} />} />
                <Route path="profile" element={<ProfileView key={location.pathname} />} />
            </Route>
        </Routes>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
