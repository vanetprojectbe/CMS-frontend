import { AccidentAlert } from '@/types/emergency';
import { Card } from '@/components/ui/card';
import { AlertCircle, Car, CheckCircle2, Clock, TrendingUp, Shield } from 'lucide-react';

interface StatsCardsProps {
  alerts: AccidentAlert[];
}

export const StatsCards = ({ alerts }: StatsCardsProps) => {
  const active = alerts.filter((a) => a.status === 'new').length;
  const dispatched = alerts.filter((a) => a.status === 'dispatched').length;
  const resolved = alerts.filter((a) => a.status === 'resolved').length;
  const critical = alerts.filter((a) => a.severity === 'critical' && a.status === 'new').length;

  const avgETA =
    alerts.length > 0
      ? Math.round(alerts.reduce((sum, a) => sum + a.dispatchETA, 0) / alerts.length)
      : 0;
  const avgMins = Math.floor(avgETA / 60);
  const avgSecs = avgETA % 60;

  const stats = [
    {
      label: 'Active Alerts',
      value: active,
      icon: AlertCircle,
      color: 'text-critical',
      bg: 'bg-critical/10',
      border: 'border-critical/20',
      glow: active > 0 ? 'shadow-[0_0_20px_hsl(var(--critical)/0.15)]' : '',
    },
    {
      label: 'Critical',
      value: critical,
      icon: Shield,
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      glow: critical > 0 ? 'shadow-[0_0_20px_hsl(var(--warning)/0.15)]' : '',
    },
    {
      label: 'Dispatched',
      value: dispatched,
      icon: Car,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      glow: '',
    },
    {
      label: 'Resolved',
      value: resolved,
      icon: CheckCircle2,
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20',
      glow: '',
    },
    {
      label: 'Avg Response',
      value: `${avgMins}:${avgSecs.toString().padStart(2, '0')}`,
      icon: Clock,
      color: 'text-muted-foreground',
      bg: 'bg-muted/50',
      border: 'border-border',
      glow: '',
    },
    {
      label: 'Total Incidents',
      value: alerts.length,
      icon: TrendingUp,
      color: 'text-muted-foreground',
      bg: 'bg-muted/50',
      border: 'border-border',
      glow: '',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className={`p-3 ${stat.bg} border ${stat.border} ${stat.glow} transition-shadow`}
        >
          <div className="flex items-center gap-2 mb-1">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
            <span className="text-xs text-muted-foreground truncate">{stat.label}</span>
          </div>
          <p className={`text-2xl font-bold font-mono-data ${stat.color}`}>{stat.value}</p>
        </Card>
      ))}
    </div>
  );
};
