import React from 'react';
import { Package, Lock, ShieldCheck, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Layout: React.FC<{ children: React.ReactNode; onAdminClick: () => void; showNav?: boolean }> = ({ children, onAdminClick, showNav = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      {showNav && (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
                <div className="bg-primary p-1.5 rounded-lg">
                  <Package className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight">RapidConsign</span>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onAdminClick} className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Admin
                </Button>
              </div>
            </div>
          </div>
        </nav>
      )}
      
      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-muted/50 border-t">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold tracking-tight">RapidConsign</span>
              </div>
              <p className="text-muted-foreground max-w-xs">
                Next-generation logistics management and tracking solution for modern commerce. Efficient, secure, and transparent.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-primary cursor-pointer">About Us</li>
                <li className="hover:text-primary cursor-pointer">Contact</li>
                <li className="hover:text-primary cursor-pointer">Privacy Policy</li>
                <li className="hover:text-primary cursor-pointer">Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                Verified Secure
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} RapidConsign Logistics. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};