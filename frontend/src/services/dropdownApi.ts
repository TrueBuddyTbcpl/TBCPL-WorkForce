import { apiClient } from '../lib/api-client';

export const getDropdownOptions = (fieldName: string): Promise<string[]> =>
  apiClient
    .get(`/operation/dropdowns/${fieldName}`)
    .then((res) => res.data?.data ?? []);

export const saveCustomOption = (fieldName: string, value: string): Promise<void> =>
  apiClient
    .post('/operation/dropdown-options', { fieldName, value })
    .then(() => undefined);