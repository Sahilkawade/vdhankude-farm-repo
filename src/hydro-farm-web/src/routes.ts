import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('pages/home/HomePage.tsx'),
  route('about', 'pages/about/AboutPage.tsx'),
  route('hydroponics', 'pages/hydroponics/HydroponicsPage.tsx'),
  route('our-farm', 'pages/our-farm/OurFarmPage.tsx'),
  route('training', 'pages/training/TrainingPage.tsx'),
  route('farm-setup', 'pages/farm-setup/FarmSetupPage.tsx'),
  route('contact', 'pages/contact/ContactPage.tsx'),
  route('*', 'pages/NotFoundPage.tsx'),
] satisfies RouteConfig;
