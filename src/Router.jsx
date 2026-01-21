import { Routes, Route } from 'react-router-dom';
import App from './App';
import Page from './pages/Page';
import CategoryHub from './pages/CategoryHub';
import AdminApp from './admin/AdminApp';
import AdminLogin from './admin/AdminLogin';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import MedicalReviewBoard from './pages/MedicalReviewBoard';
import Careers from './pages/Careers';
import LegalPage from './pages/LegalPage';
import Research from './pages/Research';
import DrugIndexApp from './drug-index-app/App';


export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/articles" element={<Page title="Articles" />} />
      <Route path="/research-journals" element={<Research />} />
      <Route path="/pet-health" element={<CategoryHub title="Pet Health" subCategoryNames={['Dogs', 'Cats', 'Small Mammals']} />} />
      <Route path="/poultry-health" element={<CategoryHub title="Poultry Health" subCategoryNames={['Chickens', 'Ducks', 'Turkeys', 'Disease Management']} />} />
      <Route path="/nutrition" element={<CategoryHub title="Nutrition" subCategoryNames={['Pet Nutrition', 'Poultry Nutrition']} />} />
      <Route path="/resources" element={<Page title="Resources" />} />
      <Route path="/nutrition-guides" element={<CategoryHub title="Nutrition Guides" subCategoryNames={['Pet Nutrition', 'Poultry Nutrition']} />} />
      <Route path="/drug-index/*" element={<DrugIndexApp />} />

      {/* Company Pages */}
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/medical-review-board" element={<MedicalReviewBoard />} />
      <Route path="/careers" element={<Careers />} />

      {/* Legal & Policy Pages */}
      <Route path="/editorial-policy" element={<LegalPage title="Editorial Policy" />} />
      <Route path="/privacy-policy" element={<LegalPage title="Privacy Policy" />} />
      <Route path="/terms-of-service" element={<LegalPage title="Terms of Service" />} />
      <Route path="/cookie-policy" element={<LegalPage title="Cookie Policy" />} />
      <Route path="/disclaimer" element={<LegalPage title="Disclaimer" />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/:slug" element={<Page />} />
    </Routes>
  );
}
