import defaultData from '../data';

// API base URL - point directly to backend since proxy isn't working
const API_BASE = process.env.REACT_APP_API_URL || '/api';

// Helper to get auth headers
function authHeaders(token) {
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Helper for API requests
async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `Request failed: ${res.status} ${res.statusText}` }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res;
}

// SITE DATA
export async function apiGetSite() {
  try {
    const res = await apiFetch('/site');
    const data = await res.json();
    // Merge with defaults to ensure all keys exist
    return {
      site: data.site || defaultData.site,
      articles: data.articles || defaultData.articles,
      categories: data.categories || defaultData.categories,
      experts: data.experts || defaultData.experts,
      research: data.research || defaultData.research,
      slides: data.slides || defaultData.slides,
      stats: data.stats || defaultData.stats,
      footer: data.footer || defaultData.footer,
      navigation: data.navigation || defaultData.navigation,
      newsletter: data.newsletter || defaultData.newsletter,
      adminPassword: data.adminPassword || defaultData.adminPassword,
      ...data
    };
  } catch (e) {
    console.warn('[API] Error fetching site:', e);
    return defaultData;
  }
}

export async function apiSaveSite(data, token) {
  try {
    await apiFetch('/site', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data)
    });
    return true;
  } catch (e) {
    console.error('[API] Error saving site:', e);
    return false;
  }
}

// AUTH
export async function apiLogin(password) {
  try {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    return data.token || null;
  } catch (e) {
    console.error('[API] Login error:', e);
    return null;
  }
}

export async function apiLoginUser(username, password) {
  try {
    const res = await apiFetch('/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    return {
      token: data.token,
      user: { username, role: data.role }
    };
  } catch (e) {
    console.error('[API] Login error:', e);
    return null;
  }
}

// ARTICLES CRUD
export async function apiGetArticles() {
  try {
    const res = await apiFetch('/articles?limit=1000');
    return await res.json();
  } catch (e) {
    console.warn('[API] Error fetching articles:', e);
    return [];
  }
}

export async function apiCreateArticle(data, token) {
  try {
    const res = await apiFetch('/articles', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    console.error('[API] Create article error:', e);
    return { error: e.message };
  }
}

export async function apiUpdateArticle(id, articleData, token) {
  try {
    const res = await apiFetch(`/articles/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(articleData)
    });
    return await res.json();
  } catch (e) {
    console.error('[API] Update article error:', e);
    return { error: e.message };
  }
}

export async function apiDeleteArticle(id, token) {
  try {
    await apiFetch(`/articles/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    });
    return { success: true };
  } catch (e) {
    console.error('[API] Delete article error:', e);
    return { error: e.message };
  }
}

// CATEGORIES CRUD
export async function apiGetCategories() {
  try {
    const res = await apiFetch('/categories?limit=1000');
    return await res.json();
  } catch (e) {
    console.warn('[API] Error fetching categories:', e);
    return [];
  }
}

export async function apiCreateCategory(data, token) {
  try {
    const res = await apiFetch('/categories', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    console.error('[API] Create category error:', e);
    return { error: e.message };
  }
}

export async function apiUpdateCategory(id, catData, token) {
  try {
    const res = await apiFetch(`/categories/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(catData)
    });
    return await res.json();
  } catch (e) {
    console.error('[API] Update category error:', e);
    return { error: e.message };
  }
}

export async function apiDeleteCategory(id, token) {
  try {
    await apiFetch(`/categories/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    });
    return true;
  } catch (e) {
    console.error('[API] Delete category error:', e);
    return false;
  }
}

// SLIDES CRUD
export async function apiGetSlides() {
  try {
    const res = await apiFetch('/slides?limit=100');
    return await res.json();
  } catch (e) {
    console.warn('[API] Error fetching slides:', e);
    return [];
  }
}

export async function apiCreateSlide(data, token) {
  try {
    const res = await apiFetch('/slides', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    console.error('[API] Create slide error:', e);
    return { error: e.message };
  }
}

export async function apiUpdateSlide(id, slideData, token) {
  try {
    const res = await apiFetch(`/slides/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(slideData)
    });
    return await res.json();
  } catch (e) {
    console.error('[API] Update slide error:', e);
    return { error: e.message };
  }
}

export async function apiDeleteSlide(id, token) {
  try {
    await apiFetch(`/slides/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    });
    return true;
  } catch (e) {
    console.error('[API] Delete slide error:', e);
    return false;
  }
}

// EXPERTS CRUD
export async function apiGetExperts() {
  try {
    const res = await apiFetch('/experts?limit=100');
    return await res.json();
  } catch (e) {
    console.warn('[API] Error fetching experts:', e);
    return [];
  }
}

export async function apiCreateExpert(data, token) {
  try {
    const res = await apiFetch('/experts', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    console.error('[API] Create expert error:', e);
    return { error: e.message };
  }
}

export async function apiUpdateExpert(id, expData, token) {
  try {
    const res = await apiFetch(`/experts/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(expData)
    });
    return await res.json();
  } catch (e) {
    console.error('[API] Update expert error:', e);
    return { error: e.message };
  }
}

export async function apiDeleteExpert(id, token) {
  try {
    await apiFetch(`/experts/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    });
    return true;
  } catch (e) {
    console.error('[API] Delete expert error:', e);
    return false;
  }
}

// RESEARCH CRUD
export async function apiGetResearch() {
  try {
    const res = await apiFetch('/research?limit=100');
    return await res.json();
  } catch (e) {
    console.warn('[API] Error fetching research:', e);
    return [];
  }
}

export async function apiCreateResearch(data, token) {
  try {
    const res = await apiFetch('/research', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    console.error('[API] Create research error:', e);
    return { error: e.message };
  }
}

export async function apiUpdateResearch(id, resData, token) {
  try {
    const res = await apiFetch(`/research/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(resData)
    });
    return await res.json();
  } catch (e) {
    console.error('[API] Update research error:', e);
    return { error: e.message };
  }
}

export async function apiDeleteResearch(id, token) {
  try {
    await apiFetch(`/research/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    });
    return true;
  } catch (e) {
    console.error('[API] Delete research error:', e);
    return false;
  }
}

// USERS CRUD
export async function apiGetUsers(token) {
  try {
    const res = await apiFetch('/users', {
      headers: authHeaders(token)
    });
    return await res.json();
  } catch (e) {
    console.warn('[API] Error fetching users:', e);
    return [];
  }
}

export async function apiCreateUser(data, token) {
  try {
    const res = await apiFetch('/users', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    console.error('[API] Create user error:', e);
    return null;
  }
}

export async function apiUpdateUser(id, userData, token) {
  try {
    const res = await apiFetch(`/users/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(userData)
    });
    return await res.json();
  } catch (e) {
    console.error('[API] Update user error:', e);
    return null;
  }
}

export async function apiDeleteUser(id, token) {
  try {
    await apiFetch(`/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    });
    return true;
  } catch (e) {
    console.error('[API] Delete user error:', e);
    return false;
  }
}

export async function apiUpdateUserPassword(id, password, token) {
  try {
    await apiFetch(`/users/${id}/password`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ password })
    });
    return true;
  } catch (e) {
    console.error('[API] Update password error:', e);
    return false;
  }
}

// LOGS
export async function apiGetLogs(token) {
  try {
    const res = await apiFetch('/logs', {
      headers: authHeaders(token)
    });
    return await res.json();
  } catch (e) {
    console.warn('[API] Error fetching logs:', e);
    return [];
  }
}

export async function apiSearchLogs(params, token) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await apiFetch(`/logs?${query}`, {
      headers: authHeaders(token)
    });
    return await res.json();
  } catch (e) {
    console.warn('[API] Error searching logs:', e);
    return [];
  }
}

// SEARCH HELPERS (Client-side filtering)
export async function apiSearchArticles(params) {
  let articles = await apiGetArticles();
  if (!articles) articles = [];

  let filtered = articles;
  let page = 1;
  let limit = 20;
  let sort = 'updatedAt';
  let order = 'desc';

  if (typeof params === 'object' && params !== null) {
    const q = (params.q || '').toLowerCase();
    if (q) {
      filtered = filtered.filter(a =>
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
        (a.category && a.category.toLowerCase().includes(q)) ||
        (a.subCategory && a.subCategory.toLowerCase().includes(q))
      );
    }
    if (params.published !== undefined) {
      filtered = filtered.filter(a => !!a.published === params.published);
    }
    if (params.page) page = parseInt(params.page);
    if (params.limit) limit = parseInt(params.limit);
    if (params.sort) sort = params.sort;
    if (params.order) order = params.order;
  } else if (typeof params === 'string' && params) {
    const q = params.toLowerCase();
    filtered = filtered.filter(a =>
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(q))
    );
  }

  // Sort
  filtered.sort((a, b) => {
    let va = a[sort];
    let vb = b[sort];
    if (sort === 'date' || sort === 'createdAt' || sort === 'updatedAt') {
      va = new Date(va || 0).getTime();
      vb = new Date(vb || 0).getTime();
    } else {
      va = (va || '').toString().toLowerCase();
      vb = (vb || '').toString().toLowerCase();
    }
    if (va < vb) return order === 'asc' ? -1 : 1;
    if (va > vb) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return { items: paged, total };
}

export async function apiSearchCategories(query) {
  const categories = await apiGetCategories();
  if (!categories) return { items: [], total: 0 };

  let q = '';
  if (typeof query === 'string') q = query.toLowerCase();
  else if (typeof query === 'object' && query.q) q = query.q.toLowerCase();

  const filtered = categories.filter(c =>
    (c.name && c.name.toLowerCase().includes(q))
  );

  return { items: filtered, total: filtered.length };
}
