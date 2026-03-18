import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ChevronDown, ArrowLeft, Save } from 'lucide-react';
import { loaApi } from '../../../services/api/loaApi';
import { useLoaDropdowns } from '../../../hooks/loa/useLoa';
import type { LoaResponse } from '../../../types/loa.types';
import { toast } from 'sonner';

/**
 * All form fields are strings — HTML <select> always yields strings.
 * Numbers are only constructed in onSubmit when building the API payload.
 * This avoids ALL Zod v4 coerce/preprocess type inference issues.
 */
const schema = z.object({
  employeeId: z.string().min(1, 'Please select an employee'),
  clientId:   z.string().min(1, 'Please select a client'),
  validUpto:  z.string().min(1, 'Valid upto date is required'),
});

type FormValues = z.infer<typeof schema>;

const AdminLoaCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { employees, clients, loading: dropdownLoading } = useLoaDropdowns();
  const [submitting, setSubmitting] = useState(false);
  const [existingLoa, setExistingLoa] = useState<LoaResponse | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: '',
      clientId:   '',
      validUpto:  '',
    },
  });

  const selectedEmployeeId = watch('employeeId');
  const selectedClientId   = watch('clientId');

  useEffect(() => {
    if (isEdit && id) {
      loaApi.getLoaById(Number(id))
        .then(loa => {
          setExistingLoa(loa);
          // Convert numbers → strings for the form
          setValue('employeeId', String(loa.employeeId));
          setValue('clientId',   String(loa.clientId));
          setValue('validUpto',  loa.validUpto);
        })
        .catch(() => toast.error('Failed to load LOA data.'));
    }
  }, [isEdit, id, setValue]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      // Convert strings → numbers only here, when building the API payload
      const payload = {
        employeeId: Number(values.employeeId),
        clientId:   Number(values.clientId),
        validUpto:  values.validUpto,
      };

      if (isEdit && id) {
        await loaApi.updateLoa(Number(id), payload);
        toast.success('LOA updated successfully.');
      } else {
        const created = await loaApi.createLoa(payload);
        toast.success(`LOA ${created.loaNumber} created successfully.`);
      }
      navigate('/admin/loa');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to save LOA.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/loa')}
          className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit LOA' : 'Generate New LOA'}
          </h2>
          {isEdit && existingLoa && (
            <p className="text-sm text-gray-500 mt-0.5">{existingLoa.loaNumber}</p>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {dropdownLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-500">Loading form data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Employee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field Associate Employee <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className={`w-full px-4 py-3 border rounded-lg appearance-none bg-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.employeeId ? 'border-red-400' : 'border-gray-300'
                  }`}
                  value={selectedEmployeeId}
                  onChange={e => setValue('employeeId', e.target.value, { shouldValidate: true })}
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map(e => (
                    <option key={e.id} value={String(e.id)}>
                      {e.fullName} ({e.empId})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.employeeId && (
                <p className="mt-1 text-xs text-red-500">{errors.employeeId.message}</p>
              )}
            </div>

            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className={`w-full px-4 py-3 border rounded-lg appearance-none bg-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.clientId ? 'border-red-400' : 'border-gray-300'
                  }`}
                  value={selectedClientId}
                  onChange={e => setValue('clientId', e.target.value, { shouldValidate: true })}
                >
                  <option value="">-- Select Client --</option>
                  {clients.map(c => (
                    <option key={c.clientId} value={String(c.clientId)}>
                      {c.clientName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.clientId && (
                <p className="mt-1 text-xs text-red-500">{errors.clientId.message}</p>
              )}
            </div>

            {/* Valid Upto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid Upto <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                {...register('validUpto')}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500 ${
                  errors.validUpto ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.validUpto && (
                <p className="mt-1 text-xs text-red-500">{errors.validUpto.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg
                  hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {submitting
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Save className="w-4 h-4" />}
                {isEdit ? 'Update LOA' : 'Generate LOA'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/loa')}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLoaCreate;
