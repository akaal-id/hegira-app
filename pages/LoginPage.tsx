
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import Logo from '../components/Logo';
import { UserRole, AuthRoleType, mapAuthRoleToUserRole } from '../HegiraApp'; 
import { Eye, EyeOff, Mail, Lock, X } from 'lucide-react';

interface LoginPageProps {
  role: AuthRoleType; 
  onLoginSuccess: (role: UserRole) => void; // Modified: Only role is passed
  onClose: () => void; 
  onSwitchToSignup: () => void; 
}

const LoginPage: React.FC<LoginPageProps> = ({ 
  role,
  onLoginSuccess, 
  onClose,
  onSwitchToSignup
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError('Email tidak boleh kosong.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Format email tidak valid.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError('Password tidak boleh kosong.');
      return false;
    }
    if (value.length < 8) {
      setPasswordError('Password minimal 8 karakter.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const userRoleToSet = mapAuthRoleToUserRole(role); 
        onLoginSuccess(userRoleToSet); // Pass only role
      }, 1500);
    }
  };

  const modalTitle = `Masuk sebagai ${role}`;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-hegra-auth-background/80 backdrop-blur-md p-4 animate-fade-in"
      aria-labelledby="login-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-hegra-white w-full max-w-md rounded-2xl shadow-2xl border border-hegra-navy/10 overflow-hidden transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors z-20"
            aria-label="Tutup modal login"
        >
            <X size={24} />
        </button>
        
        <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
            <Logo className="text-3xl sm:text-4xl text-hegra-turquoise font-bold mb-2" />
            <h1 id="login-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy">{modalTitle}</h1>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
                <label htmlFor={`modal-email-${role}`} className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email
                </label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                    id={`modal-email-${role}`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                    }}
                    onBlur={(e) => validateEmail(e.target.value)}
                    className={`w-full py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 bg-white text-hegra-navy border 
                                rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors
                                placeholder-gray-400 text-sm ${emailError ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                    placeholder="email@example.com"
                />
                </div>
                {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
            </div>

            <div>
                <label htmlFor={`modal-password-${role}`} className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Password
                </label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                    id={`modal-password-${role}`}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                    }}
                    onBlur={(e) => validatePassword(e.target.value)}
                    className={`w-full py-2 sm:py-2.5 pl-9 sm:pl-10 pr-10 bg-white text-hegra-navy border 
                                rounded-lg shadow-sm focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 transition-colors
                                placeholder-gray-400 text-sm ${passwordError ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                    placeholder="••••••••"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
                </div>
                {passwordError && <p className="mt-1 text-xs text-red-500">{passwordError}</p>}
            </div>

            <div className="text-right">
                <a href="#" className="text-xs font-medium text-hegra-turquoise hover:text-hegra-turquoise/80">
                Lupa password?
                </a>
            </div>

            <div>
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
                    'Masuk'
                )}
                </button>
            </div>
            </form>

            <p className="mt-6 text-center text-xs text-gray-500">
            Belum punya akun?{' '}
            <button onClick={onSwitchToSignup} className="font-medium text-hegra-turquoise hover:text-hegra-turquoise/80">
                Daftar sebagai {role}
            </button>
            </p>
        </div>
      </div>
      <style>{`
        .animate-modal-appear { 
          animation: modalAppear 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
