import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { FeeStatus, MadrasaFeeRecord, Student } from '../types';
import { PlusIcon, PencilIcon, CashIcon } from './Icons';
import AddMadrasaFeeModal from './AddMadrasaFeeModal';

const getStatusBadge = (status?: FeeStatus) => {
    switch (status) {
        case FeeStatus.Paid: return 'bg-emerald-100 text-emerald-800';
        case FeeStatus.Pending: return 'bg-amber-100 text-amber-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const MadrasaFees: React.FC = () => {
    const { students, classes, madrasaFeeRecords, setMadrasaFeeRecords } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recordToEdit, setRecordToEdit] = useState<MadrasaFeeRecord | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const [monthFilter, setMonthFilter] = useState<string>(currentMonth);
    const [classFilter, setClassFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const studentMap = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);
    const classMap = useMemo(() => new Map(classes.map(c => [c.id, c])), [classes]);

    const feeDataForMonth = useMemo(() => {
        const records = new Map<string, MadrasaFeeRecord>();
        madrasaFeeRecords.forEach(record => {
            if (record.month === monthFilter) {
                records.set(record.studentId, record);
            }
        });
        
        let displayData = students
            .filter(student => {
                 if (classFilter !== 'all' && student.classId !== classFilter) return false;
                 if (searchTerm && !student.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
                 return true;
            })
            .map(student => {
                const feeRecord = records.get(student.id);
                return { student, feeRecord };
            });

        if (statusFilter !== 'all') {
            displayData = displayData.filter(({ feeRecord }) => {
                const status = feeRecord?.status || FeeStatus.Pending;
                return status === statusFilter;
            });
        }
        
        return displayData.sort((a,b) => a.student.name.localeCompare(b.student.name));

    }, [students, madrasaFeeRecords, monthFilter, classFilter, statusFilter, searchTerm]);

    const feeSummary = useMemo(() => {
        let total = 0;
        let paid = 0;
        let pending = 0;

        feeDataForMonth.forEach(({ feeRecord }) => {
            const amount = feeRecord?.amount || 0; // Assume a default or fetch from settings
            const status = feeRecord?.status || FeeStatus.Pending;
            
            if (feeRecord) { // Only count if a record exists
              total += amount;
              if (status === FeeStatus.Paid) {
                  paid += amount;
              } else {
                  pending += amount;
              }
            }
        });
        return { total, paid, pending };
    }, [feeDataForMonth]);

    const handleOpenEditModal = (record: MadrasaFeeRecord) => {
        setRecordToEdit(record);
        setIsModalOpen(true);
    };

    const handleOpenAddModal = (student: Student) => {
        const existingRecord = feeDataForMonth.find(d => d.student.id === student.id)?.feeRecord;
        if(existingRecord) {
            handleOpenEditModal(existingRecord);
        } else {
            setRecordToEdit(null); // Clear any previous edit state
            // Pre-populate a new record for the modal
            const newRecord: Omit<MadrasaFeeRecord, 'id'> = {
                studentId: student.id,
                month: monthFilter,
                amount: 1500, // Default fee, can be changed
                status: FeeStatus.Pending,
                receiptNumber: ''
            };
            // This is a bit of a hack to pass a "new" record to the edit modal
            setRecordToEdit({id: '', ...newRecord});
            setIsModalOpen(true);
        }
    };
    
    const handleSaveRecord = (recordData: Omit<MadrasaFeeRecord, 'id'> & { id?: string }) => {
        if (recordData.id) {
            setMadrasaFeeRecords(prev => prev.map(r => r.id === recordData.id ? { ...r, ...recordData } as MadrasaFeeRecord : r));
        } else {
            const newRecord: MadrasaFeeRecord = { ...recordData, id: `mf${Date.now()}` };
            setMadrasaFeeRecords(prev => [...prev, newRecord]);
        }
        setIsModalOpen(false);
        setRecordToEdit(null);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-on-surface">Madrasa Fee Management</h1>
            
            <div className="bg-surface p-4 rounded-xl shadow-sm border border-stroke grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <div>
                    <label htmlFor="month-select" className="block text-sm font-medium text-gray-700">Select Month</label>
                    <input id="month-select" type="month" className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light" value={monthFilter} onChange={e => setMonthFilter(e.target.value)} />
                </div>
                 <div>
                    <label htmlFor="class-select" className="block text-sm font-medium text-gray-700">Filter by Class</label>
                    <select id="class-select" className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
                        <option value="all">All Classes</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="status-select" className="block text-sm font-medium text-gray-700">Filter by Status</label>
                    <select id="status-select" className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="all">All Statuses</option>
                        <option value={FeeStatus.Paid}>Paid</option>
                        <option value={FeeStatus.Pending}>Pending</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="search-student" className="block text-sm font-medium text-gray-700">Search Student</label>
                    <input type="text" id="search-student" placeholder="Enter name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light" />
                </div>
            </div>

            <div className="bg-surface p-4 rounded-xl shadow-sm border border-stroke">
                <h2 className="font-bold text-lg text-on-surface mb-4">
                    Fee Status for {new Date(monthFilter + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                
                 {/* Table for larger screens */}
                <div className="hidden md:block max-h-[70vh] overflow-y-auto">
                     <table className="min-w-full divide-y divide-stroke">
                        <thead className="bg-sky-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-light uppercase">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-light uppercase">Class</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-light uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-light uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-light uppercase">Receipt No.</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-on-surface-light uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-stroke">
                            {feeDataForMonth.map(({ student, feeRecord }) => (
                                <tr key={student.id} className="hover:bg-sky-50/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full object-cover" src={student.picture} alt={student.name} />
                                            <div className="ml-4"><div className="text-sm font-medium text-on-surface">{student.name}</div></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-light">{classMap.get(student.classId)?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-light">{feeRecord ? `Rs. ${feeRecord.amount.toLocaleString()}`: '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(feeRecord?.status || FeeStatus.Pending)}`}>
                                            {feeRecord?.status || FeeStatus.Pending}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-light">{feeRecord?.receiptNumber || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => feeRecord ? handleOpenEditModal(feeRecord) : handleOpenAddModal(student)} className="text-primary hover:text-primary-dark font-semibold">
                                            {feeRecord ? 'Edit' : 'Add Record'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Cards for mobile screens */}
                <div className="md:hidden space-y-4">
                  {feeDataForMonth.map(({ student, feeRecord }) => (
                     <div key={student.id} className="bg-white p-4 rounded-lg shadow border border-stroke">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img className="h-10 w-10 rounded-full object-cover" src={student.picture} alt={student.name} />
                                <div className="ml-3">
                                    <p className="text-sm font-bold text-on-surface">{student.name}</p>
                                    <p className="text-xs text-on-surface-light">{classMap.get(student.classId)?.name}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(feeRecord?.status || FeeStatus.Pending)}`}>
                                {feeRecord?.status || FeeStatus.Pending}
                            </span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-stroke text-sm text-on-surface-light space-y-1">
                             <p><strong>Amount:</strong> {feeRecord ? `Rs. ${feeRecord.amount.toLocaleString()}`: 'N/A'}</p>
                             <p><strong>Receipt No:</strong> {feeRecord?.receiptNumber || 'N/A'}</p>
                        </div>
                        <div className="mt-3 text-right">
                           <button onClick={() => feeRecord ? handleOpenEditModal(feeRecord) : handleOpenAddModal(student)} className="text-sm text-primary hover:text-primary-dark font-semibold">
                                {feeRecord ? 'Edit Record' : 'Add Fee Record'}
                            </button>
                        </div>
                     </div>
                  ))}
                </div>

                {feeDataForMonth.length === 0 && <p className="text-center text-on-surface-light py-8">No students found for the selected filters.</p>}
            </div>
            {isModalOpen && <AddMadrasaFeeModal onClose={() => {setIsModalOpen(false); setRecordToEdit(null);}} onSave={handleSaveRecord} recordToEdit={recordToEdit} selectedMonth={monthFilter} />}
        </div>
    );
};

export default MadrasaFees;
