// src/pages/LiveMap.tsx

import { useState } from "react";
import { useAlerts } from "@/hooks/useAlerts";
import { EmergencyMap } from "@/components/EmergencyMap";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import type { AccidentAlert } from "@/hooks/useAlerts";

const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: "text-red-500 border-red-500/30",
  MAJOR:    "text-yellow-500 border-yellow-500/30",
  MINOR:    "text-blue-400 border-blue-400/30",
  UNKNOWN:  "text-gray-400 border-gray-400/30",
};

const LiveMap = () => {
  const { alerts, isConnected, error } = useAlerts(10000);
  const [selectedAlert, setSelectedAlert] = useState<AccidentAlert | undefined>();

  const activeAlerts = alerts.filter(a =>
    ["open", "dispatched", "acknowledged"].includes(a.status)
  );

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">

      {/* ── Header bar ───────────────────────────────────────────────── */}
      <div className="h-14 border-b border-border bg-card/50 px-6 flex items-center gap-4 shrink-0">
        <h1 className="text-xl font-bold">Live Map</h1>

        <div className="ml-auto flex items-center gap-3">
          {isConnected ? (
            <Badge variant="outline" className="border-green-500/30 text-green-500 gap-1">
              <Wifi className="w-3 h-3" /> Live
            </Badge>
          ) : (
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-500 gap-1">
              <WifiOff className="w-3 h-3" /> Disconnected
            </Badge>
          )}
          <span className="text-sm text-muted-foreground">
            {activeAlerts.length} active incident{activeAlerts.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Error banner ──────────────────────────────────────────────── */}
      {error && (
        <div className="px-6 py-2 bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-500 text-sm">
          {error}
        </div>
      )}

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Map */}
        <div className="flex-1">
          <EmergencyMap
            alerts={activeAlerts}
            selectedAlert={selectedAlert}
            onSelectAlert={setSelectedAlert}
          />
        </div>

        {/* ── Sidebar — active incidents list ───────────────────────── */}
        <div className="w-72 border-l border-border bg-card/50 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-semibold text-sm">Active Incidents</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeAlerts.length === 0 ? "No pending response" : `${activeAlerts.length} pending response`}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2">
                <span>No active incidents</span>
                <span className="text-xs">Alerts will appear here in real-time</span>
              </div>
            ) : (
              activeAlerts.map(alert => (
                <div
                  key={alert._id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/40 transition-colors ${
                    selectedAlert?._id === alert._id ? "bg-muted/60" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${SEVERITY_COLOR[alert.severity]?.split(" ")[0] || "text-gray-400"}`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium truncate">
                    {alert.vehicleId || "Unknown vehicle"}
                  </div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">
                    {alert.address || `${alert.latitude?.toFixed(4)}, ${alert.longitude?.toFixed(4)}`}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    RSU: {alert.rsuId || "—"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
