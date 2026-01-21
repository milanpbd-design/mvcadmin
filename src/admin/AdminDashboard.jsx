import { useSiteData } from '../context/SiteDataContext';
import Card, { CardHeader, CardBody } from './components/Card';
import Button from './components/Button';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const { siteData } = useSiteData() || {};

    const stats = [
        {
            label: 'Total Articles',
            value: (siteData?.articles || []).length,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            color: 'bg-blue-500',
            change: '+12%',
        },
        {
            label: 'Categories',
            value: (siteData?.categories || []).length,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
            color: 'bg-green-500',
            change: '+3',
        },
        {
            label: 'Experts',
            value: (siteData?.experts || []).length,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: 'bg-purple-500',
            change: '+2',
        },
        {
            label: 'Research Papers',
            value: (siteData?.research || []).length,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            color: 'bg-orange-500',
            change: '+5',
        },
    ];

    const quickActions = [
        { label: 'New Article', to: '/admin/editor', icon: '📝', color: 'blue' },
        { label: 'Add Category', to: '/admin/categories', icon: '📁', color: 'green' },
        { label: 'Add Expert', to: '/admin/users', icon: '👤', color: 'purple' },
        { label: 'Homepage', to: '/admin/homepage', icon: '🏠', color: 'orange' },
    ];

    const recentArticles = (siteData?.articles || []).slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Welcome to My Vet Corner Admin</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your veterinary knowledge platform with ease</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} padding="p-6" hover>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                                <p className="text-sm text-green-600 dark:text-green-400 mt-1">{stat.change}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                {stat.icon}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="lg:col-span-1">
                    <CardHeader title="Quick Actions" />
                    <CardBody>
                        <div className="grid grid-cols-2 gap-3">
                            {quickActions.map((action, i) => (
                                <Link key={i} to={action.to}>
                                    <button className="w-full p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition text-center">
                                        <div className="text-2xl mb-2">{action.icon}</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</div>
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Recent Activity */}
                <Card className="lg:col-span-2">
                    <CardHeader
                        title="Recent Articles"
                        subtitle={`${recentArticles.length} most recent`}
                        action={
                            <Link to="/admin/editor">
                                <Button size="sm" variant="ghost">View All</Button>
                            </Link>
                        }
                    />
                    <CardBody>
                        <div className="space-y-3">
                            {recentArticles.length === 0 ? (
                                <p className="text-center py-8 text-gray-500 dark:text-gray-400">No articles yet. Create your first one!</p>
                            ) : (
                                recentArticles.map((article, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 dark:text-white">{article.title || 'Untitled'}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {article.category || 'Uncategorized'} • {article.date || 'No date'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {article.published ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs rounded-full">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Site Health */}
            <Card>
                <CardHeader title="Site Health" subtitle="System status and recommendations" />
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <h5 className="font-semibold text-green-800 dark:text-green-200">All Systems Operational</h5>
                            </div>
                            <p className="text-sm text-green-600 dark:text-green-300">Backend and frontend running smoothly</p>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h5 className="font-semibold text-blue-800 dark:text-blue-200">Content Quality</h5>
                            </div>
                            <p className="text-sm text-blue-600 dark:text-blue-300">SEO optimization recommended</p>
                        </div>

                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <h5 className="font-semibold text-purple-800 dark:text-purple-200">Expert Network</h5>
                            </div>
                            <p className="text-sm text-purple-600 dark:text-purple-300">{(siteData?.experts || []).length} medical professionals</p>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
