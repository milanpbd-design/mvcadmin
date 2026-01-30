import { useEffect, useMemo, useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { useAuth } from '../context/AuthContext';
import { articlesService, slidesService } from '../services/supabaseService';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Card, { CardHeader, CardBody } from './components/Card';
import Button from './components/Button';
import { ConfirmModal } from './components/Modal';
import { useToast } from './components/Toast';

export default function ContentEditor() {
  const { siteData, reloadData } = useSiteData() || {};
  const { user } = useAuth();
  const toast = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);

  const categories = useMemo(() => Array.isArray(siteData?.categories) ? siteData.categories : [], [siteData]);
  const current = articles[currentIndex] || {};

  // Load all articles (including drafts) for admin
  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      setLoading(true);
      const data = await articlesService.fetchAll();
      setArticles(data || []);
    } catch (error) {
      console.error('Failed to load articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }

  // Filter articles
  const filteredArticles = useMemo(() => {
    let filtered = [...articles];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        (a.title || '').toLowerCase().includes(q) ||
        (a.excerpt || '').toLowerCase().includes(q) ||
        (a.category || '').toLowerCase().includes(q)
      );
    }

    if (filterStatus === 'published') {
      filtered = filtered.filter(a => a.published);
    } else if (filterStatus === 'draft') {
      filtered = filtered.filter(a => !a.published);
    }

    return filtered;
  }, [articles, searchQuery, filterStatus]);

  function updateLocal(field, value) {
    setArticles(prev => prev.map((a, i) => {
      if (i !== currentIndex) return a;
      const next = { ...a, [field]: value };

      // Auto-calculate read time
      if (field === 'content') {
        const words = (value || '').replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
        next.read_time = `${Math.max(1, Math.ceil(words / 200))} min read`;
      }

      return next;
    }));
  }

  async function addArticle() {
    try {
      setLoading(true);
      const newArticle = {
        title: `New Article ${Date.now()}`,
        slug: `article-${Date.now()}`,
        category: '',
        content: '',
        excerpt: '',
        image: '',
        read_time: '1 min read',
        date: new Date().toISOString().split('T')[0],
        author_id: user?.id,
        featured: false,
        published: false
      };

      const created = await articlesService.create(newArticle);
      setArticles(prev => [created, ...prev]);
      setCurrentIndex(0);
      toast.success('Article created successfully!');
    } catch (error) {
      console.error('Failed to create article:', error);
      toast.error('Failed to create article');
    } finally {
      setLoading(false);
    }
  }

  async function saveArticle() {
    try {
      setLoading(true);
      const updated = await articlesService.update(current.id, {
        ...current,
        date: new Date().toISOString().split('T')[0]
      });

      setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
      await reloadData(); // Refresh site data
      toast.success('Article saved!');
    } catch (error) {
      console.error('Failed to save article:', error);
      toast.error('Failed to save article');
    } finally {
      setLoading(false);
    }
  }

  async function publishArticle() {
    try {
      setLoading(true);
      const updated = await articlesService.update(current.id, {
        ...current,
        published: true,
        date: new Date().toISOString().split('T')[0]
      });

      setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
      await reloadData();
      toast.success('Article published!');
    } catch (error) {
      console.error('Failed to publish article:', error);
      toast.error('Failed to publish article');
    } finally {
      setLoading(false);
    }
  }

  async function deleteArticle() {
    try {
      setLoading(true);
      await articlesService.delete(current.id);
      setArticles(prev => prev.filter(a => a.id !== current.id));
      setCurrentIndex(0);
      setDeleteModal(false);
      await reloadData();
      toast.success('Article deleted');
    } catch (error) {
      console.error('Failed to delete article:', error);
      toast.error('Failed to delete article');
    } finally {
      setLoading(false);
    }
  }

  async function promoteToHero() {
    try {
      setLoading(true);
      const newSlide = {
        tag: current.category || 'Featured',
        title: current.title,
        excerpt: current.excerpt,
        image: current.image,
        read_time: current.read_time,
        order: 0,
        active: true
      };

      await slidesService.create(newSlide);
      await reloadData();
      toast.success('Promoted to hero slides!');
    } catch (error) {
      console.error('Failed to promote to hero:', error);
      toast.error('Failed to promote to hero');
    } finally {
      setLoading(false);
    }
  }

  const colorOptions = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'indigo', 'gray'];

  if (loading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Article List */}
      <div className="col-span-12 lg:col-span-4">
        <Card>
          <CardHeader
            title="Articles"
            subtitle={`${filteredArticles.length} total`}
            action={
              <Button size="sm" onClick={addArticle} disabled={loading} icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }>
                New
              </Button>
            }
          />
          <CardBody className="space-y-4">
            {/* Search & Filters */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('published')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${filterStatus === 'published'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  Published
                </button>
                <button
                  onClick={() => setFilterStatus('draft')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${filterStatus === 'draft'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  Drafts
                </button>
              </div>
            </div>

            {/* Article List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredArticles.length === 0 ? (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400">No articles found</p>
              ) : (
                filteredArticles.map((article, i) => {
                  const actualIndex = articles.indexOf(article);
                  return (
                    <button
                      key={article.id || i}
                      onClick={() => setCurrentIndex(actualIndex)}
                      className={`w-full text-left p-3 rounded-lg transition ${actualIndex === currentIndex
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {article.title || 'Untitled'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {article.category || 'No category'}
                        </span>
                        <span className="text-xs">•</span>
                        {article.published ? (
                          <span className="text-xs text-green-600 dark:text-green-400">Published</span>
                        ) : (
                          <span className="text-xs text-yellow-600 dark:text-yellow-400">Draft</span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Editor */}
      <div className="col-span-12 lg:col-span-8 space-y-4">
        {articles.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No articles yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first article to get started</p>
              <Button onClick={addArticle}>Create Article</Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Article Header */}
            <Card>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Article Title"
                    value={current.title || ''}
                    onChange={e => updateLocal('title', e.target.value)}
                    className="text-2xl font-bold w-full bg-transparent border-none outline-none text-gray-900 dark:text-white"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    {current.published ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full font-medium">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs rounded-full font-medium">
                        Draft
                      </span>
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">{current.date || 'No date'}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteModal(true)}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  }
                />
              </div>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader title="Article Details" />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={current.category || ''}
                      onChange={e => updateLocal('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
                    <input
                      type="text"
                      value={current.slug || ''}
                      onChange={e => updateLocal('slug', e.target.value)}
                      placeholder="article-slug"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Featured Image URL</label>
                    <input
                      type="text"
                      value={current.image || ''}
                      onChange={e => updateLocal('image', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    {current.image && (
                      <img src={current.image} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg" />
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt</label>
                    <textarea
                      value={current.excerpt || ''}
                      onChange={e => updateLocal('excerpt', e.target.value)}
                      rows={3}
                      placeholder="Brief article summary..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader title="Content" />
              <CardBody>
                <div className="h-96">
                  <ReactQuill
                    theme="snow"
                    value={current.content || ''}
                    onChange={val => updateLocal('content', val)}
                    className="h-full bg-white dark:bg-gray-700"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        ['link', 'image', 'video'],
                        ['clean']
                      ]
                    }}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Actions */}
            <Card>
              <CardBody>
                <div className="flex justify-between items-center">
                  <Button variant="ghost" size="sm" onClick={promoteToHero} disabled={loading}>
                    ⭐ Promote to Hero
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={saveArticle} disabled={loading}>
                      {loading ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button onClick={publishArticle} disabled={loading}>
                      {loading ? 'Publishing...' : 'Publish'}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={deleteArticle}
        title="Delete Article"
        message={`Are you sure you want to delete "${current.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
