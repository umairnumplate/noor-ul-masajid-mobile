import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import AddTeacherModal from './AddTeacherModal';
import { PlusIcon, PencilIcon, TrashIcon } from './Icons';
import { Teacher } from '../types';
import WhatsappLink from './WhatsappLink';

const Teachers: React.FC = () => {
    const { teachers, classes, setTeachers } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);
    
    const getClassName = (classId: string) => classes.find(c => c.id === classId)?.name || 'Unknown Class';
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleOpenAddModal = () => {
        setTeacherToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (teacher: Teacher) => {
        setTeacherToEdit(teacher);
        setIsModalOpen(true);
    };

    const handleRemoveTeacher = (teacherId: string) => {
        if (window.confirm('Are you sure you want to remove this teacher?')) {
            setTeachers(prev => prev.filter(t => t.id !== teacherId));
        }
    };

    const handleSaveTeacher = (teacherData: Omit<Teacher, 'id' | 'timetable'> & { id?: string }) => {
        if (teacherData.id) { // Editing existing
            setTeachers(prev => prev.map(t => t.id === teacherData.id ? { ...t, ...teacherData, timetable: t.timetable } as Teacher : t));
        } else { // Adding new
            const newTeacher: Teacher = {
                ...teacherData,
                id: `t${Date.now()}`,
                timetable: [], // Start with an empty timetable
                picture: teacherData.picture || `https://picsum.photos/seed/t${Date.now()}/200`,
            };
            setTeachers(prev => [...prev, newTeacher]);
        }
        setIsModalOpen(false);
    };


    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-on-surface">Teacher Management</h1>
                 <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all transform hover:scale-105"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add New Teacher
                </button>
            </div>
            <div className="space-y-8">
                {teachers.map(teacher => (
                    <div key={teacher.id} className="bg-surface rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 relative">
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                           <button onClick={() => handleOpenEditModal(teacher)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-blue-600"><PencilIcon className="h-5 w-5"/></button>
                           <button onClick={() => handleRemoveTeacher(teacher.id)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-rose-600"><TrashIcon className="h-5 w-5"/></button>
                        </div>
                        <div className="flex-shrink-0 text-center">
                            <img src={teacher.picture} alt={teacher.name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-secondary"/>
                            <h2 className="mt-4 text-xl font-bold text-on-surface">{teacher.name}</h2>
                            <p className="text-sm text-gray-500">{teacher.qualifications}</p>
                            <div className="mt-2 flex justify-center">
                               <WhatsappLink phone={teacher.contact} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-on-surface border-b pb-2 mb-4">Weekly Timetable</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {daysOfWeek.map(day => {
                                    const entries = teacher.timetable.filter(t => t.day === day);
                                    if(entries.length === 0) return null;
                                    return (
                                        <div key={day}>
                                            <h4 className="font-bold text-md text-primary">{day}</h4>
                                            <div className="mt-2 space-y-2">
                                                {entries.map(entry => (
                                                    <div key={entry.id} className="p-2 bg-sky-50 rounded-lg">
                                                        <p className="font-semibold text-sm text-sky-800">{entry.subject}</p>
                                                        <p className="text-xs text-gray-600">{getClassName(entry.classId)}</p>
                                                        <p className="text-xs text-gray-500">{entry.startTime} - {entry.endTime}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                             {teacher.timetable.length === 0 && <p className="text-center text-gray-500 pt-8">No classes assigned.</p>}
                        </div>
                    </div>
                ))}
            </div>
             {isModalOpen && <AddTeacherModal onClose={() => setIsModalOpen(false)} onSave={handleSaveTeacher} teacherToEdit={teacherToEdit}/>}
        </div>
    );
};

export default Teachers;