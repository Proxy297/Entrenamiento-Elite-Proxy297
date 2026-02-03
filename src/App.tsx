import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginView />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <MobileLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<DashboardView />} />
                        <Route path="training" element={<TrainingView />} />
                        <Route path="profile" element={<ProfileView />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
