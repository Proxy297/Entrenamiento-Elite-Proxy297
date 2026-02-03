import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Moon, Battery, Activity } from 'lucide-react';

interface DailyCheckInProps {
    onComplete: () => void;
}

const DailyCheckIn = ({ onComplete }: DailyCheckInProps) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        sleep_hours: 7,
        soreness_level: 3, // 1-10 (1 = Fresh, 10 = Broken)
        energy_level: 7    // 1-10 (1 = Dead, 10 = Beast)
    });

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);

        const { error } = await supabase.from('daily_status').upsert([{
            user_id: user.id,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            sleep_hours: data.sleep_hours,
            soreness_level: data.soreness_level,
            energy_level: data.energy_level
        }], { onConflict: 'user_id,date' });

        if (!error) {
            onComplete();
        } else {
            console.error(error);
            alert(`Error syncing status: ${error.message} (${error.details || error.hint || ''})`);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-neutral-950 flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-transparent"></div>

            <Card className="w-full max-w-md bg-neutral-900 border-white/10 shadow-2xl">
                <CardContent className="p-6 space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-heading font-black text-white italic uppercase tracking-wider">Morning <span className="text-blue-600">Report</span></h2>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Protocol 297: Status Check</p>
                    </div>

                    {/* Sleep */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-white">
                            <div className="flex items-center gap-2 text-sm font-bold uppercase">
                                <Moon className="h-4 w-4 text-blue-400" /> Sleep
                            </div>
                            <span className="text-2xl font-black text-blue-500">{data.sleep_hours} <span className="text-xs text-neutral-500">hrs</span></span>
                        </div>
                        <input
                            type="range" min="0" max="12" step="0.5"
                            value={data.sleep_hours}
                            onChange={(e) => setData({ ...data, sleep_hours: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    {/* Soreness */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-white">
                            <div className="flex items-center gap-2 text-sm font-bold uppercase">
                                <Activity className="h-4 w-4 text-red-400" /> Soreness
                            </div>
                            <span className="text-2xl font-black text-red-500">{data.soreness_level} <span className="text-xs text-neutral-500">/ 10</span></span>
                        </div>
                        <input
                            type="range" min="1" max="10"
                            value={data.soreness_level}
                            onChange={(e) => setData({ ...data, soreness_level: parseInt(e.target.value) })}
                            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                        />
                        <div className="flex justify-between text-[10px] text-neutral-500 font-bold uppercase">
                            <span>Fresh</span>
                            <span>Injured</span>
                        </div>
                    </div>

                    {/* Energy */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-white">
                            <div className="flex items-center gap-2 text-sm font-bold uppercase">
                                <Battery className="h-4 w-4 text-green-400" /> Energy
                            </div>
                            <span className="text-2xl font-black text-green-500">{data.energy_level} <span className="text-xs text-neutral-500">/ 10</span></span>
                        </div>
                        <input
                            type="range" min="1" max="10"
                            value={data.energy_level}
                            onChange={(e) => setData({ ...data, energy_level: parseInt(e.target.value) })}
                            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full h-14 bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-widest text-lg"
                    >
                        {loading ? 'Syncing...' : 'Submit Report'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default DailyCheckIn;
