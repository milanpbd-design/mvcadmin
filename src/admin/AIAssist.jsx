import { useMemo, useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

function suggestTitles(base) {
  if (!base) return [];
  const b = base.trim();
  return [
    `The Complete Guide to ${b}`,
    `${b}: Best Practices and Pitfalls`,
    `How to Master ${b} in 7 Steps`,
    `${b} — Expert Cheatsheet`,
  ];
}
function suggestDescription(text) {
  if (!text) return '';
  const s = text.replace(/\s+/g,' ').trim();
  return s.length>160? s.slice(0,157)+'…' : s;
}

export default function AIAssist() {
  const { setSiteData } = useSiteData() || {};
  const [draftTitle, setDraftTitle] = useState('');
  const [draftExcerpt, setDraftExcerpt] = useState('');
  const titles = useMemo(()=>suggestTitles(draftTitle), [draftTitle]);
  const seoDesc = useMemo(()=>suggestDescription(draftExcerpt), [draftExcerpt]);
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">AI Assist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4 space-y-3">
          <div className="font-semibold">Title Suggestions</div>
          <input className="border rounded px-3 py-2 w-full" placeholder="Draft title" value={draftTitle} onChange={e=>setDraftTitle(e.target.value)} />
          <ul className="space-y-2">
            {titles.map(t=> (
              <li key={t} className="flex items-center justify-between">
                <div>{t}</div>
                <button className="text-blue-700" onClick={()=>{
                  setSiteData(d=>({ ...d, articles: d.articles.map((a,i)=> i===0? { ...a, title: t }: a) }));
                }}>Apply to first article</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded shadow p-4 space-y-3">
          <div className="font-semibold">SEO Meta Description</div>
          <textarea rows={4} className="border rounded px-3 py-2 w-full" placeholder="Article excerpt" value={draftExcerpt} onChange={e=>setDraftExcerpt(e.target.value)} />
          <div className="text-sm text-gray-700">Suggestion: {seoDesc}</div>
        </div>
      </div>
    </div>
  );
}
