import { Panel } from "./Panel";
import { Sidebar } from "./sidebar/Sidebar";
import { DeviceMenu } from "./DeviceMenu";



export function DashboardLayout() {
    return (
        <main className="min-h-screen bg-dark-background flex">

            <Sidebar />
            <DeviceMenu />
            <Panel />

        </main>
    )
}