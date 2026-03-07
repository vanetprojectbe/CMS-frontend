import { AccidentAlert } from '@/types/emergency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

interface DashboardChartsProps {
  alerts: AccidentAlert[];
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'hsl(0, 84%, 55%)',
  warning: 'hsl(38, 92%, 50%)',
  moderate: 'hsl(215, 20%, 65%)',
};

export const DashboardCharts = ({ alerts }: DashboardChartsProps) => {
  // Build hourly trend from real alert timestamps
  const hourlyMap = new Map<string, number>();
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const h = new Date(now);
    h.setHours(h.getHours() - i, 0, 0, 0);
    const key = h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    hourlyMap.set(key, 0);
  }
  alerts.forEach((a) => {
    const key = new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (hourlyMap.has(key)) hourlyMap.set(key, (hourlyMap.get(key) || 0) + 1);
  });
  const trendData = Array.from(hourlyMap, ([time, count]) => ({ time, count }));

  // Severity distribution
  const severityCounts = { critical: 0, warning: 0, moderate: 0 };
  alerts.forEach((a) => {
    severityCounts[a.severity] = (severityCounts[a.severity] || 0) + 1;
  });
  const pieData = Object.entries(severityCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Incident Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Incident Trend (24h)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[180px]">
          {alerts.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              No data yet — incidents will populate this chart
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: 'hsl(215, 20%, 65%)' }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'hsl(215, 20%, 65%)' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(220, 25%, 12%)',
                    border: '1px solid hsl(220, 20%, 22%)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(217, 91%, 60%)"
                  fill="url(#trendGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Severity Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Severity Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[180px]">
          {pieData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              No incidents to display
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(220, 25%, 12%)',
                    border: '1px solid hsl(220, 20%, 22%)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
