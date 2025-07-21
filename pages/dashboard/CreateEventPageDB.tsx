/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { EventData } from '../../HegiraApp';
import { DashboardViewId } from '../../pages/DashboardPage';
import { Save, PlusCircle, Trash2, Image as ImageIcon, Info, Calendar, ClockIcon, MapPinIcon, DollarSignIcon, UsersIcon, ParkingCircleIcon, FileTextIcon, ShieldCheckIcon, TagIcon, BriefcaseIcon, XCircle, Link as LinkIconLucide, PhoneIcon, MailIcon, UserCircle2, Bold, Italic, Underline, UploadCloud, ArrowLeft } from 'lucide-react'; // Added ArrowLeft

interface CreateEventPageDBProps {
  onNewEventCreated: (newEvent: EventData) => void;
  onCancel: (viewId: DashboardViewId) => void;
}

const countryCodeOptions = [
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
];

interface FormEventData {
  id: string; // Auto-generated
  name: string;
  category: 'B2C' | 'B2B' | 'B2G';
  theme: string;
  // status is 'Draf' by default, not in form
  eventSlug: string;

  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isTimeRange: boolean;
  timezone: 'WIB' | 'WITA' | 'WIT' | '';

  location: string;
  address: string;
  googleMapsQuery: string;

  // summary removed
  parkingAvailable: 'true' | 'false' | '';
  ageRestriction: string;
  arrivalInfo: string;
  
  coverImageFile: File | null; // For uploaded image
  coverImageUrlPreview: string; // For image preview

  narahubungName: string;
  narahubungEmail: string;
  
  fullDescription: string;
  termsAndConditions: string;
  // narahubungPhone removed from here, will be handled by separate state
}

const initialFormState: FormEventData = {
  id: `HEGIRA-EVT-${Date.now()}`,
  name: '',
  category: 'B2C',
  theme: '',
  eventSlug: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  isTimeRange: true,
  timezone: 'WIB',
  location: '',
  address: '',
  googleMapsQuery: '',
  parkingAvailable: '',
  ageRestriction: '',
  arrivalInfo: '',
  coverImageFile: null,
  coverImageUrlPreview: '',
  narahubungName: '',
  narahubungEmail: '',
  fullDescription: '',
  termsAndConditions: '',
};

const CreateEventPageDB: React.FC<CreateEventPageDBProps> = ({ onNewEventCreated, onCancel }) => {
  const [formData, setFormData] = useState<FormEventData>(initialFormState);
  const [localNarahubungPhone, setLocalNarahubungPhone] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+62');

  useEffect(() => {
    setFormData(prev => ({ ...prev, id: `HEGIRA-EVT-${Date.now()}`})); 
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === "eventSlug") {
      const sanitizedSlug = value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/--+/g, '-');
      setFormData(prev => ({ ...prev, [name]: sanitizedSlug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, coverImageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImageUrlPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, coverImageFile: null, coverImageUrlPreview: '' }));
    }
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dateDisplay = formData.startDate && formData.endDate 
        ? `${formData.startDate.replace(/-/g, '/')} - ${formData.endDate.replace(/-/g, '/')}` 
        : formData.startDate.replace(/-/g, '/');
    
    let timeDisplayValue = '';
    if (formData.startTime) {
        if (formData.isTimeRange && formData.endTime) { 
            timeDisplayValue = `${formData.startTime} - ${formData.endTime}`;
        } else {
            timeDisplayValue = `${formData.startTime} - Selesai`;
        }
    }
    
    const fullPhoneNumber = localNarahubungPhone ? selectedCountryCode + localNarahubungPhone : undefined;
    
    const newEvent: EventData = {
      id: parseInt(formData.id.split('-').pop() || Date.now().toString()), 
      name: formData.name,
      category: formData.category,
      theme: formData.theme,
      status: 'Draf', 
      eventSlug: formData.eventSlug,
      
      dateDisplay,
      timeDisplay: timeDisplayValue,
      timezone: formData.timezone || undefined,

      location: formData.location,
      address: formData.address,
      googleMapsQuery: formData.googleMapsQuery || undefined,
      
      summary: '', 
      parkingAvailable: formData.parkingAvailable === 'true' ? true : (formData.parkingAvailable === 'false' ? false : undefined),
      ageRestriction: formData.ageRestriction || undefined,
      arrivalInfo: formData.arrivalInfo || undefined,

      coverImageUrl: formData.coverImageUrlPreview || undefined, 

      narahubungName: formData.narahubungName || undefined,
      narahubungPhone: fullPhoneNumber,
      narahubungEmail: formData.narahubungEmail || undefined,
      
      fullDescription: formData.fullDescription,
      termsAndConditions: formData.termsAndConditions || undefined,

      ticketCategories: [], 
      displayPrice: "Info Tiket Menyusul", 
      
      organizerName: formData.narahubungName, 
      organizerLogoUrl: undefined, 
    };

    console.log("Event Data to be saved:", newEvent);
    onNewEventCreated(newEvent);
    alert("Event baru berhasil dibuat dengan status Draf!");
    onCancel('daftarEvent'); 
  };
  
  const FormattingToolbar = () => (
    <div className="flex items-center gap-1 mb-1 border border-gray-200 rounded-t-md p-1.5 bg-gray-50">
      <button type="button" title="Bold" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Bold size={16} /></button>
      <button type="button" title="Italic" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Italic size={16} /></button>
      <button type="button" title="Underline" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Underline size={16} /></button>
    </div>
  );

  const renderSection = (title: string, IconElement: React.ElementType, children: React.ReactNode, sectionId?: string) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200" id={sectionId}>
      <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
        <IconElement size={20} className="mr-3 text-hegra-turquoise" />
        <h2 className="text-xl font-semibold text-hegra-deep-navy">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const renderInput = (label: string, name: keyof FormEventData, type: string = "text", placeholder?: string, required: boolean = true, options?: {value: string, label: string}[], disabled: boolean = false, prefix?: string) => {
    const isTextareaWithToolbar = (name === "fullDescription" || name === "termsAndConditions") && type === "textarea";
    const disabledClasses = disabled ? 'disabled:bg-white disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed' : 'bg-white';
    const focusClasses = 'focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50';
    
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
        {isTextareaWithToolbar && <FormattingToolbar />}
        <div className={prefix ? "flex items-center" : ""}>
          {prefix && <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">{prefix}</span>}
          {type === "select" ? (
            <select id={name} name={name} value={formData[name] as string} onChange={handleInputChange} required={required} className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none ${focusClasses} sm:text-sm rounded-md shadow-sm bg-white ${prefix ? 'rounded-l-none' : ''} ${disabledClasses}`} disabled={disabled}>
              {placeholder && <option value="">{placeholder}</option>}
              {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          ) : type === "textarea" ? (
            <textarea id={name} name={name} value={formData[name] as string} onChange={handleInputChange} required={required} placeholder={placeholder || label} rows={6} className={`mt-0 block w-full shadow-sm sm:text-sm border-gray-300 bg-white ${isTextareaWithToolbar ? 'rounded-b-md focus:border-gray-300 focus:ring-0' : `rounded-md ${focusClasses}`} p-2 ${prefix ? 'rounded-l-none' : ''} ${disabledClasses}`} disabled={disabled}></textarea>
          ) : (
            <input type={type} id={name} name={name} value={formData[name] as string} onChange={handleInputChange} required={required} placeholder={placeholder || label} className={`mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${focusClasses} p-2 bg-white ${disabled ? 'cursor-not-allowed' : ''} ${prefix ? 'rounded-l-none' : ''} ${disabledClasses}`} disabled={disabled}/>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-8">
       <div className="mb-6 -mt-2"> {/* Adjust margin as needed */}
          <button
            type="button"
            onClick={() => onCancel('daftarEvent')}
            className="flex items-center text-sm text-hegra-turquoise hover:text-hegra-navy font-semibold transition-colors group"
          >
            <ArrowLeft size={18} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Event
          </button>
        </div>

      {renderSection("Cover Event", ImageIcon, <>
        <label htmlFor="coverImageFile" className="block text-sm font-medium text-gray-700 mb-1">Unggah Cover Image (Rasio 16:6 direkomendasikan)</label>
        <input type="file" id="coverImageFile" name="coverImageFile" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-hegra-turquoise/10 file:text-hegra-turquoise hover:file:bg-hegra-turquoise/20 focus:outline-none focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"/>
        {formData.coverImageUrlPreview ? (
          <div className="mt-2 relative w-full aspect-[16/6] rounded-md overflow-hidden border border-gray-200 bg-gray-100">
            <img src={formData.coverImageUrlPreview} alt="Preview Cover Event" className="absolute top-0 left-0 w-full h-full object-cover object-center"/>
          </div>
        ) : (
          <div className="mt-2 relative w-full aspect-[16/6] rounded-md overflow-hidden border-2 border-dashed border-hegra-turquoise/20 bg-white flex flex-col items-center justify-center text-hegra-turquoise/50">
            <UploadCloud size={48} />
            <p className="text-sm mt-2">Area Unggah Cover</p>
            <p className="text-xs">Klik atau seret file ke sini</p>
          </div>
        )}
      </>)}

      {renderSection("Informasi Dasar", Info, <>
        {renderInput("ID Event", "id", "text", "", false, undefined, true)} 
        {renderInput("Nama Event", "name", "text", "Nama event Anda")}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput("Kategori Event", "category", "select", "Pilih Kategori", true, [
            {value: "B2C", label: "B2C (Business to Consumer)"},
            {value: "B2B", label: "B2B (Business to Business)"},
            {value: "B2G", label: "B2G (Business to Government)"},
          ])}
          {renderInput("Tema Event", "theme", "text", "cth: Konser Musik, Seminar")}
        </div>
        {renderInput("Slug Link Event", "eventSlug", "text", "cth: konser-band-keren-2025", true, undefined, false, "https://hegira.id/event/")}
        <p className="text-xs text-gray-500 mt-1">Gunakan huruf kecil, angka, dan tanda hubung (-). Akan otomatis diformat.</p>
      </>)}

      {renderSection("Jadwal Event", Calendar, <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput("Tanggal Mulai", "startDate", "date")}
          {renderInput("Tanggal Selesai", "endDate", "date", "", false)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          {renderInput("Waktu Mulai", "startTime", "time")}
           <div className="flex items-center gap-2">
            {renderInput("Waktu Selesai", "endTime", "time", "", false, undefined, !formData.isTimeRange)} 
            <label className="flex items-center space-x-1.5 text-sm text-gray-700 mt-1 md:mt-7 whitespace-nowrap">
              <input 
                type="checkbox" 
                name="isTimeRange" 
                checked={!formData.isTimeRange} 
                onChange={(e) => setFormData(prev => ({
                    ...prev, 
                    isTimeRange: !e.target.checked, 
                    endTime: e.target.checked ? '' : prev.endTime 
                }))} 
                className="form-checkbox h-4 w-4 text-hegra-turquoise rounded focus:ring-hegra-turquoise/20"
              />
              <span>Berakhir: Selesai</span>
            </label>
          </div>
        </div>
        {renderInput("Zona Waktu", "timezone", "select", "Pilih Zona Waktu", true, [
            {value: "WIB", label: "WIB (Waktu Indonesia Barat)"},
            {value: "WITA", label: "WITA (Waktu Indonesia Tengah)"},
            {value: "WIT", label: "WIT (Waktu Indonesia Timur)"},
        ])}
      </>)}

      {renderSection("Lokasi Event", MapPinIcon, <>
        {renderInput("Nama Lokasi (Singkat)", "location", "text", "cth: Rooftop ITC Depok, GBK Stadium")}
        {renderInput("Alamat Lengkap", "address", "textarea", "Jl. Margonda Raya No.56, Kota Depok...")}
        {renderInput("Link Google Maps (Query)", "googleMapsQuery", "text", "cth: Rooftop ITC Depok atau Koordinat", false)}
      </>)}

      {renderSection("Detail Tambahan", FileTextIcon, <>
        {renderInput("Ketersediaan Parkir", "parkingAvailable", "select", "Pilih Ketersediaan Parkir", false, [
            {value: "", label: "Tidak Ditentukan"},
            {value: "true", label: "Tersedia/Gratis"},
            {value: "false", label: "Terbatas/Bayar"},
        ])}
        {renderInput("Batasan Usia", "ageRestriction", "text", "cth: 17+, Semua Umur", false)}
        {renderInput("Info Kedatangan", "arrivalInfo", "text", "cth: Pintu dibuka pukul 18:00", false)}
      </>)}
      
      {renderSection("Narahubung", UserCircle2, <>
        {renderInput("Nama Narahubung", "narahubungName", "text", "Nama PIC Event", false)}
        <div>
          <label htmlFor="localNarahubungPhone" className="block text-sm font-medium text-gray-700 mb-1">No. Telpon Narahubung (Opsional)</label>
          <div className="relative flex items-stretch w-full mt-1">
            <div className="relative">
              <select 
                id="narahubungCountryCode" 
                name="narahubungCountryCode" 
                value={selectedCountryCode} 
                onChange={(e) => setSelectedCountryCode(e.target.value)} 
                className="appearance-none z-10 h-full block w-auto py-2.5 pl-3 pr-8 text-sm border border-r-0 border-gray-300 rounded-l-md focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 bg-white"
                aria-label="Kode negara narahubung"
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
                <PhoneIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="tel" name="localNarahubungPhone" id="localNarahubungPhone"
                className={`block w-full shadow-sm sm:text-sm border-gray-300 rounded-r-md focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 p-2 pl-9 bg-white`}
                placeholder="81234567890" 
                value={localNarahubungPhone} 
                onChange={(e) => setLocalNarahubungPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>
        </div>
        {renderInput("Email Narahubung", "narahubungEmail", "email", "cth: kontak@eventanda.com", false)}
      </>)}

      {renderSection("Deskripsi & S&K", FileTextIcon, <>
        {renderInput("Deskripsi Lengkap Event", "fullDescription", "textarea", "Jelaskan detail event Anda di sini...")}
        {renderInput("Syarat dan Ketentuan", "termsAndConditions", "textarea", "Syarat dan ketentuan untuk peserta...", false)}
      </>)}
      
      <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
        <button type="button" onClick={() => onCancel('daftarEvent')} className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Batal
        </button>
        <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-hegra-turquoise hover:bg-hegra-turquoise/90 rounded-lg shadow-sm transition-colors">
          <Save size={18} /> Simpan Event (Draf)
        </button>
      </div>
    </form>
  );
};

export default CreateEventPageDB;