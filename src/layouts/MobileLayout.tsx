import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, User } from 'lucide-react';
import logo from '../assets/logo.png';

export const MobileLayout = () => {
    return (
        // Phone Container Wrapper for Desktop View
        <div className="min-h-screen bg-neutral-950 flex justify-center items-center font-sans tracking-tight">
            <div className="w-full max-w-[450px] bg-background min-h-screen relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border-x border-white/5 flex flex-col">

                {/* Header - XXL Logo */}
                <header className="fixed top-0 w-full max-w-[450px] z-50 h-28 border-b border-white/5 bg-background/90 backdrop-blur-xl flex items-center px-6 justify-between shadow-2xl shadow-black/80">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Logo" className="h-[4.5rem] w-auto object-contain drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
                        <div className="flex items-baseline whitespace-nowrap">
                            <span className="font-heading font-black text-2xl tracking-[0.15em] text-white italic leading-none">PROXY</span>
                            <span className="font-heading font-black text-2xl tracking-[0.15em] text-blue-600 italic leading-none">297</span>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 pt-32 pb-24 px-5 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background hide-scrollbar">
                    <Outlet />
                </main>

                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 w-full max-w-[450px] z-50 h-[5.5rem] border-t border-white/5 bg-background/95 backdrop-blur-lg pb-4">
                    <div className="flex h-full items-center justify-around px-2">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300 ${isActive ? 'text-blue-500 scale-110 drop-shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'text-neutral-500 hover:text-white'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <LayoutDashboard size={26} strokeWidth={isActive ? 2.5 : 1.5} />
                                    <span className="text-[9px] uppercase font-black tracking-[0.2em]">Home</span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/training"
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300 ${isActive ? 'text-red-500 scale-110 drop-shadow-[0_0_10px_rgba(220,38,38,0.4)]' : 'text-neutral-500 hover:text-white'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Dumbbell size={26} strokeWidth={isActive ? 2.5 : 1.5} />
                                    <span className="text-[9px] uppercase font-black tracking-[0.2em]">Train</span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300 ${isActive ? 'text-blue-500 scale-110 drop-shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'text-neutral-500 hover:text-white'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <User size={26} strokeWidth={isActive ? 2.5 : 1.5} />
                                    <span className="text-[9px] uppercase font-black tracking-[0.2em]">Profile</span>
                                </>
                            )}
                        </NavLink>
                    </div>
                </nav>
            </div>
        </div>
    );
};
