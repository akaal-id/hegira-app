import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { URLS, generateEventSlug, generateCompanySlug } from '../utils';
import { PageName } from '../../HegiraApp';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const navigateTo = (page: PageName, data?: any) => {
    let path = '/';
    
    switch (page) {
      case 'landing':
        path = URLS.LANDING;
        break;
      case 'events':
        path = URLS.EVENTS;
        break;
      case 'eventDetail':
        if (data?.eventSlug) {
          path = URLS.EVENT_DETAIL(data.eventSlug);
        } else if (data?.name) {
          path = URLS.EVENT_DETAIL(generateEventSlug(data.name));
        } else {
          path = URLS.EVENTS;
        }
        break;
      case 'checkout':
        if (data?.event?.eventSlug) {
          path = URLS.EVENT_CHECKOUT(data.event.eventSlug);
        } else if (data?.event?.name) {
          path = URLS.EVENT_CHECKOUT(generateEventSlug(data.event.name));
        } else {
          path = URLS.EVENTS;
        }
        break;
      case 'paymentLoading':
        if (data?.event?.eventSlug) {
          path = URLS.EVENT_PAYMENT(data.event.eventSlug);
        } else if (data?.event?.name) {
          path = URLS.EVENT_PAYMENT(generateEventSlug(data.event.name));
        } else {
          // For payment loading, we need event data to construct the URL
          console.warn('Payment loading navigation requires event data');
          path = URLS.EVENTS;
        }
        break;
      case 'transactionSuccess':
        if (data?.event?.eventSlug) {
          path = URLS.EVENT_SUCCESS(data.event.eventSlug);
        } else if (data?.event?.name) {
          path = URLS.EVENT_SUCCESS(generateEventSlug(data.event.name));
        } else {
          // For transaction success, we need event data to construct the URL
          console.warn('Transaction success navigation requires event data');
          path = URLS.EVENTS;
        }
        break;
      case 'ticketDisplay':
        if (data?.event?.eventSlug) {
          path = URLS.EVENT_TICKET(data.event.eventSlug);
        } else if (data?.event?.name) {
          path = URLS.EVENT_TICKET(generateEventSlug(data.event.name));
        } else {
          // For ticket display, we need event data to construct the URL
          console.warn('Ticket display navigation requires event data');
          path = URLS.EVENTS;
        }
        break;
      case 'business':
        path = URLS.BUSINESS;
        break;
      case 'businessDetail':
        if (data?.slug) {
          path = URLS.BUSINESS_DETAIL(data.slug);
        } else if (data?.name) {
          path = URLS.BUSINESS_DETAIL(generateCompanySlug(data.name));
        } else {
          path = URLS.BUSINESS;
        }
        break;
      case 'help':
        path = URLS.HELP;
        break;
      case 'login':
        path = URLS.LOGIN;
        break;
      case 'signup':
        path = URLS.SIGNUP;
        break;
      case 'dashboard':
        path = URLS.DASHBOARD;
        break;
      case 'createEventInfo':
        path = URLS.CREATE_EVENT;
        break;
      case 'creatorAuth':
        path = URLS.CREATOR_AUTH;
        break;
      case 'otpInput':
        path = URLS.OTP;
        break;
      case 'articlesPage':
        path = URLS.ARTICLES;
        break;
      case 'home':
        path = URLS.HOME;
        break;
      default:
        path = URLS.LANDING;
    }

    // Store data in sessionStorage for the next page to access
    if (data) {
      sessionStorage.setItem('navigationData', JSON.stringify(data));
    }

    navigate(path);
  };

  const getNavigationData = () => {
    const data = sessionStorage.getItem('navigationData');
    if (data) {
      sessionStorage.removeItem('navigationData');
      return JSON.parse(data);
    }
    return null;
  };

  const getCurrentPage = (): PageName => {
    const path = location.pathname;
    
    if (path === '/' || path === '/beranda') return 'landing';
    if (path === '/events') return 'events';
    if (path.startsWith('/events/') && path.includes('/checkout')) return 'checkout';
    if (path.startsWith('/events/') && path.includes('/payment')) return 'paymentLoading';
    if (path.startsWith('/events/') && path.includes('/success')) return 'transactionSuccess';
    if (path.startsWith('/events/') && path.includes('/ticket')) return 'ticketDisplay';
    if (path.startsWith('/events/')) return 'eventDetail';
    if (path === '/business') return 'business';
    if (path.startsWith('/business/')) return 'businessDetail';
    if (path === '/help') return 'help';
    if (path === '/login') return 'login';
    if (path === '/signup') return 'signup';
    if (path === '/dashboard') return 'dashboard';
    if (path === '/dashboard-bm') return 'dashboard';
    if (path === '/create-event') return 'createEventInfo';
    if (path === '/creator-auth') return 'creatorAuth';
    if (path === '/otp') return 'otpInput';
    if (path === '/articles') return 'articlesPage';
    if (path === '/home') return 'home';
    
    return 'landing';
  };

  const getEventSlug = (): string | null => {
    return params.eventSlug || null;
  };

  const getCompanySlug = (): string | null => {
    return params.companySlug || null;
  };

  return {
    navigateTo,
    getNavigationData,
    getCurrentPage,
    getEventSlug,
    getCompanySlug,
    currentPath: location.pathname,
  };
};
