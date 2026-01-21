import { useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export default function ImportExport() {
  const { siteData, setSiteData } = useSiteData() || {};
  const ref = useRef(null);
  function exportJson() {
    const blob = new Blob([JSON.stringify(siteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'site-data.json'; a.click(); URL.revokeObjectURL(url);
  }
  function importJson(file) {
    const r = new FileReader();
    r.onload = () => { try { const obj = JSON.parse(r.result); setSiteData(obj); } catch(e){} };
    r.readAsText(file);
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Import / Export</h1>
      <div className="bg-white rounded shadow p-4 flex items-center gap-3">
        <button className="bg-blue-700 text-white rounded px-3 py-2" onClick={exportJson}>Export JSON</button>
        <input ref={ref} type="file" accept="application/json" onChange={e=>{ const f=e.target.files?.[0]; if(f) importJson(f); }} />
      </div>
    </div>
  );
}

