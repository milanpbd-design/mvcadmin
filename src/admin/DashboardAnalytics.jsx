import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import { apiGetLogs, apiSearchLogs } from '../utils/api';

export default function DashboardAnalytics() {
  const { siteData, setSiteData } = useSiteData() || {};
  const [entity, setEntity] = useState('')
  const [action, setAction] = useState('')
  const [order, setOrder] = useState('desc')
  useEffect(()=>{ const t=localStorage.getItem('adminToken')||''; apiGetLogs(t).then(list=>{ if(Array.isArray(list)) setSiteData(d=>({ ...d, logs: list })) }) }, [setSiteData])
  function searchLogs() {
    const t=localStorage.getItem('adminToken')||''
    apiSearchLogs({ entity, action, order }, t).then(list=>{ if(Array.isArray(list)) setSiteData(d=>({ ...d, logs: list })) })
  }
  const metrics = useMemo(() => {
    const articles = siteData?.articles?.length || 0;
    const comments = siteData?.comments?.length || 0;
    const media = siteData?.media?.length || 0;
    const users = siteData?.users?.length || 0;
    return [
      { label: 'Articles', value: articles },
      { label: 'Comments', value: comments },
      { label: 'Media', value: media },
      { label: 'Users', value: users },
    ];
  }, [siteData]);
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map(m => {
          const to = m.label==='Articles'? '/admin/editor':
                     m.label==='Comments'? '/admin/comments':
                     m.label==='Media'? '/admin/media':
                     m.label==='Users'? '/admin/users': '/admin';
          return (
            <Link key={m.label} to={to} className="bg-white rounded-lg shadow p-4 block hover:ring-2 ring-blue-200">
              <div className="text-sm text-gray-500">{m.label}</div>
              <div className="text-2xl font-bold">{m.value}</div>
            </Link>
          )
        })}
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="font-semibold mb-2">Recent Activity</div>
          <div className="flex items-center gap-2 mb-2">
            <select className="border rounded px-2 py-1" value={entity} onChange={e=>setEntity(e.target.value)}>
              <option value="">All Entities</option>
              <option value="article">Article</option>
              <option value="category">Category</option>
            </select>
            <select className="border rounded px-2 py-1" value={action} onChange={e=>setAction(e.target.value)}>
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
            </select>
            <select className="border rounded px-2 py-1" value={order} onChange={e=>setOrder(e.target.value)}>
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
            <button className="bg-blue-700 text-white rounded px-3 py-2" onClick={searchLogs}>Search</button>
          </div>
          <ul className="space-y-2">
            {(siteData?.logs||[]).slice(-10).reverse().map((l, i) => (
              <li key={i} className="text-sm text-gray-700">
                <Link to="/admin/editor" className="hover:text-blue-700">{l?.message}</Link> • {l?.at}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="font-semibold mb-2">Publishing Queue</div>
          <ul className="space-y-2">
            {(siteData?.articles||[]).filter(a=>a.publishAt && !a.published).slice(0,10).map((a,i)=> (
              <li key={i} className="text-sm text-gray-700">
                <Link to={`/admin/editor?q=${encodeURIComponent(a.title||'')}&published=false`} className="hover:text-blue-700">{a.title}</Link> • {a.publishAt}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
