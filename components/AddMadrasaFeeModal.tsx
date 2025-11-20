
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { MadrasaFeeRecord, FeeStatus } from '../types';

interface AddMadrasaFeeModalProps {
    onClose: () => void;
    onSave: (record: Omit<MadrasaFeeRecord, 'id'> & { id?: string }) => void;
    recordToEdit?: MadrasaFeeRecord | null;
    selectedMonth: string;
}

const AddMadrasaFeeModal: React.FC<AddMadrasaFeeModalProps> = ({ onClose, onSave, recordToEdit, selectedMonth }) => {
    const { students } = useAppContext();
    const isEditing = !!recordToEdit;

    const [formData, setFormData] = useState<Omit<MadrasaFeeRecord, 'id'>>({
        studentId: recordToEdit?.studentId || students[0]?.id || '',
        month: recordToEdit?.month || selectedMonth,
        amount: 0,
        status: FeeStatus.Pending,
        receiptNumber: '',
    });

    useEffect(() => {
        if (recordToEdit) {
            setFormData(recordToEdit);
        }
    }, [recordToEdit]);
    
    const [errors, setErrors] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const validate = () => {
        const newErrors: any = {};
        if (!formData.studentId) newErrors.studentId = 'Student is required';
        if (formData.amount <= 0) newErrors.amount = 'Amount must be positive';
        if (formData.status === FeeStatus.Paid && !formData.receiptNumber) {
            newErrors.receiptNumber = 'Receipt number is required for paid fees';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave({ ...formData, id: recordToEdit?.id });
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-on-surface">{isEditing ? 'Edit Fee Record' : 'Add Fee Record'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student</label>
                        <select name="studentId" id="studentId" value={formData.studentId} onChange={handleChange} disabled={isEditing} className={`mt-1 block w-full p-2 border ${errors.studentId ? 'border-red-500' : 'border-gray-300'} rounded-md bg-gray-50 disabled:opacity-75`} required>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
                    </div>
                     <div>
                        <label htmlFor="month" className="block text-sm font-medium text-gray-700">Fee Month</label>
                        <input type="month" name="month" id="month" value={formData.month} onChange={handleChange} disabled={isEditing} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 disabled:opacity-75" required />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (Rs.)</label>
                        <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-md`} required />
                        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                            <option value={FeeStatus.Pending}>Pending</option>
                            <option value={FeeStatus.Paid}>Paid</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="receiptNumber" className="block text-sm font-medium text-gray-700">Receipt Number</label>
                        <input type="text" name="receiptNumber" id="receiptNumber" value={formData.receiptNumber || ''} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.receiptNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
                         {errors.receiptNumber && <p className="text-red-500 text-xs mt-1">{errors.receiptNumber}</p>}
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark">{isEditing ? 'Save Changes' : 'Save Record'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMadrasaFeeModal;
