import { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import Card, { CardHeader, CardBody } from './components/Card';
import Button from './components/Button';
import Modal from './components/Modal';
import { useToast } from './components/Toast';

export default function CategoryHeroManager() {
    const { siteData, setSiteData } = useSiteData() || {};
    const toast = useToast();
    const [editModal, setEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const allCategories = siteData?.categories || [];

    function openEdit(category) {
        setSelectedCategory(category);
        setImageUrl(category.image || '');
        setEditModal(true);
    }

    function saveImage() {
        if (!selectedCategory) return;

        // Update in siteData
        setSiteData(d => ({
            ...d,
            categories: (d.categories || []).map(c =>
                (c._id || c.id) === (selectedCategory._id || selectedCategory.id)
                    ? { ...c, image: imageUrl }
                    : c
            )
        }));

        toast.success('Hero image updated!');
        setEditModal(false);
    }

    function removeImage() {
        setImageUrl('');
        toast.info('Image URL cleared');
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader
                    title="Category Hero Images"
                    subtitle="Customize banner images for category pages"
                />
            </Card>

            {allCategories.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No categories found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Create categories first to add hero images</p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allCategories.map((cat) => (
                        <Card
                            key={cat._id || cat.id}
                            padding="p-0"
                            hover
                            onClick={() => openEdit(cat)}
                            className="cursor-pointer group overflow-hidden"
                        >
                            <div className="relative aspect-video bg-gradient-to-br from-blue-400 to-purple-500">
                                {cat.image ? (
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white">
                                        <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
                                    <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                                    {cat.image ? (
                                        <span className="text-green-400 text-sm flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Image set
                                        </span>
                                    ) : (
                                        <span className="text-gray-300 text-sm">No image</span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            <Modal
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                title={`Edit Hero Image - ${selectedCategory?.name}`}
                size="lg"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setEditModal(false)}>Cancel</Button>
                        {imageUrl && <Button variant="danger" onClick={removeImage}>Clear Image</Button>}
                        <Button onClick={saveImage}>Save Changes</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                        </label>
                        <input
                            type="text"
                            value={selectedCategory?.name || ''}
                            readOnly
                            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Hero Image URL
                        </label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Enter a direct URL to an image (recommended: 1200x400px)
                        </p>
                    </div>

                    {imageUrl && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Preview
                            </label>
                            <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-full h-64 object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        toast.error('Invalid image URL');
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
