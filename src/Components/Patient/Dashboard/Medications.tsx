import React, { useEffect, useState } from "react";
import { ScrollArea } from "@mantine/core";
import { getMedicinesConsumedByPatient } from "../../../Service/AppointmentService";
import { useSelector } from "react-redux";

const Medications = () => {
  const [data, setData] = useState<any[]>([]);
  const user = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.profileId) return;

    setLoading(true);
    setError(null);
    getMedicinesConsumedByPatient(user.profileId)
      .then((res) => {
        setData(res || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching medications:", err);
        setError("Failed to load medications");
        setLoading(false);
      });
  }, [user?.profileId]);

  const card = (app: any) => {
    return (
      <div
        className="p-3 mb-3 border rounded-xl justify-between border-l-4 border-orange-500 flex shadow-md bg-orange-100 items-center"
        key={app.id}
      >
        <div>
          <div className="font-medium">{app.name}</div>
          <div className="text-sm text-gray-500">{app.manufacturer}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">{app.dosage}</div>
          <div className="text-sm text-gray-500">
            Frequency: {app.frequency}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 border rounded-xl bg-violet-50 shadow-xl flex flex-col gap-3">
      <div className="text-xl font-semibold">Medications</div>
      <div>
        {loading && (
          <div className="text-center text-gray-500">
            Loading medications...
          </div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}
        {!loading && !error && data.length === 0 && (
          <div className="text-center text-gray-500">
            No medications prescribed
          </div>
        )}
        {!loading && !error && data.length > 0 && (
          <ScrollArea.Autosize mah={300} mx="auto">
            {data.map((app) => card(app))}
          </ScrollArea.Autosize>
        )}
      </div>
    </div>
  );
};

export default Medications;
