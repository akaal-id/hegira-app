/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Mail } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpenInitially?: boolean;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpenInitially = false }) => {
  const [isOpen, setIsOpen] = useState(isOpenInitially);
  const id = React.useId();

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center w-full py-5 text-left text-hegra-navy hover:text-hegra-turquoise focus:outline-none focus-visible:ring focus-visible:ring-hegra-yellow focus-visible:ring-opacity-75 transition-colors group"
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${id}`}
        >
          <span className="font-semibold font-jakarta text-base sm:text-lg group-hover:text-hegra-turquoise">{question}</span>
          {isOpen ? <ChevronUp size={24} className="text-hegra-turquoise flex-shrink-0" /> : <ChevronDown size={24} className="text-gray-500 group-hover:text-hegra-turquoise flex-shrink-0" />}
        </button>
      </h3>
      {isOpen && (
        <div id={`faq-answer-${id}`} className="pb-5 px-1 text-gray-700 leading-relaxed text-sm sm:text-base">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const faqs = [
  { 
    question: "Apa itu Hegira?", 
    answer: "Hegira adalah platform terintegrasi yang dirancang untuk memudahkan Anda dalam menemukan, mengelola, dan menghadiri berbagai jenis event. Kami menyediakan solusi lengkap mulai dari penjualan tiket (B2C, B2B, B2G) hingga fitur business matching untuk membantu Anda menjalin koneksi bisnis yang strategis." 
  },
  { 
    question: "Bagaimana cara membeli tiket event di Hegira?", 
    answer: "Untuk membeli tiket, Anda dapat menjelajahi daftar event yang tersedia di halaman 'Event'. Pilih event yang Anda minati, klik tombol 'Detail Event' atau 'Beli Tiket', lalu ikuti langkah-langkah pembelian yang tertera. Kami menyediakan berbagai metode pembayaran yang aman dan mudah." 
  },
  { 
    question: "Bagaimana cara mendaftarkan atau mengelola event saya di Hegira?", 
    answer: "Jika Anda adalah seorang penyelenggara event dan tertarik untuk mempublikasikan serta mengelola event Anda melalui Hegira, silakan hubungi tim kami melalui halaman 'Kontak' atau kirimkan email ke partnership@hegira.com. Kami akan dengan senang hati membantu Anda." 
  },
  { 
    question: "Apa yang dimaksud dengan fitur Business Matching?", 
    answer: "Fitur Business Matching di Hegira bertujuan untuk mempertemukan Anda dengan individu atau perusahaan lain yang memiliki kesamaan minat atau kebutuhan bisnis. Ini bisa berupa pencarian vendor, supplier, investor, atau calon partner strategis untuk mengembangkan bisnis Anda." 
  },
  { 
    question: "Apakah data pribadi saya aman di platform Hegira?", 
    answer: "Keamanan dan privasi data Anda adalah prioritas utama kami. Hegira menerapkan standar keamanan yang tinggi dan mematuhi regulasi privasi data yang berlaku. Untuk informasi lebih detail, silakan tinjau 'Kebijakan Privasi' kami." 
  },
  {
    question: "Bagaimana jika saya mengalami masalah atau memiliki pertanyaan lain?",
    answer: "Tim support kami siap membantu Anda. Jangan ragu untuk menghubungi kami melalui email di support@hegira.com atau melalui formulir kontak yang tersedia di halaman 'Pusat Bantuan' ini. Kami akan merespons pertanyaan Anda sesegera mungkin."
  }
];

const HelpPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <header className="text-center mb-10 md:mb-16">
          <HelpCircle size={48} className="mx-auto text-hegra-turquoise mb-4" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-jakarta font-bold text-hegra-navy">Pusat Bantuan Hegira</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan jawaban atas pertanyaan Anda mengenai platform Hegira.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <section aria-labelledby="faq-heading" className="bg-hegra-white p-6 sm:p-8 md:p-10 rounded-xl border border-hegra-navy/10">
            <h2 id="faq-heading" className="text-2xl sm:text-3xl font-jakarta font-semibold text-hegra-navy mb-6 sm:mb-8">
              Pertanyaan Umum (FAQ)
            </h2>
            <div className="space-y-1">
              {faqs.map((faq, index) => (
                <FAQItem 
                  key={index} 
                  question={faq.question} 
                  answer={faq.answer}
                  isOpenInitially={index === 0} // Open the first FAQ by default
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="contact-support-heading" className="mt-12 md:mt-16 text-center bg-hegra-white p-6 sm:p-8 md:p-10 rounded-xl border border-hegra-navy/10">
            <Mail size={40} className="mx-auto text-hegra-turquoise mb-4" />
            <h2 id="contact-support-heading" className="text-2xl sm:text-3xl font-jakarta font-semibold text-hegra-navy mb-4">
              Masih Membutuhkan Bantuan?
            </h2>
            <p className="text-gray-700 mb-6 sm:mb-8 max-w-lg mx-auto text-sm sm:text-base">
              Jika Anda tidak menemukan jawaban yang Anda cari di FAQ kami, tim support kami siap membantu.
              Silakan hubungi kami melalui email.
            </p>
            <a
              href="mailto:support@hegira.com"
              className="inline-flex items-center gap-2 bg-hegra-turquoise text-hegra-white font-semibold px-6 py-3 sm:px-8 sm:py-3.5 rounded-lg hover:bg-opacity-90 transition-all text-base sm:text-lg shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Mail size={20} />
              Email Tim Support
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;