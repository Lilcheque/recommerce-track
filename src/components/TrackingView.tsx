import React from 'react';
import { Consignment } from '../types';
import { CheckCircle2, Clock, Truck, Package, MapPin, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const statusIcons: Record<string, React.ReactNode> = {
  'Pending': <Clock className="w-5 h-5 text-yellow-500" />,
  'Picked Up': <Package className="w-5 h-5 text-blue-500" />,
  'In Transit': <Truck className="w-5 h-5 text-indigo-500" />,
  'Out for Delivery': <Truck className="w-5 h-5 text-purple-500" />,
  'Delivered': <CheckCircle2 className="w-5 h-5 text-green-500" />,
  'Cancelled': <CheckCircle2 className="w-5 h-5 text-red-500" />,
};

interface TrackingViewProps {
  consignment: Consignment;
}

export const TrackingView: React.FC<TrackingViewProps> = ({ consignment }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{consignment.trackingNumber}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Status: <span className="font-semibold text-foreground">{consignment.status}</span></p>
          </div>
          <Badge variant={consignment.status === 'Delivered' ? 'default' : 'secondary'} className="px-4 py-1 text-sm">
            {consignment.status}
          </Badge>
        </CardHeader>
        <CardContent className="grid md:grid-rows-2 gap-8 py-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">From</p>
              <p className="font-medium text-lg">{consignment.senderName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">To</p>
              <p className="font-medium text-lg">{consignment.receiverName}</p>
              <p className="text-sm text-muted-foreground">{consignment.receiverAddress}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Shipment Progress
            </h3>
            
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-muted before:to-transparent">
              {consignment.history.map((entry, idx) => (
                <div key={entry.id} className="relative flex items-center justify-between md:justify-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-primary z-10 shrink-0">
                    {statusIcons[entry.status] || <Clock className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="flex-1 ml-6 bg-muted/30 p-4 rounded-lg border border-border/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                      <span className="font-bold text-sm md:text-base text-primary">{entry.status}</span>
                      <span className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleString()}</span>
                    </div>
                    <p className="text-sm font-medium mb-1">{entry.location}</p>
                    <p className="text-sm text-muted-foreground">{entry.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};