import { useEffect, useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { useAuth } from '../context/AuthContext';
import { categoriesService } from '../services/supabaseService';
import Card, { CardHeader, CardBody } from './components/Card';
import Button from './components/Button';
import Modal, { ConfirmModal } from './components/Modal';
import { useToast } from './components/Toast';

export default function CategoriesManager() {
  const { reloadData } = useSiteData() || {};
  const { user } = useAuth();
  const toast = useToast();
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await categoriesService.fetchAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  function openEdit(category = null) {
    setCurrentCategory(category || {
      name: '',
      image: '',
      count: '',
      hero_image: '',
      description: ''
    });
    setEditModal(true);
  }

  function openDelete(category) {
    setCurrentCategory(category);
    setDeleteModal(true);
  }

  async function saveCategory() {
    try {
      setLoading(true);

      if (currentCategory.id) {
        // Update existing
        const updated = await categoriesService.update(currentCategory.id, currentCategory);
        setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
        toast.success('Category updated!');
      } else {
        // Create new
        const created = await categoriesService.create(currentCategory);
        setCategories(prev => [created, ...prev]);
        toast.success('Category created!');
      }

      await reloadData();
      setEditModal(false);
    } catch (error) {
      console.error('Failed to save category:', error);
      toast.error('Failed to save category');
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory() {
    try {
      setLoading(true);
      await categoriesService.delete(currentCategory.id);
      setCategories(prev => prev.filter(c => c.id !== currentCategory.id));
      await reloadData();
      toast.success('Category deleted');
      setDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Failed to delete category');
    } finally {
      setLoading(false);
    }
  }

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Categories"
          subtitle={`${categories.length} total categories`}
          action={
            <Button onClick={() => openEdit()} disabled={loading} icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }>
              Add Category
            </Button>
          }
        />
      </Card>

      {categories.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No categories yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first category to organize articles</p>
            <Button onClick={() => openEdit()}>Create Category</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <Card key={cat.id || i} hover className="group">
              <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => openDelete(cat)}
                    className="p-2 bg-white rounded-lg hover:bg-red-50 transition"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{cat.name}</h3>
              {cat.count && <p className="text-sm text-gray-500 dark:text-gray-400">{cat.count}</p>}
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title={currentCategory?.id ? 'Edit Category' : 'New Category'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditModal(false)}>Cancel</Button>
            <Button onClick={saveCategory} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={currentCategory?.name || ''}
              onChange={e => setCurrentCategory({ ...currentCategory, name: e.target.value })}
              placeholder="e.g., Dog Health"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
            <input
              type="text"
              value={currentCategory?.image || ''}
              onChange={e => setCurrentCategory({ ...currentCategory, image: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
            {currentCategory?.image && (
              <img src={currentCategory.image} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Image URL</label>
            <input
              type="text"
              value={currentCategory?.hero_image || ''}
              onChange={e => setCurrentCategory({ ...currentCategory, hero_image: e.target.value })}
              placeholder="https://... (for category page header)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (optional)</label>
            <input
              type="text"
              value={currentCategory?.count || ''}
              onChange={e => setCurrentCategory({ ...currentCategory, count: e.target.value })}
              placeholder="e.g., Expert guides on canine health"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={deleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${currentCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
