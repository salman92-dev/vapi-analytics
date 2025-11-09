// app/page.jsx  (Server Component)

import { getVapiData } from "@/lib/vapi-data";

export default async function Home() {

 let data;
 let error = false;

  try {
    data = await getVapiData();
  } catch (err) {
    error = true;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold">Failed to load data</h1>
        <p className="text-gray-500 mt-2">Please try again later.</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>No data available.</p>
      </div>
    );
  }
  return (
    <div>
      <h1>Server Fetched Data</h1>

      {data ? (
        <div className="overflow-x-auto h-[100vh] scrollar rounded-xl">
          <table className="w-[400%] md:w-[100%] border-collapse border border-gray-300 dark:border-gray-700">
            <thead className="sticky -top-[1px] bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border p-3 text-left">Type</th>
                <th className="border p-3 text-left">Start Time</th>
                <th className="border p-3 text-left">End Time</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Assistant</th>
                <th className="border p-3 text-left">Reason</th>
                <th className="border p-3 text-left">Created At</th>
              </tr>
            </thead>

            <tbody>
              {data.map((call) => (
                <tr
                  key={call.id}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="p-3">{call.type}</td>

                  <td className="p-3">
                    {call.startedAt
                      ? new Date(call.startedAt).toLocaleString()
                      : "—"}
                  </td>

                  <td className="p-3">
                    {call.endedAt
                      ? new Date(call.endedAt).toLocaleString()
                      : "—"}
                  </td>

                  <td className="p-3">{call.status}</td>
                  <td className="p-3">{call.assistantOverrides?.name || "—"}</td>
                  <td className="p-3">{call.endedReason || "—"}</td>

                  <td className="p-3">
                    {new Date(call.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}
