import { useState, useEffect } from 'react';
import Card, { CardHeader, CardBody } from './components/Card';
import Button from './components/Button';
import { useToast } from './components/Toast';
import GitHubService from './GitHubService';

export default function GitHubSettings() {
    const toast = useToast();
    const [token, setToken] = useState('');
    const [owner, setOwner] = useState('');
    const [repo, setRepo] = useState('myvetcorner');
    const [testing, setTesting] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(null);

    useEffect(() => {
        // Load saved settings
        setToken(localStorage.getItem('github_token') || '');
        setOwner(localStorage.getItem('github_owner') || '');
        setRepo(localStorage.getItem('github_repo') || 'myvetcorner');
    }, []);

    function saveSettings() {
        if (!token) {
            toast.error('Please enter a GitHub token');
            return;
        }
        if (!owner) {
            toast.error('Please enter your GitHub username/organization');
            return;
        }
        if (!repo) {
            toast.error('Please enter your repository name');
            return;
        }

        localStorage.setItem('github_token', token);
        localStorage.setItem('github_owner', owner);
        localStorage.setItem('github_repo', repo);

        toast.success('✅ GitHub settings saved!');
        setConnectionStatus(null); // Reset status
    }

    async function testConnection() {
        if (!token || !owner || !repo) {
            toast.error('Please fill in all fields and save first');
            return;
        }

        setTesting(true);
        setConnectionStatus(null);

        try {
            const github = new GitHubService(token, owner, repo);
            const result = await github.testConnection();

            setConnectionStatus({
                success: true,
                message: `✅ Connected to ${result.repoName}`,
                details: result.private ? '🔒 Private repository' : '🌍 Public repository'
            });

            toast.success('Connection successful!');
        } catch (error) {
            setConnectionStatus({
                success: false,
                message: '❌ Connection failed',
                details: error.message
            });

            toast.error('Connection failed: ' + error.message);
        } finally {
            setTesting(false);
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader
                    title="GitHub Configuration"
                    subtitle="Configure GitHub repository for content management"
                />
                <CardBody>
                    <div className="space-y-5">
                        {/* Instructions */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                                📚 Setup Instructions
                            </h3>
                            <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                                <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline font-medium">GitHub Settings → Developer settings → Personal access tokens</a></li>
                                <li>Click "Generate new token (classic)"</li>
                                <li>Give it a name (e.g., "My Vet Corner Admin")</li>
                                <li>Select scope: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">repo</code> (full repository access)</li>
                                <li>Click "Generate token" and copy it</li>
                                <li>Paste the token below and save</li>
                            </ol>
                        </div>

                        {/* GitHub Owner/Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                GitHub Username or Organization
                            </label>
                            <input
                                type="text"
                                value={owner}
                                onChange={e => setOwner(e.target.value)}
                                placeholder="your-github-username"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Your GitHub username or organization name (e.g., "octocat")
                            </p>
                        </div>

                        {/* Repository Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Repository Name
                            </label>
                            <input
                                type="text"
                                value={repo}
                                onChange={e => setRepo(e.target.value)}
                                placeholder="myvetcorner"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                The repository name (without username, e.g., "myvetcorner")
                            </p>
                        </div>

                        {/* Personal Access Token */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Personal Access Token
                            </label>
                            <input
                                type="password"
                                value={token}
                                onChange={e => setToken(e.target.value)}
                                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Required scope: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">repo</code>
                            </p>
                        </div>

                        {/* Connection Status */}
                        {connectionStatus && (
                            <div className={`p-4 rounded-lg border ${connectionStatus.success
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                }`}>
                                <p className={`font-medium ${connectionStatus.success
                                        ? 'text-green-900 dark:text-green-200'
                                        : 'text-red-900 dark:text-red-200'
                                    }`}>
                                    {connectionStatus.message}
                                </p>
                                <p className={`text-sm mt-1 ${connectionStatus.success
                                        ? 'text-green-700 dark:text-green-300'
                                        : 'text-red-700 dark:text-red-300'
                                    }`}>
                                    {connectionStatus.details}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                onClick={saveSettings}
                                variant="primary"
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                }
                            >
                                Save Settings
                            </Button>
                            <Button
                                onClick={testConnection}
                                disabled={testing}
                                variant="secondary"
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                }
                            >
                                {testing ? 'Testing...' : 'Test Connection'}
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Security Notice */}
            <Card>
                <CardBody>
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                🔐 Security Notice
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Your GitHub token is stored locally in your browser's localStorage.
                                Never share your token with anyone. Only use this admin panel on trusted devices.
                                If you suspect your token has been compromised, revoke it immediately on GitHub and generate a new one.
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
