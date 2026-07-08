import { Link } from "react-router-dom";


export function NotFoundPage() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center
        bg-zinc-100 dark:bg-dark-background">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,_transparent_1px),linear-gradient(90deg,_rgba(255,255,255,0.035)_1px,_transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,_black_35%,_transparent_75%)]" />

            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_50%)]" />
                <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>

            <div className="flex flex-col gap-5 items-center justify-center">
                <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-50">404 - Page Not Found</h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">The page you are looking for does not exist.</p>
                <Link to="/" className="z-50 cursor-pointer border rounded-lg px-4 py-2 text-blue-500 hover:text-blue-600">Go to home</Link>
            </div>
        </section>
    )
}