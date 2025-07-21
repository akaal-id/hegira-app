/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { AuthRoleType } from '../HegiraApp';
import Logo from '../components/Logo';
import { Eye, EyeOff, Mail, Lock, User, Briefcase, X } from 'lucide-react'; // Added Briefcase for Organization

interface SignupPageProps {
  role: AuthRoleType; 
  onClose: () => void;
  onSwitchToLogin: () => void; 
  onSignupSuccess: (email: string) => void; // This will now trigger OTP modal via HegiraApp
  setUserEmailForVerification: (email: string) => void; // Kept for now, but primary flow via onSignupSuccess
}

const SignupPage: React.FC<SignupPageProps> = ({ 
    role,
    onClose, 
    onSwitchToLogin,
    onSignupSuccess,
    setUserEmailForVerification // This prop might be redundant if onSignupSuccess handles email passing
}) => {
  const [name, setName] = useState(''); // "Nama Lengkap" or "Nama Organisasi"
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const nameLabel = role === "Organization" ? "Nama Organisasi" : "Nama Lengkap";
  const namePlaceholder = role === "Organization" ? "Nama Organisasi Anda" : "Nama Anda";
  const NameIcon = role === "Organization" ? Briefcase : User;


  const validateForm = (): boolean => {
    let isValid = true;
    if (!name.trim()) {
      setNameError(`${nameLabel} tidak boleh kosong.`);
      isValid = false;
    } else {
      setNameError('');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email tidak boleh kosong.');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Format email tidak valid.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 8) {
      setPasswordError('Password minimal 8 karakter.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Konfirmasi password tidak cocok.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        console.log('Signup data:', { role: role, name, email, password });
        // setUserEmailForVerification(email); // This might be handled by HegiraApp via onSignupSuccess context
        onSignupSuccess(email); // Trigger OTP flow in HegiraApp
      }, 1500);
    }
  };

  const modalTitle = `Daftar sebagai ${role}`;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-hegra-auth-background/80 backdrop-blur-md p-4 animate-fade-in"
      aria-labelledby="signup-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-hegra-white w-full max-w-lg rounded-2xl shadow-2xl border border-hegra-navy/10 overflow-hidden transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors z-20"
            aria-label="Tutup modal pendaftaran"
        >
            <X size={24} />
        </button>
        
        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar-modal">
            <div className="text-center mb-6">
                <Logo className="text-3xl sm:text-4xl text-hegra-turquoise font-bold mb-2" />
                <h1 id="signup-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy">{modalTitle}</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                 <div>
                    <label htmlFor={`signup-name-${role}`} className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{nameLabel}</label>
                    <div className="relative">
                        <NameIcon className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-full w-5 text-gray-400" />
                        <input type="text" id={`signup-name-${role}`} value={name} onChange={(e) => setName(e.target.value)} required 
                               className={`w-full py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 bg-white text-hegra-navy border rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors placeholder-gray-400 text-sm ${nameError ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                               placeholder={namePlaceholder}/>
                    </div>
                    {nameError && <p className="mt-1 text-xs text-red-400">{nameError}</p>}
                </div>
                <div>
                    <label htmlFor={`signup-email-${role}`} className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                     <div className="relative">
                        <Mail className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-full w-5 text-gray-400" />
                        <input type="email" id={`signup-email-${role}`} value={email} onChange={(e) => setEmail(e.target.value)} required 
                               className={`w-full py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 bg-white text-hegra-navy border rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors placeholder-gray-400 text-sm ${emailError ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                               placeholder="email@example.com"/>
                    </div>
                    {emailError && <p className="mt-1 text-xs text-red-400">{emailError}</p>}
                </div>
                <div>
                    <label htmlFor={`signup-password-${role}`} className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-full w-5 text-gray-400" />
                        <input type={showPassword ? "text" : "password"} id={`signup-password-${role}`} value={password} onChange={(e) => setPassword(e.target.value)} required 
                               className={`w-full py-2 sm:py-2.5 pl-9 sm:pl-10 pr-10 bg-white text-hegra-navy border rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors placeholder-gray-400 text-sm ${passwordError ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                               placeholder="Minimal 8 karakter"/>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                            {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </button>
                    </div>
                     {passwordError && <p className="mt-1 text-xs text-red-400">{passwordError}</p>}
                </div>
                 <div>
                    <label htmlFor={`signup-confirm-password-${role}`} className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                    <div className="relative">
                        <Lock className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-full w-5 text-gray-400" />
                        <input type={showConfirmPassword ? "text" : "password"} id={`signup-confirm-password-${role}`} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required 
                               className={`w-full py-2 sm:py-2.5 pl-9 sm:pl-10 pr-10 bg-white text-hegra-navy border rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors placeholder-gray-400 text-sm ${confirmPasswordError ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                               placeholder="Ulangi password"/>
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                            {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </button>
                    </div>
                    {confirmPasswordError && <p className="mt-1 text-xs text-red-400">{confirmPasswordError}</p>}
                </div>

                <p className="text-xs text-gray-500">
                    Dengan mendaftar, Anda menyetujui <a href="#" className="text-hegra-turquoise hover:underline">Syarat Layanan</a> dan <a href="#" className="text-hegra-turquoise hover:underline">Kebijakan Privasi</a> kami.
                </p>

                <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold 
                                text-white bg-hegra-turquoise hover:bg-hegra-turquoise/90 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-hegra-white focus:ring-hegra-yellow
                                disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105`}
                >
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    'Daftar Akun'
                )}
                </button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-500">
                Sudah punya akun?{' '}
                <button 
                    onClick={onSwitchToLogin}
                    className="font-medium text-hegra-turquoise hover:text-hegra-turquoise/80"
                >
                    Masuk sebagai {role}
                </button>
            </p>
        </div>
      </div>
      <style>{`
        .animate-modal-appear { 
          animation: modalAppear 0.3s ease-out forwards;
        }
        .custom-scrollbar-modal::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar-modal::-webkit-scrollbar-track {
          background: #f1f1f1; /* Or transparent if desired */
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb {
          background: var(--hegra-turquoise); /* Use Hegra turquoise for thumb */
          border-radius: 3px;
        }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover {
          background-color: rgba(75, 153, 142, 0.8); /* Turquoise with opacity */
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
