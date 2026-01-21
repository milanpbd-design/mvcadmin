import { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

const sections = ['hero', 'stats', 'articles', 'experts', 'categories', 'research', 'newsletter', 'footer'];

export default function HomepageBuilder() {
  const { siteData, setSiteData } = useSiteData() || {};
  const [order, setOrder] = useState(siteData?.homeLayout || sections);
  function onDragStart(e, id) { e.dataTransfer.setData('id', id); }
  function onDrop(e, id) {
    const from = e.dataTransfer.getData('id');
    const next = [...order];
    const i = next.indexOf(from);
    const j = next.indexOf(id);
    if (i>-1 && j>-1) { const t = next[i]; next[i]=next[j]; next[j]=t; setOrder(next); setSiteData(d=>({ ...d, homeLayout: next })); }
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Homepage Builder</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {order.map(s => (
          <div key={s} draggable onDragStart={e=>onDragStart(e,s)} onDragOver={e=>e.preventDefault()} onDrop={e=>onDrop(e,s)} className="bg-white rounded shadow p-4 cursor-move">
            <div className="font-semibold">{s}</div>
            <div className="text-sm text-gray-600">Drag to reorder</div>
          </div>
        ))}
      </div>
    </div>
  );
}

