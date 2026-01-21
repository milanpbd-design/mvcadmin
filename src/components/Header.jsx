import { Link, useLocation, useNavigate } from "react-router-dom";
import { labelToPath } from "../utils/paths";
import { useState } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { useTheme } from "../context/ThemeContext";

export default function Header({ siteName, navigation }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { siteData } = useSiteData() || {};
  const { darkMode, toggleTheme } = useTheme();

  function isActive(label) {
    const href = labelToPath(label);
    return location.pathname === href || (location.pathname === "/" && href === "/");
  }

  function categoryPathByName(name) {
    return labelToPath(name);
  }

  function isDropdownActive(dropdown) {
    return dropdown.some((sub) => categoryPathByName(sub) === location.pathname || labelToPath(sub) === location.pathname);
  }

  function onSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/articles?q=${encodeURIComponent(search)}`);
      setOpen(false);
    }
  }

  const navItems = navigation && navigation.length > 0 ? navigation : [];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo1.png" alt={siteName} className="w-8 h-8 -ml-1 rounded" />
            <span className="text-xl lg:text-2xl font-bold">
              <span className="text-green-600">My</span><span className="text-blue-800">VetCorner</span>
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-4 whitespace-nowrap">
            <nav className="flex items-center gap-4 xl:gap-6">
              {navItems.map((item, idx) => (
                item.dropdown && item.dropdown.length > 0 ? (
                  <div key={idx} className="dropdown relative group">
                    <Link to={labelToPath(item.label)} className={`flex items-center space-x-1 py-6 font-medium transition ${isActive(item.label) || isDropdownActive(item.dropdown) ? "text-blue-800 border-b-2 border-blue-800" : "text-gray-700 hover:text-blue-800"}`}>
                      <span>{item.label}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </Link>
                    <div className="dropdown-menu hidden group-hover:block absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
                      {item.dropdown.map((sub) => {
                        const to = categoryPathByName(sub);
                        const active = to === location.pathname;
                        return (
                          <Link key={sub} to={to} className={`block px-4 py-2 ${active ? "bg-blue-50 text-blue-800 font-medium" : "text-gray-700 hover:bg-blue-50 hover:text-blue-800"}`}>{sub}</Link>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <Link key={idx} to={labelToPath(item.label)} className={`font-medium transition ${isActive(item.label) ? "text-blue-800 border-b-2 border-blue-800 py-6" : "text-gray-700 hover:text-blue-800"}`}>{item.label}</Link>
                )
              ))}
            </nav>
            <form onSubmit={onSearch} className="flex items-center">
              <input
                type="text"
                className="border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 xl:w-48"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="bg-blue-800 text-white px-3 py-2 rounded-r-lg text-sm hover:bg-blue-900 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </form>
          </div>
          <button onClick={toggleTheme} className="hidden lg:block ml-4 p-2 rounded-full hover:bg-gray-100 text-gray-700 transition" aria-label="Toggle Theme">
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          <div className="flex items-center space-x-4 lg:hidden">
            <button className="p-2" onClick={() => setOpen((o) => !o)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`${open ? "" : "hidden"} lg:hidden bg-white border-t`}>
        <div className="px-4 py-4 space-y-3">
          <form onSubmit={onSearch} className="flex items-center mb-4">
            <input
              type="text"
              className="border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="bg-blue-800 text-white px-3 py-2 rounded-r-lg text-sm hover:bg-blue-900 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
          <div className="flex items-center justify-between px-1 pb-4">
            <span className="text-sm font-medium text-gray-700">Appearance</span>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition" aria-label="Toggle Theme">
              {darkMode ? (
                <div className="flex items-center space-x-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg><span>Light</span></div>
              ) : (
                <div className="flex items-center space-x-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg><span>Dark</span></div>
              )}
            </button>
          </div>
          {navItems.map((item) => (
            item.dropdown && item.dropdown.length > 0 ? (
              <div key={item.label} className="pb-2">
                <Link to={labelToPath(item.label)} className={`font-medium block pb-1 transition ${(isActive(item.label) || isDropdownActive(item.dropdown)) ? "text-blue-800" : "text-gray-700 hover:text-blue-800"}`}>{item.label}</Link>
                {item.dropdown.map((sub) => {
                  const to = categoryPathByName(sub);
                  const active = to === location.pathname;
                  return (
                    <Link key={sub} to={to} className={`block py-2 pl-4 transition ${active ? "text-blue-800 font-medium" : "text-gray-700 hover:text-blue-800"}`}>{sub}</Link>
                  )
                })}
              </div>
            ) : (
              <Link key={item.label} to={labelToPath(item.label)} className={`block py-2 font-medium transition ${isActive(item.label) ? "text-blue-800" : "text-gray-700 hover:text-blue-800"}`}>{item.label}</Link>
            )
          ))}
        </div>
      </div>
    </header>
  );
}
