import { useSiteData } from '../context/SiteDataContext';

export default function Versioning() {
  const { siteData, setSiteData } = useSiteData() || {};
  const versions = siteData?.versions || [];
  function restore(idx) {
    const snap = versions[idx];
    if (snap?.type === 'article') {
      setSiteData(d=>({ ...d, articles: d.articles.map((a,i)=> i===0? snap.data: a) }));
    }
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Versioning</h1>
      <div className="bg-white rounded shadow p-4">
        <ul className="space-y-2">
          {versions.slice().reverse().map((v,i)=>(
            <li key={i} className="flex items-center justify-between">
              <div>{v.type} • {v.at}</div>
              <button className="text-blue-700" onClick={()=>restore(versions.length-1-i)}>Restore</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

