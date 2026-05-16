import { useState } from 'react';
import { Search, Loader2, Package, ArrowRight, ShieldCheck, Globe, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster, toast } from 'sonner';
import { Consignment } from './types';
import { getConsignments } from './lib/storage';
import { TrackingView } from './components/TrackingView';
import { AdminPanel } from './components/AdminPanel';
import { Layout } from './components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [foundConsignment, setFoundConsignment] = useState<Consignment | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleTrack = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setIsSearching(true);
    // Simulate network delay
    setTimeout(() => {
      const consignments = getConsignments();
      const found = consignments.find(c => c.trackingNumber.toLowerCase() === trackingNumber.trim().toLowerCase());
      
      if (found) {
        setFoundConsignment(found);
        toast.success('Shipment found!');
      } else {
        setFoundConsignment(null);
        toast.error('No shipment found with that number');
      }
      setIsSearching(false);
    }, 800);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a real auth call
    // For this demo, using password "admin123"
    if (adminPassword === 'admin123') {
      setIsAdminLoggedIn(true);
      toast.success('Welcome back, Admin');
    } else {
      toast.error('Invalid credentials');
    }
  };

  if (view === 'admin' && !isAdminLoggedIn) {
    return (
      <Layout onAdminClick={() => setView('public')} showNav={false}>
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-card p-8 rounded-2xl border shadow-xl"
          >
            <div className="text-center mb-8">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Admin Portal</h2>
              <p className="text-muted-foreground">Secure access to management tools</p>
            </div>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input 
                  type="password" 
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password (hint: admin123)"
                  className="bg-muted/50"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-lg">
                Access Dashboard
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={() => setView('public')}
              >
                Back to Home
              </Button>
            </form>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (view === 'admin' && isAdminLoggedIn) {
    return (
      <Layout onAdminClick={() => setIsAdminLoggedIn(false)} showNav={false}>
        <AdminPanel onLogout={() => setIsAdminLoggedIn(false)} />
        <Toaster position="top-right" />
      </Layout>
    );
  }

  return (
    <Layout onAdminClick={() => setView('admin')}>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/5b477b5e-29f0-4dcc-a653-5ddc5561df87/hero-logistics-bg-f4275a39-1778913400677.webp" 
            alt="Logistics Background" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Track Your <span className="text-primary">Consignment</span> in Real-Time
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-lg">
              Reliable logistics tracking for your peace of mind. Enter your tracking number below to see your shipment's journey.
            </p>

            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter Tracking Number (e.g. TRK-2024-001)" 
                  className="h-14 pl-12 pr-4 text-lg bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-zinc-400 focus:bg-white/20 transition-all rounded-xl"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 text-lg rounded-xl" disabled={isSearching}>
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track Now'}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence>
        {foundConsignment && (
          <section id="results" className="py-20 bg-muted/30">
            <div className="max-w-4xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold tracking-tight">Shipment Details</h2>
                  <Button variant="outline" size="sm" onClick={() => setFoundConsignment(null)}>Clear Result</Button>
                </div>
                <TrackingView consignment={foundConsignment} />
              </motion.div>
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose RapidConsign?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We leverage advanced technology to provide the most transparent and efficient logistics experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-muted/50 transition-colors">
              <div className="bg-primary/10 p-4 rounded-2xl mb-6">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Network</h3>
              <p className="text-muted-foreground">
                Ship to over 150 countries with our reliable network of international partners.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-muted/50 transition-colors">
              <div className="bg-primary/10 p-4 rounded-2xl mb-6">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Handling</h3>
              <p className="text-muted-foreground">
                Your packages are handled with the utmost care and secured with tamper-proof tech.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-muted/50 transition-colors">
              <div className="bg-primary/10 p-4 rounded-2xl mb-6">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Speedy Delivery</h3>
              <p className="text-muted-foreground">
                Express shipping options that ensure your consignment reaches its destination on time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Ship Your Package?</h2>
              <p className="text-primary-foreground/80 mb-10 text-lg max-w-xl mx-auto">
                Join thousands of businesses and individuals who trust RapidConsign for their logistics needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="h-12 px-8 font-semibold">
                  Get a Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 font-semibold border-white/20 hover:bg-white/10 text-white">
                  Contact Sales
                </Button>
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      <Toaster position="bottom-right" />
    </Layout>
  );
}

export default App;