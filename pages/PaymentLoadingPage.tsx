/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect } from 'react';
import { CheckoutInfo, PageName } from '../HegiraApp'; // Renamed import
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';

interface PaymentLoadingPageProps {
  onNavigate: (page: PageName, data?: any) => void;
  onNavigateRequestWithConfirmation: (targetPage: PageName, targetData?: any, resetCallback?: () => void) => void;
  checkoutInfoToReturnTo: CheckoutInfo;
}

const PaymentLoadingPage: React.FC<PaymentLoadingPageProps> = ({ 
  onNavigate, 
  onNavigateRequestWithConfirmation,
  checkoutInfoToReturnTo 
}) => {
  useEffect(() => {
    const processingTime = Math.random() * 2000 + 3000; // 3-5 seconds
    const timer = setTimeout(() => {
      onNavigate('transactionSuccess');
    }, processingTime);

    return () => clearTimeout(timer);
  }, [onNavigate]);

  const handleCancelPayment = () => {
    // HegiraApp's modal will use a generic message, or we can customize it
    // The title and message in HegiraApp's ConfirmationModal should be updated for this case.
    // HegiraApp's confirmation modal has been updated to handle this specific case message.
    onNavigateRequestWithConfirmation('checkout', checkoutInfoToReturnTo);
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-hegra-white text-hegra-navy p-4 text-center">
      <LoadingSpinner size="xl" />
      <h1 className="text-2xl md:text-3xl font-bold mt-8 mb-2">Memproses Pembayaran Anda...</h1>
      <p className="text-gray-600">Mohon tunggu sebentar, kami sedang memfinalisasi pesanan Anda.</p>
      <p className="text-sm text-gray-500 mt-1">Jangan menutup atau me-refresh halaman ini.</p>
      
      <button
        onClick={handleCancelPayment}
        className="mt-12 flex items-center text-sm text-hegra-turquoise hover:text-hegra-navy font-semibold transition-colors group border border-hegra-turquoise px-4 py-2 rounded-lg hover:bg-hegra-turquoise/10"
      >
        <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-0.5 transition-transform" />
        Batalkan Pembayaran & Kembali
      </button>
    </div>
  );
};

export default PaymentLoadingPage;