import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';

export default function DashboardAnalytics() {
  const { siteData } = useSiteData() || {};

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
          const to = m.label === 'Articles' ? '/admin/editor' :
            m.label === 'Comments' ? '/admin/comments' :
              m.label === 'Media' ? '/admin/media' :
                m.label === 'Users' ? '/admin/users' : '/admin';
          return (
            <Link key={m.label} to={to} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 block hover:ring-2 ring-blue-200">
              <div className="text-sm text-gray-500 dark:text-gray-400">{m.label}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{m.value}</div>
            </Link>
          )
        })}
      </div>
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="font-semibold mb-2 text-gray-900 dark:text-white">Publishing Queue</div>
          <ul className="space-y-2">
            {(siteData?.articles || []).filter(a => a.publishAt && !a.published).slice(0, 10).map((a, i) => (
              <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                <Link to={`/admin/editor?q=${encodeURIComponent(a.title || '')}&published=false`} className="hover:text-blue-700 dark:hover:text-blue-400">{a.title}</Link> • {a.publishAt}
              </li>
            ))}
            {(siteData?.articles || []).filter(a => a.publishAt && !a.published).length === 0 && (
              <li className="text-sm text-gray-500 dark:text-gray-400">No articles in publishing queue</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
