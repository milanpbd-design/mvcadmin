import { useEffect, useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { useAuth } from '../context/AuthContext';
import { researchService } from '../services/supabaseService';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Card, { CardHeader, CardBody } from './components/Card';
import Button from './components/Button';
import { ConfirmModal } from './components/Modal';
import { useToast } from './components/Toast';

export default function ResearchManager() {
    const { reloadData } = useSiteData() || {};
    const { user } = useAuth();
    const toast = useToast();
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [expandedContent, setExpandedContent] = useState({});
    const [loading, setLoading] = useState(false);
    const [research, setResearch] = useState([]);

    useEffect(() => {
        loadResearch();
    }, []);

    async function loadResearch() {
        try {
            setLoading(true);
            const data = await researchService.fetchAll();
            setResearch(data || []);
        } catch (error) {
            console.error('Failed to load research:', error);
            toast.error('Failed to load research');
        } finally {
            setLoading(false);
        }
    }

    async function addResearch() {
        try {
            setLoading(true);
            const newResearch = {
                title: 'New Study',
                type: 'Peer Reviewed',
                year: new Date().getFullYear().toString(),
                authors: '',
                journal: '',
                abstract: '',
                pdf_url: ''
            };

            const created = await researchService.create(newResearch);
            setResearch(prev => [created, ...prev]);
            await reloadData();
            toast.success('Research paper added');
        } catch (error) {
            console.error('Failed to create research:', error);
            toast.error('Failed to create research');
        } finally {
            setLoading(false);
        }
    }

    function updateLocal(i, field, value) {
        setResearch(prev => prev.map((item, idx) =>
            idx === i ? { ...item, [field]: value } : item
        ));
    }

    async function saveResearch(i) {
        try {
            setLoading(true);
            const item = research[i];
            const updated = await researchService.update(item.id, item);
            setResearch(prev => prev.map((r, idx) => idx === i ? updated : r));
            await reloadData();
            toast.success('Research saved');
        } catch (error) {
            console.error('Failed to save research:', error);
            toast.error('Failed to save research');
        } finally {
            setLoading(false);
        }
    }

    function confirmDelete(i) {
        setDeleteIndex(i);
        setDeleteModal(true);
    }

    async function removeResearch() {
        try {
            setLoading(true);
            const item = research[deleteIndex];
            await researchService.delete(item.id);
            setResearch(prev => prev.filter((_, idx) => idx !== deleteIndex));
            await reloadData();
            toast.success('Research deleted');
            setDeleteModal(false);
        } catch (error) {
            console.error('Failed to delete research:', error);
            toast.error('Failed to delete research');
        } finally {
            setLoading(false);
        }
    }

    function toggleContent(i) {
        setExpandedContent(prev => ({ ...prev, [i]: !prev[i] }));
    }

    const typeOptions = ['Peer Reviewed', 'Clinical Study', 'Case Report', 'Meta-Analysis', 'Review'];
    const colorOptions = ['blue', 'green', 'purple', 'red', 'orange'];

    if (loading && research.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading research...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader
                    title="Research & Journals"
                    subtitle={`${research.length} publications`}
                    action={
                        <Button onClick={addResearch} disabled={loading} icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        }>
                            Add Paper
                        </Button>
                    }
                />
            </Card>

            {research.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No research papers yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Add published research to establish credibility</p>
                        <Button onClick={addResearch}>Add Research</Button>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {research.map((item, i) => (
                        <Card key={item.id || i}>
                            <CardBody>
                                {/* Header with metadata */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <select
                                            value={item.type || 'Peer Reviewed'}
                                            onChange={e => updateLocal(i, 'type', e.target.value)}
                                            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>

                                        <input
                                            type="text"
                                            value={item.year || ''}
                                            onChange={e => updateLocal(i, 'year', e.target.value)}
                                            placeholder="Year"
                                            className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />

                                        {item.pdf_url && (
                                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                </svg>
                                                PDF Linked
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => saveResearch(i)}
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save'}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => confirmDelete(i)}
                                            icon={
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Title and authors */}
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={item.title || ''}
                                        onChange={e => updateLocal(i, 'title', e.target.value)}
                                        placeholder="Research Title"
                                        className="w-full text-lg font-semibold px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={item.authors || ''}
                                            onChange={e => updateLocal(i, 'authors', e.target.value)}
                                            placeholder="Authors (e.g., Smith, J., Doe, M.)"
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />

                                        <input
                                            type="text"
                                            value={item.journal || ''}
                                            onChange={e => updateLocal(i, 'journal', e.target.value)}
                                            placeholder="Journal Name, Vol(Issue)"
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    {/* Abstract */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Abstract (Summary)
                                        </label>
                                        <textarea
                                            value={item.abstract || ''}
                                            onChange={e => updateLocal(i, 'abstract', e.target.value)}
                                            rows={3}
                                            placeholder="Brief abstract summary for preview..."
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    {/* PDF URL Section */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            📄 Research Paper PDF URL
                                        </label>
                                        <input
                                            type="text"
                                            value={item.pdf_url || ''}
                                            onChange={e => updateLocal(i, 'pdf_url', e.target.value)}
                                            placeholder="https://... (link to PDF hosted elsewhere)"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                        {item.pdf_url && (
                                            <div className="mt-2 flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                </svg>
                                                <a
                                                    href={item.pdf_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
                                                >
                                                    {item.pdf_url}
                                                </a>
                                            </div>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Enter URL to PDF hosted on GitHub, cloud storage, or other service
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={removeResearch}
                title="Delete Research"
                message="Are you sure you want to delete this research paper?"
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
