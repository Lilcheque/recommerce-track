import { Consignment, ConsignmentStatus, HistoryEntry } from '../types';

const STORAGE_KEY = 'consignments_data';

const initialData: Consignment[] = [
  {
    id: '1',
    trackingNumber: 'TRK-2024-001',
    senderName: 'John Doe',
    receiverName: 'Jane Smith',
    receiverAddress: '123 Ocean Drive, Miami, FL',
    weight: '2.5kg',
    description: 'Laptop and accessories',
    status: 'In Transit',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    history: [
      {
        id: 'h1',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'Pending',
        location: 'New York Hub',
        message: 'Shipment info received',
      },
      {
        id: 'h2',
        date: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        status: 'Picked Up',
        location: 'New York Hub',
        message: 'Package picked up by courier',
      },
      {
        id: 'h3',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'In Transit',
        location: 'Philadelphia Distribution Center',
        message: 'Package is in transit to the next facility',
      },
    ],
  },
];

export const getConsignments = (): Consignment[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

export const saveConsignments = (consignments: Consignment[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consignments));
};

export const addConsignment = (consignment: Omit<Consignment, 'id' | 'trackingNumber' | 'createdAt' | 'history'>) => {
  const consignments = getConsignments();
  const newConsignment: Consignment = {
    ...consignment,
    id: crypto.randomUUID(),
    trackingNumber: `TRK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    history: [
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        status: 'Pending',
        location: 'Origin Hub',
        message: 'Shipment created and pending pickup',
      },
    ],
  };
  saveConsignments([newConsignment, ...consignments]);
  return newConsignment;
};

export const updateConsignmentStatus = (id: string, status: ConsignmentStatus, location: string, message: string) => {
  const consignments = getConsignments();
  const updated = consignments.map((c) => {
    if (c.id === id) {
      const historyEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        status,
        location,
        message,
      };
      return {
        ...c,
        status,
        history: [historyEntry, ...c.history],
      };
    }
    return c;
  });
  saveConsignments(updated);
};

export const deleteConsignment = (id: string) => {
  const consignments = getConsignments();
  saveConsignments(consignments.filter((c) => c.id !== id));
};