"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Visit } from "@/lib/types";
import { useStats } from "@/hooks/useBilling";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  User,
  ArrowRight,
  Activity,
  ShieldCheck,
  BarChart3,
  ChevronRight,
  Receipt,
  Search,
  Wallet,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { useState } from "react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: visits, isLoading: isLoadingVisits } = useQuery<Visit[]>({
    queryKey: ["visits"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/visits");
        return data.data;
      } catch {
        return [];
      }
    },
  });

  const { data: stats, isLoading: isLoadingStats } = useStats();

  const filteredVisits = visits?.filter((visit) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      visit.patient.name.toLowerCase().includes(searchLower) ||
      visit.id.toLowerCase().includes(searchLower) ||
      (visit.patient.insurance?.name.toLowerCase().includes(searchLower) ??
        false)
    );
  });

  if (isLoadingVisits || isLoadingStats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative">
          <div className="h-20 w-20 rounded-[4px] border-[6px] border-slate-100 border-t-blue-600 animate-spin" />
          <Activity className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-6 text-slate-600 font-normal tracking-widest uppercase text-xs animate-pulse">
          Synchronizing eFiche...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Top Banner */}
      <div className="bg-blue-600 text-white py-2 px-4 text-center text-xs font-normal tracking-wide uppercase">
        eFiche Facility Management System • Billing Module Prototype v1.0
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 bg-blue-600 rounded-[4px] flex items-center justify-center ">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-normal tracking-tight text-slate-900">
                  eFiche
                </span>
                <span className="text-blue-600 font-normal ml-1">Billing</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-10">
              <a
                href="#overview"
                className="text-sm font-normal text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Overview
              </a>
              <a
                href="#queue"
                className="text-sm font-normal text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Billing Queue
              </a>
              <a
                href="#reports"
                className="text-sm font-normal text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Reports
              </a>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-slate-800 text-slate-900 rounded-[4px] px-8 font-normal "
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section - Nexun Inspired */}
        <section
          id="overview"
          className="relative pt-20 pb-24 overflow-hidden bg-white"
        >
          <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 skew-x-[-12deg] translate-x-20 -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none px-4 py-1.5 rounded-[4px] text-xs font-normal uppercase tracking-widest">
                  Healthcare Financial Cloud
                </Badge>
                <h1 className="text-6xl lg:text-7xl font-normal tracking-tight text-slate-900 leading-[1.05]">
                  Streamline Your <br />
                  <span className="text-blue-600">Facility Billing.</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  Integrate clinical data with financial processing. Efficiently
                  manage invoices, payments, and insurance claims in one unified
                  platform.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-[4px] px-10 h-16 text-lg font-normal group"
                  >
                    Launch Queue
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <div className="flex items-center gap-4 px-6 border-l-2 border-slate-100 ml-2">
                    <div className="h-12 w-12 rounded-[4px] bg-emerald-50 flex items-center justify-center text-emerald-600 font-normal">
                      100%
                    </div>
                    <div className="text-sm font-normal text-slate-600 uppercase tracking-tighter">
                      Secure & <br /> Database-Driven
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Stats Cards */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="rounded-[10px] border-none bg-[#F1F5F9] p-8 ">
                  <div className="h-14 w-14 bg-white rounded-[4px] flex items-center justify-center mb-10 ">
                    <TrendingUp className="h-7 w-7 text-blue-600" />
                  </div>
                  <p className="text-slate-600 font-normal uppercase tracking-widest text-[10px] mb-2">
                    Collection Rate
                  </p>
                  <h3 className="text-4xl font-normal text-slate-900">
                    {stats?.collection_rate}%
                  </h3>
                </Card>
                <Card className="rounded-[10px] border-none bg-blue-600 text-white p-8 ">
                  <div className="h-14 w-14 bg-blue-500 rounded-[4px] flex items-center justify-center mb-10 ">
                    <Wallet className="h-7 w-7 text-slate-900" />
                  </div>
                  <p className="text-blue-50 font-normal uppercase tracking-widest text-[10px] mb-2">
                    Total Billed
                  </p>
                  <h3 className="text-4xl font-normal text-white">
                    {new Intl.NumberFormat("en-RW", {
                      notation: "compact",
                    }).format(Number(stats?.total_billed || 0))}
                  </h3>
                </Card>
                <Card className="rounded-[10px] border-none bg-amber-50 p-8 col-span-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div>
                        <p className="text-amber-600 font-normal uppercase tracking-widest text-[10px] mb-2">
                          Pending Invoices
                        </p>
                        <h3 className="text-5xl font-normal text-amber-900">
                          {stats?.pending_invoices}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-amber-600 font-normal text-xl mb-1">
                        Queue Live
                      </div>
                      <div className="text-amber-500/70 text-xs font-normal uppercase tracking-widest">
                        Next Shift: 18:00
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section id="queue" className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div>
                <h2 className="text-4xl font-normal tracking-tight text-slate-900 mb-2">
                  Billing Queue
                </h2>
                <p className="text-slate-600 font-normal">
                  Manage active patient visits and processing status.
                </p>
              </div>
              <div className="relative group w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-blue-600 transition-colors" />
                <input
                  placeholder="Search patient, visit ID, or insurance..."
                  className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-[4px] focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none font-normal transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* List of Visits */}
            <div className="grid gap-4">
              {filteredVisits && filteredVisits.length > 0 ? (
                filteredVisits.map((visit) => (
                  <Card
                    key={visit.id}
                    className="group overflow-hidden border-slate-200 bg-white hover:border-blue-300 transition-all duration-300 rounded-[32px] hover:"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row md:items-center p-8 gap-6">
                        <div className="h-16 w-16 rounded-[24px] bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                          <User className="h-8 w-8 text-slate-600 group-hover:text-blue-600 transition-colors" />
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h4 className="text-2xl font-normal text-slate-900">
                              {visit.patient.name}
                            </h4>
                            <div className="flex gap-2">
                              {visit.invoice ? (
                                <Badge
                                  className={cn(
                                    "text-[10px] uppercase font-normal px-3 py-1 rounded-[4px]",
                                    visit.invoice.is_fully_paid
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-blue-100 text-blue-700",
                                  )}
                                >
                                  {visit.invoice.is_fully_paid
                                    ? "Settled"
                                    : "Awaiting Payment"}
                                </Badge>
                              ) : (
                                <Badge className="bg-slate-100 text-slate-600 text-[10px] uppercase font-normal px-3 py-1 rounded-[4px]">
                                  New Visit
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                              <p className="text-[10px] text-slate-600 uppercase font-normal tracking-widest leading-none">
                                Visit ID
                              </p>
                              <p className="text-sm font-normal text-slate-600 font-mono truncate">
                                {visit.id}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] text-slate-600 uppercase font-normal tracking-widest leading-none">
                                Arrival Time
                              </p>
                              <p className="text-sm font-normal text-slate-600">
                                {new Date(visit.visited_at).toLocaleString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  day: "2-digit",
                                  month: "short",
                                })}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] text-slate-600 uppercase font-normal tracking-widest leading-none">
                                Insurance
                              </p>
                              <p className="text-sm font-normal text-slate-600">
                                {visit.patient.insurance?.name || "Self-Pay"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] text-slate-600 uppercase font-normal tracking-widest leading-none">
                                Total Amount
                              </p>
                              <p className="text-sm font-normal text-blue-600">
                                {visit.invoice
                                  ? new Intl.NumberFormat("en-RW", {
                                      style: "currency",
                                      currency: "RWF",
                                      minimumFractionDigits: 0,
                                    }).format(
                                      Number(visit.invoice.total_amount || 0),
                                    )
                                  : "---"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/visits/${visit.id}/billing`}
                          passHref
                          className="w-full md:w-auto"
                        >
                          <Button
                            size="lg"
                            className="w-full md:w-auto bg-slate-100 hover:bg-blue-600 text-slate-900 hover:text-white rounded-[4px] px-8 font-normal transition-all group/btn border border-slate-200"
                          >
                            {visit.invoice ? "Process" : "Generate"}
                            <ChevronRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="p-24 text-center bg-white rounded-[4px] border-2 border-dashed border-slate-200">
                  <div className="h-20 w-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                    <Receipt className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-normal text-slate-900 mb-2">
                    Your Queue is Empty
                  </h3>
                  <p className="text-slate-600 font-normal max-w-sm mx-auto">
                    All active visits have been processed. Run seeders to
                    populate new test data.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Feature Grid - Nexun Inspired */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="space-y-6">
                <div className="h-16 w-16 bg-blue-50 rounded-[4px] flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-normal text-slate-900">
                  Real-time Analytics
                </h3>
                <p className="text-slate-600 leading-relaxed font-normal">
                  Monitor your facility&apos;s financial health with live
                  collection rates, revenue trends, and outstanding balance
                  reports.
                </p>
              </div>
              <div className="space-y-6">
                <div className="h-16 w-16 bg-indigo-50 rounded-[4px] flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-normal text-slate-900">
                  Insurance Verification
                </h3>
                <p className="text-slate-600 leading-relaxed font-normal">
                  Automated split-billing between patients and insurance
                  providers. Ensure accurate claims processing and reduced
                  errors.
                </p>
              </div>
              <div className="space-y-6">
                <div className="h-16 w-16 bg-emerald-50 rounded-[4px] flex items-center justify-center">
                  <Activity className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-normal text-slate-900">
                  Seamless Integration
                </h3>
                <p className="text-slate-600 leading-relaxed font-normal">
                  Directly synchronized with eFiche clinical records. Fetch
                  visit data, diagnosis, and services instantly for billing.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 py-24 text-slate-900 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20 border-b border-slate-200 pb-20">
            <div className="space-y-6 max-w-md">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-600 rounded-[4px] flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-normal tracking-tight">
                  eFiche Billing
                </span>
              </div>
              <p className="text-slate-600 font-normal">
                The next generation of healthcare financial management.
                Empowering medical facilities with smart billing solutions.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div className="space-y-4">
                <h4 className="text-xs font-normal uppercase tracking-[0.2em] text-blue-500">
                  Platform
                </h4>
                <ul className="space-y-2 text-slate-600 text-sm font-normal">
                  <li className="hover:text-slate-900 cursor-pointer">
                    Dashboard
                  </li>
                  <li className="hover:text-slate-900 cursor-pointer">
                    Visits
                  </li>
                  <li className="hover:text-slate-900 cursor-pointer">
                    Claims
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-normal uppercase tracking-[0.2em] text-blue-500">
                  Resources
                </h4>
                <ul className="space-y-2 text-slate-600 text-sm font-normal">
                  <li className="hover:text-slate-900 cursor-pointer">
                    Documentation
                  </li>
                  <li className="hover:text-slate-900 cursor-pointer">
                    API Reference
                  </li>
                  <li className="hover:text-slate-900 cursor-pointer">
                    Status
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-slate-600 text-xs font-normal uppercase tracking-widest flex flex-col md:flex-row justify-between gap-4">
            <p>© 2026 eFiche Billing System • Built with Clinical Precision</p>
            <p>Made in Kigali, Rwanda</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
