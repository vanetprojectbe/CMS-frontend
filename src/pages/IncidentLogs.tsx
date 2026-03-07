import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollText, Search, Download } from 'lucide-react';

const IncidentLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="h-14 border-b border-border bg-card/50 px-6 flex items-center">
        <ScrollText className="w-5 h-5 mr-3 text-primary" />
        <h1 className="text-xl font-bold">Incident Logs</h1>
      </div>

      <div className="p-6 border-b border-border bg-card/30">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, address, or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="text-center py-12 text-muted-foreground">
          No incidents logged yet. Incidents will appear here as they are recorded.
        </div>
      </div>
    </div>
  );
};

export default IncidentLogs;
