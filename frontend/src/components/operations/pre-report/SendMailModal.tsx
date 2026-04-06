import { useState, useEffect } from 'react';
import { X, Mail, User, MessageSquare, Send, Loader2, AlertCircle } from 'lucide-react';

interface SendMailModalProps {
    isOpen: boolean;
    reportId: string;
    clientName: string;
    defaultEmail?: string;
    onClose: () => void;
    onConfirm: (toEmail: string, toName: string, notes: string) => Promise<void>;
}

const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const SendMailModal = ({
    isOpen,
    reportId,
    clientName,
    defaultEmail = '',
    onClose,
    onConfirm,
}: SendMailModalProps) => {
    const [toEmail, setToEmail] = useState(defaultEmail);
    const [toName, setToName] = useState(clientName ?? '');
    const [notes, setNotes] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [emailError, setEmailError] = useState('');

    // Reset form whenever modal opens
    useEffect(() => {
        if (isOpen) {
            setToEmail(defaultEmail);
            setToName(clientName ?? '');
            setNotes('');
            setEmailError('');
            setIsSending(false);
        }
    }, [isOpen, defaultEmail, clientName]);

    const handleEmailChange = (val: string) => {
        setToEmail(val);
        if (emailError && isValidEmail(val)) setEmailError('');
    };

    // In SendMailModal.tsx
    const handleSubmit = async () => {
        if (!isValidEmail(toEmail)) {
            setEmailError('Please enter a valid email address');
            return;
        }
        if (!toName.trim()) return;

        setIsSending(true);
        try {
            await onConfirm(toEmail.trim(), toName.trim(), notes.trim());
            onClose(); // only close on success
        } catch {
            // toast shown by parent — modal stays open for retry
        } finally {
            setIsSending(false); // always re-enable button
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && !isSending) onClose();
    };

    if (!isOpen) return null;

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget && !isSending) onClose(); }}
            onKeyDown={handleKeyDown}
        >
            {/* Modal */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-green-700" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Send Report via Email</h2>
                            <p className="text-xs text-gray-500 mt-0.5">{reportId}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSending}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">

                    {/* Recipient Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Recipient Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                                type="email"
                                value={toEmail}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                placeholder="client@example.com"
                                disabled={isSending}
                                className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg outline-none transition-colors
                  focus:ring-2 focus:ring-green-500 focus:border-green-500
                  disabled:bg-gray-50 disabled:cursor-not-allowed
                  ${emailError
                                        ? 'border-red-400 bg-red-50'
                                        : 'border-gray-300 bg-white'
                                    }`}
                            />
                        </div>
                        {emailError && (
                            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                                <AlertCircle className="w-3 h-3" /> {emailError}
                            </p>
                        )}
                    </div>

                    {/* Recipient Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Recipient Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={toName}
                                onChange={(e) => setToName(e.target.value)}
                                placeholder="Client name"
                                disabled={isSending}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none
                  focus:ring-2 focus:ring-green-500 focus:border-green-500
                  disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Additional Notes
                            <span className="ml-1 text-xs font-normal text-gray-400">(optional)</span>
                        </label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add a personal message or note to include in the email..."
                                rows={3}
                                disabled={isSending}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none resize-none
                  focus:ring-2 focus:ring-green-500 focus:border-green-500
                  disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Info strip */}
                    <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-blue-700 leading-relaxed">
                            The PDF report will be generated automatically and attached to this email.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        disabled={isSending}
                        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg
              hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSending || !toEmail.trim() || !toName.trim()}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg
              hover:bg-green-700 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSending ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                        ) : (
                            <><Send className="w-4 h-4" /> Send Report</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendMailModal;