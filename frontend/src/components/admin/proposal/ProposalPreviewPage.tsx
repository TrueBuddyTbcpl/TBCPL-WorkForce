import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Mail, Pencil, CheckCircle,
  Clock, AlertCircle, XCircle, Loader2, Upload, ChevronDown,
} from 'lucide-react';
import { useProposal, useUpdateProposalStatus, useUploadSignatureStamp } from '../../../hooks/useProposal';
import { useAuthStore } from '../../../stores/authStore';
import ProposalStatusBadge from './shared/ProposalStatusBadge';
import { ProposalStatus } from '../../../types/proposal.types';
import type {
  ProposalDetailResponse,
  ProposalStatusUpdateRequest,
} from '../../../types/proposal.types';
import { toast } from 'sonner';

// ─── Status Update Modal ──────────────────────────────────────────────────────

interface StatusModalProps {
  currentStatus: string;
  onConfirm:     (req: ProposalStatusUpdateRequest) => void;
  onClose:       () => void;
  isSaving:      boolean;
}

const StatusModal: React.FC<StatusModalProps> = ({ currentStatus, onConfirm, onClose, isSaving }) => {
  const [status, setStatus]   = useState<string>(currentStatus);
  const [remarks, setRemarks] = useState('');
  const [sections, setSections] = useState('');

  const statusOptions = [
    { value: ProposalStatus.DRAFT,                label: 'Draft',                  icon: <Clock className="w-4 h-4 text-gray-500" /> },
    { value: ProposalStatus.IN_PROGRESS,          label: 'In Progress',            icon: <Loader2 className="w-4 h-4 text-blue-500" /> },
    { value: ProposalStatus.WAITING_FOR_APPROVAL, label: 'Waiting for Approval',   icon: <Clock className="w-4 h-4 text-yellow-500" /> },
    { value: ProposalStatus.REQUEST_FOR_CHANGES,  label: 'Request for Changes',    icon: <AlertCircle className="w-4 h-4 text-orange-500" /> },
    { value: ProposalStatus.APPROVED,             label: 'Approved',               icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
    { value: ProposalStatus.DECLINED,             label: 'Declined',               icon: <XCircle className="w-4 h-4 text-red-500" /> },
  ];

  const needsRemarks = status === ProposalStatus.REQUEST_FOR_CHANGES;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Update Proposal Status</h3>
        </div>
        <div className="p-6 space-y-4">
          {/* Status Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
            <div className="space-y-2">
              {statusOptions.map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm transition
                    ${status === opt.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                >
                  {opt.icon}
                  {opt.label}
                  {status === opt.value && <CheckCircle className="w-4 h-4 ml-auto text-blue-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Remarks — required when REQUEST_FOR_CHANGES */}
          {needsRemarks && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks <span className="text-red-500">*</span>
              </label>
              <textarea value={remarks} onChange={e => setRemarks(e.target.value)}
                rows={3} placeholder="Explain what changes are required..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sections Needing Changes</label>
                <input value={sections} onChange={e => setSections(e.target.value)}
                  placeholder="e.g. Background, Professional Fee"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} disabled={isSaving}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            onClick={() => {
              if (needsRemarks && !remarks.trim()) {
                toast.error('Remarks are required when requesting changes');
                return;
              }
              onConfirm({ status: status as any, remarks, sectionsNeedingChanges: sections });
            }}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Section Block ─────────────────────────────────────────────────────────────

interface SectionProps {
  title:    string;
  children: React.ReactNode;
  isEmpty?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, children, isEmpty }) => (
  <div className="mb-8">
    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 pb-2 border-b border-gray-200">
      {title}
    </h2>
    {isEmpty
      ? <p className="text-sm text-gray-400 italic">Not filled yet.</p>
      : children}
  </div>
);

// ─── Bullet List ───────────────────────────────────────────────────────────────

const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-1.5">
    {items.map((item, idx) => (
      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
        <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

// ─── Main Preview Page ─────────────────────────────────────────────────────────

const ProposalPreviewPage: React.FC = () => {
  const { id }       = useParams<{ id: string }>();
  const navigate     = useNavigate();
  const proposalId   = parseInt(id || '0');
  const { user }     = useAuthStore();
  const printRef     = useRef<HTMLDivElement>(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showSignatureUpload, setShowSignatureUpload] = useState(false);

  const { data, isLoading } = useProposal(proposalId);
  const statusMutation      = useUpdateProposalStatus(proposalId);
  const signatureMutation   = useUploadSignatureStamp(proposalId);

  const proposal: ProposalDetailResponse | null = data?.data || null;

  const isAdmin    = user?.roleName === 'SUPER_ADMIN' || user?.roleName === 'HR_MANAGER';
  const isApproved = proposal?.status === ProposalStatus.APPROVED;
  const canEdit    = !isApproved || isAdmin;

  // ── PDF Export via browser print ─────────────────────────────────────────────
  const handleExportPDF = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const win     = window.open('', '_blank');
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${proposal?.proposalCode || 'Proposal'}</title>
          <meta charset="utf-8" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Times New Roman', serif; font-size: 12pt; color: #111; padding: 40px; line-height: 1.7; }
            h1 { font-size: 18pt; text-align: center; margin-bottom: 6px; }
            h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 1px; color: #555; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin: 24px 0 10px; }
            h3 { font-size: 11pt; font-weight: 600; margin: 16px 0 6px; }
            p, li { font-size: 11pt; margin-bottom: 6px; }
            ul { padding-left: 20px; }
            li { list-style: disc; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
            th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 10pt; }
            th { background: #f5f5f5; font-weight: 600; }
            .header-box { text-align: center; margin-bottom: 32px; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
            .meta-item { font-size: 10.5pt; }
            .meta-label { font-weight: 600; color: #333; }
            .signature-block { margin-top: 40px; display: flex; justify-content: space-between; }
            .signature-col { text-align: center; }
            .signature-line { border-top: 1px solid #000; margin-top: 40px; padding-top: 6px; font-size: 10pt; }
            @media print {
              body { padding: 20px; }
              @page { margin: 20mm; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  // ── Signature Upload ──────────────────────────────────────────────────────────
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    signatureMutation.mutate(file, {
      onSuccess: () => setShowSignatureUpload(false),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading proposal...
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-4">
        <AlertCircle className="w-10 h-10 text-gray-300" />
        <p>Proposal not found.</p>
        <button onClick={() => navigate('/admin/proposals')}
          className="text-blue-600 text-sm hover:underline">← Back to Proposals</button>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Top Action Bar ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin/proposals')}
              className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-gray-900 font-mono">{proposal.proposalCode}</h1>
                <ProposalStatusBadge status={proposal.status} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{proposal.clientName} · {proposal.proposalDate}</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Edit — visible if not approved OR admin */}
            {canEdit && (
              <button onClick={() => navigate(`/admin/proposals/${proposalId}/edit`)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                <Pencil className="w-4 h-4" /> Edit
              </button>
            )}

            {/* Export PDF */}
            <button onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
              <Download className="w-4 h-4" /> Export PDF
            </button>

            {/* Admin-only actions */}
            {isAdmin && (
              <>
                {/* Signature Upload */}
                <div className="relative">
                  <button onClick={() => setShowSignatureUpload(s => !s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                    <Upload className="w-4 h-4" />
                    {proposal.signatureStampPath ? 'Update Signature' : 'Upload Signature'}
                  </button>
                  {showSignatureUpload && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-56 z-30">
                      <p className="text-xs text-gray-500 mb-2">Upload CEO signature/stamp (JPG, PNG)</p>
                      <label className="cursor-pointer block">
                        <input type="file" accept="image/*" className="hidden" onChange={handleSignatureUpload}
                          disabled={signatureMutation.isPending} />
                        <span className={`block text-center px-3 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700
                          ${signatureMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                          {signatureMutation.isPending ? 'Uploading...' : 'Choose File'}
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Send Email (placeholder) */}
                {isApproved && (
                  <button onClick={() => toast.info('Email feature coming soon')}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                    <Mail className="w-4 h-4" /> Send Email
                  </button>
                )}

                {/* Status Update */}
                <button onClick={() => setShowStatusModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  <ChevronDown className="w-4 h-4" /> Status
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Printable Proposal Content ────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div ref={printRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-10">

          {/* ── Proposal Header ─────────────────────────────────────────────── */}
          <div className="header-box text-center mb-10">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Prepared by</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{proposal.preparedBy || 'True Buddy Consulting Pvt Ltd'}</h1>
            <div className="w-16 h-0.5 bg-blue-600 mx-auto mt-3 mb-6" />
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
              PROPOSAL FOR {proposal.clientName?.toUpperCase()}
            </h2>
            {proposal.suspectEntityName && (
              <p className="text-base text-gray-600 mt-1 font-medium">
                {proposal.serviceTypeDisplayName?.toUpperCase()} OF {proposal.suspectEntityName?.toUpperCase()}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-3">Date: {proposal.proposalDate}</p>
            <p className="text-xs text-gray-400 mt-1 font-mono">{proposal.proposalCode}</p>
          </div>

          {/* ── Meta Info Grid ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-10 p-5 bg-gray-50 rounded-lg border border-gray-200">
            {[
              { label: 'Client',               value: proposal.clientName },
              { label: 'Client Company Type',  value: proposal.clientCompanyType },
              { label: 'Suspect Entity',        value: proposal.suspectEntityName },
              { label: 'Suspect Entity Type',   value: proposal.suspectEntityType },
              { label: 'Project Title',         value: proposal.projectTitle },
              { label: 'Target Products',       value: proposal.targetProducts },
              { label: 'Service Type',          value: proposal.serviceTypeDisplayName },
              { label: 'Prepared By',           value: proposal.preparedBy },
            ].map(item => item.value ? (
              <div key={item.label}>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{item.label}</span>
                <p className="text-sm text-gray-800 mt-0.5">{item.value}</p>
              </div>
            ) : null)}
          </div>

          {/* ── 1. Background ───────────────────────────────────────────────── */}
          <Section title="Background" isEmpty={!proposal.background?.backgroundText}>
            <p className="text-sm text-gray-700 leading-relaxed">{proposal.background?.backgroundText}</p>
          </Section>

          {/* ── 2. Scope of Work ────────────────────────────────────────────── */}
          <Section title="Scope of Work" isEmpty={!proposal.scopeOfWork?.scopeItems?.length}>
            <BulletList
              items={(proposal.scopeOfWork?.scopeItems || [])
                .filter(i => i.selected)
                .map(i => i.label)}
            />
          </Section>

          {/* ── 3. Approach & Methodology ───────────────────────────────────── */}
          <Section title="Approach & Methodology"
            isEmpty={!proposal.methodology ||
              (!proposal.methodology.desktopDueDiligencePoints?.length &&
               !proposal.methodology.marketGroundIntelligencePoints?.length &&
               !proposal.methodology.productVerificationPoints?.length &&
               !proposal.methodology.testPurchasePoints?.length)}>
            {proposal.methodology && (
              <div className="space-y-5">
                {[
                  { label: 'Desktop & Documentary Due Diligence', items: proposal.methodology.desktopDueDiligencePoints },
                  { label: 'Market Ground Intelligence',          items: proposal.methodology.marketGroundIntelligencePoints },
                  { label: 'Verification of Product Offerings',   items: proposal.methodology.productVerificationPoints },
                  { label: 'Test Purchase Procedure (If Applicable)', items: proposal.methodology.testPurchasePoints },
                ].filter(s => s.items?.length).map(section => (
                  <div key={section.label}>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">{section.label}</h3>
                    <BulletList items={section.items} />
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* ── 4. Professional Fee ─────────────────────────────────────────── */}
          <Section title="Professional Fee" isEmpty={!proposal.professionalFee?.dueDiligenceFeeAmount}>
            {proposal.professionalFee && (
              <div className="space-y-4">
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-700">Item</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-2.5 text-gray-700">Due Diligence Fee (complete due diligence of target entity)</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                        ₹ {Number(proposal.professionalFee.dueDiligenceFeeAmount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                    {(proposal.professionalFee.feeComponents || []).map((comp, idx) => (
                      <tr key={idx} className="text-gray-600">
                        <td className="px-4 py-2.5">{comp.label}</td>
                        <td className="px-4 py-2.5 text-right">
                          {comp.isActuals ? 'At actuals' : comp.amount != null ? `₹ ${Number(comp.amount).toLocaleString('en-IN')}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Special Conditions */}
                {proposal.professionalFee.specialConditions?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Special Conditions</p>
                    <BulletList items={proposal.professionalFee.specialConditions} />
                  </div>
                )}
              </div>
            )}
          </Section>

          {/* ── 5. Payment Terms ────────────────────────────────────────────── */}
          <Section title="Payment Terms" isEmpty={!proposal.paymentTerms?.paymentTermsText}>
            <p className="text-sm text-gray-700 leading-relaxed">{proposal.paymentTerms?.paymentTermsText}</p>
          </Section>

          {/* ── 6. Confidentiality ──────────────────────────────────────────── */}
          <Section title="Confidentiality" isEmpty={!proposal.confidentiality?.paragraphText}>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{proposal.confidentiality?.paragraphText}</p>
            {(proposal.confidentiality?.customPoints?.length ?? 0) > 0 && (
              <BulletList items={proposal.confidentiality!.customPoints} />
            )}
          </Section>

          {/* ── 7. Special Obligations ──────────────────────────────────────── */}
          <Section
            title={`Special Obligations of ${proposal.specialObligations?.clientName || proposal.clientName || 'Client'}`}
            isEmpty={!proposal.specialObligations?.obligationPoints?.length}>
            {proposal.specialObligations?.obligationPoints && (
              <BulletList items={proposal.specialObligations.obligationPoints} />
            )}
          </Section>

          {/* ── 8. Conclusion ───────────────────────────────────────────────── */}
          <Section title="Conclusion" isEmpty={!proposal.conclusion?.paragraphText}>
            <p className="text-sm text-gray-700 leading-relaxed">{proposal.conclusion?.paragraphText}</p>
          </Section>

          {/* ── Signature Block ──────────────────────────────────────────────── */}
          <div className="mt-14 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-end">
              {/* TBCPL Signatory */}
              <div className="text-center min-w-[200px]">
                {proposal.signatureStampPath ? (
                  <img
                    src={proposal.signatureStampPath}
                    alt="Signature & Stamp"
                    className="h-16 mx-auto mb-2 object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="h-16 mb-2 flex items-end justify-center">
                    <div className="w-40 border-t border-gray-400" />
                  </div>
                )}
                <p className="text-sm font-semibold text-gray-800">For True Buddy Consulting Pvt Ltd</p>
                <p className="text-xs text-gray-500 mt-0.5">Authorised Signatory</p>
              </div>

              {/* Client Signatory */}
              <div className="text-center min-w-[200px]">
                <div className="h-16 mb-2 flex items-end justify-center">
                  <div className="w-40 border-t border-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-800">For {proposal.clientName}</p>
                <p className="text-xs text-gray-500 mt-0.5">Authorised Signatory</p>
              </div>
            </div>
          </div>

        </div>{/* end printRef */}

        {/* ── Step Status Summary ─────────────────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Completion Status</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {(proposal.steps || []).map(step => {
              const completed = step.status === 'COMPLETED';
              return (
                <div key={step.stepName}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center
                    ${completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  {completed
                    ? <CheckCircle className="w-5 h-5 text-green-500" />
                    : <Clock className="w-5 h-5 text-gray-300" />}
                  <span className={`text-xs font-medium ${completed ? 'text-green-700' : 'text-gray-400'}`}>
                    {step.stepName.replace(/_/g, ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>{/* end page body */}

      {/* ── Status Modal ─────────────────────────────────────────────────────── */}
      {showStatusModal && (
        <StatusModal
          currentStatus={proposal.status}
          onConfirm={(req) => {
            statusMutation.mutate(req, {
              onSuccess: () => setShowStatusModal(false),
            });
          }}
          onClose={() => setShowStatusModal(false)}
          isSaving={statusMutation.isPending}
        />
      )}

    </div>
  );
};

export default ProposalPreviewPage;
