import { Panel } from "./Panel";
import { Sidebar } from "./sidebar/Sidebar";



export function DashboardLayout() {
    return (
        <main className="min-h-screen bg-dark-background flex">

            <Sidebar />
            <Panel />

        </main>
    )
}