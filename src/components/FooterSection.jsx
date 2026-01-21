import { Link } from "react-router-dom";
import { footerLinkToPath } from "../utils/paths";
import { useSiteData } from "../context/SiteDataContext";
import { useTheme } from "../context/ThemeContext";

export default function FooterSection({ siteName, footer }) {
  const { siteData } = useSiteData() || {};
  const { darkMode } = useTheme();

  const pages = siteData?.pages || [];
  function pagePath(name) {
    const p = pages.find(p => (p?.title || '') === name);
    if (p?.slug) return `/pages/${p.slug}`;
    return footerLinkToPath(name);
  }
  const socialLinks = Array.isArray(siteData?.footer?.socialLinks)
    ? siteData.footer.socialLinks
    : Array.isArray(footer?.socialLinks)
      ? footer.socialLinks
      : [];

  const getIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>;
      case 'facebook': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.324 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>;
      case 'instagram': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" /></svg>;
      case 'linkedin': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>;
      case 'youtube': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93 0 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;
      default: return <span className="font-bold text-xs">{platform?.[0]}</span>;
    }
  }

  // Theme classes
  const footerBg = darkMode ? "bg-gray-900" : "bg-blue-50 border-t border-gray-200";
  const textColor = darkMode ? "text-gray-400" : "text-gray-600";
  const headerColor = darkMode ? "text-white" : "text-gray-900";
  const linkHover = darkMode ? "hover:text-white" : "hover:text-blue-800";
  const borderColor = darkMode ? "border-gray-800" : "border-gray-200";

  return (
    <footer className={`${footerBg} ${textColor} py-12 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold">
                <span className="text-green-500">My</span><span className="text-blue-400">VetCorner</span>
              </span>
            </div>
            <p className="text-sm mb-4">{siteData?.footer?.description || footer.description}</p>
            <div className="flex space-x-4">
              {socialLinks.map((link, i) => (
                link.url && (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={`${linkHover} transition`} aria-label={link.platform}>
                    {getIcon(link.platform)}
                  </a>
                )
              ))}
            </div>
          </div>
          <div>
            <h4 className={`${headerColor} font-semibold mb-3`}>Quick Links</h4>
            <ul className="space-y-2">
              {footer.quickLinks.map((l) => (
                <li key={l}><Link className={`${linkHover} transition`} to={pagePath(l)}>{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={`${headerColor} font-semibold mb-3`}>Company</h4>
            <ul className="space-y-2">
              {footer.companyLinks.map((l) => (
                <li key={l}><Link className={`${linkHover} transition`} to={pagePath(l)}>{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={`${headerColor} font-semibold mb-3`}>Legal</h4>
            <ul className="space-y-2">
              {footer.legalLinks.map((l) => (
                <li key={l}><Link className={`${linkHover} transition`} to={pagePath(l)}>{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className={`border-t ${borderColor} pt-6 text-sm`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <p className={textColor}>
              &copy; {new Date().getFullYear()} <span className="text-green-500">My</span><span className="text-blue-400">VetCorner</span>. All rights reserved.
            </p>
            <p className={`${textColor} md:text-right`}>{footer.disclaimerText}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
