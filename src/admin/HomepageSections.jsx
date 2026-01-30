import { useEffect, useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { useAuth } from '../context/AuthContext';
import { slidesService, siteConfigService } from '../services/supabaseService';
import Card, { CardHeader, CardBody } from './components/Card';
import Button from './components/Button';
import { ConfirmModal } from './components/Modal';
import { useToast } from './components/Toast';

export default function HomepageSections() {
    const { reloadData } = useSiteData() || {};
    const { user } = useAuth();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('hero');
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [slides, setSlides] = useState([]);
    const [siteConfig, setSiteConfig] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const [slidesData, configData] = await Promise.all([
                slidesService.fetchAll(),
                siteConfigService.fetchConfig()
            ]);
            setSlides(slidesData || []);
            setSiteConfig(configData || {});
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    }

    // Hero Slides Functions
    async function addSlide() {
        try {
            setLoading(true);
            const newSlide = {
                tag: 'Featured',
                title: 'New Slide',
                excerpt: '',
                image: '',
                read_time: '5 min read',
                active: true,
                order: slides.length
            };

            const created = await slidesService.create(newSlide);
            setSlides(prev => [created, ...prev]);
            await reloadData();
            toast.success('Slide added');
        } catch (error) {
            console.error('Failed to create slide:', error);
            toast.error('Failed to create slide');
        } finally {
            setLoading(false);
        }
    }

    function updateSlideLocal(i, field, value) {
        setSlides(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
    }

    async function saveSlide(i) {
        try {
            setLoading(true);
            const slide = slides[i];
            const updated = await slidesService.update(slide.id, slide);
            setSlides(prev => prev.map((s, idx) => idx === i ? updated : s));
            await reloadData();
            toast.success('Slide saved');
        } catch (error) {
            console.error('Failed to save slide:', error);
            toast.error('Failed to save slide');
        } finally {
            setLoading(false);
        }
    }

    function confirmDeleteSlide(i) {
        setDeleteIndex(i);
        setDeleteModal(true);
    }

    async function removeSlide() {
        try {
            setLoading(true);
            const slide = slides[deleteIndex];
            await slidesService.delete(slide.id);
            setSlides(prev => prev.filter((_, idx) => idx !== deleteIndex));
            await reloadData();
            toast.success('Slide removed');
            setDeleteModal(false);
        } catch (error) {
            console.error('Failed to delete slide:', error);
            toast.error('Failed to delete slide');
        } finally {
            setLoading(false);
        }
    }

    // Site Config Functions
    function updateConfigLocal(section, field, value) {
        setSiteConfig(prev => ({
            ...prev,
            [section]: { ...(prev[section] || {}), [field]: value }
        }));
    }

    async function saveConfig() {
        try {
            setLoading(true);
            await siteConfigService.updateConfig(siteConfig);
            await reloadData();
            toast.success('Settings saved');
        } catch (error) {
            console.error('Failed to save config:', error);
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    }

    const tabs = [
        { id: 'hero', label: 'Hero Slides', icon: '🎨' },
        { id: 'newsletter', label: 'Newsletter', icon: '📧' },
        { id: 'footer', label: 'Footer', icon: '🔗' },
    ];

    if (loading && slides.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader
                    title="Homepage Builder"
                    subtitle="Customize your homepage sections"
                />
                <CardBody>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* Hero Slides Tab */}
            {activeTab === 'hero' && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader
                            title="Hero Slides"
                            subtitle={`${slides.length} active slides`}
                            action={<Button size="sm" onClick={addSlide} disabled={loading}>+ Add Slide</Button>}
                        />
                    </Card>

                    {slides.length === 0 ? (
                        <Card>
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">No slides yet</p>
                                <Button onClick={addSlide}>Create First Slide</Button>
                            </div>
                        </Card>
                    ) : (
                        slides.map((slide, i) => (
                            <Card key={slide.id || i}>
                                <CardBody>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-semibold text-lg">Slide {i + 1}</h3>
                                        <div className="flex gap-2">
                                            <Button variant="secondary" size="sm" onClick={() => saveSlide(i)} disabled={loading}>
                                                {loading ? 'Saving...' : 'Save'}
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => confirmDeleteSlide(i)}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={slide.tag || ''}
                                                onChange={e => updateSlideLocal(i, 'tag', e.target.value)}
                                                placeholder="Tag (e.g., Featured)"
                                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                            <input
                                                type="text"
                                                value={slide.read_time || ''}
                                                onChange={e => updateSlideLocal(i, 'read_time', e.target.value)}
                                                placeholder="Read time"
                                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>

                                        <input
                                            type="text"
                                            value={slide.title || ''}
                                            onChange={e => updateSlideLocal(i, 'title', e.target.value)}
                                            placeholder="Slide title"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 font-semibold text-gray-900 dark:text-white"
                                        />

                                        <input
                                            type="text"
                                            value={slide.image || ''}
                                            onChange={e => updateSlideLocal(i, 'image', e.target.value)}
                                            placeholder="Image URL"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />

                                        {slide.image && (
                                            <img src={slide.image} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                                        )}

                                        <textarea
                                            value={slide.excerpt || ''}
                                            onChange={e => updateSlideLocal(i, 'excerpt', e.target.value)}
                                            placeholder="Slide description"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Newsletter Tab */}
            {activeTab === 'newsletter' && (
                <Card>
                    <CardHeader title="Newsletter Section" subtitle="Subscription call-to-action" />
                    <CardBody>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={siteConfig.newsletter?.title || ''}
                                    onChange={e => updateConfigLocal('newsletter', 'title', e.target.value)}
                                    placeholder="Stay Updated"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                                <textarea
                                    value={siteConfig.newsletter?.subtitle || ''}
                                    onChange={e => updateConfigLocal('newsletter', 'subtitle', e.target.value)}
                                    placeholder="Get the latest vet-reviewed articles..."
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <Button onClick={saveConfig} disabled={loading}>
                                {loading ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Footer Tab */}
            {activeTab === 'footer' && (
                <Card>
                    <CardHeader title="Footer Content" />
                    <CardBody>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={siteConfig.footer?.description || ''}
                                    onChange={e => updateConfigLocal('footer', 'description', e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Copyright Text</label>
                                <input
                                    type="text"
                                    value={siteConfig.footer?.copyright || ''}
                                    onChange={e => updateConfigLocal('footer', 'copyright', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <Button onClick={saveConfig} disabled={loading}>
                                {loading ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={removeSlide}
                title="Delete Slide"
                message="Are you sure you want to delete this slide?"
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
