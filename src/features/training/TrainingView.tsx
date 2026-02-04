import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, Search, Dumbbell, Timer } from 'lucide-react';
import SessionTimer from './SessionTimer';

interface Exercise {
    id: string;
    name: string;
    category: string;
}

import { useNavigate } from 'react-router-dom';

const TrainingView = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Timer State
    const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

    const [newExerciseName, setNewExerciseName] = useState('');
    const [newExerciseCategory, setNewExerciseCategory] = useState('Striking');

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const { data, error } = await supabase
                .from('exercises')
                .select('*')
                .order('name');

            if (error) throw error;
            if (data) setExercises(data);
        } catch (err) {
            console.error("Critical Training Error:", err);
            navigate('/'); // Fail safe redirect
        } finally {
            setLoading(false);
        }
    };

    const handleCreateExercise = async () => {
        if (!newExerciseName) return;

        const { data } = await supabase
            .from('exercises')
            .insert([{ name: newExerciseName, category: newExerciseCategory }])
            .select();

        if (data) {
            setExercises([...exercises, data[0]]);
            setIsCreating(false);
            setNewExerciseName('');
        }
    };

    const filteredExercises = exercises.filter(ex =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500 relative">

            {/* Timer Overlay */}
            {activeExercise && (
                <SessionTimer
                    exerciseName={activeExercise.name}
                    onClose={() => setActiveExercise(null)}
                />
            )}

            <header className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-heading font-black text-white italic uppercase tracking-wider">Training <span className="text-red-600">Log</span></h2>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Select Protocol</p>
                </div>
                <Button
                    size="icon"
                    onClick={() => setIsCreating(!isCreating)}
                    className="rounded-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                >
                    <Plus className="h-6 w-6 text-white" />
                </Button>
            </header>

            {/* Creation Form */}
            {isCreating && (
                <Card className="bg-neutral-900 border-blue-900/50 mb-6 animate-in slide-in-from-top-2">
                    <CardContent className="p-4 space-y-4">
                        <label className="text-xs font-bold text-blue-400 uppercase">New Exercise Name</label>
                        <input
                            type="text"
                            value={newExerciseName}
                            onChange={(e) => setNewExerciseName(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none font-bold"
                            placeholder="e.g. Flying Knee"
                        />

                        <div className="flex gap-2">
                            {['Striking', 'Grappling', 'BJJ', 'Conditioning'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setNewExerciseCategory(cat)}
                                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${newExerciseCategory === cat ? 'bg-blue-600 text-white' : 'bg-white/5 text-neutral-400'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <Button onClick={handleCreateExercise} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold uppercase">
                            Save to Database
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-500" />
                <input
                    type="text"
                    placeholder="Search database..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-neutral-900 border-none rounded-2xl py-3 pl-10 pr-4 text-white placeholder:text-neutral-600 focus:ring-1 focus:ring-blue-600/50"
                />
            </div>

            {/* Exercises List */}
            <div className="grid grid-cols-1 gap-3">
                {loading ? (
                    <div className="text-neutral-500 text-center py-10">Syncing with HQ...</div>
                ) : (
                    filteredExercises.map(exercise => (
                        <div
                            key={exercise.id}
                            onClick={() => setActiveExercise(exercise)}
                            className="group relative overflow-hidden rounded-xl bg-neutral-900/80 border border-white/5 p-4 flex items-center justify-between hover:border-blue-600/30 transition-colors cursor-pointer hover:bg-neutral-800"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${exercise.category === 'Striking' ? 'bg-red-500/10 text-red-500' :
                                    exercise.category === 'Grappling' ? 'bg-orange-500/10 text-orange-500' :
                                        exercise.category === 'BJJ' ? 'bg-purple-500/10 text-purple-500' :
                                            'bg-green-500/10 text-green-500'
                                    }`}>
                                    <Dumbbell className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white uppercase tracking-wide">{exercise.name}</h3>
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{exercise.category}</span>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" className="text-neutral-400 group-hover:text-blue-500 transition-colors">
                                <Timer className="h-5 w-5" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TrainingView;
