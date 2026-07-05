import { NavLink, Outlet } from "react-router-dom";


export function AuthPanel() {

    return (
        <main className="relative min-h-screen overflow-hidden bg-dark-background bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_34%)] px-4 py-8 sm:px-6 lg:px-10">

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,_transparent_1px),linear-gradient(90deg,_rgba(255,255,255,0.035)_1px,_transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,_black_35%,_transparent_75%)]" />

            <div className="absolute z-10">
                <NavLink to="/">
                    <h1 className="dark:text-white text-xl md:text-2xl font-semibold tracking-tight">
                        AppliBoard
                    </h1>
                </NavLink>
            </div>

            <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
                <Outlet />
            </div>

        </main>
    )

}