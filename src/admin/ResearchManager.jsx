import { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Card, { CardHeader, CardBody } from './components/Card';
import Button from './components/Button';
import { ConfirmModal } from './components/Modal';
import { useToast } from './components/Toast';
import GitHubService from './GitHubService';

export default function ResearchManager() {
    const { siteData, setSiteData } = useSiteData() || {};
    const toast = useToast();
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [uploadingPdf, setUploadingPdf] = useState({});
    const [expandedContent, setExpandedContent] = useState({});
    const [publishing, setPublishing] = useState(false);

    const research = siteData?.research || [];

    function addResearch() {
        setSiteData(d => ({
            ...d,
            research: [{
                title: 'New Study',
                type: 'Peer Reviewed',
                typeColor: 'blue',
                year: new Date().getFullYear().toString(),
                authors: '',
                journal: '',
                abstract: '',
                content: '',
                pdfUrl: '',
                pdfFilename: '',
                _id: String(Date.now())
            }, ...(d.research || [])]
        }));
        toast.success('Research paper added');
    }

    function updateResearch(i, field, value) {
        setSiteData(d => ({
            ...d,
            research: d.research.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
        }));
    }

    async function uploadPdf(i, file) {
        if (!file) return;

        const item = research[i];
        const formData = new FormData();
        formData.append('pdf', file);

        setUploadingPdf(prev => ({ ...prev, [i]: true }));

        try {
            const token = localStorage.getItem('adminToken') || '';
            const response = await fetch(`http://localhost:5000/api/research/${item._id}/upload-pdf`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            updateResearch(i, 'pdfUrl', data.pdfUrl);
            updateResearch(i, 'pdfFilename', data.filename);
            toast.success('PDF uploaded successfully!');
        } catch (err) {
            console.error('Upload error:', err);
            toast.error('Failed to upload PDF: ' + err.message);
        } finally {
            setUploadingPdf(prev => ({ ...prev, [i]: false }));
        }
    }

    async function deletePdf(i) {
        const item = research[i];
        if (!item.pdfFilename) return;

        try {
            const token = localStorage.getItem('adminToken') || '';
            const response = await fetch(`http://localhost:5000/api/research/${item._id}/delete-pdf?filename=${item.pdfFilename}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            updateResearch(i, 'pdfUrl', '');
            updateResearch(i, 'pdfFilename', '');
            toast.success('PDF deleted');
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Failed to delete PDF: ' + err.message);
        }
    }

    function confirmDelete(i) {
        setDeleteIndex(i);
        setDeleteModal(true);
    }

    function removeResearch() {
        setSiteData(d => ({
            ...d,
            research: d.research.filter((_, idx) => idx !== deleteIndex)
        }));
        toast.success('Research paper removed');
        setDeleteModal(false);
    }

    function toggleContent(i) {
        setExpandedContent(prev => ({ ...prev, [i]: !prev[i] }));
    }

    async function publishToGitHub() {
        setPublishing(true);

        try {
            const token = localStorage.getItem('github_token');
            const owner = localStorage.getItem('github_owner');
            const repo = localStorage.getItem('github_repo');

            if (!token || !owner) {
                toast.error('Please configure GitHub settings first');
                return;
            }

            const github = new GitHubService(token, owner, repo);
            await github.updateResearch(siteData.research);

            toast.success('✅ Published to GitHub! Site will rebuild automatically.');
        } catch (error) {
            console.error('Publish error:', error);
            toast.error('Failed to publish: ' + error.message);
        } finally {
            setPublishing(false);
        }
    }

    const typeOptions = ['Peer Reviewed', 'Clinical Study', 'Case Report', 'Meta-Analysis', 'Review'];
    const colorOptions = ['blue', 'green', 'purple', 'red', 'orange'];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader
                    title="Research & Journals"
                    subtitle={`${research.length} publications`}
                    action={
                        <div className="flex gap-2">
                            <Button onClick={addResearch} icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            }>
                                Add Paper
                            </Button>
                            <Button
                                onClick={publishToGitHub}
                                disabled={publishing}
                                variant="primary"
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                }
                            >
                                {publishing ? 'Publishing...' : '🚀 Publish'}
                            </Button>
                        </div>
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
                        <Card key={item._id || i}>
                            <CardBody>
                                {/* Header with metadata */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <select
                                            value={item.type || 'Peer Reviewed'}
                                            onChange={e => updateResearch(i, 'type', e.target.value)}
                                            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>

                                        <select
                                            value={item.typeColor || 'blue'}
                                            onChange={e => updateResearch(i, 'typeColor', e.target.value)}
                                            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>

                                        <input
                                            type="text"
                                            value={item.year || ''}
                                            onChange={e => updateResearch(i, 'year', e.target.value)}
                                            placeholder="Year"
                                            className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />

                                        {item.pdfUrl && (
                                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                </svg>
                                                PDF Attached
                                            </span>
                                        )}
                                    </div>

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

                                {/* Title and authors */}
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={item.title || ''}
                                        onChange={e => updateResearch(i, 'title', e.target.value)}
                                        placeholder="Research Title"
                                        className="w-full text-lg font-semibold px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={item.authors || ''}
                                            onChange={e => updateResearch(i, 'authors', e.target.value)}
                                            placeholder="Authors (e.g., Smith, J., Doe, M.)"
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />

                                        <input
                                            type="text"
                                            value={item.journal || ''}
                                            onChange={e => updateResearch(i, 'journal', e.target.value)}
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
                                            onChange={e => updateResearch(i, 'abstract', e.target.value)}
                                            rows={3}
                                            placeholder="Brief abstract summary for preview..."
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    {/* Full Content Editor */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Full Content
                                            </label>
                                            <button
                                                onClick={() => toggleContent(i)}
                                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                {expandedContent[i] ? 'Collapse' : 'Expand'} Editor
                                            </button>
                                        </div>
                                        {expandedContent[i] && (
                                            <div className="h-96">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={item.content || ''}
                                                    onChange={val => updateResearch(i, 'content', val)}
                                                    className="h-full bg-white dark:bg-gray-700"
                                                    modules={{
                                                        toolbar: [
                                                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                                            ['bold', 'italic', 'underline', 'strike'],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                                                            [{ 'color': [] }, { 'background': [] }],
                                                            [{ 'align': [] }],
                                                            ['link', 'image'],
                                                            ['clean']
                                                        ]
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* PDF Upload Section */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            📄 Research Paper PDF
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={e => uploadPdf(i, e.target.files[0])}
                                                    disabled={uploadingPdf[i]}
                                                    className="block w-full text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-white dark:bg-gray-700 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-200 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                                                />
                                            </div>
                                            {uploadingPdf[i] && (
                                                <span className="text-sm text-blue-600 dark:text-blue-400">Uploading...</span>
                                            )}
                                        </div>

                                        {item.pdfUrl && (
                                            <div className="mt-2 flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                </svg>
                                                <span className="flex-1 text-sm text-gray-900 dark:text-white truncate">
                                                    {item.pdfFilename || 'research.pdf'}
                                                </span>
                                                <a
                                                    href={`http://localhost:5000${item.pdfUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    Download
                                                </a>
                                                <button
                                                    onClick={() => deletePdf(i)}
                                                    className="text-sm text-red-600 dark:text-red-400 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Upload PDF (max 10MB) for users to download from the frontend
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
