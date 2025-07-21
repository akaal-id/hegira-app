/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { PageName } from '../HegiraApp';
import Logo from '../components/Logo';
// RoleTabs import removed
import { Eye, EyeOff, Mail, Lock, User, Briefcase, ArrowLeft, CheckCircle, BarChart3, Users as UsersIcon, Server, BrainCircuit, LogIn, Calendar } from 'lucide-react';

type AuthMode = 'login' | 'signup';

interface CreatorAuthPageProps {
  initialMode?: AuthMode;
  onNavigate: (page: PageName) => void;
  onLoginSuccess: (name: string) => void; 
  onSignupSuccess: (email: string, name: string) => void; // Modified to include name
}

interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4; 
  text: string;
  colorClass: string;
}

const PasswordStrengthMeter: React.FC<{ password?: string }> = ({ password = "" }) => {
  const calculateStrength = (pass: string): PasswordStrength => {
    let score = 0;
    if (!pass) return { score: 0, text: "", colorClass: "bg-gray-200" };

    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++; 

    if (score <= 1) return { score: 1, text: "Lemah", colorClass: "bg-red-500" };
    if (score === 2) return { score: 2, text: "Sedang", colorClass: "bg-yellow-500" };
    if (score <= 4) return { score: 3, text: "Kuat", colorClass: "bg-green-500" };
    return { score: 4, text: "Sangat Kuat", colorClass: "bg-emerald-600" };
  };

  const strength = calculateStrength(password);
  if (!password) return null;

  return (
    <div className="mt-1.5">
      <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-200">
        <div className={`transition-all duration-300 ease-in-out ${strength.colorClass}`} style={{ width: `${(strength.score / 4) * 100}%` }}></div>
      </div>
      <p className={`text-xs mt-1 ${strength.score === 1 ? 'text-red-500' : strength.score === 2 ? 'text-yellow-600' : 'text-green-600'}`}>
        {strength.text}
      </p>
    </div>
  );
};


const CreatorAuthPage: React.FC<CreatorAuthPageProps> = ({ 
  initialMode = 'login', 
  onNavigate, 
  onLoginSuccess, 
  onSignupSuccess 
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const [genderError, setGenderError] = useState('');


  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
    // Reset errors and fields when mode changes
    setNameError(''); setEmailError(''); setPasswordError(''); setConfirmPasswordError('');
    setDateOfBirthError(''); setGenderError('');
    setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
    setDateOfBirth(''); setGender('');
  }, [mode]);

  const benefits = [
    { text: "Manajemen peserta & tiket real-time", icon: UsersIcon },
    { text: "Business matching dengan vendor terpercaya", icon: Briefcase },
    { text: "Analitik pendapatan & engagement", icon: BarChart3 },
    { text: "Platform stabil & aman", icon: Server },
    { text: "Dukungan promosi cerdas berbasis AI", icon: BrainCircuit },
  ];

  const validateEmail = (val: string) => {
    if (!val.trim()) { setEmailError('Email tidak boleh kosong.'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setEmailError('Format email tidak valid.'); return false; }
    setEmailError(''); return true;
  };

  const validatePassword = (val: string, isSignup: boolean = false) => {
    if (!val) { setPasswordError('Password tidak boleh kosong.'); return false; }
    if (isSignup && val.length < 8) { setPasswordError('Password minimal 8 karakter.'); return false; }
    setPasswordError(''); return true;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNameError(''); setEmailError(''); setPasswordError(''); setConfirmPasswordError('');
    setDateOfBirthError(''); setGenderError('');
    let isValid = true;

    if (!validateEmail(email)) isValid = false;
    if (!validatePassword(password, mode === 'signup')) isValid = false;

    if (mode === 'signup') {
      if (!name.trim()) { setNameError('Nama lengkap tidak boleh kosong.'); isValid = false; }
      if (password !== confirmPassword) { setConfirmPasswordError('Konfirmasi password tidak cocok.'); isValid = false; }
      if (!dateOfBirth) { setDateOfBirthError('Tanggal lahir tidak boleh kosong.'); isValid = false; }
      if (!gender) { setGenderError('Jenis kelamin tidak boleh kosong.'); isValid = false; }
    }

    if (isValid) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (mode === 'login') {
          console.log('Creator Login:', { email, password });
          onLoginSuccess(name || "Event Kreator"); 
        } else {
          console.log('Creator Signup:', { name, email, password, dateOfBirth, gender });
          onSignupSuccess(email, name); // Pass name along with email
        }
      }, 1500);
    }
  };
  
  const panelTitle = mode === 'login' ? "Login ke Akun Kreatormu" : "Buat Akun Kreator Baru";
  const inputBaseClasses = "w-full py-2.5 pl-10 pr-3 bg-white border rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors placeholder-gray-400 text-sm";


  return (
    <div className="min-h-screen flex bg-hegra-auth-background">
      <div className="hidden lg:flex lg:w-2/5 bg-hegra-white flex-col items-center justify-center p-12 text-hegra-navy relative overflow-hidden">
        <div className="w-full max-w-md z-10">
          <Logo className="h-12 mb-8" />
          <h1 className="text-3xl font-bold mb-3">Welcome to Hegira Event Creator Dashboard</h1>
          <p className="text-md text-gray-600 mb-8">
            Ubah Ide Event Jadi Kenyataan. Platform All-in-One untuk Event Creator Profesional.
          </p>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <benefit.icon className="h-6 w-6 text-hegra-turquoise mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{benefit.text}</span>
              </div>
            ))}
          </div>
          <img 
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60&blend=150439&sat=-100&bri=-10&bm=multiply&blend-mode=multiply"
            alt="Dashboard Illustration" 
            className="absolute bottom-0 right-0 w-3/4 opacity-20 transform translate-x-1/4 translate-y-1/4 rounded-tl-full"
          />
        </div>
      </div>

      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 sm:p-8 md:p-12 relative">
        <button 
          onClick={() => onNavigate('landing')}
          className="absolute top-6 right-6 text-xs text-hegra-auth-text/70 hover:text-hegra-auth-text inline-flex items-center"
        >
          <ArrowLeft size={14} className="mr-1" /> Kembali ke Halaman Utama
        </button>

        <div className="w-full max-w-md bg-hegra-white p-8 sm:p-10 rounded-xl shadow-2xl">
          <div className="text-center lg:hidden mb-6">
             <Logo className="h-10 mb-4 mx-auto" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-hegra-navy text-center mb-6">
            {panelTitle}
          </h1>
          
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="creator-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                      <input id="creator-name" type="text" value={name} onChange={e => setName(e.target.value)} required
                             className={`${inputBaseClasses} ${nameError ? 'border-red-500' : 'border-gray-300'}`} placeholder="Nama Anda"/>
                  </div>
                  {nameError && <p className="error-text">{nameError}</p>}
                </div>
                <div>
                  <label htmlFor="creator-dob" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <input id="creator-dob" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required
                           className={`${inputBaseClasses} ${dateOfBirthError ? 'border-red-500' : 'border-gray-300'}`}/>
                  </div>
                  {dateOfBirthError && <p className="error-text">{dateOfBirthError}</p>}
                </div>
                <div>
                  <label htmlFor="creator-gender" className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                  <div className="relative">
                    <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <select id="creator-gender" value={gender} onChange={e => setGender(e.target.value)} required
                            className={`${inputBaseClasses} appearance-none ${genderError ? 'border-red-500' : 'border-gray-300'}`}>
                      <option value="" disabled>Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                  {genderError && <p className="error-text">{genderError}</p>}
                </div>
              </>
            )}
            <div>
              <label htmlFor="creator-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                <input id="creator-email" type="email" value={email} onChange={e => setEmail(e.target.value)} ref={emailInputRef} required
                       className={`${inputBaseClasses} ${emailError ? 'border-red-500' : 'border-gray-300'}`} placeholder="email@example.com"/>
              </div>
              {emailError && <p className="error-text">{emailError}</p>}
            </div>
            <div>
              <label htmlFor="creator-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                <input id="creator-password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                       className={`${inputBaseClasses} pr-10 ${passwordError ? 'border-red-500' : 'border-gray-300'}`} placeholder={mode === 'signup' ? 'Minimal 8 karakter' : 'Password Anda'}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
              {passwordError && <p className="error-text">{passwordError}</p>}
              {mode === 'signup' && <PasswordStrengthMeter password={password} />}
            </div>
            {mode === 'signup' && (
              <div>
                <label htmlFor="creator-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <input id="creator-confirm-password" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                           className={`${inputBaseClasses} pr-10 ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ulangi password"/>
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                        {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                </div>
                {confirmPasswordError && <p className="error-text">{confirmPasswordError}</p>}
              </div>
            )}
            {mode === 'login' && (
              <div className="text-right">
                <a href="#" className="text-xs font-medium text-hegra-auth-primary hover:text-hegra-auth-primary/80">Lupa password?</a>
              </div>
            )}
            <button type="submit" disabled={isLoading} className="w-full btn-primary-auth">
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (mode === 'login' ? 'Masuk ke Dashboard' : 'Daftar Akun Kreator')}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Atau lanjutkan dengan</span>
              </div>
            </div>
            <div className="mt-4">
              <button type="button" className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50">
                <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15.84 10.083c0-.52-.045-.996-.126-1.434H10.23v2.72h3.13c-.143.885-.525 1.602-1.073 2.09v1.77h2.27c1.322-1.217 2.086-3.017 2.086-5.146z"></path>
                    <path d="M10.23 16c2.045 0 3.754-.675 5.004-1.823l-2.27-1.77c-.684.464-1.566.735-2.733.735-2.086 0-3.857-1.403-4.488-3.285H3.34v1.823C4.6 14.617 7.19 16 10.23 16z"></path>
                    <path d="M5.742 9.984a4.66 4.66 0 010-3.968V4.193H3.34A7.973 7.973 0 002 10c0 1.403.368 2.72.992 3.807l2.408-1.823z"></path>
                    <path d="M10.23 3.882c1.127 0 2.136.387 2.932 1.14l2.016-2.016C13.93.833 12.112 0 10.23 0 7.19 0 4.6 1.383 3.34 3.807l2.408 1.823C6.373 3.968 8.143 3.882 10.23 3.882z"></path>
                </svg>
                Masuk dengan Google
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-gray-500">
            {mode === 'login' ? 'Belum punya akun kreator?' : 'Sudah punya akun kreator?'}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="font-medium text-hegra-auth-primary hover:text-hegra-auth-primary/80 ml-1">
              {mode === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
            </button>
          </p>
        </div>
      </div>
      <style>{`
        .error-text { font-size: 0.75rem; color: #ef4444; margin-top: 0.25rem; }
        .btn-primary-auth { display: inline-flex; items-center; justify-content: center; gap: 0.5rem; border-radius: 0.5rem; border: 1px solid transparent; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); padding: 0.75rem 1.5rem; background-color: var(--hegra-auth-primary, #339999); font-size: 0.875rem; font-weight: 600; color: white; transition: background-color 0.2s; }
        .btn-primary-auth:hover { background-color: rgba(51, 153, 153, 0.9); }
        .btn-primary-auth:disabled { opacity:0.7; cursor:not-allowed; }
        select.input-field {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem; /* To make space for the arrow */
        }
      `}</style>
    </div>
  );
};

export default CreatorAuthPage;
