import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, AlertCircle, Car, CheckCircle2, Radio } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface ActivityEvent {
  id: string;
  type: 'alert_new' | 'dispatched' | 'resolved' | 'acknowledged' | 'system';
  message: string;
  timestamp: Date;
}

interface ActivityFeedProps {
  events: ActivityEvent[];
}

const eventConfig: Record<ActivityEvent['type'], { icon: typeof Activity; color: string; badge: string }> = {
  alert_new: { icon: AlertCircle, color: 'text-critical', badge: 'border-critical/30 text-critical' },
  dispatched: { icon: Car, color: 'text-primary', badge: 'border-primary/30 text-primary' },
  resolved: { icon: CheckCircle2, color: 'text-success', badge: 'border-success/30 text-success' },
  acknowledged: { icon: Radio, color: 'text-warning', badge: 'border-warning/30 text-warning' },
  system: { icon: Activity, color: 'text-muted-foreground', badge: 'border-border text-muted-foreground' },
};

export const ActivityFeed = ({ events }: ActivityFeedProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[260px]">
          {events.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-muted-foreground">
              No activity yet — events will appear here in real-time
            </div>
          ) : (
            <div className="divide-y divide-border">
              {events.map((event) => {
                const config = eventConfig[event.type];
                const Icon = config.icon;
                return (
                  <div key={event.id} className="px-4 py-3 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">{event.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${config.badge} flex-shrink-0`}>
                      {event.type.replace('_', ' ')}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
