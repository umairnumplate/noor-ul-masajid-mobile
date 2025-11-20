import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { PaperAirplaneIcon, WhatsAppIcon } from './Icons';

interface BulkMessageModalProps {
    onClose: () => void;
    selectedStudentIds: string[];
}

const BulkMessageModal: React.FC<BulkMessageModalProps> = ({ onClose, selectedStudentIds }) => {
    const { students } = useAppContext();
    const [message, setMessage] = useState('');
    const [copyStatus, setCopyStatus] = useState('');

    const selectedStudents = useMemo(() => {
        return students.filter(s => selectedStudentIds.includes(s.id));
    }, [students, selectedStudentIds]);

    const handleSendSms = () => {
        if (!message) return;
        const phoneNumbers = selectedStudents.map(s => s.phone.replace(/[^0-9]/g, '')).join(',');
        const smsLink = `sms:${phoneNumbers}?body=${encodeURIComponent(message)}`;
        window.location.href = smsLink;
        onClose();
    };
    
    const handleCopyToClipboard = () => {
        if (!message) return;
        const phoneNumbers = selectedStudents.map(s => s.phone).join('\n');
        const textToCopy = `Message from Noor ul Masajid:\n${message}\n\nRecipients:\n${phoneNumbers}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopyStatus('Copied to clipboard!');
            setTimeout(() => setCopyStatus(''), 2000);
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-on-surface">Compose Bulk Message</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-700">Recipients ({selectedStudents.length}):</h3>
                        <div className="text-sm text-gray-600 max-h-24 overflow-y-auto bg-gray-50 p-2 rounded-md mt-1 border">
                            {selectedStudents.map(s => s.name).join(', ')}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="bulk-message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            id="bulk-message"
                            rows={6}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                        />
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t mt-6">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 order-last sm:order-first"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCopyToClipboard}
                        className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 disabled:bg-green-300"
                        disabled={!message}
                    >
                        <WhatsAppIcon className="h-5 w-5" />
                        {copyStatus || 'Copy for WhatsApp'}
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSendSms} 
                        className="px-4 py-2 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 flex items-center justify-center gap-2 disabled:bg-sky-300"
                        disabled={!message}
                    >
                        <PaperAirplaneIcon className="h-5 w-5" />
                        Send via SMS
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkMessageModal;