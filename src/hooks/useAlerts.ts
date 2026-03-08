import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { AccidentAlert } from '@/types/emergency';
import { api, API_BASE_URL } from '@/lib/apiClient';

/**
 * Hook to fetch alerts via REST and subscribe to real-time updates via WebSocket.
 * 
 * The Express backend should expose:
 *   GET  /api/alerts          — list all active alerts
 *   WS   ws(s)://host/ws      — real-time alert events
 * 
 * WebSocket message format expected:
 *   { type: 'alert.new' | 'alert.updated' | 'alert.resolved', data: AccidentAlert }
 */
export function useAlerts() {
  const [alerts, setAlerts] = useState<AccidentAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Initial REST fetch
  const fetchAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<AccidentAlert[]>('/alerts');
      setAlerts(data.map(a => ({ ...a, timestamp: new Date(a.timestamp) })));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // WebSocket connection
  const connectWs = useCallback(() => {
    const wsUrl = API_BASE_URL
      .replace(/^http/, 'ws')
      .replace(/\/api$/, '/ws');

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const alert = { ...msg.data, timestamp: new Date(msg.data.timestamp) } as AccidentAlert;

        setAlerts(prev => {
          switch (msg.type) {
            case 'alert.new':
              toast.info('🚨 New Accident Detected', {
                description: `${alert.address} — Nearest hospital, police & fire station auto-notified.`,
                duration: 8000,
              });
              return [alert, ...prev];
            case 'alert.updated':
              return prev.map(a => a.id === alert.id ? alert : a);
            case 'alert.resolved':
              return prev.filter(a => a.id !== alert.id);
            case 'services.notified':
              toast.success('✅ Emergency Services Notified', {
                description: `${msg.data.services?.length || 'All'} services alerted for incident ${msg.data.alertId}`,
                duration: 6000,
              });
              return prev;
            case 'service.acknowledged':
              toast.success(`${msg.data.serviceName} acknowledged`, {
                description: `ETA: ${msg.data.eta} min — ${msg.data.alertId}`,
                duration: 5000,
              });
              return prev;
            default:
              return prev;
          }
        });
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Reconnect after 3s
      reconnectTimeout.current = setTimeout(connectWs, 3000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    fetchAlerts();
    connectWs();

    return () => {
      wsRef.current?.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [fetchAlerts, connectWs]);

  // Actions that hit the REST API
  const dispatchAlert = useCallback(async (alertId: string) => {
    const updated = await api.patch<AccidentAlert>(`/alerts/${alertId}/dispatch`, {});
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...updated, timestamp: new Date(updated.timestamp) } : a));
    return updated;
  }, []);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    const updated = await api.patch<AccidentAlert>(`/alerts/${alertId}/acknowledge`, {});
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...updated, timestamp: new Date(updated.timestamp) } : a));
    return updated;
  }, []);

  return { alerts, isConnected, isLoading, error, dispatchAlert, acknowledgeAlert, refetch: fetchAlerts };
}
