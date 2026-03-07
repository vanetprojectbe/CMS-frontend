import { useState } from 'react';
import { AlertTriagePanel } from '@/components/AlertTriagePanel';
import { EmergencyMap } from '@/components/EmergencyMap';
import { AccidentAlert } from '@/types/emergency';
import { Button } from '@/components/ui/button';
import { AlertCircle, Car, Activity } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [alerts] = useState<AccidentAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AccidentAlert | undefined>();

  const handleDispatch = (alertId: string) => {
    toast.success('Emergency Response Dispatched', {
      description: `Units dispatched to ${alerts.find(a => a.id === alertId)?.address}`,
    });
  };

  const handleSelectAlert = (alert: AccidentAlert) => {
    setSelectedAlert(alert);
  };

  const activeAlerts = alerts.filter((a) => a.status === 'new');
  const dispatchedCount = alerts.filter((a) => a.status === 'dispatched').length;

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
