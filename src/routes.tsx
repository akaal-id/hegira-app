import React from 'react';
import { RouteObject } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import EventPage from '../pages/EventPage';
import BusinessMatchingPage from '../pages/BusinessMatchingPage';
import HelpPage from '../pages/HelpPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import BusinessMatchingDashboardPage from '../pages/dashboard-bm/BusinessMatchingDashboardPage';
import EventDetailPage from '../pages/EventDetailPage';
import CheckoutPage from '../pages/CheckoutPage';
import PaymentLoadingPage from '../pages/PaymentLoadingPage';
import TransactionSuccessPage from '../pages/TransactionSuccessPage';
import TicketDisplayPage from '../pages/TicketDisplayPage';
import CreateEventInfoPage from '../pages/CreateEventInfoPage';
import ArticleListPage from '../pages/ArticleListPage';
import CreatorAuthPage from '../pages/CreatorAuthPage';
import OtpInputPage from '../pages/OtpInputPage';
import CompanyDetailPage from '../pages/business-matching/CompanyDetailPage';
import Home from '../Home';

// Route components that will be rendered
export const routeComponents = {
  landing: LandingPage,
  events: EventPage,
  business: BusinessMatchingPage,
  help: HelpPage,
  login: LoginPage,
  signup: SignupPage,
  dashboard: DashboardPage,
  businessMatchingDashboard: BusinessMatchingDashboardPage,
  eventDetail: EventDetailPage,
  checkout: CheckoutPage,
  paymentLoading: PaymentLoadingPage,
  transactionSuccess: TransactionSuccessPage,
  ticketDisplay: TicketDisplayPage,
  createEventInfo: CreateEventInfoPage,
  articlesPage: ArticleListPage,
  creatorAuth: CreatorAuthPage,
  otpInput: OtpInputPage,
  businessDetail: CompanyDetailPage,
  home: Home,
};

// Route configuration with slugs
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/beranda',
    element: <LandingPage />,
  },
  {
    path: '/events',
    element: <EventPage />,
  },
  {
    path: '/events/:eventSlug',
    element: <EventDetailPage />,
  },
  {
    path: '/events/:eventSlug/checkout',
    element: <CheckoutPage />,
  },
  {
    path: '/events/:eventSlug/payment',
    element: <PaymentLoadingPage />,
  },
  {
    path: '/events/:eventSlug/success',
    element: <TransactionSuccessPage />,
  },
  {
    path: '/events/:eventSlug/ticket',
    element: <TicketDisplayPage />,
  },
  {
    path: '/business',
    element: <BusinessMatchingPage />,
  },
  {
    path: '/business/:companySlug',
    element: <CompanyDetailPage />,
  },
  {
    path: '/help',
    element: <HelpPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/dashboard-bm',
    element: <BusinessMatchingDashboardPage />,
  },
  {
    path: '/create-event',
    element: <CreateEventInfoPage />,
  },
  {
    path: '/creator-auth',
    element: <CreatorAuthPage />,
  },
  {
    path: '/otp',
    element: <OtpInputPage />,
  },
  {
    path: '/articles',
    element: <ArticleListPage />,
  },
  {
    path: '/home',
    element: <Home />,
  },
];

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
