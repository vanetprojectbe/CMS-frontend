import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AccidentAlert } from '@/types/emergency';

interface EmergencyMapProps {
  alerts: AccidentAlert[];
  selectedAlert?: AccidentAlert;
  onSelectAlert: (alert: AccidentAlert) => void;
}

const getSeverityColor = (severity: AccidentAlert['severity']) => {
  switch (severity) {
    case 'critical': return '#ef4444';
    case 'warning': return '#f59e0b';
    default: return '#6b7280';
  }
};

export const EmergencyMap = ({ alerts, selectedAlert, onSelectAlert }: EmergencyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const locationMarkerRef = useRef<L.Marker | null>(null);
  const locationCircleRef = useRef<L.Circle | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [40.7580, -73.9855],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when alerts change
  useEffect(() => {
    if (!markersRef.current || !mapInstanceRef.current) return;

    markersRef.current.clearLayers();

    alerts.forEach((alert) => {
      const color = getSeverityColor(alert.severity);
      const isSelected = selectedAlert?.id === alert.id;
      const size = isSelected ? 18 : 12;
      const border = isSelected ? 4 : 3;

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width: ${size}px; height: ${size}px;
          background: ${color};
          border: ${border}px solid white;
          border-radius: 50%;
          box-shadow: 0 0 8px ${color}88;
          cursor: pointer;
        "></div>`,
        iconSize: [size + border * 2, size + border * 2],
        iconAnchor: [(size + border * 2) / 2, (size + border * 2) / 2],
      });

      const marker = L.marker([alert.location.lat, alert.location.lng], { icon })
        .addTo(markersRef.current!);

      marker.bindPopup(`
        <div style="font-size: 13px; min-width: 180px;">
          <div style="font-weight: bold; font-size: 15px; margin-bottom: 4px;">${alert.id}</div>
          <div><strong>Location:</strong> ${alert.address}</div>
          <div><strong>Vehicle:</strong> ${alert.vehicle.id} (${alert.vehicle.type})</div>
          <div><strong>Speed:</strong> ${alert.vehicle.speed} mph</div>
          <div><strong>Severity:</strong> <span style="color: ${color}">${alert.severity}</span></div>
          <div><strong>Status:</strong> ${alert.status}</div>
          <div><strong>Time:</strong> ${alert.timestamp.toLocaleTimeString()}</div>
        </div>
      `);

      marker.on('click', () => onSelectAlert(alert));
    });
  }, [alerts, selectedAlert, onSelectAlert]);

  // Fly to selected alert
  useEffect(() => {
    if (selectedAlert && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedAlert.location.lat, selectedAlert.location.lng],
        15,
        { duration: 0.8 }
      );
    }
  }, [selectedAlert]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
      <div ref={mapRef} className="w-full h-full" />

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
