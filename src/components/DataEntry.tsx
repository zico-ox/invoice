import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Calendar, 
  Droplets, 
  Phone, 
  Mail, 
  Save, 
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MoreVertical,
  Users,
  Search,
  ExternalLink,
  Lock,
  Trash2,
  Edit3,
  Info,
  Eye,
  X
} from 'lucide-react';

export const DataEntry: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    nameEnglish: '',
    nameArabic: '',
    fatherNameEnglish: '',
    fatherNameArabic: '',
    placeEnglish: '',
    placeArabic: '',
    dob: '',
    bloodGroup: '',
    mobile: '',
    email: '',
    batch: ''
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://frc-entries-default-rtdb.firebaseio.com/students.json');
      const data = await response.json();
      if (data) {
        const studentList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).reverse();
        setStudents(studentList);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudents = () => {
    setViewMode(true);
    setShowMenu(false);
    fetchStudents();
  };

  const handleAdminAccess = () => {
    const password = prompt('Enter Admin Password:');
    if (password === '0044') {
      setIsAdmin(true);
      setShowMenu(false);
      handleViewStudents();
    } else if (password !== null) {
      alert('Incorrect password!');
    }
  };

  const handleEdit = (student: any) => {
    setFormData({
      nameEnglish: student.nameEnglish || '',
      nameArabic: student.nameArabic || '',
      fatherNameEnglish: student.fatherNameEnglish || '',
      fatherNameArabic: student.fatherNameArabic || '',
      placeEnglish: student.placeEnglish || '',
      placeArabic: student.placeArabic || '',
      dob: student.dob || '',
      bloodGroup: student.bloodGroup || '',
      mobile: student.mobile || '',
      email: student.email || '',
      batch: student.batch || ''
    });
    setEditingId(student.id);
    setViewMode(false);
    setSelectedStudent(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student record?')) {
      setLoading(true);
      try {
        const response = await fetch(`https://frc-entries-default-rtdb.firebaseio.com/students/${id}.json`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setStudents(prev => prev.filter(s => s.id !== id));
          setSelectedStudent(null);
          alert('Student record deleted successfully.');
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student record.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId 
        ? `https://frc-entries-default-rtdb.firebaseio.com/students/${editingId}.json`
        : 'https://frc-entries-default-rtdb.firebaseio.com/students.json';
      
      const response = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          updatedAt: new Date().toISOString(),
          ...(editingId ? {} : { createdAt: new Date().toISOString() })
        })
      });

      if (response.ok) {
        alert(editingId ? 'Student data updated successfully!' : 'Student data saved successfully!');
        setFormData({
          nameEnglish: '',
          nameArabic: '',
          fatherNameEnglish: '',
          fatherNameArabic: '',
          placeEnglish: '',
          placeArabic: '',
          dob: '',
          bloodGroup: '',
          mobile: '',
          email: '',
          batch: ''
        });
        setEditingId(null);
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student data.');
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const batches = ['ED20', 'ED21', 'ED22', 'ED23', 'ED24', 'ED25'];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-start mb-10">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {viewMode ? 'Registered Students' : (editingId ? 'Update Student Record' : 'Student Data Entry')}
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              {viewMode 
                ? `Viewing all ${students.length} registered students`
                : (editingId ? 'Modify existing student information with precision' : 'Register new student details with professional precision')}
            </p>
            {!viewMode && <div className="h-1 w-20 bg-blue-600 mt-4 rounded-full"></div>}
          </div>

          {editingId && !viewMode && (
             <button
               onClick={() => {
                 setEditingId(null);
                 setFormData({
                    nameEnglish: '', nameArabic: '', fatherNameEnglish: '', fatherNameArabic: '',
                    placeEnglish: '', placeArabic: '', dob: '', bloodGroup: '',
                    mobile: '', email: '', batch: ''
                 });
               }}
               className="mr-4 px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
             >
               Cancel Edit
             </button>
          )}
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm active:scale-95"
            >
              <MoreVertical className="w-6 h-6" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={viewMode ? () => setViewMode(false) : handleViewStudents}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors font-semibold text-sm"
                >
                  {viewMode ? <UserPlus className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                  {viewMode ? 'New Registration' : 'View Students'}
                </button>
                
                <button
                  onClick={handleAdminAccess}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors font-semibold text-sm"
                >
                  <Lock className="w-5 h-5" />
                  {isAdmin ? 'Admin Mode Active' : 'Admin Access'}
                </button>
              </div>
            )}
          </div>
        </div>

      {!viewMode ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
        <div className="p-8 space-y-10">
          
          {/* Personal Information Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Name in English</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    name="nameEnglish"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    placeholder="Enter full name"
                    value={formData.nameEnglish}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 mr-1 text-right block">الاسم بالعربية</label>
                <input
                  type="text"
                  name="nameArabic"
                  required
                  dir="rtl"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-right"
                  placeholder="أدخل الاسم الكامل"
                  value={formData.nameArabic}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Parent Details Section */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Father's Name (English)</label>
                <div className="relative group">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    name="fatherNameEnglish"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    placeholder="Father's full name"
                    value={formData.fatherNameEnglish}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 mr-1 text-right block">اسم الأب بالعربية</label>
                <input
                  type="text"
                  name="fatherNameArabic"
                  required
                  dir="rtl"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-right"
                  placeholder="اسم الأب الكامل"
                  value={formData.fatherNameArabic}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Place Details Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Location Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Place in English</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    name="placeEnglish"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    placeholder="City / Village"
                    value={formData.placeEnglish}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 mr-1 text-right block">المكان بالعربية</label>
                <input
                  type="text"
                  name="placeArabic"
                  required
                  dir="rtl"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-right"
                  placeholder="المدينة / القرية"
                  value={formData.placeArabic}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Other Details Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Additional Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Date of Birth</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="date"
                    name="dob"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Blood Group</label>
                <div className="relative group">
                  <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors pointer-events-none" />
                  <select
                    name="bloodGroup"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium appearance-none"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Mobile</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="tel"
                    name="mobile"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                    placeholder="+91 ..."
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Email ID</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                    placeholder="student@mail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Batch</label>
                <div className="relative group">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors pointer-events-none" />
                  <select
                    name="batch"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium appearance-none"
                    value={formData.batch}
                    onChange={handleChange}
                  >
                    <option value="">Select Batch</option>
                    {batches.map(batch => (
                      <option key={batch} value={batch}>{batch}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl shadow-xl shadow-slate-900/10 transition-all hover:translate-y-0.5 active:translate-y-0 font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {editingId ? 'Update Student Information' : 'Save Student Information'}
              </>
            )}
          </button>
        </div>
      </form>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-500 font-semibold animate-pulse">Loading students data...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Students Found</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">Start by registering your first student in the system.</p>
              <button 
                onClick={() => setViewMode(false)}
                className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Go to Registration
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-bottom border-slate-100">
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider w-16 text-center">Sl No.</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Students</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className="group hover:bg-blue-50/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <td className="px-6 py-6 text-center">
                        <span className="text-slate-400 font-bold text-sm">{index + 1}</span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">
                              {student.nameEnglish}
                            </span>
                            <div className="flex items-center gap-3 text-slate-500 font-medium text-sm mt-1">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {student.placeEnglish}
                              </div>
                              {student.batch && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs font-bold">
                                  {student.batch}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-center">
                <button 
                  onClick={() => setViewMode(false)}
                  className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" /> Back to Registration Form
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{selectedStudent.nameEnglish}</h3>
                  <p className="text-slate-500 font-medium">{selectedStudent.nameArabic}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Father's Name</p>
                  <p className="font-semibold text-slate-700">{selectedStudent.fatherNameEnglish}</p>
                  <p className="text-sm text-slate-500">{selectedStudent.fatherNameArabic}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                  <p className="font-semibold text-slate-700">{selectedStudent.placeEnglish}</p>
                  <p className="text-sm text-slate-500">{selectedStudent.placeArabic}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date of Birth</p>
                  <p className="font-semibold text-slate-700">{selectedStudent.dob}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Batch & Group</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm">{selectedStudent.batch}</span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg font-bold text-sm">{selectedStudent.bloodGroup}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Details</p>
                  <p className="font-semibold text-slate-700 flex items-center gap-2 text-sm"><Phone className="w-3.5 h-3.5" /> {selectedStudent.mobile}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-2 mt-1 text-sm"><Mail className="w-3.5 h-3.5" /> {selectedStudent.email}</p>
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button 
                  onClick={() => handleEdit(selectedStudent)}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-sm"
                >
                  <Edit3 className="w-5 h-5" /> Edit Record
                </button>
                <button 
                  onClick={() => handleDelete(selectedStudent.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all"
                >
                  <Trash2 className="w-5 h-5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
