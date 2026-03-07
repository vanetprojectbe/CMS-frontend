import { useState } from 'react';
import { EmergencyMap } from '@/components/EmergencyMap';
import { AccidentAlert } from '@/types/emergency';

const LiveMap = () => {
  const [alerts] = useState<AccidentAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AccidentAlert | undefined>();

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="h-14 border-b border-border bg-card/50 px-6 flex items-center">
        <h1 className="text-xl font-bold">Live Map</h1>
        <div className="ml-auto text-sm text-muted-foreground">
          {alerts.length} Active Incidents
        </div>
      </div>
      
      <div className="flex-1">
        <EmergencyMap
          alerts={alerts}
          selectedAlert={selectedAlert}
          onSelectAlert={setSelectedAlert}
        />
      </div>
    </div>
  );
};

export default LiveMap;
