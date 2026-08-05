import React, { useState } from 'react';
import { Terminal, Copy, Check, Code, Clock, Send, ShieldAlert, Layers } from 'lucide-react';
import { AxiosLog } from '../types';

interface ApiResponseViewerProps {
  logs: AxiosLog[];
}

export const ApiResponseViewer: React.FC<ApiResponseViewerProps> = ({ logs }) => {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(
    logs.length > 0 ? logs[0].id : null
  );
  const [copied, setCopied] = useState(false);

  const currentLog = logs.find((l) => l.id === selectedLogId) || logs[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="api-inspector-container" className="bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Axios HTTP Request & Response Inspector</h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Inspect real-time network payloads sent to Express POST /api/students
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-mono font-medium border border-slate-700">
            Axios v1.19.0
          </span>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <Layers className="w-10 h-10 mx-auto text-slate-700 mb-3 animate-pulse" />
          <p className="font-medium text-slate-400">No Axios HTTP calls captured yet.</p>
          <p className="text-xs mt-1 text-slate-500">
            Submit the registration form to trigger your first POST request.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
          {/* Left Column: Log History */}
          <div className="lg:col-span-4 border-r border-slate-800 bg-slate-950/30 p-3 space-y-2 overflow-y-auto max-h-[500px]">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
              Captured Requests ({logs.length})
            </p>
            {logs.map((log) => {
              const isSelected = (selectedLogId || logs[0].id) === log.id;
              return (
                <button
                  key={log.id}
                  onClick={() => setSelectedLogId(log.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-indigo-500/50 text-white shadow-xs'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        log.method === 'POST'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : log.method === 'DELETE'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {log.method}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {log.durationMs}ms
                    </span>
                  </div>

                  <p className="font-mono text-xs font-semibold text-slate-200 truncate">
                    {log.url}
                  </p>

                  <div className="flex items-center justify-between mt-2 text-[11px]">
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span
                      className={`font-mono font-medium ${
                        log.isError ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {log.status ? `Status ${log.status}` : 'Pending'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Log Details & Code */}
          {currentLog && (
            <div className="lg:col-span-8 p-6 space-y-6 flex flex-col justify-between">
              <div>
                {/* Status Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-indigo-400 font-bold">
                      {currentLog.method} {currentLog.url}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${
                        currentLog.isError
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      HTTP {currentLog.status} {currentLog.statusText}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(JSON.stringify(currentLog.responseBody, null, 2))}
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Response JSON</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Request & Response Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Request Payload */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <Send className="w-3.5 h-3.5 text-indigo-400" /> Request Payload (Sent via Axios)
                    </div>
                    <pre className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-indigo-300 border border-slate-800 overflow-x-auto min-h-[140px]">
                      {currentLog.requestBody
                        ? JSON.stringify(currentLog.requestBody, null, 2)
                        : '// No request body'}
                    </pre>
                  </div>

                  {/* Response JSON */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      {currentLog.isError ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Code className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      Server Response (Axios response.data)
                    </div>
                    <pre className={`p-3.5 rounded-xl bg-slate-950 font-mono text-xs border overflow-x-auto min-h-[140px] ${
                      currentLog.isError
                        ? 'text-rose-300 border-rose-950/60'
                        : 'text-emerald-300 border-slate-800'
                    }`}>
                      {currentLog.responseBody
                        ? JSON.stringify(currentLog.responseBody, null, 2)
                        : '// No response data'}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Code Snippet Example */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <p className="text-[11px] font-mono text-slate-400 mb-1">
                  // Equivalent Axios implementation code:
                </p>
                <code className="block font-mono text-xs text-amber-300/90 whitespace-pre overflow-x-auto">
                  {`const response = await axios.post('/api/students', ${JSON.stringify(currentLog.requestBody || { name: '...', email: '...', course: '...' })});`}
                </code>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
