
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { X, FileText } from 'lucide-react';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  eventName: string;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  eventName,
}) => {
  if (!isOpen) return null;

  const tncContent = `
    Selamat datang di Hegra! Sebelum Anda melanjutkan pembelian tiket untuk event "${eventName}", mohon luangkan waktu untuk membaca dan memahami Syarat dan Ketentuan berikut ini. Dengan mengklik "Ya, Saya Mengerti dan Setuju", Anda dianggap telah membaca, memahami, dan menyetujui seluruh isi dari Syarat dan Ketentuan ini.

    <h5>1. Definisi</h5>
    <ul>
        <li><strong>Platform Hegra (selanjutnya disebut "Hegra" atau "Kami")</strong>: Merujuk pada aplikasi dan situs web Hegra yang menyediakan layanan informasi dan pembelian tiket event.</li>
        <li><strong>Penyelenggara Event (selanjutnya disebut "Penyelenggara")</strong>: Pihak ketiga yang bertanggung jawab atas pelaksanaan dan konten dari event yang tiketnya dijual melalui Hegra.</li>
        <li><strong>Pengguna (selanjutnya disebut "Anda")</strong>: Setiap individu yang mengakses atau menggunakan Platform Hegra untuk mencari informasi atau melakukan pembelian tiket.</li>
        <li><strong>Tiket</strong>: Dokumen elektronik (e-tiket) yang memberikan hak kepada pemegangnya untuk menghadiri event tertentu sesuai dengan kategori dan ketentuan yang tertera.</li>
    </ul>

    <h5>2. Pembelian Tiket</h5>
    <ol>
        <li>Anda wajib memberikan data yang akurat, lengkap, dan terkini saat melakukan proses pemesanan tiket, termasuk nama lengkap, alamat email, dan nomor telepon.</li>
        <li>Setelah pembayaran berhasil diverifikasi, e-tiket akan dikirimkan ke alamat email yang Anda daftarkan dan/atau melalui notifikasi dalam aplikasi. Pastikan alamat email yang Anda masukkan benar dan aktif.</li>
        <li>Hegra tidak bertanggung jawab atas kegagalan pengiriman e-tiket yang disebabkan oleh kesalahan penulisan alamat email atau masalah teknis pada server email Anda.</li>
        <li>Semua transaksi pembelian tiket bersifat final setelah pembayaran dikonfirmasi.</li>
    </ol>

    <h5>3. Penggunaan Tiket</h5>
    <ol>
        <li>Satu tiket berlaku untuk satu orang, kecuali jika secara eksplisit dinyatakan berbeda (misalnya, tiket keluarga atau grup).</li>
        <li>Tiket hanya berlaku untuk event, tanggal, dan waktu yang tertera pada tiket.</li>
        <li>Tiket yang sudah dibeli pada umumnya tidak dapat dipindahtangankan, kecuali jika diizinkan secara khusus oleh Penyelenggara Event dan/atau Hegra.</li>
        <li>Tiket yang sudah dibeli pada umumnya tidak dapat dibatalkan, ditukar, atau diuangkan kembali (non-refundable), kecuali dalam kasus pembatalan event oleh Penyelenggara atau kondisi lain yang ditetapkan oleh Penyelenggara dan/atau Hegra. Kebijakan refund akan mengikuti ketentuan dari Penyelenggara.</li>
        <li>Dilarang memperjualbelikan tiket di luar platform resmi atau dengan harga yang tidak wajar. Hegra dan Penyelenggara berhak membatalkan tiket yang diperoleh melalui cara yang tidak sah.</li>
        <li>Anda bertanggung jawab penuh atas keamanan e-tiket Anda. Jangan membagikan kode QR atau detail unik tiket kepada pihak yang tidak berkepentingan.</li>
    </ol>

    <h5>4. Pengumpulan dan Penggunaan Data Pribadi</h5>
    <ol>
        <li>Dengan melakukan transaksi di Hegra, Anda menyetujui pengumpulan, penyimpanan, penggunaan, dan pengungkapan data pribadi Anda (termasuk data diri pemesan dan data pemegang tiket tambahan jika ada) oleh Hegra dan Penyelenggara.</li>
        <li>Data pribadi Anda akan digunakan untuk keperluan:
            <ul>
                <li>Memproses transaksi pembelian tiket.</li>
                <li>Menerbitkan dan mengirimkan e-tiket.</li>
                <li>Komunikasi terkait event (informasi, perubahan, pembatalan).</li>
                <li>Verifikasi identitas di lokasi event.</li>
                <li>Analisis dan pengembangan layanan Hegra.</li>
                <li>Tujuan pemasaran dengan persetujuan Anda (opt-in).</li>
            </ul>
        </li>
        <li>Data pribadi Anda dapat dibagikan kepada Penyelenggara Event terkait untuk keperluan manajemen event dan komunikasi dengan peserta.</li>
        <li>Hegra berkomitmen untuk melindungi data pribadi Anda sesuai dengan Kebijakan Privasi Hegra dan peraturan perundang-undangan yang berlaku di Indonesia. Silakan merujuk ke Kebijakan Privasi kami untuk informasi lebih lanjut.</li>
    </ol>

    <h5>5. Pelaksanaan Event</h5>
    <ol>
        <li>Anda wajib mematuhi seluruh peraturan dan tata tertib yang berlaku di lokasi event, termasuk ketentuan yang ditetapkan oleh Penyelenggara dan pengelola venue.</li>
        <li>Penyelenggara berhak menolak masuk atau mengeluarkan peserta yang berperilaku tidak pantas, mengganggu ketertiban, atau melanggar peraturan tanpa pengembalian dana tiket.</li>
        <li>Penyelenggara berhak melakukan perubahan terhadap jadwal, pengisi acara, atau aspek lain dari event dengan pemberitahuan sebelumnya kepada peserta melalui email atau media komunikasi lain yang dianggap patut.</li>
        <li>Dilarang membawa senjata tajam, minuman keras, obat-obatan terlarang, atau barang-barang lain yang dapat membahayakan keselamatan dan kenyamanan peserta lain. Daftar barang yang dilarang dapat berbeda untuk setiap event dan akan diinformasikan oleh Penyelenggara.</li>
        <li>Pengambilan foto atau video selama event mungkin tunduk pada batasan yang ditetapkan oleh Penyelenggara.</li>
    </ol>

    <h5>6. Pembatalan, Penundaan, dan Perubahan Event oleh Penyelenggara</h5>
    <ol>
        <li>Jika event dibatalkan oleh Penyelenggara, proses pengembalian dana (refund) atau kompensasi lainnya akan menjadi tanggung jawab penuh Penyelenggara sesuai dengan kebijakan mereka. Hegra akan berupaya memfasilitasi komunikasi antara Anda dan Penyelenggara terkait hal ini.</li>
        <li>Jika event ditunda atau mengalami perubahan signifikan, Penyelenggara akan memberikan informasi mengenai opsi yang tersedia (misalnya, penggunaan tiket di tanggal baru atau refund).</li>
        <li>Hegra bertindak sebagai platform penjualan tiket dan tidak bertanggung jawab atas pelaksanaan, kualitas, perubahan, penundaan, atau pembatalan event oleh Penyelenggara.</li>
    </ol>

    <h5>7. Batasan Tanggung Jawab</h5>
    <ol>
        <li>Hegra tidak bertanggung jawab atas segala kerugian, cedera, atau kerusakan properti yang mungkin Anda alami selama menghadiri event, kecuali jika disebabkan secara langsung oleh kelalaian berat Hegra.</li>
        <li>Hegra dan Penyelenggara tidak bertanggung jawab atas kegagalan pelaksanaan event yang disebabkan oleh keadaan kahar (force majeure) seperti bencana alam, perang, huru-hara, pandemi, atau peraturan pemerintah yang di luar kendali wajar.</li>
    </ol>

    <h5>8. Hak Kekayaan Intelektual</h5>
    <p>Seluruh konten dan materi yang terdapat di Platform Hegra, termasuk namun tidak terbatas pada logo, desain, teks, grafis, dan perangkat lunak, adalah milik Hegra atau pemberi lisensinya dan dilindungi oleh undang-undang hak cipta dan kekayaan intelektual lainnya.</p>

    <h5>9. Persetujuan</h5>
    <p>Dengan mencentang kotak persetujuan dan melanjutkan transaksi, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh seluruh Syarat dan Ketentuan ini, serta Kebijakan Privasi Hegra.</p>

    <h5>10. Lain-lain</h5>
    <ol>
        <li>Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia.</li>
        <li>Hegra berhak untuk mengubah Syarat dan Ketentuan ini dari waktu ke waktu tanpa pemberitahuan sebelumnya. Versi terbaru akan selalu tersedia di Platform Hegra. Penggunaan Platform Hegra secara berkelanjutan setelah perubahan dianggap sebagai persetujuan Anda terhadap perubahan tersebut.</li>
        <li>Jika ada pertanyaan lebih lanjut mengenai Syarat dan Ketentuan ini, silakan hubungi layanan pelanggan kami melalui email di support@hegra.com atau melalui fitur bantuan di aplikasi.</li>
    </ol>

    Terima kasih telah menggunakan Hegra!
  `;


  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-labelledby="tnc-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-hegra-white text-hegra-navy p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors z-20"
          aria-label="Tutup modal Syarat dan Ketentuan"
        >
          <X size={24} />
        </button>

        <div className="flex items-center mb-4 sm:mb-6">
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-hegra-turquoise/20 sm:h-12 sm:w-12 mr-3 sm:mr-4">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-hegra-turquoise" aria-hidden="true" />
          </div>
          <h2 id="tnc-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy">
            Syarat dan Ketentuan Pembelian Tiket
          </h2>
        </div>

        <div 
          className="prose prose-sm max-w-none text-gray-700 max-h-[60vh] sm:max-h-[50vh] overflow-y-auto pr-2 mb-6 sm:mb-8 custom-scrollbar"
          dangerouslySetInnerHTML={{ __html: tncContent }}
        />

        <div className="flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={onConfirm}
            type="button"
            className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-3 bg-hegra-turquoise text-base font-semibold text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-yellow sm:text-sm transition-colors"
          >
            Ya, Saya Mengerti dan Setuju
          </button>
          <button
            onClick={onCancel}
            type="button"
            className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise sm:text-sm transition-colors"
          >
            Tidak, Batalkan Pesanan
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modal-appear {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-appear {
          animation: modal-appear 0.3s forwards;
        }
        .prose h5 {
          margin-top: 1.25em;
          margin-bottom: 0.5em;
          font-size: 1.1em;
          font-weight: 600;
        }
        .prose ul, .prose ol {
          margin-top: 0.5em;
          margin-bottom: 0.75em;
          padding-left: 1.5em;
        }
        .prose li {
          margin-top: 0.25em;
          margin-bottom: 0.25em;
        }
        .prose li > ul, .prose li > ol {
            margin-top: 0.25em;
            margin-bottom: 0.25em;
        }
        .prose p {
            margin-top: 0.5em;
            margin-bottom: 0.75em;
            line-height: 1.6;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c5c5c5; /* hegra-chino var(--hegra-chino) could be #d0cea9 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8; /* Darker shade of chino or turquoise */
        }
      `}</style>
    </div>
  );
};

export default TermsAndConditionsModal;
