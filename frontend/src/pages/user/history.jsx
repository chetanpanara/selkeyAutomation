import React from 'react'

export default function History() {


  const Dashboard = [
    { name: "WORKFLOW EXECUTED", number: "1000", img: "../img/d2.png" },
    { name: "TASK CONSUMED", number: "00", img: "../img/d1.png" },
    { name: "FREE TASK CONSUMED", number: "600", img: "../img/d4.png" },
  ];


  return (
    <>

      <div className="container  max-w-full p-4">
        <div className="grid grid-cols-1">
          <div className="block">
            <p className="font-semibold text-2xl mb-3">Task History</p>
            <span className="text-gray-500 text-sm ">
              View all of your task history. Any action performed in your workflow is considered a task. Triggers are not included in the task count, and internal applications of Pabbly Connect, such as filters, routers, and formatters, are also not considered tasks. Please note that the task history is only available for the last 15 days. 
            </span>
          </div>
        </div>
      </div>

      
      <div className=" mt-10 bg-slate-100 rounded-lg">
        <div className="grid lg:grid-cols-3 md:grid-cols-1 p-2 gap-3">
          {Dashboard.map((item) => (
            <div className="flex border-1 rounded-lg shadow-md p-6 bg-white ">
              <img
                src={item.img}
                className="w-10 h-10 rounded-full"
                alt=""
              />
              <div className="block ml-5">
                <span className="font-semibold text-sm uppercase text-gray-600  tracking-wider">
                  {item.name}
                </span>{" "}
                <br />
                <span className="font-semibold text-xl">{item.number}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  )
}
