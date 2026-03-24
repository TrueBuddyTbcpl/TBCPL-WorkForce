import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProposalSchema, type CreateProposalFormData } from '../../../../schemas/proposal.schemas';
import { ProposalServiceType, ProposalServiceTypeLabels } from '../../../../types/proposal.types';
import type { ProposalDetailResponse } from '../../../../types/proposal.types';

interface Props {
  proposal:   ProposalDetailResponse | null;
  clients:    { clientId: number; clientName: string }[];
  onSave:     (data: CreateProposalFormData) => void;
  isSaving:   boolean;
}

const Step1Main: React.FC<Props> = ({ proposal, clients, onSave, isSaving }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProposalFormData>({
    resolver: zodResolver(createProposalSchema),
  });

  useEffect(() => {
    if (proposal) {
      reset({
        clientId:          proposal.clientId,
        clientCompanyType: proposal.clientCompanyType || '',
        suspectEntityName: proposal.suspectEntityName || '',
        suspectEntityType: proposal.suspectEntityType || '',
        projectTitle:      proposal.projectTitle || '',
        proposalDate:      proposal.proposalDate ? proposal.proposalDate.substring(0, 10) : '',
        targetProducts:    proposal.targetProducts || '',
        serviceType:       proposal.serviceType,
      });
    }
  }, [proposal, reset]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-5">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Basic Information</h3>

      {/* Client */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Client <span className="text-red-500">*</span></label>
        <select {...register('clientId', { valueAsNumber: true })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value={0}>-- Select Client --</option>
          {clients.map(c => <option key={c.clientId} value={c.clientId}>{c.clientName}</option>)}
        </select>
        {errors.clientId && <p className="text-red-500 text-xs mt-1">{errors.clientId.message}</p>}
      </div>

      {/* Client Company Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Client Company Type</label>
        <input {...register('clientCompanyType')} placeholder="e.g. Private Limited"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Suspect Entity Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Suspect Entity Name</label>
          <input {...register('suspectEntityName')} placeholder="e.g. Star Bioscience"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {/* Suspect Entity Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Suspect Entity Type</label>
          <input {...register('suspectEntityType')} placeholder="e.g. Manufacturer"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Project Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
        <input {...register('projectTitle')} placeholder="e.g. Due Diligence of Star Bioscience"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Proposal Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Date <span className="text-red-500">*</span></label>
          <input {...register('proposalDate')} type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.proposalDate && <p className="text-red-500 text-xs mt-1">{errors.proposalDate.message}</p>}
        </div>
        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Type <span className="text-red-500">*</span></label>
          <select {...register('serviceType')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">-- Select Service Type --</option>
            {Object.values(ProposalServiceType).map(v => (
              <option key={v} value={v}>{ProposalServiceTypeLabels[v]}</option>
            ))}
          </select>
          {errors.serviceType && <p className="text-red-500 text-xs mt-1">{errors.serviceType.message}</p>}
        </div>
      </div>

      {/* Target Products */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Target Products</label>
        <input {...register('targetProducts')} placeholder="e.g. Spinosad 45, Spinetoram 81"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {isSaving ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </form>
  );
};

export default Step1Main;
