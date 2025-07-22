/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { CouponData } from '../CouponItemCardDB';
import { TicketCategory } from '../../../HegiraApp';
import { X, Save } from 'lucide-react';

type CouponFormData = Omit<CouponData, 'id'> & { id?: string };

interface AddCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (couponData: CouponFormData) => void;
  initialCouponData?: CouponFormData | null;
  availableTickets: TicketCategory[];
}

const AddCouponModal: React.FC<AddCouponModalProps> = ({ isOpen, onClose, onSave, initialCouponData, availableTickets }) => {
  const [formData, setFormData] = useState<CouponFormData>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    quantity: undefined,
    resetsDaily: false,
    startDate: undefined,
    endDate: undefined,
    minPurchase: undefined,
    applicableTicketIds: [],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialCouponData) {
      setFormData({
      
        resetsDaily: false,
        ...initialCouponData,
        applicableTicketIds: initialCouponData.applicableTicketIds || [],
      });
    } else {
      setFormData({
        id: `KUPON-${Date.now().toString().slice(-6)}`,
        name: '',
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        quantity: undefined,
        resetsDaily: false,
        startDate: undefined,
        endDate: undefined,
        minPurchase: undefined,
        applicableTicketIds: [],
      });
    }
    setFormErrors({});
  }, [initialCouponData, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nama kupon tidak boleh kosong.";
    if (!formData.code.trim()) errors.code = "Kode kupon tidak boleh kosong.";
    else if (formData.code.trim().includes(' ')) errors.code = "Kode kupon tidak boleh mengandung spasi.";
    if (formData.discountValue <= 0) errors.discountValue = "Nilai diskon harus lebih dari 0.";
    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      errors.discountValue = "Diskon persentase tidak boleh lebih dari 100%.";
    }
    if (formData.quantity !== undefined && formData.quantity < 0) errors.quantity = "Jumlah kupon tidak boleh negatif.";
    if (formData.minPurchase !== undefined && formData.minPurchase < 0) errors.minPurchase = "Minimum pembelian tidak boleh negatif.";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      errors.endDate = "Tanggal akhir tidak boleh sebelum tanggal mulai.";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let processedValue: string | number | boolean | undefined = value;
    
    if (name === 'resetsDaily') {
        processedValue = checked;
    } else if (type === 'number') {
      processedValue = value === '' ? undefined : parseFloat(value);
    } else if (type === 'date') {
      processedValue = value === '' ? undefined : value;
    } else if (name === 'code') {
      processedValue = value.toUpperCase().replace(/\s+/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleTicketSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ticketId = e.target.value;
    setFormData(prev => ({
        ...prev,
        applicableTicketIds: ticketId ? [ticketId] : [],
    }));
  };

  const modalTitle = initialCouponData ? "Edit Kupon" : "Tambah Kupon Baru";
  const saveButtonText = initialCouponData ? "Simpan Perubahan" : "Tambah Kupon";
  const inputClass = `w-full py-2.5 px-3 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-labelledby="add-coupon-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-hegra-navy p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear max-h-[90vh] overflow-y-auto custom-scrollbar-modal">
        <div className="flex justify-between items-center mb-6">
          <h2 id="add-coupon-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy">
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
          {/* ID Kupon */}
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">ID Kupon</label>
            <input type="text" name="id" id="id" value={formData.id || ''} disabled className={`${inputClass} bg-gray-100 cursor-not-allowed`} />
            <p className="mt-1 text-xs text-gray-500">ID ini dibuat secara otomatis.</p>
          </div>

          {/* Nama Kupon */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Kupon <span className="text-red-500">*</span></label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className={`${inputClass} ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="cth: Diskon Peluncuran" />
            {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
          </div>

          {/* Kode Kupon */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Kode Kupon <span className="text-red-500">*</span></label>
            <input type="text" name="code" id="code" value={formData.code} onChange={handleInputChange} required className={`${inputClass} uppercase ${formErrors.code ? 'border-red-500' : 'border-gray-300'}`} placeholder="cth: LAUNCH10 (tanpa spasi)" />
            {formErrors.code && <p className="mt-1 text-xs text-red-500">{formErrors.code}</p>}
          </div>

          {/* Jenis & Nilai Diskon */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-1">Jenis Diskon <span className="text-red-500">*</span></label>
              <select name="discountType" id="discountType" value={formData.discountType} onChange={handleInputChange} className={`${inputClass} appearance-none border-gray-300`}>
                <option value="percentage">Persentase (%)</option>
                <option value="fixed">Nominal Tetap (IDR)</option>
              </select>
            </div>
            <div>
              <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-1">Nilai Diskon <span className="text-red-500">*</span></label>
              <input type="number" name="discountValue" id="discountValue" value={formData.discountValue} onChange={handleInputChange} required min="0" className={`${inputClass} ${formErrors.discountValue ? 'border-red-500' : 'border-gray-300'}`} placeholder={formData.discountType === 'percentage' ? 'cth: 10' : 'cth: 50000'} />
              {formErrors.discountValue && <p className="mt-1 text-xs text-red-500">{formErrors.discountValue}</p>}
            </div>
          </div>
          
          {/* Jumlah Kupon Tersedia */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Jumlah Kupon Tersedia (Opsional)</label>
            <div className="flex items-center gap-3">
              <input type="number" name="quantity" id="quantity" value={formData.quantity === undefined ? '' : formData.quantity} onChange={handleInputChange} min="0" className={`${inputClass} flex-grow ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'}`} placeholder="Kosongkan jika tidak terbatas" />
              <label htmlFor="resetsDaily" className="flex items-center space-x-2 text-sm text-gray-700 whitespace-nowrap">
                <input type="checkbox" name="resetsDaily" id="resetsDaily" checked={!!formData.resetsDaily} onChange={handleInputChange} className="h-4 w-4 text-hegra-turquoise border-gray-300 rounded focus:ring-hegra-turquoise/20"/>
                <span>Setiap Hari</span>
              </label>
            </div>
            {formErrors.quantity && <p className="mt-1 text-xs text-red-500">{formErrors.quantity}</p>}
            <p className="text-xs text-gray-500 mt-1">Jika "Setiap Hari" dicentang, jumlah kupon akan tersedia ulang setiap hari.</p>
          </div>


          {/* Validitas Kupon */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai (Opsional)</label>
              <input type="date" name="startDate" id="startDate" value={formData.startDate || ''} onChange={handleInputChange} className={`${inputClass} border-gray-300`} />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir (Opsional)</label>
              <input type="date" name="endDate" id="endDate" value={formData.endDate || ''} onChange={handleInputChange} className={`${inputClass} ${formErrors.endDate ? 'border-red-500' : 'border-gray-300'}`} />
              {formErrors.endDate && <p className="mt-1 text-xs text-red-500">{formErrors.endDate}</p>}
            </div>
          </div>

          {/* Minimum Pembelian */}
          <div>
            <label htmlFor="minPurchase" className="block text-sm font-medium text-gray-700 mb-1">Minimum Pembelian (IDR, Opsional)</label>
            <input type="number" name="minPurchase" id="minPurchase" value={formData.minPurchase === undefined ? '' : formData.minPurchase} onChange={handleInputChange} min="0" className={`${inputClass} ${formErrors.minPurchase ? 'border-red-500' : 'border-gray-300'}`} placeholder="cth: 200000" />
            {formErrors.minPurchase && <p className="mt-1 text-xs text-red-500">{formErrors.minPurchase}</p>}
          </div>

          {/* Applicable Tickets Selector */}
          <div className="pt-3 border-t border-gray-200">
            <label htmlFor="applicableTicketIds" className="block text-sm font-medium text-gray-700 mb-1">Tiket yang Berlaku (Opsional)</label>
            <div className="relative">
                <select
                    id="applicableTicketIds"
                    name="applicableTicketIds"
                    value={formData.applicableTicketIds?.[0] || ''}
                    onChange={handleTicketSelectionChange}
                    className={`${inputClass} appearance-none border-gray-300 pr-16 ${!formData.applicableTicketIds?.[0] ? 'text-gray-400' : 'text-hegra-navy'}`}
                >
                    <option value="" disabled>Pilih tiket</option>
                    {availableTickets.map(ticket => (
                        <option key={ticket.id} value={ticket.id}>{ticket.name}</option>
                    ))}
                </select>
                
                {formData.applicableTicketIds && formData.applicableTicketIds.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, applicableTicketIds: [] }))}
                        className="absolute inset-y-0 right-0 flex items-center pr-8 text-gray-400 hover:text-red-500 transition-colors z-10"
                        aria-label="Hapus pilihan tiket"
                    >
                        <X size={18} />
                    </button>
                )}

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            <p id="applicable-tickets-hint" className="text-xs text-gray-500 mt-1">
                Jika kosong, kupon akan berlaku untuk total transaksi pesanan.
            </p>
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
        .animate-modal-appear { animation: modalAppear 0.3s ease-out forwards; }
        @keyframes modalAppear { to { opacity: 1; transform: scale(1); } }
        .custom-scrollbar-modal::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-modal::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb { background: var(--hegra-chino, #d0cea9); border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover { background: #b8b495; }
        /* Removed generic select styling to allow for custom inline button */
        select[multiple] {
          background-image: none;
          padding-right: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default AddCouponModal;