
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { OrganizationAccountData } from '../BusinessMatchingDashboardPage';
import { Briefcase, Mail, Phone, Globe, MapPin, Edit3, Save, Info, UploadCloud, Building2, Layers, Users } from 'lucide-react';

interface CompanyProfileBMProps {
  organizationData: OrganizationAccountData;
  onUpdateOrganizationData: (updatedData: OrganizationAccountData) => void; // For saving changes
}

const CompanyProfileBM: React.FC<CompanyProfileBMProps> = ({ organizationData, onUpdateOrganizationData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<OrganizationAccountData>(organizationData);
  const [logoPreview, setLogoPreview] = useState<string | null>(organizationData.profilePictureUrl || null);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(organizationData);
    setLogoPreview(organizationData.profilePictureUrl || null);
  }, [organizationData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    // Here, you might want to upload the logo file if selectedLogoFile exists
    // For now, we'll just update with the preview URL (which would be a data URL)
    onUpdateOrganizationData({ ...formData, profilePictureUrl: logoPreview || undefined });
    setIsEditing(false);
    setSelectedLogoFile(null); // Reset file selection
    alert("Profil perusahaan berhasil diperbarui!");
  };
  
  const handleCancelEdit = () => {
    setFormData(organizationData); // Reset form data
    setLogoPreview(organizationData.profilePictureUrl || null); // Reset logo preview
    setSelectedLogoFile(null);
    setIsEditing(false);
  };

  const renderInfoField = (label: string, value: string | undefined | null, Icon: React.ElementType, isEditable: boolean = true, name?: keyof OrganizationAccountData, type: string = 'text', asTextarea: boolean = false) => {
    if (isEditing && isEditable && name) {
      if (asTextarea) {
        return (
          <div className="mb-3">
            <label htmlFor={name} className="block text-xs font-medium text-gray-600 mb-0.5">{label}</label>
            <textarea id={name} name={name} value={formData[name] as string || ''} onChange={handleInputChange} rows={3} className="w-full py-2 px-3 text-sm border border-gray-300 rounded-md focus:ring-hegra-turquoise focus:border-hegra-turquoise shadow-sm bg-white"></textarea>
          </div>
        );
      }
      return (
        <div className="mb-3">
          <label htmlFor={name} className="block text-xs font-medium text-gray-600 mb-0.5">{label}</label>
          <div className="relative">
            {Icon && <Icon size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />}
            <input type={type} id={name} name={name} value={formData[name] as string || ''} onChange={handleInputChange} className={`w-full py-2 ${Icon ? 'pl-8' : 'pl-3'} pr-3 text-sm border border-gray-300 rounded-md focus:ring-hegra-turquoise focus:border-hegra-turquoise shadow-sm bg-white`} />
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-start py-1.5">
        {Icon && <Icon size={15} className="text-gray-500 mr-2.5 mt-0.5 flex-shrink-0" />}
        <span className="text-xs text-gray-500 w-28 sm:w-32 flex-shrink-0">{label}:</span>
        <span className="text-sm text-hegra-deep-navy font-medium break-words flex-grow">{value || '-'}</span>
      </div>
    );
  };

  return (
    <div className="p-0 sm:p-2 md:p-4 bg-gray-50 min-h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-hegra-deep-navy">Profil Perusahaan Anda</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-hegra-turquoise text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 text-sm mt-3 sm:mt-0"
          >
            <Edit3 size={16} /> Edit Profil
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {/* Profile Picture/Logo Section */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full mb-3 group">
            <img
              src={logoPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.organizationName)}&background=18093B&color=FFFFFF&size=160`}
              alt="Logo Organisasi"
              className="w-full h-full rounded-full object-cover border-4 border-hegra-turquoise/30"
            />
            {isEditing && (
              <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  aria-label="Ubah logo organisasi"
              >
                  <UploadCloud size={36} />
              </button>
            )}
          </div>
           {isEditing && <input type="file" ref={fileInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />}
          {!isEditing && <h2 className="text-xl font-semibold text-hegra-navy">{formData.organizationName}</h2>}
          {!isEditing && formData.industry && <p className="text-sm text-gray-500">{formData.industry}</p>}
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
            {renderInfoField("Nama Organisasi", formData.organizationName, Building2, true, "organizationName")}
            {renderInfoField("Industri", formData.industry, Layers, true, "industry")}
            {renderInfoField("Alamat", formData.address, MapPin, true, "address", 'text', true)}
            
            <h3 className="text-md font-semibold text-gray-600 pt-3 mt-3 border-t border-gray-100">Informasi Kontak</h3>
            {renderInfoField("Nama Kontak PIC", formData.contactPerson, Users, true, "contactPerson")}
            {renderInfoField("Email Organisasi", formData.email, Mail, true, "email")}
            {renderInfoField("No. Telepon Organisasi", formData.phoneNumber, Phone, true, "phoneNumber")}
            {renderInfoField("Website", formData.website, Globe, true, "website")}
        </div>

        {isEditing && (
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
            <button onClick={handleCancelEdit} type="button" className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button onClick={handleSaveChanges} type="button" className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-hegra-turquoise hover:bg-opacity-90 rounded-lg shadow-sm transition-colors">
              <Save size={18} /> Simpan Perubahan Profil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfileBM;
