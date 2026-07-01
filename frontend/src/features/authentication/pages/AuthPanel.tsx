import { NavLink, Outlet } from "react-router-dom";


export function AuthPanel() {

    return (
        <main className="min-h-screen bg-dark-background px-4 py-8 sm:px-6 lg:px-8">

            <div className="absolute">
                <NavLink to="/">
                    <h1 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        AppliBoard
                    </h1>
                </NavLink>
            </div>

            <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
                <Outlet />
            </div>

        </main>
    )

}