import { useSiteData } from '../context/SiteDataContext';

export default function SecurityPerformance() {
  const { siteData, setSiteData } = useSiteData() || {};
  const security = siteData?.security || { twoFARequired:false };
  const performance = siteData?.performance || { lazyImages:true, prefetchRoutes:false };
  function log(message) { setSiteData(d=>({ ...d, logs: [...(d.logs||[]), { message, at: new Date().toISOString() }] })); }
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Security & Performance</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4 space-y-3">
          <div className="font-semibold">Security</div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!security.twoFARequired} onChange={e=>setSiteData(d=>({ ...d, security: { ...(d.security||{}), twoFARequired: e.target.checked } }))} /> Require 2FA</label>
          <button className="border rounded px-3 py-2" onClick={()=>log('Security setting updated')}>Log Event</button>
        </div>
        <div className="bg-white rounded shadow p-4 space-y-3">
          <div className="font-semibold">Performance</div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!performance.lazyImages} onChange={e=>setSiteData(d=>({ ...d, performance: { ...(d.performance||{}), lazyImages: e.target.checked } }))} /> Lazy-load images</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!performance.prefetchRoutes} onChange={e=>setSiteData(d=>({ ...d, performance: { ...(d.performance||{}), prefetchRoutes: e.target.checked } }))} /> Prefetch routes</label>
        </div>
      </div>
      <div className="bg-white rounded shadow p-4 mt-4">
        <div className="font-semibold mb-2">Logs</div>
        <ul className="space-y-2">
          {(siteData?.logs||[]).slice().reverse().map((l,i)=>(
            <li key={i} className="text-sm text-gray-700">{l.message} • {l.at}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

