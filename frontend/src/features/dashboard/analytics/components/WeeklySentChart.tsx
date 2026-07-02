import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AnalyticsDto } from "../models/AnalyticsDto";

// dummy data sun-saturday
const data = [
    { name: "Sunday", sent: 5 },
    { name: "Monday", sent: 20 },
    { name: "Tuesday", sent: 30 },
    { name: "Wednesday", sent: 40 },
    { name: "Thursday", sent: 50 },
    { name: "Friday", sent: 60 },
    { name: "Saturday", sent: 70 },
];

interface WeeklySentChartProps {
    analytics: AnalyticsDto;
}

export function WeeklySentChart() {

    return (
        <figure className="w-full h-85 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20 }}>
                    <XAxis dataKey="name" tickMargin={10} />
                    <YAxis label={{ value: "Sent", position: "top", offset: 10 }} />
                    <CartesianGrid stroke="#ccc"  />
                    <Tooltip />
                    <Line type="monotone" dataKey="sent" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </figure>
    );
}