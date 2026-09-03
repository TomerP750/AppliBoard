import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface MonthlyResponsesChartProps {
    totalMonthlyResponses: Record<number, number>;
}

export function MonthlyResponsesChart({ totalMonthlyResponses }: MonthlyResponsesChartProps) {

    const data = Array.from({ length: 31 }, (_, index) => {
        const day = index + 1;
        return {
            day,
            responses: totalMonthlyResponses[day] ?? 0,
        };
    });

    return (
        <figure className="w-full h-85 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 32, right: 8, left: 12 }}>
                    <XAxis dataKey="day" tickMargin={10} interval={0} minTickGap={4} />
                    <YAxis
                        allowDecimals={false}
                        label={{ value: "Responses", position: "top", offset: 14, dx: 28 }}
                    />
                    <CartesianGrid stroke="#ccc" />
                    <Tooltip
                        formatter={(value) => [value, "Responses"]}
                        labelFormatter={(day) => `Day ${day}`}
                    />
                    <Line type="monotone" dataKey="responses" stroke="#22c55e" dot />
                </LineChart>
            </ResponsiveContainer>
        </figure>
    );
}
