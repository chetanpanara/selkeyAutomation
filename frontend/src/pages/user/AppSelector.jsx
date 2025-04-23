import { useSelector } from "react-redux";

export default function TriggerAppSelector() {
  const { apps } = useSelector((state) => state.app);

  return (
    <div className="border border-gray-200 rounded-lg p-4 mt-4 max-w-8xl mx-auto bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          {/* Render the list of apps */}
          {apps && apps.length > 0 ? (
            <ul className="list-disc pl-5">
              {apps.map((app, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <img src={app.logoUrl} alt={`${app.appName} logo`} className="w-6 h-6 rounded-full" />
                  <span>{app.appName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No apps available</p>
          )}
        </div>
      </div>
    </div>
  );
}
