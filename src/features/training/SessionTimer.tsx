import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RefreshCw, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

interface SessionTimerProps {
    exerciseName: string;
    onClose: () => void;
}

const SessionTimer = ({ exerciseName, onClose }: SessionTimerProps) => {
    if (!exerciseName) return null; // Safety check

    // Mounted Check Pattern
    const isMounted = useRef(true);
    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    const [timeLeft, setTimeLeft] = useState(180); // Default 3 mins
    const [isActive, setIsActive] = useState(false);
    const [isResting, setIsResting] = useState(false);
    const [round, setRound] = useState(1);

    // Settings
    const [workTime, setWorkTime] = useState(180);
    const [restTime, setRestTime] = useState(60);

    // Timer Tick Effect
    useEffect(() => {
        let interval: any = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                if (isMounted.current) {
                    setTimeLeft((prev) => prev - 1);
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]); // timeLeft is needed here to stop interval at 0

    // Round Transition Effect
    useEffect(() => {
        if (timeLeft === 0 && isActive) {
            if (isResting) {
                // End of Rest -> Start Work
                setIsResting(false);
                setTimeLeft(workTime);
                setRound(r => r + 1);
            } else {
                // End of Work -> Start Rest
                setIsResting(true);
                setTimeLeft(restTime);
            }
        }
    }, [timeLeft, isActive, isResting, workTime, restTime]);

    /* 
       BETTER APPROACH for Timer Stability:
       Split the 'tick' from the 'time check'. 
    */

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setIsResting(false);
        setTimeLeft(workTime);
        setRound(1);
    };

    return (
        <div id="session-timer-container" className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" suppressHydrationWarning={true}>
            <Card className="w-full max-w-sm bg-neutral-900 border-blue-900/50 relative overflow-hidden">
                <div className="p-6 flex flex-col items-center gap-6">
                    {/* Heder */}
                    <div className="w-full flex justify-between items-center bg-transparent">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Exercise</span>
                            <span className="text-xl font-heading font-black text-white italic uppercase">{exerciseName}</span>
                        </div>
                        <Button onClick={onClose} variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Timer Display */}
                    <div className={`relative h-64 w-64 rounded-full flex items-center justify-center border-8 ${isResting ? 'border-green-500/30' : 'border-blue-600/30'}`}>
                        <div className={`absolute inset-0 rounded-full border-8 ${isResting ? 'border-green-500' : 'border-blue-600'} transition-all duration-1000`}
                            style={{ clipPath: `inset(0 0 0 0)` }}></div>

                        <div className="flex flex-col items-center z-10">
                            <span className={`text-6xl font-heading font-black italic tracking-tighter ${isResting ? 'text-green-500' : 'text-blue-500'}`}>
                                {formatTime(timeLeft)}
                            </span>
                            <span className="text-xs font-bold uppercase text-white tracking-[0.2em] mt-2">
                                {isResting ? 'Rest Period' : `Round ${round}`}
                            </span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4 w-full">
                        <Button
                            onClick={toggleTimer}
                            className={`flex-1 h-14 text-lg font-bold uppercase tracking-widest ${isActive ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-blue-600 hover:bg-blue-500'} text-white shadow-lg`}
                        >
                            {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                            {isActive ? 'Pause' : 'Start'}
                        </Button>
                        <Button onClick={resetTimer} variant="outline" className="h-14 w-14 border-white/10 bg-white/5 hover:bg-white/10">
                            <RefreshCw className="h-5 w-5 text-neutral-400" />
                        </Button>
                    </div>

                    {/* Settings Quick Select */}
                    {!isActive && (
                        <div className="flex flex-col gap-2 w-full pt-4 border-t border-white/5">
                            <span className="text-xs font-bold text-neutral-500 uppercase">Work Time</span>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => { setWorkTime(180); setTimeLeft(180); }} className={`p-2 rounded text-[10px] font-bold uppercase transition ${workTime === 180 ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-blue-900/40'}`}>3 Min</button>
                                <button onClick={() => { setWorkTime(300); setTimeLeft(300); }} className={`p-2 rounded text-[10px] font-bold uppercase transition ${workTime === 300 ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-blue-900/40'}`}>5 Min</button>
                                <button onClick={() => { setWorkTime(60); setTimeLeft(60); }} className={`p-2 rounded text-[10px] font-bold uppercase transition ${workTime === 60 ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-blue-900/40'}`}>1 Min</button>
                            </div>

                            <span className="text-xs font-bold text-neutral-500 uppercase mt-2">Rest Time</span>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => setRestTime(60)} className={`p-2 rounded text-[10px] font-bold uppercase transition ${restTime === 60 ? 'bg-green-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-green-900/40'}`}>60s Rest</button>
                                <button onClick={() => setRestTime(30)} className={`p-2 rounded text-[10px] font-bold uppercase transition ${restTime === 30 ? 'bg-green-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-green-900/40'}`}>30s Rest</button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default SessionTimer;
