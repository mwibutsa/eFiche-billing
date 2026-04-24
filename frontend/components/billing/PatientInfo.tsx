import { Patient, Visit } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { User, Shield, IdCard } from 'lucide-react';

interface PatientInfoProps {
  patient: Patient;
  visit: Visit;
}

export function PatientInfo({ patient, visit }: PatientInfoProps) {
  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
               <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{patient.name}</h2>
              <div className="flex items-center text-blue-100 mt-1 space-x-3">
                 <span className="flex items-center text-xs">
                    <IdCard className="h-3 w-3 mr-1" />
                    ID: {patient.national_id || 'N/A'}
                 </span>
                 <span className="h-1 w-1 rounded-full bg-blue-200/50" />
                 <span className="flex items-center text-xs font-semibold uppercase tracking-wider">
                    {visit.status}
                 </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end space-y-2">
            <div className="flex items-center bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-sm">
               <Shield className="h-4 w-4 mr-2 text-blue-200" />
               <div className="text-left">
                  <p className="text-[10px] text-blue-200 uppercase font-bold leading-none">Insurance</p>
                  <p className="text-sm font-semibold leading-tight">{patient.insurance?.name || 'Self-Pay (No Insurance)'}</p>
               </div>
            </div>
            {patient.insurance_number && (
              <p className="text-xs text-blue-200">Policy: <span className="text-white font-mono">{patient.insurance_number}</span></p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
