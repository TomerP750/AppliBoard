import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DayOfWeek } from "../models/AnalyticsDto";

const weekDays: Array<{ key: DayOfWeek; label: string }> = [
    { key: "SUNDAY", label: "Sunday" },
    { key: "MONDAY", label: "Monday" },
    { key: "TUESDAY", label: "Tuesday" },
    { key: "WEDNESDAY", label: "Wednesday" },
    { key: "THURSDAY", label: "Thursday" },
    { key: "FRIDAY", label: "Friday" },
    { key: "SATURDAY", label: "Saturday" },
];

interface WeeklySentChartProps {
    weeklyApplicationsByDay: Record<DayOfWeek, number>;
}

export function WeeklySentChart({ weeklyApplicationsByDay }: WeeklySentChartProps) {
    
    const data = weekDays.map((day) => ({
        name: day.label,
        sent: weeklyApplicationsByDay[day.key],
    }));

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