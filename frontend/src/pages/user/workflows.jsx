import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllApps } from "@/store/slices/app-slice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function workflows() {
  const { user } = useSelector((state) => state.auth);
  const { apps } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllApps());
  }, [dispatch]);
  return (
    <div className="w-full min-h-screen bg-slate-100 md:px-4">
      <div className="w-full mb-6">
        <div className="flex flex-col w-full gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Workflows</h1>
        </div>
      </div>
      {/* main grid */}
      <div className="grid grid-cols-3 bg-white shadow-md p-4">
        {/* drid inside grid */}
        <div className="grid grid-cols-3 space-x-2">
          {apps.map((app) => (
            <Card key={app._id}>
              <CardHeader> 
                <CardTitle>{app.appName}</CardTitle>
                
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default workflows;
