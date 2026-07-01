import { NavLink } from "react-router-dom";

export function Hero() {
    return (
        <header className="relative min-h-screen overflow-hidden bg-dark-background px-6 md:px-10">

            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_50%)]" />
                <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>

            <div className="relative z-10">

                {/* NAVBAR */}
                <div className="w-full h-20 md:h-24 flex items-center justify-between text-white">
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                        AppliBoard
                    </h1>
                    
                     <NavLink
                        to={"/dashboard"}
                        
                    >
                        Dashboard
                    </NavLink>


                    <NavLink
                        to={"/auth/login"}
                        className="text-sm md:text-base bg-white/5 py-2 px-4 rounded-lg
                        border border-white/10 backdrop-blur-md
                        hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                    >
                        Login
                    </NavLink>
                </div>

                {/* HERO CONTENT */}
                <section className="flex flex-col items-start justify-center min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-7rem)]">

                    <div className="max-w-2xl">

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            <span className="bg-linear-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                                Track your job applications
                            </span>
                            <br />
                            <span className="text-white/90">
                                with clarity and control
                            </span>
                        </h1>

                        <p className="mt-5 text-white/60 text-sm md:text-base max-w-lg leading-relaxed">
                            Organize applications, follow up on interviews, and stay consistent with your job search in one clean workspace.
                        </p>

                        <div className="mt-7">
                            <NavLink
                                to="/auth/signup"
                                className="bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm md:text-base"
                            >
                                Get Started
                            </NavLink>
                        </div>

                    </div>

                </section>
            </div>
        </header>
    );
}