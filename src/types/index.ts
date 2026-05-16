export type ConsignmentStatus = 'Pending' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface HistoryEntry {
  id: string;
  date: string;
  status: ConsignmentStatus;
  location: string;
  message: string;
}

export interface Consignment {
  id: string;
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  receiverAddress: string;
  weight: string;
  description: string;
  status: ConsignmentStatus;
  history: HistoryEntry[];
  createdAt: string;
}