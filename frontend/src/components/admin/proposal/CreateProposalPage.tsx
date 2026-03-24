import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useProposal, useCreateProposal, useUpdateProposal,
  useSaveBackground, useSaveScope, useSaveMethodology, useSaveFee,
  useSavePaymentTerms, useSaveConfidentiality, useSaveObligations, useSaveConclusion,
} from '../../../hooks/useProposal';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../services/api/apiClient';
import { ADMIN_ENDPOINTS } from '../../../utils/constants';
import ProposalBreadcrumb from './shared/ProposalBreadcrumb';
import Step1Main          from './steps/Step1Main';
import Step2Background    from './steps/Step2Background';
import Step3ScopeOfWork   from './steps/Step3ScopeOfWork';
import Step4Methodology   from './steps/Step4Methodology';
import Step5ProfessionalFee from './steps/Step5ProfessionalFee';
import Step6PaymentTerms  from './steps/Step6PaymentTerms';
import Step7Confidentiality from './steps/Step7Confidentiality';
import Step8Obligations   from './steps/Step8Obligations';
import Step9Conclusion    from './steps/Step9Conclusion';

const CreateProposalPage: React.FC = () => {
  const navigate           = useNavigate();
  const { id }             = useParams<{ id?: string }>();
  const proposalId         = id ? parseInt(id) : null;
  const isEdit             = !!proposalId;
  const [currentStep, setCurrentStep] = useState(0);
  const [localProposalId, setLocalProposalId] = useState<number | null>(proposalId);

  const { data: proposalData, isLoading } = useProposal(localProposalId || 0);
  const proposal = proposalData?.data || null;

  const { data: clientsData } = useQuery({
    queryKey: [ADMIN_ENDPOINTS.CLIENTS],
    queryFn:  () => apiClient.get(ADMIN_ENDPOINTS.CLIENTS).then(r => r.data),
  });
  const clients = clientsData?.data || [];

  const createMutation   = useCreateProposal();
  const updateMutation   = useUpdateProposal(localProposalId || 0);
  const bgMutation       = useSaveBackground(localProposalId || 0);
  const scopeMutation    = useSaveScope(localProposalId || 0);
  const methodMutation   = useSaveMethodology(localProposalId || 0);
  const feeMutation      = useSaveFee(localProposalId || 0);
  const paymentMutation  = useSavePaymentTerms(localProposalId || 0);
  const confMutation     = useSaveConfidentiality(localProposalId || 0);
  const obligMutation    = useSaveObligations(localProposalId || 0);
  const concMutation     = useSaveConclusion(localProposalId || 0);

  const steps = proposal?.steps || Array(9).fill(null).map((_, i) => ({
    stepName: ['MAIN','BACKGROUND','SCOPE_OF_WORK','APPROACH_METHODOLOGY','PROFESSIONAL_FEE','PAYMENT_TERMS','CONFIDENTIALITY','SPECIAL_OBLIGATIONS','CONCLUSION'][i] as any,
    status: 'NOT_COMPLETED' as any,
  }));

  const handleStep1Save = async (data: any) => {
    if (!localProposalId) {
      const res = await createMutation.mutateAsync(data);
      setLocalProposalId(res.data.proposalId);
      setCurrentStep(1);
    } else {
      await updateMutation.mutateAsync(data);
      setCurrentStep(1);
    }
  };

  if (isLoading && isEdit) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading proposal...</div>;
  }

  const renderStep = () => {
    const pid = localProposalId || 0;
    switch (currentStep) {
      case 0: return <Step1Main proposal={proposal} clients={clients} onSave={handleStep1Save} isSaving={createMutation.isPending || updateMutation.isPending} />;
      case 1: return <Step2Background data={proposal?.background || null} onSave={d => bgMutation.mutate(d, { onSuccess: () => setCurrentStep(2) })} isSaving={bgMutation.isPending} />;
      case 2: return <Step3ScopeOfWork data={proposal?.scopeOfWork || null} onSave={d => scopeMutation.mutate(d, { onSuccess: () => setCurrentStep(3) })} isSaving={scopeMutation.isPending} />;
      case 3: return <Step4Methodology data={proposal?.methodology || null} onSave={d => methodMutation.mutate(d, { onSuccess: () => setCurrentStep(4) })} isSaving={methodMutation.isPending} />;
      case 4: return <Step5ProfessionalFee data={proposal?.professionalFee || null} onSave={d => feeMutation.mutate(d, { onSuccess: () => setCurrentStep(5) })} isSaving={feeMutation.isPending} />;
      case 5: return <Step6PaymentTerms data={proposal?.paymentTerms || null} onSave={d => paymentMutation.mutate(d, { onSuccess: () => setCurrentStep(6) })} isSaving={paymentMutation.isPending} />;
      case 6: return <Step7Confidentiality data={proposal?.confidentiality || null} onSave={d => confMutation.mutate(d, { onSuccess: () => setCurrentStep(7) })} isSaving={confMutation.isPending} />;
      case 7: return <Step8Obligations data={proposal?.specialObligations || null} clientName={proposal?.clientName || ''} onSave={d => obligMutation.mutate(d, { onSuccess: () => setCurrentStep(8) })} isSaving={obligMutation.isPending} />;
      case 8: return <Step9Conclusion data={proposal?.conclusion || null} clientName={proposal?.clientName || ''} onSave={d => concMutation.mutate(d, { onSuccess: () => navigate(`/admin/proposals/${pid}/preview`) })} isSaving={concMutation.isPending} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/admin/proposals')} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-gray-900">{isEdit ? 'Edit Proposal' : 'New Proposal'}</h1>
          {proposal?.proposalCode && <p className="text-xs text-gray-500">{proposal.proposalCode}</p>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <ProposalBreadcrumb steps={steps} currentStep={currentStep} onStepClick={idx => {
          if (localProposalId || idx === 0) setCurrentStep(idx);
        }} />

        {/* Step Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition">
            ← Previous
          </button>
          {currentStep < 8 && (
            <button onClick={() => { if (localProposalId) setCurrentStep(s => Math.min(8, s + 1)); }}
              disabled={!localProposalId}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition">
              Skip →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProposalPage;
