import { useState, useCallback } from 'react';
import { AlertTriagePanel } from '@/components/AlertTriagePanel';
import { EmergencyMap } from '@/components/EmergencyMap';
import { StatsCards } from '@/components/StatsCards';
import { DashboardCharts } from '@/components/DashboardCharts';
import { ActivityFeed, ActivityEvent } from '@/components/ActivityFeed';
import { CreateIncidentDialog } from '@/components/CreateIncidentDialog';
import { AccidentAlert } from '@/types/emergency';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  const [alerts, setAlerts] = useState<AccidentAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AccidentAlert | undefined>();
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  const addEvent = useCallback((type: ActivityEvent['type'], message: string) => {
    setEvents((prev) => [
      { id: crypto.randomUUID(), type, message, timestamp: new Date() },
      ...prev.slice(0, 49), // keep last 50
    ]);
  }, []);

  const handleDispatch = useCallback(
    (alertId: string) => {
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: 'dispatched' as const } : a))
      );
      const alert = alerts.find((a) => a.id === alertId);
      toast.success('Emergency Response Dispatched', {
        description: `Units dispatched to ${alert?.address}`,
      });
      addEvent('dispatched', `Units dispatched to ${alert?.address || alertId}`);
    },
    [alerts, addEvent]
  );

  const handleSelectAlert = useCallback((alert: AccidentAlert) => {
    setSelectedAlert(alert);
  }, []);

  const handleCreateAlert = useCallback(
    (alert: AccidentAlert) => {
      setAlerts((prev) => [alert, ...prev]);
      toast.info('New Incident Reported', { description: alert.address });
      addEvent('alert_new', `New ${alert.severity} incident at ${alert.address}`);
    },
    [addEvent]
  );

  const activeAlerts = alerts.filter((a) => a.status === 'new');

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Top Action Bar */}
      <div className="px-4 py-3 border-b border-border bg-card/50 flex items-center gap-3 flex-wrap">
        <h1 className="text-lg font-bold">Command Center</h1>
        <div className="ml-auto flex items-center gap-2">
          <CreateIncidentDialog onCreateAlert={handleCreateAlert} />
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

      {/* Dashboard Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Map + Stats */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* KPI Stats */}
          <StatsCards alerts={alerts} />

          {/* Map */}
          <div className="h-[400px]">
            <EmergencyMap
              alerts={alerts}
              selectedAlert={selectedAlert}
              onSelectAlert={handleSelectAlert}
            />
          </div>

          {/* Charts + Activity Feed */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <DashboardCharts alerts={alerts} />
            </div>
            <div>
              <ActivityFeed events={events} />
            </div>
          </div>
        </div>

        {/* Right: Triage Panel */}
        <aside className="w-[380px] border-l border-border bg-card/50 overflow-hidden flex-shrink-0">
          <AlertTriagePanel
            alerts={alerts}
            onSelectAlert={handleSelectAlert}
            onDispatch={handleDispatch}
            selectedAlertId={selectedAlert?.id}
          />
        </aside>
      </div>
    </div>
  );
};

export default Index;
