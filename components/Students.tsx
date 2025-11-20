import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import AddStudentModal from './AddStudentModal';
import { PlusIcon, PencilIcon, TrashIcon, ChatBubbleLeftRightIcon } from './Icons';
import { Student } from '../types';
import WhatsappLink from './WhatsappLink';
import BulkMessageModal from './BulkMessageModal';

const Students: React.FC = () => {
    const { students, classes, setStudents } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);


    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleSelectionChange = (studentId: string) => {
        setSelectedStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const toggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
        setSelectedStudentIds([]); // Clear selection when toggling mode
    };

    const filteredStudents = students
        .filter(student => selectedClass === 'all' || student.classId === selectedClass)
        .filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const getClassName = (classId: string) => classes.find(c => c.id === classId)?.name || 'Unknown Class';
    
    const handleOpenAddModal = () => {
        setStudentToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (student: Student) => {
        setStudentToEdit(student);
        setIsModalOpen(true);
    };

    const handleRemoveStudent = (studentId: string) => {
        if (window.confirm('Are you sure you want to remove this student? This action cannot be undone.')) {
            setStudents(prev => prev.filter(s => s.id !== studentId));
        }
    };

    const handleSaveStudent = (studentData: Omit<Student, 'id'> & { id?: string }) => {
        if (studentData.id) { // Editing existing student
            setStudents(prev => prev.map(s => s.id === studentData.id ? { ...s, ...studentData } as Student : s));
        } else { // Adding new student
            const newStudent: Student = {
                ...studentData,
                id: `s${Date.now()}`,
                picture: studentData.picture || `https://picsum.photos/seed/s${Date.now()}/200`,
            };
            setStudents(prev => [...prev, newStudent]);
        }
        setIsModalOpen(false);
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-on-surface">Student Management</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleSelectionMode}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-white font-bold rounded-lg shadow-md transition-all ${selectionMode ? 'bg-rose-500 hover:bg-rose-600' : 'bg-sky-500 hover:bg-sky-600'}`}
                    >
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        {selectionMode ? 'Cancel Selection' : 'Bulk Message'}
                    </button>
                    <button
                        onClick={handleOpenAddModal}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all transform hover:scale-105"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Add New Student
                    </button>
                </div>
            </div>
           
            <div className="bg-surface p-4 rounded-xl shadow-lg flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <select
                    className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={selectedClass}
                    onChange={e => setSelectedClass(e.target.value)}
                >
                    <option value="all">All Classes</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            {selectionMode && selectedStudentIds.length > 0 && (
                <div className="bg-surface p-4 rounded-xl shadow-lg flex justify-between items-center sticky top-2 z-10 animate-fade-in">
                    <p className="font-semibold text-on-surface">{selectedStudentIds.length} student(s) selected.</p>
                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark"
                    >
                        Compose Message
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredStudents.map(student => (
                    <div key={student.id} className={`bg-surface rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 relative ${selectedStudentIds.includes(student.id) ? 'ring-2 ring-primary' : ''}`}>
                        {selectionMode && (
                            <div className="absolute top-2 left-2 z-10 bg-white/50 p-1 rounded-full">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded text-primary focus:ring-primary border-gray-300"
                                    checked={selectedStudentIds.includes(student.id)}
                                    onChange={() => handleSelectionChange(student.id)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}
                        <img src={student.picture} alt={student.name} className="w-full h-48 object-cover"/>
                        <div className="p-4 text-center">
                            <h3 className="text-lg font-bold text-on-surface">{student.name}</h3>
                            <p className="text-sm text-gray-500">{getClassName(student.classId)}</p>
                            <p className="text-xs text-primary mt-1">ID: {student.id}</p>
                        </div>

                         {expandedId === student.id && (
                            <div className="p-4 border-t bg-sky-50/50 animate-fade-in text-sm space-y-2">
                                <h4 className="font-bold text-primary mb-2">Personal Information</h4>
                                <p><strong className="text-gray-600">Father:</strong> {student.fatherName}</p>
                                <p><strong className="text-gray-600">B-Form:</strong> {student.bForm}</p>
                                <div className="flex items-center gap-1"><strong className="text-gray-600">Contact:</strong> <WhatsappLink phone={student.phone} /></div>
                                <p><strong className="text-gray-600">Address:</strong> {student.address}</p>
                            </div>
                        )}

                        <div className="mt-auto p-2 bg-gray-50 border-t flex justify-end gap-2">
                            <button onClick={() => toggleExpand(student.id)} className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
                                {expandedId === student.id ? 'Hide' : 'Details'}
                            </button>
                            <button onClick={() => handleOpenEditModal(student)} className="p-2 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"><PencilIcon className="h-4 w-4"/></button>
                            <button onClick={() => handleRemoveStudent(student.id)} className="p-2 text-rose-600 rounded-md hover:bg-rose-100 transition-colors"><TrashIcon className="h-4 w-4"/></button>
                        </div>
                    </div>
                ))}
            </div>
            {filteredStudents.length === 0 && <p className="text-center text-gray-500 py-8">No students found.</p>}

            {isModalOpen && <AddStudentModal onClose={() => setIsModalOpen(false)} onSave={handleSaveStudent} studentToEdit={studentToEdit} />}
            {isBulkModalOpen && <BulkMessageModal onClose={() => setIsBulkModalOpen(false)} selectedStudentIds={selectedStudentIds} />}
        </div>
    );
};

export default Students;