import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Visit,
  Invoice,
  Insurance,
  PaymentMethod,
  BillingItem,
} from "@/lib/types";

export function useVisit(visitId: string) {
  return useQuery<Visit>({
    queryKey: ["visit", visitId],
    queryFn: async () => {
      const { data } = await api.get(`/visits/${visitId}`);
      return data.data;
    },
    enabled: !!visitId,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await api.get("/stats");
      return data.data;
    },
  });
}

export function useInvoice(invoiceId: string) {
  return useQuery<Invoice>({
    queryKey: ["invoice", invoiceId],
    queryFn: async () => {
      const { data } = await api.get(`/invoices/${invoiceId}`);
      return data.data;
    },
    enabled: !!invoiceId,
    // Polling if invoice is not fully paid (for mobile money)
    refetchInterval: (query) => {
      const invoice = query.state.data as Invoice | undefined;
      return invoice && !invoice.is_fully_paid ? 5000 : false;
    },
  });
}

export function useFacilityInsurances(facilityId: string) {
  return useQuery<Insurance[]>({
    queryKey: ["insurances", facilityId],
    queryFn: async () => {
      const { data } = await api.get(`/facilities/${facilityId}/insurances`);
      return data.data;
    },
    enabled: !!facilityId,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      visitId,
      items,
    }: {
      visitId: string;
      items: BillingItem[];
    }) => {
      const { data } = await api.post(`/visits/${visitId}/invoices`, { items });
      return data.data;
    },
    onSuccess: (_, { visitId }) => {
      queryClient.invalidateQueries({ queryKey: ["visit", visitId] });
    },
  });
}

export function useProcessPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      invoiceId,
      amount,
      method,
    }: {
      invoiceId: string;
      amount: number;
      method: PaymentMethod;
    }) => {
      const { data } = await api.post(`/invoices/${invoiceId}/payments`, {
        amount,
        method,
      });
      return data.data;
    },
    onSuccess: (_, { invoiceId }) => {
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
    },
  });
}
