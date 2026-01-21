import { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import Card, { CardHeader, CardBody } from './components/Card';
import Button from './components/Button';
import { ConfirmModal } from './components/Modal';
import { useToast } from './components/Toast';

export default function HomepageSections() {
    const { siteData, setSiteData } = useSiteData() || {};
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('hero');
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState({ type: '', index: null });

    // Hero Slides Functions
    function addSlide() {
        setSiteData(d => ({
            ...d,
            slides: [{
                tag: 'Featured',
                title: 'New Slide',
                excerpt: '',
                image: '',
                readTime: '5 min read'
            }, ...(d.slides || [])]
        }));
        toast.success('Slide added');
    }

    function updateSlide(i, field, value) {
        setSiteData(d => ({
            ...d,
            slides: d.slides.map((s, idx) => idx === i ? { ...s, [field]: value } : s)
        }));
    }

    function confirmDeleteSlide(i) {
        setDeleteInfo({ type: 'slide', index: i });
        setDeleteModal(true);
    }

    function removeSlide() {
        setSiteData(d => ({
            ...d,
            slides: d.slides.filter((_, idx) => idx !== deleteInfo.index)
        }));
        toast.success('Slide removed');
        setDeleteModal(false);
    }

    // Stats Functions
    function addStat() {
        setSiteData(d => ({
            ...d,
            stats: [{
                value: '100+',
                label: 'New Stat',
                icon: 'shield'
            }, ...(d.stats || [])]
        }));
        toast.success('Stat added');
    }

    function updateStat(i, field, value) {
        setSiteData(d => ({
            ...d,
            stats: d.stats.map((s, idx) => idx === i ? { ...s, [field]: value } : s)
        }));
    }

    function confirmDeleteStat(i) {
        setDeleteInfo({ type: 'stat', index: i });
        setDeleteModal(true);
    }

    function removeStat() {
        setSiteData(d => ({
            ...d,
            stats: d.stats.filter((_, idx) => idx !== deleteInfo.index)
        }));
        toast.success('Stat removed');
        setDeleteModal(false);
    }

    // Newsletter Functions
    function updateNewsletter(field, value) {
        setSiteData(d => ({
            ...d,
            newsletter: { ...(d.newsletter || {}), [field]: value }
        }));
    }

    // Footer Functions
    function updateFooter(field, value) {
        setSiteData(d => ({
            ...d,
            footer: { ...(d.footer || {}), [field]: value }
        }));
    }

    function updateSocialLink(i, field, value) {
        setSiteData(d => ({
            ...d,
            footer: {
                ...d.footer,
                socialLinks: (d.footer?.socialLinks || []).map((link, idx) =>
                    idx === i ? { ...link, [field]: value } : link
                )
            }
        }));
    }

    function addSocialLink() {
        setSiteData(d => ({
            ...d,
            footer: {
                ...d.footer,
                socialLinks: [...(d.footer?.socialLinks || []), { platform: 'New Platform', url: '#' }]
            }
        }));
    }

    function removeSocialLink(i) {
        setSiteData(d => ({
            ...d,
            footer: {
                ...d.footer,
                socialLinks: (d.footer?.socialLinks || []).filter((_, idx) => idx !== i)
            }
        }));
    }

    const tabs = [
        { id: 'hero', label: 'Hero Slides', icon: '🎨' },
        { id: 'stats', label: 'Statistics', icon: '📊' },
        { id: 'newsletter', label: 'Newsletter', icon: '📧' },
        { id: 'footer', label: 'Footer', icon: '🔗' },
    ];

    const iconOptions = ['shield', 'book', 'users', 'lab'];

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
                            subtitle={`${(siteData?.slides || []).length} active slides`}
                            action={<Button size="sm" onClick={addSlide}>+ Add Slide</Button>}
                        />
                    </Card>

                    {(siteData?.slides || []).length === 0 ? (
                        <Card>
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">No slides yet</p>
                                <Button onClick={addSlide}>Create First Slide</Button>
                            </div>
                        </Card>
                    ) : (
                        (siteData?.slides || []).map((slide, i) => (
                            <Card key={i}>
                                <CardBody>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-semibold text-lg">Slide {i + 1}</h3>
                                        <Button variant="ghost" size="sm" onClick={() => confirmDeleteSlide(i)}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={slide.tag || ''}
                                                onChange={e => updateSlide(i, 'tag', e.target.value)}
                                                placeholder="Tag (e.g., Featured)"
                                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                            />
                                            <input
                                                type="text"
                                                value={slide.readTime || ''}
                                                onChange={e => updateSlide(i, 'readTime', e.target.value)}
                                                placeholder="Read time"
                                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                            />
                                        </div>

                                        <input
                                            type="text"
                                            value={slide.title || ''}
                                            onChange={e => updateSlide(i, 'title', e.target.value)}
                                            placeholder="Slide title"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 font-semibold"
                                        />

                                        <input
                                            type="text"
                                            value={slide.image || ''}
                                            onChange={e => updateSlide(i, 'image', e.target.value)}
                                            placeholder="Image URL"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                        />

                                        {slide.image && (
                                            <img src={slide.image} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                                        )}

                                        <textarea
                                            value={slide.excerpt || ''}
                                            onChange={e => updateSlide(i, 'excerpt', e.target.value)}
                                            placeholder="Slide description"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader
                            title="Statistics"
                            subtitle="Homepage stat counters"
                            action={<Button size="sm" onClick={addStat}>+ Add Stat</Button>}
                        />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(siteData?.stats || []).map((stat, i) => (
                            <Card key={i}>
                                <CardBody>
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-semibold">Stat {i + 1}</h3>
                                        <Button variant="ghost" size="sm" onClick={() => confirmDeleteStat(i)}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={stat.value || ''}
                                            onChange={e => updateStat(i, 'value', e.target.value)}
                                            placeholder="Value (e.g., 500+)"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 font-bold text-lg"
                                        />

                                        <input
                                            type="text"
                                            value={stat.label || ''}
                                            onChange={e => updateStat(i, 'label', e.target.value)}
                                            placeholder="Label"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                        />

                                        <select
                                            value={stat.icon || 'shield'}
                                            onChange={e => updateStat(i, 'icon', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                        >
                                            {iconOptions.map(icon => (
                                                <option key={icon} value={icon}>{icon.charAt(0).toUpperCase() + icon.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
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
                                    value={siteData?.newsletter?.title || ''}
                                    onChange={e => updateNewsletter('title', e.target.value)}
                                    placeholder="Stay Updated"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                                <textarea
                                    value={siteData?.newsletter?.subtitle || ''}
                                    onChange={e => updateNewsletter('subtitle', e.target.value)}
                                    placeholder="Get the latest vet-reviewed articles..."
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button Text</label>
                                <input
                                    type="text"
                                    value={siteData?.newsletter?.buttonText || ''}
                                    onChange={e => updateNewsletter('buttonText', e.target.value)}
                                    placeholder="Subscribe Now"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Footer Text</label>
                                <input
                                    type="text"
                                    value={siteData?.newsletter?.footerText || ''}
                                    onChange={e => updateNewsletter('footerText', e.target.value)}
                                    placeholder="Join 50,000+ subscribers..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Footer Tab */}
            {activeTab === 'footer' && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader title="Footer Content" />
                        <CardBody>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <textarea
                                        value={siteData?.footer?.description || ''}
                                        onChange={e => updateFooter('description', e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Copyright Text</label>
                                    <input
                                        type="text"
                                        value={siteData?.footer?.copyright || ''}
                                        onChange={e => updateFooter('copyright', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Disclaimer</label>
                                    <textarea
                                        value={siteData?.footer?.disclaimerText || ''}
                                        onChange={e => updateFooter('disclaimerText', e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader
                            title="Social Media Links"
                            action={<Button size="sm" onClick={addSocialLink}>+ Add Link</Button>}
                        />
                        <CardBody>
                            <div className="space-y-3">
                                {(siteData?.footer?.socialLinks || []).map((link, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={link.platform || ''}
                                            onChange={e => updateSocialLink(i, 'platform', e.target.value)}
                                            placeholder="Platform"
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                        />
                                        <input
                                            type="text"
                                            value={link.url || ''}
                                            onChange={e => updateSocialLink(i, 'url', e.target.value)}
                                            placeholder="URL"
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                        />
                                        <Button variant="ghost" size="sm" onClick={() => removeSocialLink(i)}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={deleteInfo.type === 'slide' ? removeSlide : removeStat}
                title={`Delete ${deleteInfo.type === 'slide' ? 'Slide' : 'Stat'}`}
                message={`Are you sure you want to delete this ${deleteInfo.type}?`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
