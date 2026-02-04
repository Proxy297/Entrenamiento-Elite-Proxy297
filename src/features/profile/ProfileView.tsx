import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Swords, HandMetal, PersonStanding, Save, Activity } from 'lucide-react';

const SkillsView = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'striking' | 'grappling' | 'bjj'>('striking');
    const [loading, setLoading] = useState(false);

    // Form States
    const [scores, setScores] = useState({
        striking_accuracy: 50,
        grappling_control: 50,
        bjj_submission_rate: 50,
        notes: ''
    });

    const getActiveScore = () => {
        switch (activeTab) {
            case 'striking': return scores.striking_accuracy;
            case 'grappling': return scores.grappling_control;
            case 'bjj': return scores.bjj_submission_rate;
            default: return 0;
        }
    };

    const activeScore = getActiveScore();
    const handleSave = async () => {
        if (!user) return;
        setLoading(true);

        const { error } = await supabase.from('skills_assessments').insert([{
            user_id: user.id,
            striking_accuracy: scores.striking_accuracy,
            grappling_control: scores.grappling_control,
            bjj_submission_rate: scores.bjj_submission_rate,
            notes: scores.notes
        }]);

        if (!error) {
            alert('Assessment Saved');
            setScores({ ...scores, notes: '' });
        } else {
            alert('Error saving assessment');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            <header className="mb-6">
                <h2 className="text-2xl font-heading font-black text-white italic uppercase tracking-wider">Skills <span className="text-blue-600">Eval</span></h2>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Performance Metrics</p>
            </header>

            {/* Tabs */}
            <div className="flex bg-neutral-900/50 p-1 rounded-xl border border-white/5">
                {[
                    { id: 'striking', icon: Swords, label: 'Striking' },
                    { id: 'grappling', icon: PersonStanding, label: 'Grappling' },
                    { id: 'bjj', icon: HandMetal, label: 'BJJ' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg text-xs font-bold uppercase transition-all duration-300 ${activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                            : 'text-neutral-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon className="h-5 w-5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Evaluation Card */}
            <Card className="bg-neutral-900 border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 bg-blue-600/10 blur-[40px] rounded-full"></div>

                <CardContent className="p-6 space-y-8 relative z-10">

                    {/* Dynamic Slider based on Tab - Fixed with key for reconciliation */}
                    <div className="space-y-4" key={activeTab}>
                        <div className="flex justify-between items-center text-white">
                            <span className="font-bold uppercase tracking-wider text-sm">
                                {activeTab === 'striking' && 'Accuracy & Output'}
                                {activeTab === 'grappling' && 'Control Time'}
                                {activeTab === 'bjj' && 'Submission Efficiency'}
                            </span>
                            <span className="font-heading font-black text-2xl text-blue-500">
                                {activeScore}
                                <span className="text-sm text-neutral-500">%</span>
                            </span>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={activeScore}
                            onChange={(e) => setScores({
                                ...scores,
                                [activeTab === 'striking' ? 'striking_accuracy' : activeTab === 'grappling' ? 'grappling_control' : 'bjj_submission_rate']: parseInt(e.target.value)
                            })}
                            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500"
                        />
                        <div className="flex justify-between text-[10px] text-neutral-500 font-bold uppercase">
                            <span>Poor</span>
                            <span>Elite</span>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-400 uppercase">Technical Notes</label>
                        <textarea
                            value={scores.notes}
                            onChange={(e) => setScores({ ...scores, notes: e.target.value })}
                            className="w-full h-24 bg-black/50 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-blue-500 outline-none resize-none"
                            placeholder={`Describe your ${activeTab} performance...`}
                        />
                    </div>

                    <Button onClick={handleSave} disabled={loading} className="w-full h-12 bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                        {loading ? <Activity className="animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                        Save Session Log
                    </Button>

                </CardContent>
            </Card>

        </div>
    );
};

export default SkillsView;
