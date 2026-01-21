import { useEffect } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export default function ThemeIntegrations() {
  const { siteData, setSiteData } = useSiteData() || {};
  const theme = siteData?.theme || { primary:'#1e40af', secondary:'#374151', radius:12 };
  const integrations = siteData?.integrations || { gaId:'', fbPixel:'' };
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--primary', theme.primary);
    r.style.setProperty('--secondary', theme.secondary);
    r.style.setProperty('--radius', `${theme.radius}px`);
  }, [theme.primary, theme.secondary, theme.radius]);
  function updateTheme(field, value) { setSiteData(d=>({ ...d, theme: { ...(d.theme||{}), [field]: value } })); }
  function updateInt(field, value) { setSiteData(d=>({ ...d, integrations: { ...(d.integrations||{}), [field]: value } })); }
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Theme & Integrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4 space-y-3">
          <div className="font-semibold">Theme</div>
          <input type="color" className="border rounded px-3 py-2" value={theme.primary} onChange={e=>updateTheme('primary', e.target.value)} />
          <input type="color" className="border rounded px-3 py-2" value={theme.secondary} onChange={e=>updateTheme('secondary', e.target.value)} />
          <input type="number" className="border rounded px-3 py-2" value={theme.radius} onChange={e=>updateTheme('radius', Number(e.target.value))} />
        </div>
        <div className="bg-white rounded shadow p-4 space-y-3">
          <div className="font-semibold">Integrations</div>
          <input className="border rounded px-3 py-2 w-full" placeholder="Google Analytics ID" value={integrations.gaId||''} onChange={e=>updateInt('gaId', e.target.value)} />
          <input className="border rounded px-3 py-2 w-full" placeholder="Facebook Pixel ID" value={integrations.fbPixel||''} onChange={e=>updateInt('fbPixel', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

