import { useSiteData } from '../context/SiteDataContext';

export default function CommentsModeration() {
  const { siteData, setSiteData } = useSiteData() || {};
  const comments = siteData?.comments || [];
  function setStatus(i, status) {
    setSiteData(d => ({ ...d, comments: d.comments.map((c, idx) => idx===i? { ...c, status }: c) }));
  }
  function remove(i) {
    setSiteData(d => ({ ...d, comments: d.comments.filter((_,idx)=>idx!==i) }));
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Comments</h1>
      <div className="space-y-3">
        {comments.map((c,i)=>(
          <div key={i} className="bg-white rounded shadow p-4">
            <div className="text-sm text-gray-700">{c.author} • {c.at}</div>
            <div className="mt-1">{c.text}</div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-xs px-2 py-1 rounded bg-gray-100">{c.status||'pending'}</span>
              <button className="px-2 py-1 rounded bg-green-600 text-white" onClick={()=>setStatus(i,'approved')}>Approve</button>
              <button className="px-2 py-1 rounded bg-yellow-600 text-white" onClick={()=>setStatus(i,'flagged')}>Flag</button>
              <button className="px-2 py-1 rounded bg-red-600 text-white" onClick={()=>remove(i)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

