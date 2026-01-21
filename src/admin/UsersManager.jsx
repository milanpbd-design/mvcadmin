import { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import Card, { CardHeader, CardBody } from './components/Card';
import Button from './components/Button';
import Modal, { ConfirmModal } from './components/Modal';
import { useToast } from './components/Toast';

export default function UsersManager() {
  const { siteData, setSiteData } = useSiteData() || {};
  const toast = useToast();
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentExpert, setCurrentExpert] = useState(null);

  const experts = siteData?.experts || [];

  function openEdit(expert = null) {
    setCurrentExpert(expert || {
      name: '',
      title: '',
      specialty: '',
      image: '',
      bio: ''
    });
    setEditModal(true);
  }

  function openDelete(expert) {
    setCurrentExpert(expert);
    setDeleteModal(true);
  }

  function saveExpert() {
    if (currentExpert._id) {
      // Update existing
      setSiteData(d => ({
        ...d,
        experts: d.experts.map(e => e._id === currentExpert._id ? currentExpert : e)
      }));
      toast.success('Expert updated!');
    } else {
      // Create new
      const newExpert = { ...currentExpert, _id: String(Date.now()) };
      setSiteData(d => ({
        ...d,
        experts: [newExpert, ...(d.experts || [])]
      }));
      toast.success('Expert added!');
    }
    setEditModal(false);
  }

  function deleteExpert() {
    setSiteData(d => ({
      ...d,
      experts: d.experts.filter(e => e._id !== currentExpert._id)
    }));
    toast.success('Expert  removed');
    setDeleteModal(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Medical Experts"
          subtitle={`${experts.length} expert profiles`}
          action={
            <Button onClick={() => openEdit()} icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }>
              Add Expert
            </Button>
          }
        />
      </Card>

      {experts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No experts yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Add medical professionals to build credibility</p>
            <Button onClick={() => openEdit()}>Add Expert</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert, i) => (
            <Card key={expert._id || i} hover className="group">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                    {expert.image ? (
                      <img src={expert.image} alt={expert.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                        {expert.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>

                  {/* Edit/Delete Overlay */}
                  <div className="absolute -bottom-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => openEdit(expert)}
                      className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    >
                      <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDelete(expert)}
                      className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{expert.name}</h3>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">{expert.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{expert.specialty}</p>

                {expert.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">{expert.bio}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title={currentExpert?._id ? 'Edit Expert' : 'New Expert'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditModal(false)}>Cancel</Button>
            <Button onClick={saveExpert}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={currentExpert?.name || ''}
              onChange={e => setCurrentExpert({ ...currentExpert, name: e.target.value })}
              placeholder="Dr. Jane Smith"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title/Credentials</label>
            <input
              type="text"
              value={currentExpert?.title || ''}
              onChange={e => setCurrentExpert({ ...currentExpert, title: e.target.value })}
              placeholder="DVM, DACVIM"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialty</label>
            <input
              type="text"
              value={currentExpert?.specialty || ''}
              onChange={e => setCurrentExpert({ ...currentExpert, specialty: e.target.value })}
              placeholder="Small Animal Internal Medicine"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Photo URL</label>
            <input
              type="text"
              value={currentExpert?.image || ''}
              onChange={e => setCurrentExpert({ ...currentExpert, image: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
            {currentExpert?.image && (
              <img src={currentExpert.image} alt="Preview" className="mt-2 w-24 h-24 rounded-full object-cover mx-auto" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio (optional)</label>
            <textarea
              rows={3}
              value={currentExpert?.bio || ''}
              onChange={e => setCurrentExpert({ ...currentExpert, bio: e.target.value })}
              placeholder="Brief professional background..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={deleteExpert}
        title="Remove Expert"
        message={`Are you sure you want to remove "${currentExpert?.name}"? This action cannot be undone.`}
        confirmText="Remove"
        variant="danger"
      />
    </div>
  );
}
