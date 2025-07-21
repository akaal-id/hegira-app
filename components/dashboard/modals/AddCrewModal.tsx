/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { X, Save, User, Briefcase, Phone } from 'lucide-react';
import { CrewMember } from '../../../pages/dashboard/ManajemenCrewPageDB'; // Adjust path if needed

type CrewFormData = Omit<CrewMember, 'id' | 'eventId' | 'eventName' | 'status' | 'scanTimestamp'>;

interface AddCrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (crewData: CrewFormData) => void;
}

const countryCodeOptions = [
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
];

const AddCrewModal: React.FC<AddCrewModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<CrewFormData, 'phoneNumber'>>({
    name: '',
    role: '',
  });
  const [localPhoneNumber, setLocalPhoneNumber] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+62');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({ name: '', role: '' });
      setLocalPhoneNumber('');
      setSelectedCountryCode('+62');
      setFormErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nama lengkap tidak boleh kosong.";
    if (!formData.role.trim()) errors.role = "Role tidak boleh kosong.";
    if (!localPhoneNumber.trim()) errors.phoneNumber = "Nomor telepon tidak boleh kosong.";
    else if (!/^\d{9,15}$/.test(localPhoneNumber.replace(/\D/g, ''))) {
      errors.phoneNumber = "Format nomor telepon tidak valid (9-15 digit).";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const fullPhoneNumber = selectedCountryCode + localPhoneNumber;
      onSave({ ...formData, phoneNumber: fullPhoneNumber });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[102] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-labelledby="add-crew-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-hegra-navy p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear max-h-[90vh] overflow-y-auto custom-scrollbar-modal">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors z-20"
          aria-label="Tutup modal"
        >
          <X size={24} />
        </button>

        <h2 id="add-crew-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy mb-6">
          Tambah Anggota Crew Baru
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="crew-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" name="name" id="crew-name" value={formData.name} onChange={handleInputChange} required
                     className={`w-full py-2.5 pl-9 pr-3 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                     placeholder="Masukkan nama lengkap crew" />
            </div>
            {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="crew-role" className="block text-sm font-medium text-gray-700 mb-1">Role/Posisi <span className="text-red-500">*</span></label>
             <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" name="role" id="crew-role" value={formData.role} onChange={handleInputChange} required
                     className={`w-full py-2.5 pl-9 pr-3 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm ${formErrors.role ? 'border-red-500' : 'border-gray-300'}`}
                     placeholder="cth: Keamanan, Logistik, Dokumentasi" />
            </div>
            {formErrors.role && <p className="mt-1 text-xs text-red-500">{formErrors.role}</p>}
          </div>
          
          <div>
            <label htmlFor="crew-phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon <span className="text-red-500">*</span></label>
            <div className="relative flex items-stretch w-full mt-1">
              <div className="relative">
                <select 
                  id="crew-countryCode" 
                  name="crew-countryCode" 
                  value={selectedCountryCode} 
                  onChange={(e) => setSelectedCountryCode(e.target.value)} 
                  className="appearance-none z-10 h-full block w-auto py-2.5 pl-3 pr-8 text-sm border border-r-0 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 bg-white"
                  aria-label="Kode negara crew"
                >
                  {countryCodeOptions.map(opt => (
                    <option key={opt.code} value={opt.code}>{opt.flag} {opt.code}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="tel" name="phoneNumber" id="crew-phoneNumber" required
                  value={localPhoneNumber}
                  onChange={(e) => setLocalPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className={`w-full py-2.5 pl-9 pr-3 bg-white border rounded-r-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="81234567890" />
              </div>
            </div>
            {formErrors.phoneNumber && <p className="mt-1 text-xs text-red-500">{formErrors.phoneNumber}</p>}
          </div>
          
          <p className="text-xs text-gray-500">ID Crew akan digenerate otomatis dan status awal akan menjadi "Belum Hadir".</p>

          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-transparent shadow-sm px-6 py-2.5 bg-hegra-turquoise text-base font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-yellow sm:text-sm transition-colors"
            >
              <Save size={18} /> Simpan Data Crew
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise sm:text-sm transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .animate-modal-appear { animation: modalAppear 0.3s ease-out forwards; }
        @keyframes modalAppear { to { opacity: 1; transform: scale(1); } }
        .custom-scrollbar-modal::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-modal::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb { background: var(--hegra-chino, #d0cea9); border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover { background: #b8b495; }
      `}</style>
    </div>
  );
};

export default AddCrewModal;