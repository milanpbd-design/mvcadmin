import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { labelToPath } from './utils/paths';
import Header from './components/Header';
import FooterSection from './components/FooterSection';
import { useTheme } from './context/ThemeContext';
import { useSiteData } from './context/SiteDataContext';

const Icons = {
  shield: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  book: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  users: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  lab: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
};

//

function getPath(name) { return labelToPath(name); }

function App() {
  const { siteData, setSiteData } = useSiteData() || {};
  const { darkMode } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminTab, setAdminTab] = useState('articles');
  const [articleSort, setArticleSort] = useState('newest');
  const [slideSort, setSlideSort] = useState('original');
  const [researchSort, setResearchSort] = useState('newest');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmDeleteSlide, setConfirmDeleteSlide] = useState(null);
  const [confirmDeleteExpert, setConfirmDeleteExpert] = useState(null);
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState(null);
  const [confirmDeleteResearch, setConfirmDeleteResearch] = useState(null);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const expertCarouselRef = useRef(null);
  const categoryCarouselRef = useRef(null);

  useEffect(() => { if (siteData?.site) document.title = `${siteData.site.name} - ${siteData.site.tagline}`; }, [siteData?.site]);
  useEffect(() => {
    const id = setInterval(() => {
      const len = siteData?.slides?.length || 0;
      if (len > 0) setCurrentSlide(s => (s + 1) % len);
    }, 6000);
    return () => clearInterval(id);
  }, [siteData?.slides]);
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (adminOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = prev; };
  }, [adminOpen]);

  function updateArticle(i, field, value) {
    setSiteData(d => ({
      ...d,
      articles: d.articles.map((a, idx) => {
        if (idx !== i) return a;
        const next = { ...a, [field]: value };
        if (field === 'excerpt' || field === 'content') {
          const basis = field === 'content' ? value : (next.content || value || '');
          const words = (basis || '').trim().split(/\s+/).filter(Boolean).length;
          const minutes = Math.max(1, Math.ceil(words / 200));
          next.readTime = `${minutes} min read`;
        }
        return next;
      }),
    }));
  }
  function formatToday() {
    const d = new Date();
    const m = d.toLocaleString('en-US', { month: 'short' });
    const day = d.getDate();
    const y = d.getFullYear();
    return `${m} ${day}, ${y}`;
  }
  function addArticle() {
    const today = formatToday();
    setSiteData(d => ({
      ...d,
      articles: [
        { image: '', category: '', categoryColor: 'blue', title: '', excerpt: '', date: today, readTime: '' },
        ...d.articles,
      ],
    }));
  }
  function removeArticle(i) {
    setSiteData(d => ({ ...d, articles: d.articles.filter((_, idx) => idx !== i) }));
  }
  function moveArticle(i, dir) {
    setSiteData(d => {
      const next = [...d.articles];
      const j = dir === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= next.length) return d;
      const tmp = next[i];
      next[i] = next[j];
      next[j] = tmp;
      return { ...d, articles: next };
    });
  }
  function setArticleFlag(i, field, value) {
    setSiteData(d => ({
      ...d,
      articles: d.articles.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)),
    }));
  }
  function genSlug(s) {
    return s
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  function updateSlide(i, field, value) {
    setSiteData(d => ({
      ...d,
      slides: d.slides.map((a, idx) => {
        if (idx !== i) return a;
        const next = { ...a, [field]: value };
        if (field === 'excerpt') {
          const words = (value || '').trim().split(/\s+/).filter(Boolean).length;
          const minutes = Math.max(1, Math.ceil(words / 200));
          next.readTime = `${minutes} min read`;
        }
        return next;
      }),
    }));
  }
  function addSlide() {
    setSiteData(d => ({
      ...d,
      slides: [...d.slides, { tag: '', title: '', excerpt: '', image: '', readTime: '' }],
    }));
  }
  function removeSlide(i) {
    setSiteData(d => ({ ...d, slides: d.slides.filter((_, idx) => idx !== i) }));
  }
  function moveSlide(i, dir) {
    setSiteData(d => {
      const next = [...d.slides];
      const j = dir === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= next.length) return d;
      const tmp = next[i];
      next[i] = next[j];
      next[j] = tmp;
      return { ...d, slides: next };
    });
  }
  function updateExpert(i, field, value) {
    setSiteData(d => ({
      ...d,
      experts: d.experts.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)),
    }));
  }
  function addExpert() {
    setSiteData(d => ({
      ...d,
      experts: [...d.experts, { name: '', title: '', specialty: '', image: '' }],
    }));
  }
  function removeExpert(i) {
    setSiteData(d => ({ ...d, experts: d.experts.filter((_, idx) => idx !== i) }));
  }
  function updateCategory(i, field, value) {
    setSiteData(d => ({
      ...d,
      categories: d.categories.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)),
    }));
  }
  const [catIdx, setCatIdx] = useState(0);
  function addCategory() {
    setSiteData(d => ({
      ...d,
      categories: [...d.categories, { name: '', count: '', image: '' }],
    }));
  }
  function removeCategory(i) {
    setSiteData(d => ({ ...d, categories: d.categories.filter((_, idx) => idx !== i) }));
  }
  function updateResearch(i, field, value) {
    setSiteData(d => ({
      ...d,
      research: d.research.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)),
    }));
  }
  function addResearch() {
    setSiteData(d => ({
      ...d,
      research: [...d.research, { type: '', typeColor: 'blue', year: '', title: '', authors: '', journal: '', abstract: '' }],
    }));
  }
  function removeResearch(i) {
    setSiteData(d => ({ ...d, research: d.research.filter((_, idx) => idx !== i) }));
  }

  return (
    <div className="bg-white text-gray-800 min-h-screen">


      {adminOpen && (
        <div className="fixed inset-0 z-50 admin-panel" style={{ background: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
          {!isLoggedIn ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl relative">
                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setAdminOpen(false)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h2>
                <div className="space-y-4">
                  <input type="password" placeholder="Enter admin password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onKeyDown={e => { if (e.key === 'Enter') { if (e.currentTarget.value === siteData.adminPassword) setIsLoggedIn(true); } }} />
                  <button className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition" onClick={e => { const input = e.currentTarget.parentElement?.querySelector('input'); if (input && input.value === siteData.adminPassword) setIsLoggedIn(true); }}>Login</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-stretch min-h-screen" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
              <div className="bg-gray-900 text-gray-300 w-72 p-6 admin-sidebar overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white">Admin Panel</h3>
                  <p className="text-gray-400 text-sm">Manage site content and settings</p>
                </div>
                <div className="space-y-2">
                  {[
                    { key: 'hero', label: 'Hero Slides' },
                    { key: 'stats', label: 'Trust Statistics' },
                    { key: 'articles', label: 'Articles' },
                    { key: 'experts', label: 'Experts' },
                    { key: 'categories', label: 'Categories' },
                    { key: 'research', label: 'Research' },
                    { key: 'security', label: 'Security Settings' },
                  ].map(t => (
                    <button
                      key={t.key}
                      data-tab={t.key}
                      className={`admin-tab w-full text-left px-4 py-3 rounded-lg ${adminTab === t.key ? 'tab-active' : 'hover:bg-gray-800'}`}
                      onClick={() => setAdminTab(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition text-red-400" onClick={() => { setIsLoggedIn(false); }}>
                    Logout
                  </button>
                </div>
              </div>
              <div className="flex-1" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                <div className="bg-white rounded-2xl p-8 w-full max-w-4xl mx-4 shadow-2xl relative">
                  <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => { setIsLoggedIn(false); setAdminOpen(false); }}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Panel</h2>

                  {adminTab === 'articles' && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Manage Articles</h3>
                        <div className="flex items-center gap-3">
                          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold" onClick={addArticle}>Add Article</button>
                          <select className="px-3 py-2 border border-gray-300 rounded-lg" value={articleSort} onChange={e => setArticleSort(e.target.value)}>
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                            <option value="title-az">Title A–Z</option>
                            <option value="title-za">Title Z–A</option>
                            <option value="published">Published first</option>
                            <option value="draft">Drafts first</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-6">
                        {siteData.articles
                          .map((a, i) => ({ a, i }))
                          .sort((x, y) => {
                            if (articleSort === 'newest') return x.i - y.i;
                            if (articleSort === 'oldest') return y.i - x.i;
                            if (articleSort === 'title-az') return (x.a.title || '').localeCompare(y.a.title || '');
                            if (articleSort === 'title-za') return (y.a.title || '').localeCompare(x.a.title || '');
                            if (articleSort === 'published') return Number(Boolean(y.a.published)) - Number(Boolean(x.a.published));
                            if (articleSort === 'draft') return Number(Boolean(x.a.published)) - Number(Boolean(y.a.published));
                            return 0;
                          })
                          .map(({ a, i }) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-4 editable-item">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Title" value={a.title} onChange={e => updateArticle(i, 'title', e.target.value)} />
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Slug" value={a.slug || ''} onChange={e => updateArticle(i, 'slug', e.target.value)} />
                                <div className="px-4 py-3 border border-gray-300 rounded-lg flex flex-col">
                                  <label className="text-sm text-gray-600 mb-2">Category</label>
                                  <select className="px-3 py-2 border border-gray-300 rounded-lg" value={a.category || ''} onChange={e => updateArticle(i, 'category', e.target.value)}>
                                    {([...new Set([
                                      'Dogs', 'Cats', 'Small Mammals', 'Chickens', 'Ducks', 'Turkeys', 'Disease Management', 'Pet Nutrition', 'Poultry Nutrition', 'Research & Journals', 'Vet Finder', 'Drug Index',
                                      ...((siteData.categories || []).map(c => c.name))
                                    ])]).map((name, idx) => (
                                      <option key={idx} value={name}>{name}</option>
                                    ))}
                                  </select>
                                </div>
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Category Color (e.g., blue, green)" value={a.categoryColor} onChange={e => updateArticle(i, 'categoryColor', e.target.value)} />
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Date" value={a.date} onChange={e => updateArticle(i, 'date', e.target.value)} />
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Read Time" value={a.readTime} onChange={e => updateArticle(i, 'readTime', e.target.value)} />
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Image URL" value={a.image} onChange={e => updateArticle(i, 'image', e.target.value)} />
                              </div>
                              <textarea rows={3} className="mt-4 w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Excerpt" value={a.excerpt} onChange={e => updateArticle(i, 'excerpt', e.target.value)} />
                              <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <button className="px-3 py-2 bg-gray-100 rounded-lg text-sm" onClick={() => updateArticle(i, 'slug', genSlug(a.title || ''))}>Generate Slug</button>
                                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!a.published} onChange={e => setArticleFlag(i, 'published', e.target.checked)} /> Published</label>
                                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!a.featured} onChange={e => setArticleFlag(i, 'featured', e.target.checked)} /> Featured</label>
                                  <div className="flex items-center gap-2">
                                    <button className="px-3 py-2 border rounded text-sm" onClick={() => setArticleFlag(i, 'published', true)}>Publish</button>
                                    <button className="px-3 py-2 border rounded text-sm" onClick={() => setArticleFlag(i, 'published', false)}>Save to Draft</button>
                                    <span className="text-xs text-gray-500">{a.published ? 'Published' : 'Draft'}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button className="text-gray-700 hover:text-gray-900 text-sm font-semibold" onClick={() => moveArticle(i, 'up')}>Move Up</button>
                                  <button className="text-gray-700 hover:text-gray-900 text-sm font-semibold" onClick={() => moveArticle(i, 'down')}>Move Down</button>
                                  <button className="text-red-600 hover:text-red-700 text-sm font-semibold" onClick={() => setConfirmDelete(i)}>Delete</button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      {confirmDelete !== null && (
                        <div className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.5)' }}>
                          <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                              <h4 className="text-lg font-bold text-gray-900 mb-2">Delete Article?</h4>
                              <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete "{siteData.articles[confirmDelete]?.title || 'Untitled'}"?</p>
                              <div className="flex items-center justify-end gap-3">
                                <button className="px-4 py-2 rounded-lg border" onClick={() => setConfirmDelete(null)}>Cancel</button>
                                <button className="px-4 py-2 rounded-lg bg-red-600 text-white" onClick={() => { removeArticle(confirmDelete); setConfirmDelete(null); }}>Delete</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {adminTab === 'hero' && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Manage Slides</h3>
                        <div className="flex items-center gap-3">
                          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold" onClick={addSlide}>Add Slide</button>
                          <select className="px-3 py-2 border border-gray-300 rounded-lg" value={slideSort} onChange={e => setSlideSort(e.target.value)}>
                            <option value="original">Original order</option>
                            <option value="title-az">Title A–Z</option>
                            <option value="title-za">Title Z–A</option>
                            <option value="tag-az">Tag A–Z</option>
                            <option value="tag-za">Tag Z–A</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-6">
                        {siteData.slides
                          .map((a, i) => ({ a, i }))
                          .sort((x, y) => {
                            if (slideSort === 'original') return x.i - y.i;
                            if (slideSort === 'title-az') return (x.a.title || '').localeCompare(y.a.title || '');
                            if (slideSort === 'title-za') return (y.a.title || '').localeCompare(x.a.title || '');
                            if (slideSort === 'tag-az') return (x.a.tag || '').localeCompare(y.a.tag || '');
                            if (slideSort === 'tag-za') return (y.a.tag || '').localeCompare(x.a.tag || '');
                            return 0;
                          })
                          .map(({ a, i }) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-4 editable-item">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Tag" value={a.tag} onChange={e => updateSlide(i, 'tag', e.target.value)} />
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Title" value={a.title} onChange={e => updateSlide(i, 'title', e.target.value)} />
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Read Time" value={a.readTime} onChange={e => updateSlide(i, 'readTime', e.target.value)} />
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Image URL" value={a.image} onChange={e => updateSlide(i, 'image', e.target.value)} />
                              </div>
                              <textarea rows={3} className="mt-4 w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Excerpt" value={a.excerpt} onChange={e => updateSlide(i, 'excerpt', e.target.value)} />
                              <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <button className="text-gray-700 hover:text-gray-900 text-sm font-semibold" onClick={() => moveSlide(i, 'up')}>Move Up</button>
                                  <button className="text-gray-700 hover:text-gray-900 text-sm font-semibold" onClick={() => moveSlide(i, 'down')}>Move Down</button>
                                </div>
                                <button className="text-red-600 hover:text-red-700 text-sm font-semibold" onClick={() => setConfirmDeleteSlide(i)}>Delete</button>
                              </div>
                            </div>
                          ))}
                      </div>

                      {confirmDeleteSlide !== null && (
                        <div className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.5)' }}>
                          <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                              <h4 className="text-lg font-bold text-gray-900 mb-2">Delete Slide?</h4>
                              <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete "{siteData.slides[confirmDeleteSlide]?.title || 'Untitled'}"?</p>
                              <div className="flex items-center justify-end gap-3">
                                <button className="px-4 py-2 rounded-lg border" onClick={() => setConfirmDeleteSlide(null)}>Cancel</button>
                                <button className="px-4 py-2 rounded-lg bg-red-600 text-white" onClick={() => { removeSlide(confirmDeleteSlide); setConfirmDeleteSlide(null); }}>Delete</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {adminTab === 'experts' && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Manage Experts</h3>
                      <div className="space-y-6">
                        {siteData.experts.map((a, i) => (
                          <div key={i} className="border border-gray-200 rounded-lg p-4 editable-item">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Name" value={a.name} onChange={e => updateExpert(i, 'name', e.target.value)} />
                              <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Title" value={a.title} onChange={e => updateExpert(i, 'title', e.target.value)} />
                              <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Specialty" value={a.specialty} onChange={e => updateExpert(i, 'specialty', e.target.value)} />
                              <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Image URL" value={a.image} onChange={e => updateExpert(i, 'image', e.target.value)} />
                            </div>
                            <div className="mt-3 flex items-center justify-end">
                              <button className="text-red-600 hover:text-red-700 text-sm font-semibold" onClick={() => setConfirmDeleteExpert(i)}>Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold" onClick={addExpert}>Add Expert</button>
                      </div>
                      {confirmDeleteExpert !== null && (
                        <div className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.5)' }}>
                          <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                              <h4 className="text-lg font-bold text-gray-900 mb-2">Delete Expert?</h4>
                              <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete "{siteData.experts[confirmDeleteExpert]?.name || 'Unnamed Expert'}"?</p>
                              <div className="flex items-center justify-end gap-3">
                                <button className="px-4 py-2 rounded-lg border" onClick={() => setConfirmDeleteExpert(null)}>Cancel</button>
                                <button className="px-4 py-2 rounded-lg bg-red-600 text-white" onClick={() => { removeExpert(confirmDeleteExpert); setConfirmDeleteExpert(null); }}>Delete</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {adminTab === 'categories' && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Manage Categories</h3>
                      <div className="mb-4 bg-white rounded shadow p-4">
                        <div className="font-semibold mb-2">Select Category</div>
                        <input type="range" min={0} max={(siteData.categories?.length || 1) - 1} value={catIdx} onChange={e => setCatIdx(Number(e.target.value))} />
                        <div className="text-sm text-gray-600 mt-2">{siteData.categories?.[catIdx]?.name || ''}</div>
                      </div>
                      <div className="space-y-6">
                        {(siteData.categories || []).map((a, i) => i === catIdx ? (
                          <div key={i} className="border border-gray-200 rounded-lg p-4 editable-item">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Name" value={a.name} onChange={e => updateCategory(i, 'name', e.target.value)} />
                              <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Count" value={a.count} onChange={e => updateCategory(i, 'count', e.target.value)} />
                              <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Image URL" value={a.image} onChange={e => updateCategory(i, 'image', e.target.value)} />
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="text-sm text-gray-600">Path: {labelToPath(a.name || '')}</div>
                              <Link to={labelToPath(a.name || '')} className="text-blue-800 hover:underline text-sm font-semibold">Open Page</Link>
                            </div>
                            <div className="mt-3 flex items-center justify-end">
                              <button className="text-red-600 hover:text-red-700 text-sm font-semibold" onClick={() => setConfirmDeleteCategory(i)}>Delete</button>
                            </div>
                          </div>
                        ) : null)}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold" onClick={addCategory}>Add Category</button>
                      </div>
                      {confirmDeleteCategory !== null && (
                        <div className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.5)' }}>
                          <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                              <h4 className="text-lg font-bold text-gray-900 mb-2">Delete Category?</h4>
                              <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete "{siteData.categories[confirmDeleteCategory]?.name || 'Unnamed Category'}"?</p>
                              <div className="flex items-center justify-end gap-3">
                                <button className="px-4 py-2 rounded-lg border" onClick={() => setConfirmDeleteCategory(null)}>Cancel</button>
                                <button className="px-4 py-2 rounded-lg bg-red-600 text-white" onClick={() => { removeCategory(confirmDeleteCategory); setConfirmDeleteCategory(null); }}>Delete</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {adminTab === 'research' && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Manage Research</h3>
                        <div className="flex items-center gap-3">
                          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold" onClick={addResearch}>Add Research</button>
                          <select className="px-3 py-2 border border-gray-300 rounded-lg" value={researchSort} onChange={e => setResearchSort(e.target.value)}>
                            <option value="newest">Newest year first</option>
                            <option value="oldest">Oldest year first</option>
                            <option value="title-az">Title A–Z</option>
                            <option value="title-za">Title Z–A</option>
                            <option value="type-az">Type A–Z</option>
                            <option value="type-za">Type Z–A</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-6">
                        {siteData.research
                          .map((a, i) => ({ a, i }))
                          .sort((x, y) => {
                            if (researchSort === 'newest') return (parseInt(y.a.year) || 0) - (parseInt(x.a.year) || 0);
                            if (researchSort === 'oldest') return (parseInt(x.a.year) || 0) - (parseInt(y.a.year) || 0);
                            if (researchSort === 'title-az') return (x.a.title || '').localeCompare(y.a.title || '');
                            if (researchSort === 'title-za') return (y.a.title || '').localeCompare(x.a.title || '');
                            if (researchSort === 'type-az') return (x.a.type || '').localeCompare(y.a.type || '');
                            if (researchSort === 'type-za') return (y.a.type || '').localeCompare(x.a.type || '');
                            return x.i - y.i;
                          })
                          .map(({ a, i }) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-4 editable-item">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Type" value={a.type} onChange={e => updateResearch(i, 'type', e.target.value)} />
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Type Color" value={a.typeColor} onChange={e => updateResearch(i, 'typeColor', e.target.value)} />
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Year" value={a.year} onChange={e => updateResearch(i, 'year', e.target.value)} />
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Title" value={a.title} onChange={e => updateResearch(i, 'title', e.target.value)} />
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Authors" value={a.authors} onChange={e => updateResearch(i, 'authors', e.target.value)} />
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Journal" value={a.journal} onChange={e => updateResearch(i, 'journal', e.target.value)} />
                              </div>
                              <textarea rows={3} className="mt-4 w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Abstract" value={a.abstract} onChange={e => updateResearch(i, 'abstract', e.target.value)} />
                              <div className="mt-3 flex items-center justify-end">
                                <button className="text-red-600 hover:text-red-700 text-sm font-semibold" onClick={() => setConfirmDeleteResearch(i)}>Delete</button>
                              </div>
                            </div>
                          ))}
                      </div>

                      {confirmDeleteResearch !== null && (
                        <div className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.5)' }}>
                          <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                              <h4 className="text-lg font-bold text-gray-900 mb-2">Delete Research?</h4>
                              <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete "{siteData.research[confirmDeleteResearch]?.title || 'Untitled'}"?</p>
                              <div className="flex items-center justify-end gap-3">
                                <button className="px-4 py-2 rounded-lg border" onClick={() => setConfirmDeleteResearch(null)}>Cancel</button>
                                <button className="px-4 py-2 rounded-lg bg-red-600 text-white" onClick={() => { removeResearch(confirmDeleteResearch); setConfirmDeleteResearch(null); }}>Delete</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    {adminTab === 'stats' && (
                      <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Manage Trust Statistics</h3>
                        <div className="space-y-6">
                          {siteData.stats.map((s, i) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Value" value={s.value} onChange={e => setSiteData(d => ({ ...d, stats: d.stats.map((st, idx) => idx === i ? { ...st, value: e.target.value } : st) }))} />
                                <input className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Label" value={s.label} onChange={e => setSiteData(d => ({ ...d, stats: d.stats.map((st, idx) => idx === i ? { ...st, label: e.target.value } : st) }))} />
                                <select className="px-4 py-3 border border-gray-300 rounded-lg" value={s.icon} onChange={e => setSiteData(d => ({ ...d, stats: d.stats.map((st, idx) => idx === i ? { ...st, icon: e.target.value } : st) }))}>
                                  <option value="shield">shield</option>
                                  <option value="book">book</option>
                                  <option value="users">users</option>
                                  <option value="lab">lab</option>
                                </select>
                              </div>
                              <div className="mt-3 flex items-center justify-end">
                                <button className="text-red-600 hover:text-red-700 text-sm font-semibold" onClick={() => setSiteData(d => ({ ...d, stats: d.stats.filter((_, idx) => idx !== i) }))}>Delete</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold" onClick={() => setSiteData(d => ({ ...d, stats: [...d.stats, { value: '', label: '', icon: 'shield' }] }))}>Add Stat</button>
                        </div>
                      </div>
                    )}

                    {adminTab === 'security' && (
                      <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input type="password" className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Old password" value={oldPass} onChange={e => setOldPass(e.target.value)} />
                            <input type="password" className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="New password" value={newPass} onChange={e => setNewPass(e.target.value)} />
                            <input type="password" className="px-4 py-3 border border-gray-300 rounded-lg" placeholder="Confirm new password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                          </div>
                          <div className="flex items-center gap-3">
                            <button className="bg-blue-800 text-white px-4 py-2 rounded-lg" onClick={() => {
                              if (oldPass !== siteData.adminPassword) { setPassMsg('Old password incorrect'); return; }
                              if (!newPass || newPass !== confirmPass) { setPassMsg('Passwords do not match'); return; }
                              setSiteData(d => ({ ...d, adminPassword: newPass }));
                              setPassMsg('Password updated');
                              setOldPass(''); setNewPass(''); setConfirmPass('');
                            }}>Change Password</button>
                            {passMsg && <span className="text-sm text-gray-600">{passMsg}</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <Header siteName={siteData.site.name} navigation={siteData.navigation} />

      <section className="relative bg-gradient-to-br from-blue-50 to-white"><div className="max-w-7xl mx-auto px-4 py-12 lg:py-20"><div className="relative hero-slider"><div className="hero-slide flex flex-col lg:flex-row items-center gap-8 lg:gap-12"><div className="lg:w-1/2 space-y-6"><span className="inline-block bg-orange-100 text-orange-600 text-sm font-semibold px-3 py-1 rounded-full">{siteData.slides[currentSlide]?.tag}</span><h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">{siteData.slides[currentSlide]?.title}</h1><p className="text-lg text-gray-600 leading-relaxed">{siteData.slides[currentSlide]?.excerpt}</p><div className="flex items-center space-x-4"><Link to="/articles" className="inline-flex items-center bg-blue-800 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-900 transition">Read Article<svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link><span className="text-sm text-gray-500">{siteData.slides[currentSlide]?.readTime} • Vet Reviewed</span></div></div><div className="lg:w-1/2"><img src={siteData.slides[currentSlide]?.image} alt={siteData.slides[currentSlide]?.title} className="rounded-2xl shadow-2xl w-full object-cover" /></div></div></div><div className="flex justify-center mt-8 space-x-2">{siteData.slides.map((_, i) => (<button key={i} className={`w-3 h-3 rounded-full ${i === currentSlide ? 'bg-blue-800' : 'bg-gray-300'}`} onClick={() => setCurrentSlide(i)} />))}</div></div></section>

      <section className="bg-blue-800 py-6"><div className="max-w-7xl mx-auto px-4"><div className="grid grid-cols-2 lg:grid-cols-4 gap-6">{siteData.stats.map((stat, i) => (<div key={i} className="flex items-center justify-center space-x-3 text-white"><div className="bg-blue-700 p-3 rounded-full">{Icons[stat.icon] || Icons.shield}</div><div><div className="font-bold text-lg">{stat.value}</div><div className="text-blue-200 text-sm">{stat.label}</div></div></div>))}</div></div></section>

      <section className="bg-gray-50 py-3 border-b"><div className="max-w-7xl mx-auto px-4"><nav className="text-sm text-gray-500"><Link to="/" className="hover:text-blue-800">Home</Link><span className="mx-2">›</span><span className="text-gray-700">Latest Articles</span></nav></div></section>

      <section className="py-16 bg-gray-50"><div className="max-w-7xl mx-auto px-4"><div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10"><div><h2 className="text-3xl font-bold text-gray-900">Recent Articles</h2><p className="text-gray-600 mt-2">Stay updated with the latest pet and poultry health insights</p></div><Link to="/articles" className="mt-4 md:mt-0 text-blue-800 font-medium hover:underline flex items-center">View All Articles<svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></Link></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{siteData.articles.slice(0, 6).map((article, i) => (<article key={i} className="article-card bg-white rounded-xl overflow-hidden shadow-sm transition duration-300"><img src={article.image} alt={article.title} className="w-full h-48 object-cover" /><div className="p-6"><span className={`inline-block bg-${article.categoryColor || 'blue'}-100 text-${article.categoryColor || 'blue'}-800 text-xs font-semibold px-3 py-1 rounded-full mb-3`}>{article.subCategory || article.category}</span><h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-800 transition">{article.title}</h3><p className="text-gray-600 text-sm mb-4">{article.excerpt}</p><div className="flex items-center justify-between"><span className="text-xs text-gray-500">{article.date} • {article.readTime}</span><Link to="/articles" className="text-blue-800 font-medium text-sm flex items-center hover:underline">Read More<svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link></div></div></article>))}</div></div></section>

      <section className="py-16 bg-white"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-900">Meet Our Experts</h2><p className="text-gray-600 mt-2">Our Medical Review Board ensures every article meets the highest standards</p></div><div className="relative"><div ref={expertCarouselRef} className="expert-carousel flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>{siteData.experts.map((expert, i) => (<div key={i} className="flex-shrink-0 w-64 bg-gray-50 rounded-xl p-6 text-center snap-start"><img src={expert.image} alt={expert.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg" /><h3 className="font-bold text-gray-900">{expert.name}</h3><p className="text-blue-800 text-sm font-medium">{expert.title}</p><p className="text-gray-500 text-sm mt-2">{expert.specialty}</p></div>))}</div><button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 hidden lg:block" onClick={() => expertCarouselRef.current?.scrollBy({ left: -280, behavior: 'smooth' })}><svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button><button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 hidden lg:block" onClick={() => expertCarouselRef.current?.scrollBy({ left: 280, behavior: 'smooth' })}><svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button></div></div></section>

      <section className="py-16 bg-gradient-to-b from-white to-gray-50"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-12"><h2 className="text-3l font-bold text-gray-900">Explore by Category</h2><p className="text-gray-600 mt-2">Quick access to our most popular topics</p></div><div className="relative"><div ref={categoryCarouselRef} className="category-carousel flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>{siteData.categories.map((cat, i) => (<Link key={i} to={getPath(cat.name)} className="category-card group relative rounded-2xl overflow-hidden aspect-square flex-shrink-0 w-56 md:w-64 snap-start transition duration-300"><img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div><div className="absolute bottom-4 left-4 right-4"><h3 className="text-white font-bold text-xl">{cat.name}</h3><p className="text-white/80 text-sm">{cat.count}</p></div></Link>))}</div><button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 hidden lg:block" onClick={() => categoryCarouselRef.current?.scrollBy({ left: -280, behavior: 'smooth' })}><svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button><button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 hidden lg:block" onClick={() => categoryCarouselRef.current?.scrollBy({ left: 280, behavior: 'smooth' })}><svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button></div></div></section>

      <section id="research" className="py-16 bg-gray-100"><div className="max-w-7xl mx-auto px-4"><div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10"><div><h2 className="text-3xl font-bold text-gray-900">Research & Journals</h2><p className="text-gray-600 mt-2">Peer-reviewed studies and academic resources</p></div><Link to="/research-journals" className="mt-4 md:mt-0 text-blue-800 font-medium hover:underline flex items-center">Browse Full Archive<svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></Link></div><div className="grid lg:grid-cols-2 gap-6">{siteData.research.slice(0, 2).map((paper, i) => (<div key={i} className={`bg-white rounded-xl p-6 shadow-sm border-l-4 border-${paper.typeColor}-600`}><div className="flex items-start justify-between mb-4"><span className={`bg-${paper.typeColor}-100 text-${paper.typeColor}-800 text-xs font-semibold px-3 py-1 rounded-full`}>{paper.type}</span><span className="text-gray-400 text-sm">{paper.year}</span></div><h3 className="font-bold text-lg text-gray-900 mb-2">{paper.title}</h3><p className="text-gray-600 text-sm mb-4">{paper.authors} — {paper.journal}</p><p className="text-gray-500 text-sm mb-4"><strong>Abstract:</strong> {paper.abstract}</p><div className="flex items-center space-x-4"><button className="inline-flex items-center text-blue-800 font-medium text-sm"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Download PDF</button></div></div>))}</div></div></section>

      <section className={`py-16 ${darkMode ? 'bg-gray-900' : ''}`} style={{ backgroundColor: darkMode ? undefined : '#3F9AAE' }}><div className="max-w-4xl mx-auto px-4 text-center"><h2 className="text-3xl font-bold text-white mb-4">{siteData.newsletter.title}</h2><p className={`${darkMode ? 'text-gray-400' : 'text-blue-100'} mb-8`}>{siteData.newsletter.subtitle}</p><form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={e => e.preventDefault()}><input type="email" placeholder="Enter your email address" className="flex-1 px-6 py-4 rounded-full outline-none text-gray-800 focus:ring-4 focus:ring-blue-300" /><button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full transition">{siteData.newsletter.buttonText}</button></form><p className={`${darkMode ? 'text-gray-500' : 'text-blue-100'} text-sm mt-4`}>{siteData.newsletter.footerText}</p></div></section>

      <FooterSection siteName={siteData.site.name} footer={siteData.footer} />
    </div>
  );
}

export default App;
