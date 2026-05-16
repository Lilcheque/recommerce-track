import React, { useState, useEffect } from 'react';
import { Consignment, ConsignmentStatus } from '../types';
import { getConsignments, addConsignment, updateConsignmentStatus, deleteConsignment } from '../lib/storage';
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  ChevronRight, 
  LayoutDashboard, 
  Package, 
  LogOut,
  MoreVertical,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedConsignment, setSelectedConsignment] = useState<Consignment | null>(null);

  // Form states for adding
  const [newShipment, setNewShipment] = useState({
    senderName: '',
    receiverName: '',
    receiverAddress: '',
    weight: '',
    description: '',
    status: 'Pending' as ConsignmentStatus,
  });

  // Form states for updating status
  const [updateStatus, setUpdateStatus] = useState({
    status: 'In Transit' as ConsignmentStatus,
    location: '',
    message: '',
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setConsignments(getConsignments());
  };

  const handleAddShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShipment.senderName || !newShipment.receiverName) {
      toast.error('Please fill in required fields');
      return;
    }
    addConsignment(newShipment);
    toast.success('Shipment created successfully!');
    setIsAddDialogOpen(false);
    setNewShipment({
      senderName: '',
      receiverName: '',
      receiverAddress: '',
      weight: '',
      description: '',
      status: 'Pending',
    });
    refreshData();
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsignment || !updateStatus.location) {
      toast.error('Location is required for update');
      return;
    }
    updateConsignmentStatus(
      selectedConsignment.id, 
      updateStatus.status, 
      updateStatus.location, 
      updateStatus.message
    );
    toast.success('Status updated successfully!');
    setIsUpdateDialogOpen(false);
    setUpdateStatus({ status: 'In Transit', location: '', message: '' });
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this shipment?')) {
      deleteConsignment(id);
      toast.info('Shipment deleted');
      refreshData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage consignments and track shipments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Shipment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Shipment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddShipment} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sender Name</Label>
                    <Input 
                      value={newShipment.senderName} 
                      onChange={e => setNewShipment({...newShipment, senderName: e.target.value})}
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Receiver Name</Label>
                    <Input 
                      value={newShipment.receiverName} 
                      onChange={e => setNewShipment({...newShipment, receiverName: e.target.value})}
                      placeholder="Full Name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Receiver Address</Label>
                  <Input 
                    value={newShipment.receiverAddress} 
                    onChange={e => setNewShipment({...newShipment, receiverAddress: e.target.value})}
                    placeholder="Full shipping address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Weight</Label>
                    <Input 
                      value={newShipment.weight} 
                      onChange={e => setNewShipment({...newShipment, weight: e.target.value})}
                      placeholder="e.g. 5kg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Initial Status</Label>
                    <Select 
                      value={newShipment.status} 
                      onValueChange={(val: ConsignmentStatus) => setNewShipment({...newShipment, status: val})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Picked Up">Picked Up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input 
                    value={newShipment.description} 
                    onChange={e => setNewShipment({...newShipment, description: e.target.value})}
                    placeholder="Brief contents description"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">Create Consignment</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground uppercase">Total Shipments</p>
          <p className="text-3xl font-bold mt-2">{consignments.length}</p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground uppercase">Active</p>
          <p className="text-3xl font-bold mt-2 text-indigo-600">
            {consignments.filter(c => c.status !== 'Delivered' && c.status !== 'Cancelled').length}
          </p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground uppercase">Delivered</p>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {consignments.filter(c => c.status === 'Delivered').length}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking #</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Receiver</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consignments.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono font-bold text-primary">{c.trackingNumber}</TableCell>
                <TableCell>{c.senderName}</TableCell>
                <TableCell>{c.receiverName}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    c.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                    c.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {c.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(c.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedConsignment(c);
                        setIsUpdateDialogOpen(true);
                      }}>
                        <History className="w-4 h-4 mr-2" />
                        Update Status
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {consignments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No shipments found. Start by creating one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status: {selectedConsignment?.trackingNumber}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateStatus} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select 
                value={updateStatus.status} 
                onValueChange={(val: ConsignmentStatus) => setUpdateStatus({...updateStatus, status: val})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Picked Up">Picked Up</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Current Location</Label>
              <Input 
                value={updateStatus.location} 
                onChange={e => setUpdateStatus({...updateStatus, location: e.target.value})}
                placeholder="City, Facility Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Status Message</Label>
              <Input 
                value={updateStatus.message} 
                onChange={e => setUpdateStatus({...updateStatus, message: e.target.value})}
                placeholder="Optional detailed message"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">Confirm Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};