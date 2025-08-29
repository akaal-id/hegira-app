
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
    Welcome to Hegra! Before you proceed with purchasing tickets for the event "${eventName}", please take the time to read and understand the following Terms and Conditions. By clicking "Yes, I Understand and Agree", you are deemed to have read, understood, and agreed to all the contents of these Terms and Conditions.

    <h5>1. Definitions</h5>
    <ul>
        <li><strong>Hegra Platform (hereinafter referred to as "Hegra" or "We")</strong>: Refers to the Hegra application and website that provides event information and ticket purchasing services.</li>
        <li><strong>Event Organizer (hereinafter referred to as "Organizer")</strong>: Third party responsible for the implementation and content of the event whose tickets are sold through Hegra.</li>
        <li><strong>User (hereinafter referred to as "You")</strong>: Any individual who accesses or uses the Hegra Platform to search for information or make ticket purchases.</li>
        <li><strong>Ticket</strong>: Electronic document (e-ticket) that gives the holder the right to attend a specific event according to the category and terms stated.</li>
    </ul>

    <h5>2. Ticket Purchase</h5>
    <ol>
        <li>You are required to provide accurate, complete, and current data when making ticket reservations, including full name, email address, and phone number.</li>
        <li>After payment is successfully verified, e-tickets will be sent to the email address you registered and/or through notifications in the application. Make sure the email address you enter is correct and active.</li>
        <li>Hegra is not responsible for e-ticket delivery failures caused by email address typos or technical issues with your email server.</li>
        <li>All ticket purchase transactions are final after payment is confirmed.</li>
    </ol>

    <h5>3. Ticket Usage</h5>
    <ol>
        <li>One ticket is valid for one person, unless explicitly stated otherwise (e.g., family or group tickets).</li>
        <li>Tickets are only valid for the event, date, and time stated on the ticket.</li>
        <li>Tickets that have been purchased generally cannot be transferred, unless specifically permitted by the Event Organizer and/or Hegra.</li>
        <li>Tickets that have been purchased generally cannot be cancelled, exchanged, or refunded (non-refundable), except in cases of event cancellation by the Organizer or other conditions set by the Organizer and/or Hegra. Refund policy will follow the Organizer's terms.</li>
        <li>It is prohibited to resell tickets outside the official platform or at unreasonable prices. Hegra and the Organizer have the right to cancel tickets obtained through unauthorized means.</li>
        <li>You are fully responsible for the security of your e-ticket. Do not share the QR code or unique ticket details with unauthorized parties.</li>
    </ol>

    <h5>4. Collection and Use of Personal Data</h5>
    <ol>
        <li>By making transactions on Hegra, you agree to the collection, storage, use, and disclosure of your personal data (including booker data and additional ticket holder data if any) by Hegra and the Organizer.</li>
        <li>Your personal data will be used for:
            <ul>
                <li>Processing ticket purchase transactions.</li>
                <li>Issuing and sending e-tickets.</li>
                <li>Event-related communication (information, changes, cancellations).</li>
                <li>Identity verification at event locations.</li>
                <li>Analysis and development of Hegra services.</li>
                <li>Marketing purposes with your consent (opt-in).</li>
            </ul>
        </li>
        <li>Your personal data may be shared with the relevant Event Organizer for event management purposes and communication with participants.</li>
        <li>Hegra is committed to protecting your personal data in accordance with Hegra's Privacy Policy and applicable laws and regulations in Indonesia. Please refer to our Privacy Policy for more information.</li>
    </ol>

    <h5>5. Event Implementation</h5>
    <ol>
        <li>You must comply with all rules and regulations applicable at the event location, including terms set by the Organizer and venue management.</li>
        <li>The Organizer has the right to deny entry or expel participants who behave inappropriately, disturb order, or violate regulations without ticket refunds.</li>
        <li>The Organizer has the right to make changes to the schedule, performers, or other aspects of the event with prior notice to participants via email or other appropriate communication media.</li>
        <li>It is prohibited to bring sharp weapons, alcoholic beverages, illegal drugs, or other items that may endanger the safety and comfort of other participants. The list of prohibited items may vary for each event and will be informed by the Organizer.</li>
        <li>Taking photos or videos during the event may be subject to restrictions set by the Organizer.</li>
    </ol>

    <h5>6. Event Cancellation, Postponement, and Changes by Organizer</h5>
    <ol>
        <li>If the event is cancelled by the Organizer, the refund process or other compensation will be the full responsibility of the Organizer according to their policy. Hegra will endeavor to facilitate communication between you and the Organizer regarding this matter.</li>
        <li>If the event is postponed or experiences significant changes, the Organizer will provide information about available options (e.g., using tickets on the new date or refund).</li>
        <li>Hegra acts as a ticket sales platform and is not responsible for the implementation, quality, changes, postponement, or cancellation of events by the Organizer.</li>
    </ol>

    <h5>7. Limitation of Liability</h5>
    <ol>
        <li>Hegra is not responsible for any losses, injuries, or property damage you may experience while attending the event, unless caused directly by Hegra's gross negligence.</li>
        <li>Hegra and the Organizer are not responsible for event implementation failures caused by force majeure circumstances such as natural disasters, war, riots, pandemics, or government regulations beyond reasonable control.</li>
    </ol>

    <h5>8. Intellectual Property Rights</h5>
    <p>All content and materials contained on the Hegra Platform, including but not limited to logos, designs, text, graphics, and software, are owned by Hegra or its licensors and are protected by copyright and other intellectual property laws.</p>

    <h5>9. Consent</h5>
    <p>By checking the consent box and proceeding with the transaction, you declare that you have read, understood, and agreed to be bound by all these Terms and Conditions, as well as Hegra's Privacy Policy.</p>

    <h5>10. Miscellaneous</h5>
    <ol>
        <li>These Terms and Conditions are governed by and interpreted in accordance with the laws applicable in the Republic of Indonesia.</li>
        <li>Hegra has the right to change these Terms and Conditions from time to time without prior notice. The latest version will always be available on the Hegra Platform. Continued use of the Hegra Platform after changes is considered as your consent to such changes.</li>
        <li>If you have further questions regarding these Terms and Conditions, please contact our customer service via email at support@hegra.com or through the help feature in the application.</li>
    </ol>

    Thank you for using Hegra!
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
          aria-label="Close Terms and Conditions modal"
        >
          <X size={24} />
        </button>

        <div className="flex items-center mb-4 sm:mb-6">
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-hegra-turquoise/20 sm:h-12 sm:w-12 mr-3 sm:mr-4">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-hegra-turquoise" aria-hidden="true" />
          </div>
          <h2 id="tnc-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy">
            Ticket Purchase Terms and Conditions
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
            Yes, I Understand and Agree
          </button>
          <button
            onClick={onCancel}
            type="button"
            className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise sm:text-sm transition-colors"
          >
            No, Cancel Order
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
