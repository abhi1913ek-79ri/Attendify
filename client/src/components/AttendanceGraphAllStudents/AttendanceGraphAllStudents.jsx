import { SquareKanbanIcon } from "lucide-react";
import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";



const AttendanceStatsChart = (props) => {
    const data = [
        { name: "Total Students.", value: props.totalStudents},
        { name: "Present", value: props.presentToday},
        { name: "Absent", value: props.absentToday},
        { name: "Critical", value: props.numberOfCriticalStudents},
        { name: "Absent + Critical", value: props.criticalAndAbsent},

    ];
    return (
        <div className="w-full -px-5 max-md:overflow-x-auto">
            <h2 className="text-2xl font-light text-[#080160] flex flex-col text-center "><div className="items-center w-full flex justify-center"><SquareKanbanIcon /></div>Today Attendance</h2>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart
                    data={data}
                    barCategoryGap={50}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12, fill: "#444" }}
                        angle={0}
                        interval={0}
                        height={60}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#888" }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#f9f9f9",
                            borderRadius: "10px",
                            fontSize: "13px",
                        }}
                    />
                    <Bar dataKey="value" fill="#080160" barSize={25} radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AttendanceStatsChart;
