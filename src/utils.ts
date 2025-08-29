// URL constants for easy reference
export const URLS = {
  LANDING: '/',
  BERANDA: '/beranda',
  EVENTS: '/events',
  EVENT_DETAIL: (slug: string) => `/events/${slug}`,
  EVENT_CHECKOUT: (slug: string) => `/events/${slug}/checkout`,
  EVENT_PAYMENT: (slug: string) => `/events/${slug}/payment`,
  EVENT_SUCCESS: (slug: string) => `/events/${slug}/success`,
  EVENT_TICKET: (slug: string) => `/events/${slug}/ticket`,
  BUSINESS: '/business',
  BUSINESS_DETAIL: (slug: string) => `/business/${slug}`,
  HELP: '/help',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  DASHBOARD_BM: '/dashboard-bm',
  CREATE_EVENT: '/create-event',
  CREATOR_AUTH: '/creator-auth',
  OTP: '/otp',
  ARTICLES: '/articles',
  HOME: '/home',
};

// Helper function to generate URLs
export const generateUrl = (route: string, params?: Record<string, string>): string => {
  let url = route;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  
  return url;
};

// Slug generation utilities
export const generateEventSlug = (eventName: string): string => {
  return eventName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const generateCompanySlug = (companyName: string): string => {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};
