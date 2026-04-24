'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Visit } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { isLoading } = useQuery<Visit[]>({
    queryKey: ['visits'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/visits');
        return data.data;
      } catch {
        return [];
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">eFiche Billing</h1>
          <p className="text-slate-500">Facility Patient Billing Management System</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Billing Module</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                This is the prototype for the Facility Patient Billing Module. 
                You can access a patient&apos;s billing page by their Visit ID.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Quick Access (Seeded Data)
                </h4>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Jean Baptiste</p>
                        <p className="text-xs text-slate-400">Visit Status: Open</p>
                      </div>
                    </div>
                    <Link href="/visits/019dbfbd-0ccf-735e-b7ac-175e58974576/billing">
                      <Button size="sm">Open Billing</Button>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Alice Umutoni</p>
                        <p className="text-xs text-slate-400">Visit Status: Billed</p>
                      </div>
                    </div>
                    <Link href="/visits/019dbfbd-0cd2-72a2-bb56-2c4a6423f819/billing">
                      <Button size="sm">Manage Invoice</Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400 italic">
                  Note: The Visit IDs above are from the latest database seeding. 
                  If you refreshed the database, these might need to be updated.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
