import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AccidentAlert } from '@/types/emergency';

interface EmergencyMapProps {
  alerts: AccidentAlert[];
  selectedAlert?: AccidentAlert;
  onSelectAlert: (alert: AccidentAlert) => void;
}

const createSeverityIcon = (severity: AccidentAlert['severity'], isSelected: boolean) => {
  const colors: Record<string, string> = {
    critical: '#ef4444',
    warning: '#f59e0b',
    moderate: '#6b7280',
  };
  const color = colors[severity] || '#6b7280';
  const size = isSelected ? 18 : 12;
  const border = isSelected ? 4 : 3;

  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: ${color};
      border: ${border}px solid white;
      border-radius: 50%;
      box-shadow: 0 0 8px ${color}88;
    "></div>`,
    iconSize: [size + border * 2, size + border * 2],
    iconAnchor: [(size + border * 2) / 2, (size + border * 2) / 2],
  });
};

const FlyToAlert = ({ alert }: { alert?: AccidentAlert }) => {
  const map = useMap();
  useEffect(() => {
    if (alert) {
      map.flyTo([alert.location.lat, alert.location.lng], 15, { duration: 0.8 });
    }
  }, [alert, map]);
  return null;
};

export const EmergencyMap = ({ alerts, selectedAlert, onSelectAlert }: EmergencyMapProps) => {
  const center: [number, number] = [40.7580, -73.9855];

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-full z-0"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FlyToAlert alert={selectedAlert} />

        {alerts.map((alert) => (
          <Marker
            key={alert.id}
            position={[alert.location.lat, alert.location.lng]}
            icon={createSeverityIcon(alert.severity, selectedAlert?.id === alert.id)}
            eventHandlers={{ click: () => onSelectAlert(alert) }}
          >
            <Popup>
              <div className="text-sm min-w-[180px]">
                <div className="font-bold text-base mb-1">{alert.id}</div>
                <div className="mb-1"><strong>Location:</strong> {alert.address}</div>
                <div><strong>Vehicle:</strong> {alert.vehicle.id} ({alert.vehicle.type})</div>
                <div><strong>Speed:</strong> {alert.vehicle.speed} mph</div>
                <div><strong>Severity:</strong> <span style={{ color: alert.severity === 'critical' ? '#ef4444' : alert.severity === 'warning' ? '#f59e0b' : '#6b7280' }}>{alert.severity}</span></div>
                <div><strong>Status:</strong> {alert.status}</div>
                <div><strong>Time:</strong> {alert.timestamp.toLocaleTimeString()}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <h4 className="text-xs font-bold mb-2 uppercase tracking-wide">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-critical" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground" />
            <span>Moderate</span>
          </div>
        </div>
      </div>

      {alerts.length === 0 && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center pointer-events-none">
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-6 py-4 text-center">
            <p className="text-muted-foreground text-sm">No active incidents</p>
            <p className="text-xs text-muted-foreground mt-1">Alerts will appear here in real-time</p>
          </div>
        </div>
      )}
    </div>
  );
};
