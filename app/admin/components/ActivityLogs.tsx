import React from 'react';

interface ActivityLogsProps {
  logList: string[];
}

export const ActivityLogs: React.FC<ActivityLogsProps> = ({ logList }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="font-bold text-lg">Log Aktivitas</h2>
      </div>
      <div className="max-h-96 overflow-y-auto text-xs font-mono">
        {logList.length === 0 && <div className="text-gray-400">Belum ada aktivitas.</div>}
        <ul>
          {logList.map((log, idx) => (
            <li key={idx} className="mb-1 p-2 bg-gray-50 rounded">{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};