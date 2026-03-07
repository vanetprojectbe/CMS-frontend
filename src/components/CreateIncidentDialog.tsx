import { useState } from 'react';
import { AccidentAlert, SeverityLevel } from '@/types/emergency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface CreateIncidentDialogProps {
  onCreateAlert: (alert: AccidentAlert) => void;
}

export const CreateIncidentDialog = ({ onCreateAlert }: CreateIncidentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    address: '',
    severity: 'warning' as SeverityLevel,
    description: '',
    lat: '',
    lng: '',
    vehicleType: 'Sedan',
    speed: '',
  });

  const handleSubmit = () => {
    const id = `INC-${Date.now().toString(36).toUpperCase()}`;
    const alert: AccidentAlert = {
      id,
      severity: form.severity,
      status: 'new',
      location: {
        lat: parseFloat(form.lat) || 40.758,
        lng: parseFloat(form.lng) || -73.9855,
      },
      address: form.address || 'Unknown Location',
      timestamp: new Date(),
      vehicle: {
        id: `V-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        type: form.vehicleType,
        speed: parseInt(form.speed) || 0,
        direction: Math.floor(Math.random() * 360),
      },
      dispatchETA: Math.floor(Math.random() * 300) + 60,
      description: form.description || 'Manually reported incident',
      nodeId: `N-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      impactForce: Math.floor(Math.random() * 80) + 20,
      injuryLikelihood: form.severity === 'critical' ? 'high' : form.severity === 'warning' ? 'medium' : 'low',
    };

    onCreateAlert(alert);
    setOpen(false);
    setForm({
      address: '',
      severity: 'warning',
      description: '',
      lat: '',
      lng: '',
      vehicleType: 'Sedan',
      speed: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" /> Report Incident
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report New Incident</DialogTitle>
          <DialogDescription>Manually create an accident alert for the command center.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Location Address</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="e.g. 5th Ave & 42nd St, NYC"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input
                type="number"
                step="any"
                value={form.lat}
                onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                placeholder="40.758"
              />
            </div>
            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input
                type="number"
                step="any"
                value={form.lng}
                onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                placeholder="-73.9855"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select
                value={form.severity}
                onValueChange={(v: SeverityLevel) => setForm((f) => ({ ...f, severity: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vehicle Type</Label>
              <Select
                value={form.vehicleType}
                onValueChange={(v) => setForm((f) => ({ ...f, vehicleType: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Speed (mph)</Label>
            <Input
              type="number"
              value={form.speed}
              onChange={(e) => setForm((f) => ({ ...f, speed: e.target.value }))}
              placeholder="45"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the incident..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="dispatch" onClick={handleSubmit} disabled={!form.address}>
            Create Alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
