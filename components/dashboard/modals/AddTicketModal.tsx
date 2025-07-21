/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { TicketCategory } from '../../../HegiraApp';
import { X, Save,DollarSign, List, CheckSquare, AlertTriangle, Info, Calendar, ClockIcon } from 'lucide-react';

type TicketFormData = Omit<TicketCategory, 'id' | 'maxQuantity' | 'availabilityStatus'> & { id?: string; maxQuantity: number }; // maxQuantity is now number, availabilityStatus removed

interface AddTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticketData: TicketFormData) => void;
  initialTicketData?: Omit<TicketCategory, 'id'> & { id?: string } | null; // Allow initialTicketData to have maxQuantity as number | undefined
  eventTimezone?: string; 
}

const AddTicketModal: React.FC<AddTicketModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialTicketData,
  eventTimezone 
}) => {
  const getDefaultFormData = (): TicketFormData => ({
    name: '',
    categoryLabel: '',
    price: 0,
    description: '',
    maxQuantity: 100, // Default to 100, must be > 0
    useEventSchedule: false, 
    ticketStartDate: '',
    ticketEndDate: '',
    ticketStartTime: '',
    ticketEndTime: '',
    ticketIsTimeRange: true,
    ticketTimezone: eventTimezone ? (eventTimezone as TicketCategory['ticketTimezone']) : 'WIB',
  });

  const [formData, setFormData] = useState<TicketFormData>(getDefaultFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialTicketData) {
      // Destructure to remove availabilityStatus from the initial data before setting state
      const { availabilityStatus, ...restOfInitialData } = initialTicketData;
      setFormData({ 
        ...getDefaultFormData(), 
        ...restOfInitialData,
        id: initialTicketData.id, // Ensure ID is carried over for editing
        categoryLabel: initialTicketData.categoryLabel || '',
        maxQuantity: initialTicketData.maxQuantity === undefined ? 100 : initialTicketData.maxQuantity, // Ensure maxQuantity is a number
        useEventSchedule: initialTicketData.useEventSchedule === undefined ? false : initialTicketData.useEventSchedule,
        ticketTimezone: initialTicketData.ticketTimezone || (eventTimezone ? (eventTimezone as TicketCategory['ticketTimezone']) : 'WIB'),
        ticketIsTimeRange: initialTicketData.ticketIsTimeRange === undefined ? true : initialTicketData.ticketIsTimeRange,
       });
    } else {
      const newTicketId = `TICKET-${Date.now().toString().slice(-6)}`;
      setFormData({
        ...getDefaultFormData(),
        id: newTicketId,
      });
    }
    setFormErrors({}); 
  }, [initialTicketData, isOpen, eventTimezone]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nama tiket tidak boleh kosong.";
    if (formData.price < 0) errors.price = "Harga tiket tidak boleh negatif.";
    
    if (formData.maxQuantity === undefined || formData.maxQuantity === null) { // Should not happen with type change but good for safety
      errors.maxQuantity = "Jumlah tiket tersedia harus diisi.";
    } else if (formData.maxQuantity <= 0) {
      errors.maxQuantity = "Jumlah tiket tersedia harus lebih dari 0.";
    } else if (!Number.isInteger(formData.maxQuantity)) {
      errors.maxQuantity = "Jumlah tiket harus berupa angka bulat.";
    }


    if (!formData.useEventSchedule) {
        if (!formData.ticketStartDate) errors.ticketStartDate = "Tanggal mulai tiket harus diisi jika tidak menggunakan jadwal event.";
        if (!formData.ticketStartTime) errors.ticketStartTime = "Waktu mulai tiket harus diisi jika tidak menggunakan jadwal event.";
        if (formData.ticketIsTimeRange && !formData.ticketEndTime) errors.ticketEndTime = "Waktu selesai tiket harus diisi jika rentang waktu dipilih.";
        if (formData.ticketStartDate && formData.ticketEndDate && new Date(formData.ticketStartDate) > new Date(formData.ticketEndDate)) {
            errors.ticketEndDate = "Tanggal selesai tiket tidak boleh sebelum tanggal mulai.";
        }
        if (formData.ticketStartTime && formData.ticketEndTime && formData.ticketIsTimeRange && formData.ticketStartDate === formData.ticketEndDate && formData.ticketStartTime >= formData.ticketEndTime) {
            errors.ticketEndTime = "Waktu selesai tiket harus setelah waktu mulai pada hari yang sama.";
        }
        if (!formData.ticketTimezone) errors.ticketTimezone = "Zona waktu tiket harus dipilih.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => {
      const newFormData = { ...prev };
      const key = name as keyof Omit<TicketFormData, 'availabilityStatus'>;

      if (key === "useEventSchedule") {
        newFormData.useEventSchedule = checked;
      } else if (key === "ticketIsTimeRange"){
        newFormData.ticketIsTimeRange = checked;
        if (!checked) newFormData.ticketEndTime = ''; 
      } else {
        let valueToAssign: string | number | boolean;
        if (type === 'number') {
            const numVal = parseFloat(value);
            if (isNaN(numVal) || value === '') {
                // For maxQuantity, if empty or invalid, default to 1 (or handle error immediately)
                // For price, if empty or invalid, default to 0
                valueToAssign = (key === 'maxQuantity') ? 1 : 0;
            } else {
                valueToAssign = numVal;
            }
        } else if (type === 'checkbox') {
            valueToAssign = checked;
        } else {
            valueToAssign = value;
        }
        (newFormData as any)[key] = valueToAssign;
      }
      return newFormData;
    });

    if (formErrors[name as keyof TicketFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };


  const modalTitle = initialTicketData ? "Edit Tiket" : "Tambah Tiket Baru";
  const saveButtonText = initialTicketData ? "Simpan Perubahan" : "Tambah Tiket";
  
  const timezoneOptions: {value: TicketCategory['ticketTimezone'], label: string}[] = [
    {value: "WIB", label: "WIB (Waktu Indonesia Barat)"},
    {value: "WITA", label: "WITA (Waktu Indonesia Tengah)"},
    {value: "WIT", label: "WIT (Waktu Indonesia Timur)"},
  ];


  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-labelledby="add-ticket-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-hegra-navy p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear max-h-[90vh] overflow-y-auto custom-scrollbar-modal">
        <div className="flex justify-between items-center mb-6">
          <h2 id="add-ticket-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy">
            {modalTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-hegra-turquoise transition-colors"
            aria-label="Tutup modal"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {formData.id && (
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">ID Tiket</label>
              <div className="relative">
                <input type="text" name="id" id="id" value={formData.id}
                       disabled
                       className="w-full py-2.5 pl-3 pr-3 bg-gray-100 border rounded-lg shadow-sm text-gray-500 cursor-not-allowed border-gray-300" />
              </div>
              <p className="mt-1 text-xs text-gray-500">ID ini dibuat secara otomatis dan tidak dapat diubah.</p>
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Tiket <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required
                     className={`w-full py-2.5 pl-3 pr-3 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                     placeholder="cth: Regular, VIP, Early Bird" />
            </div>
            {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="categoryLabel" className="block text-sm font-medium text-gray-700 mb-1">Kategori Tiket (Opsional)</label>
            <div className="relative">
              <input type="text" name="categoryLabel" id="categoryLabel" value={formData.categoryLabel || ''} onChange={handleInputChange}
                     className={`w-full py-2.5 pl-3 pr-3 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm border-gray-300`}
                     placeholder="cth: Hari ke-1, Zona A, Presale 1" />
            </div>
            <p className="mt-1 text-xs text-gray-500">Gunakan untuk mengelompokkan tiket, misal berdasarkan hari, zona, atau fase penjualan.</p>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Harga Tiket (IDR) <span className="text-red-500">*</span></label>
             <div className="relative">
              <input type="number" name="price" id="price" value={formData.price} onChange={handleInputChange} required min="0" step="1000"
                     className={`w-full py-2.5 pl-3 pr-3 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm ${formErrors.price ? 'border-red-500' : 'border-gray-300'}`}
                     placeholder="cth: 150000" />
            </div>
            {formErrors.price && <p className="mt-1 text-xs text-red-500">{formErrors.price}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Tiket (Opsional)</label>
             <div className="relative">
                <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={3}
                        className="w-full py-2.5 pl-3 pr-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm"
                        placeholder="cth: Akses ke semua area, Merchandise eksklusif"></textarea>
            </div>
          </div>

          <div>
            <label htmlFor="maxQuantity" className="block text-sm font-medium text-gray-700 mb-1">Jumlah Tiket Tersedia <span className="text-red-500">*</span></label>
             <div className="relative">
                <input type="number" name="maxQuantity" id="maxQuantity" value={formData.maxQuantity} onChange={handleInputChange} required min="1"
                    className={`w-full py-2.5 pl-3 pr-3 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm ${formErrors.maxQuantity ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Masukkan jumlah tiket (minimal 1)" />
            </div>
            {formErrors.maxQuantity && <p className="mt-1 text-xs text-red-500">{formErrors.maxQuantity}</p>}
          </div>

          {/* Ticket Specific Schedule Section */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center mb-3">
                <input type="checkbox" id="useEventSchedule" name="useEventSchedule" checked={formData.useEventSchedule} onChange={handleInputChange} className="h-4 w-4 text-hegra-turquoise border-gray-300 rounded focus:ring-hegra-turquoise"/>
                <label htmlFor="useEventSchedule" className="ml-2 block text-sm font-medium text-gray-700">Gunakan Jadwal Event Utama</label>
            </div>

            {!formData.useEventSchedule && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200 animate-fade-in-up-sm">
                    <p className="text-xs text-gray-500 mb-2">Atur tanggal dan waktu berlaku khusus untuk kategori tiket ini.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="ticketStartDate" className="block text-xs font-medium text-gray-600 mb-1">Tgl. Mulai Tiket</label>
                            <input type="date" name="ticketStartDate" id="ticketStartDate" value={formData.ticketStartDate || ''} onChange={handleInputChange} className={`w-full input-field-sm ${formErrors.ticketStartDate ? 'border-red-500' : 'border-gray-300'}`} />
                            {formErrors.ticketStartDate && <p className="error-text-sm">{formErrors.ticketStartDate}</p>}
                        </div>
                        <div>
                            <label htmlFor="ticketEndDate" className="block text-xs font-medium text-gray-600 mb-1">Tgl. Selesai Tiket (Opsional)</label>
                            <input type="date" name="ticketEndDate" id="ticketEndDate" value={formData.ticketEndDate || ''} onChange={handleInputChange} className={`w-full input-field-sm ${formErrors.ticketEndDate ? 'border-red-500' : 'border-gray-300'}`} />
                            {formErrors.ticketEndDate && <p className="error-text-sm">{formErrors.ticketEndDate}</p>}
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div>
                            <label htmlFor="ticketStartTime" className="block text-xs font-medium text-gray-600 mb-1">Waktu Mulai Tiket</label>
                            <input type="time" name="ticketStartTime" id="ticketStartTime" value={formData.ticketStartTime || ''} onChange={handleInputChange} className={`w-full input-field-sm ${formErrors.ticketStartTime ? 'border-red-500' : 'border-gray-300'}`} />
                            {formErrors.ticketStartTime && <p className="error-text-sm">{formErrors.ticketStartTime}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-grow">
                                <label htmlFor="ticketEndTime" className="block text-xs font-medium text-gray-600 mb-1">Waktu Selesai Tiket</label>
                                <input type="time" name="ticketEndTime" id="ticketEndTime" value={formData.ticketEndTime || ''} onChange={handleInputChange} disabled={!formData.ticketIsTimeRange} className={`w-full input-field-sm ${formErrors.ticketEndTime ? 'border-red-500' : 'border-gray-300'} ${!formData.ticketIsTimeRange ? 'disabled:bg-gray-100 disabled:cursor-not-allowed' : ''}`} />
                                {formErrors.ticketEndTime && <p className="error-text-sm">{formErrors.ticketEndTime}</p>}
                            </div>
                             <label className="flex items-center space-x-1.5 text-xs text-gray-700 mt-1 md:mt-6 whitespace-nowrap">
                                <input type="checkbox" name="ticketIsTimeRange" checked={!formData.ticketIsTimeRange} 
                                       onChange={(e) => handleInputChange({ target: { name: 'ticketIsTimeRange', value: (!e.target.checked).toString(), type: 'checkbox', checked: !e.target.checked } } as any)}
                                       className="form-checkbox h-3.5 w-3.5 text-hegra-turquoise rounded focus:ring-hegra-turquoise/20"/>
                                <span>Selesai</span>
                            </label>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="ticketTimezone" className="block text-xs font-medium text-gray-600 mb-1">Zona Waktu Tiket</label>
                        <select name="ticketTimezone" id="ticketTimezone" value={formData.ticketTimezone || ''} onChange={handleInputChange} className={`w-full input-field-sm appearance-none ${formErrors.ticketTimezone ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="" disabled>Pilih Zona Waktu</option>
                            {timezoneOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        {formErrors.ticketTimezone && <p className="error-text-sm">{formErrors.ticketTimezone}</p>}
                    </div>
                </div>
            )}
          </div>


          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-transparent shadow-sm px-6 py-2.5 bg-hegra-turquoise text-base font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-yellow sm:text-sm transition-colors"
            >
              <Save size={18} /> {saveButtonText}
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
        .animate-modal-appear { 
          animation: modalAppear 0.3s ease-out forwards;
        }
        @keyframes modalAppear {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-up-sm {
          animation: fadeInUpSm 0.2s ease-out forwards;
        }
        @keyframes fadeInUpSm {
          from { opacity: 0; transform: translateY(5px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .custom-scrollbar-modal::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-modal::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb { background: var(--hegra-chino, #d0cea9); border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover { background: #b8b495; }
        .input-field-sm { padding-top: 0.5rem; padding-bottom: 0.5rem; padding-left: 0.75rem; padding-right: 0.75rem; font-size: 0.875rem; line-height: 1.25rem; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); transition-property: border-color, box-shadow; transition-timing-function: cubic-bezier(0.4,0,0.2,1); transition-duration: 150ms; background-color: white;}
        .input-field-sm:focus { outline:2px solid transparent; outline-offset:2px; --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); border-color: var(--hegra-turquoise) !important; --tw-ring-color: rgba(75, 153, 142, 0.2) !important;}
        .error-text-sm { font-size: 0.75rem; color: #ef4444; margin-top: 0.25rem; }
        select.input-field-sm {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem; 
        }
      `}</style>
    </div>
  );
};

export default AddTicketModal;
