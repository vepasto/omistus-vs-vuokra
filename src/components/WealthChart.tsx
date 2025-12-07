import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import type { YearResult } from '../utils/calculateWealth';

interface Props {
    data: YearResult[];
}

export const WealthChart: React.FC<Props> = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                        formatter={(value: number) => [`${value.toLocaleString()} €`, '']}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="ownerWealth"
                        name="Omistaja (Nettovarallisuus)"
                        stroke="#818cf8"
                        strokeWidth={3}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="renterWealth"
                        name="Vuokralainen (Nettovarallisuus)"
                        stroke="#34d399"
                        strokeWidth={3}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
