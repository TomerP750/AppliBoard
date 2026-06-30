import { Outlet } from "react-router-dom";


export function Panel() {
    return (
        <section className="min-h-screen flex-1">
            <Outlet />
        </section>
    )
}