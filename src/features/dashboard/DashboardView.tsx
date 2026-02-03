import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { AlertTriangle, PlayCircle } from 'lucide-react';
import DailyCheckIn from './DailyCheckIn';
import { useNavigate } from 'react-router-dom';

const DashboardView = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [needsCheckIn, setNeedsCheckIn] = useState(false);

    const [stats, setStats] = useState({
        readiness: 0,
        weeklySessions: 0,
        todayStatus: null as any
    });

    useEffect(() => {
        if (user) loadDashboardData();
    }, [user]);

    const loadDashboardData = async () => {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];

        // 1. Check Daily Status
        const { data: statusData } = await supabase
            .from('daily_status')
            .select('*')
            .eq('user_id', user?.id)
            .eq('date', today)
            .single();

        if (!statusData) {
            setNeedsCheckIn(true);
        } else {
            setNeedsCheckIn(false);
            // Calculate Readiness (Simple Algo)
            // Sleep (0-12) + Energy (0-10) - Soreness (0-10) => Map to 0-100
            // Ideal: 8h sleep + 10 energy - 0 soreness = 12 + 10 = 22. 
            // Worst: 0h sleep + 0 energy - 10 soreness = -10.
            // Range approx 30 points.
            let rawScore = (statusData.sleep_hours * 1.5) + statusData.energy_level - (statusData.soreness_level * 1.2);
            // Normalize roughly to 0-100. 
            // Max typical: (9 * 1.5) + 8 - 2 = 13.5 + 6 = 19.5 -> ~95%
            // Min typical: (4 * 1.5) + 3 - 8 = 6 + 3 - 8 = 1 -> ~5%
            let readiness = Math.min(100, Math.max(0, (rawScore / 20) * 100));

            setStats(prev => ({ ...prev, readiness: Math.round(readiness), todayStatus: statusData }));
        }

        // 2. Weekly Sessions Count
        // (Simplified for now, just counting rows in training_sessions)
        const { count } = await supabase
            .from('training_sessions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user?.id);

        setStats(prev => ({ ...prev, weeklySessions: count || 0 }));
        setLoading(false);
    };

    const getTrafficLight = (score: number) => {
        if (score >= 80) return { color: 'text-green-500', bg: 'bg-green-500', label: 'ELITE' };
        if (score >= 50) return { color: 'text-yellow-500', bg: 'bg-yellow-500', label: 'READY' };
        return { color: 'text-red-500', bg: 'bg-red-500', label: 'RECOVER' };
    };

    const statusColor = getTrafficLight(stats.readiness);

    if (loading) return <div className="p-6 text-neutral-500 animate-pulse uppercase font-bold text-xs text-center mt-20">Syncing Biometrics...</div>;

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-700">

            {/* Check In Overlay */}
            {needsCheckIn && <DailyCheckIn onComplete={loadDashboardData} />}

            {/* Header Status */}
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Current Status</p>
                    <h1 className={`text-4xl font-heading font-black italic ${statusColor.color} drop-shadow-md`}>
                        {needsCheckIn ? 'PENDING' : statusColor.label}
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Readiness</p>
                    <div className="flex items-baseline justify-end gap-1">
                        <span className="text-4xl font-heading font-black text-white">{needsCheckIn ? '--' : stats.readiness}</span>
                        <span className="text-sm font-bold text-neutral-600">%</span>
                    </div>
                </div>
            </div>

            {/* Quick Action */}
            <Button
                onClick={() => navigate('/training')}
                className="w-full h-16 bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/20 group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-100 group-hover:opacity-90 transition-opacity"></div>
                <div className="relative flex items-center gap-3">
                    <PlayCircle className="h-6 w-6 text-white fill-white/20" />
                    <span className="text-lg font-heading font-black italic text-white tracking-widest uppercase">Start Session</span>
                </div>
            </Button>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-neutral-900/50 border-white/5 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Weekly Load</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-heading font-black text-white">{stats.weeklySessions}</span>
                            <span className="text-xs font-bold text-neutral-600 mb-1.5">Sessions</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-neutral-900/50 border-white/5 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Pain Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className={`text-3xl font-heading font-black ${stats.todayStatus?.soreness_level > 5 ? 'text-red-500' : 'text-green-500'}`}>
                                {stats.todayStatus?.soreness_level || '-'}
                            </span>
                            <span className="text-xs font-bold text-neutral-600 mb-1.5">/ 10</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Intelligence Report */}
            {!needsCheckIn && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-blue-500" />
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest">Intelligence Report</h3>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                        <p className="text-sm text-neutral-300 font-medium leading-relaxed">
                            {stats.readiness > 80
                                ? "System primed. Hormonal and neuromuscular markers suggests peak output capability. Recommended: High-intensity intervals or heavy load."
                                : stats.readiness > 50
                                    ? "Baseline stability maintained. Moderate fatigue detected in peripheral nervous system. Focus on technical refinement."
                                    : "CRITICAL: Systemic overload imminent. Cortisol/Testosterone ratio unfavorable. Mandatory active recovery or mobility work."
                            }
                        </p>
                        <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${statusColor.bg} transition-all duration-1000`}
                                style={{ width: `${stats.readiness}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardView;
