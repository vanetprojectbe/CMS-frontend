import { useState, useEffect } from 'react';
import { AlertTriagePanel } from '@/components/AlertTriagePanel';
import { EmergencyMap } from '@/components/EmergencyMap';
import { ResponseTimer } from '@/components/ResponseTimer';
import { AccidentAlert } from '@/types/emergency';
import { initialMockAlerts, generateMockAccident } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, Car, Activity } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [alerts, setAlerts] = useState<AccidentAlert[]>(initialMockAlerts);
  const [selectedAlert, setSelectedAlert] = useState<AccidentAlert | undefined>(
    initialMockAlerts[0]
  );

  // Simulate real-time alert updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.2) {
        const newAlert = generateMockAccident(`ACC-${Date.now().toString().slice(-4)}`);
        setAlerts((prev) => [newAlert, ...prev]);
        toast.error(`New ${newAlert.severity.toUpperCase()} Alert`, {
          description: newAlert.address,
          duration: 5000,
        });
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDispatch = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: 'dispatched' as const } : alert
      )
    );
    toast.success('Emergency Response Dispatched', {
      description: `Units dispatched to ${alerts.find(a => a.id === alertId)?.address}`,
    });
  };

  const handleSelectAlert = (alert: AccidentAlert) => {
    setSelectedAlert(alert);
  };

  const activeAlerts = alerts.filter((a) => a.status === 'new');
  const dispatchedCount = alerts.filter((a) => a.status === 'dispatched').length;
  const oldestActiveAlert = activeAlerts.length > 0 ? activeAlerts[activeAlerts.length - 1] : null;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* KPI Bar */}
      <div className="px-4 py-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-critical" />
            <span className="text-sm text-muted-foreground">Active:</span>
            <span className="text-lg font-bold font-mono-data text-critical">{activeAlerts.length}</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Dispatched:</span>
            <span className="text-lg font-bold font-mono-data text-success">{dispatchedCount}</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="text-lg font-bold font-mono-data">{alerts.length}</span>
          </div>
          {oldestActiveAlert && (
            <>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Response:</span>
                <ResponseTimer timestamp={oldestActiveAlert.timestamp} />
              </div>
            </>
          )}
          <div className="ml-auto">
            <Button
              variant="dispatch"
              size="sm"
              disabled={activeAlerts.length === 0}
              onClick={() => activeAlerts[0] && handleDispatch(activeAlerts[0].id)}
            >
              Dispatch First Alert
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4">
          <EmergencyMap
            alerts={alerts}
            selectedAlert={selectedAlert}
            onSelectAlert={handleSelectAlert}
          />
        </div>
        <aside className="w-[380px] border-l border-border bg-card/50 overflow-hidden">
          <AlertTriagePanel
            alerts={alerts}
            onSelectAlert={handleSelectAlert}
            onDispatch={handleDispatch}
            selectedAlertId={selectedAlert?.id}
          />
        </aside>
      </main>
    </div>
  );
};

export default Index;
