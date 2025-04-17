import React, { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart() {
  const [taskStats, setTaskStats] = useState({
    tasksAllotted: 1000,
    tasksConsumed: 100,
    tasksRemaining: 500,
    freeTasksConsumed: 400,
  });
  return (
    <>

      <div className="lg:w-5/5">
        <div className="bg-white rounded-lg h-[400px]">
          <div className="p-3 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Tasks Summary</h2>
          </div>

          <div className="p-4 h-[calc(100%-49px)] flex flex-col">
            <div className="flex-1">
              <Pie
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                      labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                          size: 11,
                        },
                      },
                    },
                    title: {
                      display: false,
                    },
                  },
                }}
                data={{
                  labels: [
                    "Tasks Allotted",
                    "Tasks Consumed",
                    "Tasks Remaining",
                    "Free Tasks Consumed",
                  ],
                  datasets: [
                    {
                      data: [
                        taskStats.tasksAllotted,
                        taskStats.tasksConsumed,
                        taskStats.tasksRemaining,
                        taskStats.freeTasksConsumed,
                      ],
                      backgroundColor: [
                        "rgba(53, 162, 235, 0.8)",
                        "rgba(255, 99, 132, 0.8)",
                        "rgba(75, 192, 192, 0.8)",
                        "rgba(255, 206, 86, 0.8)",
                      ],
                      borderColor: [
                        "rgb(53, 162, 235)",
                        "rgb(255, 99, 132)",
                        "rgb(75, 192, 192)",
                        "rgb(255, 206, 86)",
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>

            {/* Summary stats in a more compact grid */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(taskStats).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-2 rounded-lg">
                  <div className="text-xs text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div className="text-sm font-semibold mt-0.5">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
