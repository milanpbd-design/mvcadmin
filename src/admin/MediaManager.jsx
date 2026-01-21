import { useState, useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import Card, { CardHeader, CardBody } from './components/Card';
import Button from './components/Button';
import Modal, { ConfirmModal } from './components/Modal';
import { useToast } from './components/Toast';

export default function MediaManager() {
  const { siteData, setSiteData } = useSiteData() || {};
  const toast = useToast();
  const inputRef = useRef(null);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [filterType, setFilterType] = useState('all'); // all, images, videos, documents

  const media = siteData?.media || [];

  function handleFiles(files) {
    const items = Array.from(files).map(f => ({
      name: f.name,
      type: f.type,
      size: f.size,
      url: URL.createObjectURL(f),
      uploadedAt: new Date().toISOString(),
      _id: String(Date.now() + Math.random())
    }));
    setSiteData(d => ({ ...d, media: [...items, ...(d.media || [])] }));
    toast.success(`${items.length} file(s) uploaded`);
  }

  function viewMedia(media, index) {
    setSelectedMedia(media);
    setSelectedIndex(index);
    setViewModal(true);
  }

  function confirmDelete(media, index) {
    setSelectedMedia(media);
    setSelectedIndex(index);
    setDeleteModal(true);
  }

  function removeMedia() {
    setSiteData(d => ({
      ...d,
      media: d.media.filter((_, idx) => idx !== selectedIndex)
    }));
    toast.success('Media deleted');
    setDeleteModal(false);
  }

  function copyUrl(url) {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  }

  // Filter media
  const filteredMedia = media.filter(m => {
    if (filterType === 'all') return true;
    if (filterType === 'images') return m.type.startsWith('image');
    if (filterType === 'videos') return m.type.startsWith('video');
    if (filterType === 'documents') return !m.type.startsWith('image') && !m.type.startsWith('video');
    return true;
  });

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  function getFileIcon(type) {
    if (type.startsWith('image')) return '🖼️';
    if (type.startsWith('video')) return '🎥';
    if (type.includes('pdf')) return '📄';
    return '📎';
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Media Library"
          subtitle={`${filteredMedia.length} of ${media.length} items`}
          action={
            <Button
              onClick={() => inputRef.current?.click()}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              }
            >
              Upload Files
            </Button>
          }
        />
        <CardBody>
          {/* Hidden file input */}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={e => handleFiles(e.target.files)}
            className="hidden"
          />

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${filterType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              All ({media.length})
            </button>
            <button
              onClick={() => setFilterType('images')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${filterType === 'images'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              Images ({media.filter(m => m.type.startsWith('image')).length})
            </button>
            <button
              onClick={() => setFilterType('videos')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${filterType === 'videos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              Videos ({media.filter(m => m.type.startsWith('video')).length})
            </button>
            <button
              onClick={() => setFilterType('documents')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${filterType === 'documents'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              Documents ({media.filter(m => !m.type.startsWith('image') && !m.type.startsWith('video')).length})
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No media files</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Upload images, videos, or documents</p>
            <Button onClick={() => inputRef.current?.click()}>Upload Files</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item, i) => {
            const actualIndex = media.indexOf(item);
            return (
              <Card key={item._id || i} padding="p-0" className="group overflow-hidden">
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                  {item.type.startsWith('image') ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : item.type.startsWith('video') ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {getFileIcon(item.type)}
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => viewMedia(item, actualIndex)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                      title="View"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => copyUrl(item.url)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                      title="Copy URL"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => confirmDelete(item, actualIndex)}
                      className="p-2 bg-white rounded-lg hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatFileSize(item.size)}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* View Modal */}
      <Modal
        isOpen={viewModal}
        onClose={() => setViewModal(false)}
        title={selectedMedia?.name}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setViewModal(false)}>Close</Button>
            <Button onClick={() => copyUrl(selectedMedia?.url)}>Copy URL</Button>
            <a href={selectedMedia?.url} download={selectedMedia?.name}>
              <Button variant="secondary">Download</Button>
            </a>
          </>
        }
      >
        {selectedMedia && (
          <div className="space-y-4">
            {selectedMedia.type.startsWith('image') ? (
              <img src={selectedMedia.url} alt={selectedMedia.name} className="w-full rounded-lg" />
            ) : selectedMedia.type.startsWith('video') ? (
              <video src={selectedMedia.url} controls className="w-full rounded-lg" />
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">{getFileIcon(selectedMedia.type)}</div>
                <p className="text-gray-600 dark:text-gray-400">{selectedMedia.type}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">File Size</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatFileSize(selectedMedia.size)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedMedia.type}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 dark:text-gray-400">URL</p>
                <p className="font-medium text-gray-900 dark:text-white text-xs break-all">{selectedMedia.url}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={removeMedia}
        title="Delete Media"
        message={`Are you sure you want to delete "${selectedMedia?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
