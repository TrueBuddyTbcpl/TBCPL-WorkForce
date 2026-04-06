import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2, FileText, AlertCircle, Search,
  Briefcase, TrendingUp, CheckCircle2, AlertTriangle,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useCases } from '../../../hooks/cases/useCases';
import type { CaseListItem } from '../../operations/Cases/types/case.types';

const AdminCaseList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size] = useState(15);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useCases({
    page,
    size,
    status: statusFilter || undefined,
  });

  const cases      = data?.cases      || [];
  const pagination = data?.pagination;

  const filteredCases = searchQuery
    ? cases.filter(c =>
        c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.caseTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cases;

  const handleViewCase = (c: CaseListItem) => {
    navigate(`/super-admin/cases/${c.id}`);
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':        return 'bg-blue-400/20 text-blue-100 border-blue-300/30';
      case 'in-progress': return 'bg-yellow-400/20 text-yellow-100 border-yellow-300/30';
      case 'on-hold':     return 'bg-slate-400/20 text-slate-200 border-slate-300/30';
      case 'closed':      return 'bg-green-400/20 text-green-100 border-green-300/30';
      default:            return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'low':      return 'bg-green-400/20 text-green-100 border-green-300/30';
      case 'medium':   return 'bg-yellow-400/20 text-yellow-100 border-yellow-300/30';
      case 'high':     return 'bg-orange-400/20 text-orange-100 border-orange-300/30';
      case 'critical': return 'bg-red-400/20 text-red-100 border-red-300/30';
      default:         return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-white/70" />
        <span className="ml-3 text-white/70 text-sm
          [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
          Loading cases...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-400/30
            flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-300" />
          </div>
          <p className="text-red-200 text-lg font-semibold
            [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
            Error loading cases
          </p>
          <p className="text-white/50 text-sm mt-1
            [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassStatCard
          icon={<Briefcase className="w-5 h-5 text-white/80
            drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />}
          value={pagination?.totalCases ?? 0}
          label="Total Cases"
          border="border-white/20"
        />
        <GlassStatCard
          icon={<TrendingUp className="w-5 h-5 text-yellow-200
            drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />}
          value={cases.filter(c => c.status?.toLowerCase() === 'in-progress').length}
          label="Under Investigation"
          border="border-yellow-300/20"
        />
        <GlassStatCard
          icon={<CheckCircle2 className="w-5 h-5 text-green-200
            drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />}
          value={cases.filter(c => c.status?.toLowerCase() === 'closed').length}
          label="Closed Cases"
          border="border-green-300/20"
        />
        <GlassStatCard
          icon={<AlertTriangle className="w-5 h-5 text-red-200
            drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />}
          value={cases.filter(c => c.priority?.toLowerCase() === 'critical').length}
          label="Critical Priority"
          border="border-red-300/20"
        />
      </div>

      {/* ── Filters Bar ── */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20
        rounded-2xl p-4 flex flex-wrap items-center gap-3">

        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
            text-white/50 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]" />
          <input
            type="text"
            placeholder="Search by case number, client, title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm
              bg-white/10 border border-white/20 rounded-xl
              text-white placeholder-white/35
              focus:outline-none focus:ring-2 focus:ring-white/20
              focus:border-white/40 transition
              [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
          className="px-4 py-2.5 text-sm
            bg-white/10 border border-white/20 rounded-xl
            text-white
            focus:outline-none focus:ring-2 focus:ring-white/20
            transition appearance-none cursor-pointer
            [&>option]:bg-[#3a2a00] [&>option]:text-white"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="on-hold">On Hold</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* ── Cases List ── */}
      {filteredCases.length === 0 ? (

        <div className="bg-white/10 backdrop-blur-lg border border-white/20
          rounded-2xl p-16 text-center">
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20
            flex items-center justify-center mx-auto mb-5">
            <FileText className="w-10 h-10 text-white/30" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2
            [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
            No Cases Found
          </h3>
          <p className="text-white/50 text-sm
            [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
            Cases will appear here once created from Pre-Reports
          </p>
        </div>

      ) : (
        <>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20
            rounded-2xl overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 border-b border-white/15 bg-white/5">
              <h2 className="text-sm font-semibold text-white uppercase tracking-widest
                [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                All Cases
                <span className="ml-2 px-2 py-0.5 bg-white/15 border border-white/20
                  text-white text-xs rounded-full font-bold">
                  {pagination?.totalCases ?? filteredCases.length}
                </span>
              </h2>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/10">
              {filteredCases.map(c => (
                <div
                  key={c.id}
                  onClick={() => handleViewCase(c)}
                  className="px-6 py-5 cursor-pointer
                    hover:bg-white/10 transition-all duration-150 group"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex-1 min-w-0">

                      {/* Row 1 */}
                      <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white
                          group-hover:text-white/90 transition-colors truncate
                          [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                          {c.clientName}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px]
                          font-semibold border
                          [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]
                          ${getStatusStyle(c.status)}`}>
                          {c.status}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px]
                          font-semibold border
                          [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]
                          ${getPriorityStyle(c.priority)}`}>
                          {c.priority}
                        </span>
                      </div>

                      {/* Row 2 */}
                      <p className="text-xs text-white/70 font-medium mb-1.5
                        [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                        Product: {c.clientProduct}
                      </p>

                      {/* Row 3 */}
                      <p className="text-sm text-white/60 mb-3 line-clamp-1
                        [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                        {c.caseTitle}
                      </p>

                      {/* Row 4 */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <MetaChip label={`#${c.caseNumber}`} />
                        <span className="text-white/25 text-xs">•</span>
                        <MetaChip label={`Type: ${c.caseType || 'N/A'}`} />
                        <span className="text-white/25 text-xs">•</span>
                        <MetaChip label={`Lead: ${c.leadType}`} />
                        <span className="text-white/25 text-xs">•</span>
                        <MetaChip label={`Opened: ${new Date(c.dateOpened).toLocaleDateString('en-IN')}`} />
                      </div>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={e => { e.stopPropagation(); handleViewCase(c); }}
                      className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2
                        bg-white/15 hover:bg-white/25
                        border border-white/25 hover:border-white/40
                        text-white hover:text-white
                        rounded-xl text-xs font-semibold
                        transition-all duration-150 whitespace-nowrap
                        backdrop-blur-sm
                        [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]
                        shadow-sm shadow-black/10"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Pagination ── */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between
              bg-white/10 backdrop-blur-lg border border-white/20
              rounded-2xl px-6 py-3">

              <span className="text-xs text-white/50
                [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                Showing{' '}
                <span className="text-white font-semibold">{page * size + 1}</span>
                {' '}–{' '}
                <span className="text-white font-semibold">
                  {Math.min((page + 1) * size, pagination.totalCases)}
                </span>
                {' '}of{' '}
                <span className="text-white/80 font-semibold">{pagination.totalCases}</span>
                {' '}results
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5
                    bg-white/10 hover:bg-white/20
                    border border-white/20 hover:border-white/35
                    text-xs font-medium text-white/70 hover:text-white
                    rounded-lg transition backdrop-blur-sm
                    [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]
                    disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>

                <span className="text-xs text-white/50 px-2
                  [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                  Page{' '}
                  <span className="text-white font-semibold">{page + 1}</span>
                  {' '}of{' '}
                  <span className="text-white/70">{pagination.totalPages}</span>
                </span>

                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages - 1, p + 1))}
                  disabled={page >= pagination.totalPages - 1}
                  className="flex items-center gap-1.5 px-3 py-1.5
                    bg-white/10 hover:bg-white/20
                    border border-white/20 hover:border-white/35
                    text-xs font-medium text-white/70 hover:text-white
                    rounded-lg transition backdrop-blur-sm
                    [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]
                    disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ── Stat Card ── */
interface GlassStatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  border: string;
}
const GlassStatCard: React.FC<GlassStatCardProps> = ({ icon, value, label, border }) => (
  <div className={`bg-white/10 backdrop-blur-lg border ${border}
    rounded-2xl p-5 hover:bg-white/15
    hover:scale-[1.02] transition-all duration-200
    shadow-sm shadow-black/10`}>
    <div className="flex items-center justify-between mb-3">
      <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20
        flex items-center justify-center">
        {icon}
      </div>
    </div>
    <p className="text-2xl font-bold text-white
      [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
      {value}
    </p>
    <p className="text-xs text-white/60 mt-1
      [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
      {label}
    </p>
  </div>
);

/* ── Meta Chip ── */
const MetaChip: React.FC<{ label: string }> = ({ label }) => (
  <span className="text-xs text-white/45
    [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
    {label}
  </span>
);

export default AdminCaseList;
