import { useState, useEffect, useCallback } from 'react';
import { loaApi } from '../../services/api/loaApi';
import type { LoaResponse, EmployeeDropdown, ClientDropdown } from '../../types/loa.types';
import { toast } from 'sonner';

export function useLoaList(page = 0, size = 10) {
  const [loas, setLoas] = useState<LoaResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await loaApi.getAllLoas(page, size);
      setLoas(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => { fetch(); }, [fetch]);

  return { loas, totalPages, totalElements, loading, error, refetch: fetch };
}

export function useLoaDropdowns() {
  const [employees, setEmployees] = useState<EmployeeDropdown[]>([]);
  const [clients, setClients] = useState<ClientDropdown[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([loaApi.getEmployeeDropdown(), loaApi.getClientDropdown()])
      .then(([e, c]) => { setEmployees(e); setClients(c); })
      .catch(() => toast.error('Failed to load dropdown data.'))
      .finally(() => setLoading(false));
  }, []);

  return { employees, clients, loading };
}

export function useFieldAssociateLoaList(employeeId: number, page = 0, size = 10) {
  const [loas, setLoas] = useState<LoaResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const data = await loaApi.getLoasByEmployee(employeeId, page, size);
      setLoas(data.content);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Failed to load your LOAs.');
    } finally {
      setLoading(false);
    }
  }, [employeeId, page, size]);

  useEffect(() => { fetch(); }, [fetch]);

  return { loas, totalPages, loading, refetch: fetch };
}
