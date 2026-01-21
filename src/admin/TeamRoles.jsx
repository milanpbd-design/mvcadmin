import { useSiteData } from '../context/SiteDataContext';

export default function TeamRoles() {
  const { siteData, setSiteData } = useSiteData() || {};
  const users = siteData?.users || [];
  function addUser() {
    setSiteData(d=>({ ...d, users: [...(d.users||[]), { name:'', email:'', role:'author', twoFA:false } ] }));
  }
  function updateUser(i, field, value) {
    setSiteData(d=>({ ...d, users: d.users.map((u,idx)=>idx===i?{ ...u, [field]: value }:u) }));
  }
  function removeUser(i) {
    setSiteData(d=>({ ...d, users: d.users.filter((_,idx)=>idx!==i) }));
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Team & Roles</h1>
      <div className="space-y-3">
        {users.map((u,i)=>(
          <div key={i} className="bg-white rounded shadow p-4 grid grid-cols-1 md:grid-cols-5 gap-2">
            <input className="border rounded px-3 py-2" placeholder="Name" value={u.name||''} onChange={e=>updateUser(i,'name',e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Email" value={u.email||''} onChange={e=>updateUser(i,'email',e.target.value)} />
            <select className="border rounded px-3 py-2" value={u.role||'author'} onChange={e=>updateUser(i,'role',e.target.value)}>
              <option value="admin">admin</option>
              <option value="editor">editor</option>
              <option value="author">author</option>
              <option value="contributor">contributor</option>
            </select>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!u.twoFA} onChange={e=>updateUser(i,'twoFA',e.target.checked)} /> 2FA</label>
            <button className="text-red-600" onClick={()=>removeUser(i)}>Delete</button>
          </div>
        ))}
        <button className="bg-green-700 text-white rounded px-3 py-2" onClick={addUser}>Add Member</button>
      </div>
    </div>
  );
}

