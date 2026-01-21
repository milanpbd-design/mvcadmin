import { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export default function Multilingual() {
  const { siteData, setSiteData } = useSiteData() || {};
  const locales = siteData?.locales || ['en'];
  const defaultLocale = siteData?.defaultLocale || 'en';
  const [currentLocale, setCurrentLocale] = useState(defaultLocale);
  const translations = siteData?.translations || {};
  function addLocale(l) {
    setSiteData(d=>({ ...d, locales: Array.from(new Set([...(d.locales||['en']), l])) }));
  }
  function setDefault(l) { setSiteData(d=>({ ...d, defaultLocale: l })); }
  function setTrans(slug, text) { setSiteData(d=>({ ...d, translations: { ...(d.translations||{}), [currentLocale]: { ...(d.translations?.[currentLocale]||{}), [slug]: text } } })); }
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Multilingual</h1>
      <div className="bg-white rounded shadow p-4 space-y-3">
        <div className="flex items-center gap-2">
          <select className="border rounded px-3 py-2" value={currentLocale} onChange={e=>setCurrentLocale(e.target.value)}>
            {locales.map(l=> <option key={l} value={l}>{l}</option>)}
          </select>
          <button className="border rounded px-3 py-2" onClick={()=>setDefault(currentLocale)}>Set Default</button>
          <input className="border rounded px-3 py-2" placeholder="Add locale (e.g., fr)" onKeyDown={e=>{ if(e.key==='Enter'){ const v=e.currentTarget.value.trim(); if(v) addLocale(v); e.currentTarget.value=''; } }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Page slug" id="trans-slug" />
          <input className="border rounded px-3 py-2" placeholder="Translation text" id="trans-text" />
        </div>
        <button className="bg-blue-700 text-white rounded px-3 py-2" onClick={()=>{ const s=document.getElementById('trans-slug'); const t=document.getElementById('trans-text'); if(s&&t){ setTrans(s.value, t.value); s.value=''; t.value=''; } }}>Save Translation</button>
      </div>
      <div className="bg-white rounded shadow p-4 mt-4">
        <div className="font-semibold mb-2">Translations</div>
        <pre className="text-xs overflow-auto">{JSON.stringify(translations[currentLocale]||{}, null, 2)}</pre>
      </div>
    </div>
  );
}

