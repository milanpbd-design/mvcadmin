import { useState } from 'react';
import Card, { CardHeader, CardBody } from './components/Card';
import Button from './components/Button';
import Modal, { ConfirmModal } from './components/Modal';
import { useToast } from './components/Toast';

export default function SystemUsersManager() {
    const toast = useToast();

    // State for moderators
    const [moderators, setModerators] = useState([
        // Example moderators - these would come from backend in real app
    ]);
    const [moderatorModal, setModeratorModal] = useState(false);
    const [deleteMod, setDeleteMod] = useState(null);
    const [newModerator, setNewModerator] = useState({
        username: '',
        password: '',
        email: '',
        fullName: ''
    });

    // State for admin credentials
    const [adminModal, setAdminModal] = useState(false);
    const [adminCredentials, setAdminCredentials] = useState({
        currentPassword: '',
        newUsername: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Functions for moderators
    function openModeratorModal() {
        setNewModerator({
            username: '',
            password: '',
            email: '',
            fullName: ''
        });
        setModeratorModal(true);
    }

    function addModerator() {
        if (!newModerator.username || !newModerator.password) {
            toast.error('Username and password are required');
            return;
        }

        const moderator = {
            _id: String(Date.now()),
            username: newModerator.username,
            email: newModerator.email,
            fullName: newModerator.fullName,
            role: 'moderator',
            createdAt: new Date().toISOString()
        };

        setModerators(prev => [moderator, ...prev]);
        toast.success('Moderator added successfully!');
        setModeratorModal(false);
    }

    function confirmDeleteModerator(mod) {
        setDeleteMod(mod);
    }

    function deleteModerator() {
        setModerators(prev => prev.filter(m => m._id !== deleteMod._id));
        toast.success('Moderator removed');
        setDeleteMod(null);
    }

    // Functions for admin credentials
    function openAdminModal() {
        setAdminCredentials({
            currentPassword: '',
            newUsername: '',
            newPassword: '',
            confirmPassword: ''
        });
        setAdminModal(true);
    }

    function changeAdminCredentials() {
        if (!adminCredentials.currentPassword) {
            toast.error('Current password is required');
            return;
        }

        // Validate current password (in real app, this would be validated by backend)
        const storedPassword = localStorage.getItem('adminPassword') || 'admin';
        if (adminCredentials.currentPassword !== storedPassword) {
            toast.error('Current password is incorrect');
            return;
        }

        // Update username if provided
        if (adminCredentials.newUsername) {
            localStorage.setItem('adminUsername', adminCredentials.newUsername);
        }

        // Update password if provided
        if (adminCredentials.newPassword) {
            if (adminCredentials.newPassword !== adminCredentials.confirmPassword) {
                toast.error('New passwords do not match');
                return;
            }
            if (adminCredentials.newPassword.length < 6) {
                toast.error('Password must be at least 6 characters');
                return;
            }
            localStorage.setItem('adminPassword', adminCredentials.newPassword);
        }

        toast.success('Admin credentials updated successfully!');
        setAdminModal(false);
    }

    return (
        <div className="space-y-6">
            {/* Admin Credentials Section */}
            <Card>
                <CardHeader
                    title="Admin Account"
                    subtitle="Manage administrator credentials"
                />
                <CardBody>
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Administrator Account</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Current username: <span className="font-medium">{localStorage.getItem('adminUsername') || 'admin'}</span>
                            </p>
                        </div>
                        <Button onClick={openAdminModal} variant="outline" icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        }>
                            Change Credentials
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {/* Moderators Section */}
            <Card>
                <CardHeader
                    title="Moderators"
                    subtitle={`${moderators.length} moderator accounts`}
                    action={
                        <Button onClick={openModeratorModal} icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        }>
                            Add Moderator
                        </Button>
                    }
                />
            </Card>

            {moderators.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No moderators yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Add moderators to help manage content</p>
                        <Button onClick={openModeratorModal}>Add First Moderator</Button>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {moderators.map((mod) => (
                        <Card key={mod._id} hover>
                            <CardBody>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                            {mod.fullName?.charAt(0) || mod.username?.charAt(0) || 'M'}
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {mod.fullName || mod.username}
                                            </h4>
                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    {mod.username}
                                                </span>
                                                {mod.email && (
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        {mod.email}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold rounded-full">
                                                Moderator
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => confirmDeleteModerator(mod)}
                                        icon={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        }
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Moderator Modal */}
            <Modal
                isOpen={moderatorModal}
                onClose={() => setModeratorModal(false)}
                title="Add Moderator"
                size="md"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setModeratorModal(false)}>Cancel</Button>
                        <Button onClick={addModerator}>Add Moderator</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={newModerator.username}
                            onChange={e => setNewModerator({ ...newModerator, username: e.target.value })}
                            placeholder="moderator1"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={newModerator.password}
                            onChange={e => setNewModerator({ ...newModerator, password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 6 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={newModerator.fullName}
                            onChange={e => setNewModerator({ ...newModerator, fullName: e.target.value })}
                            placeholder="John Doe"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={newModerator.email}
                            onChange={e => setNewModerator({ ...newModerator, email: e.target.value })}
                            placeholder="moderator@example.com"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </Modal>

            {/* Change Admin Credentials Modal */}
            <Modal
                isOpen={adminModal}
                onClose={() => setAdminModal(false)}
                title="Change Admin Credentials"
                size="md"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setAdminModal(false)}>Cancel</Button>
                        <Button onClick={changeAdminCredentials}>Save Changes</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Important:</strong> Changing your credentials will affect your login access. Make sure to remember your new credentials.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Current Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={adminCredentials.currentPassword}
                            onChange={e => setAdminCredentials({ ...adminCredentials, currentPassword: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Username (optional)
                        </label>
                        <input
                            type="text"
                            value={adminCredentials.newUsername}
                            onChange={e => setAdminCredentials({ ...adminCredentials, newUsername: e.target.value })}
                            placeholder={localStorage.getItem('adminUsername') || 'admin'}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password (optional)
                        </label>
                        <input
                            type="password"
                            value={adminCredentials.newPassword}
                            onChange={e => setAdminCredentials({ ...adminCredentials, newPassword: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={adminCredentials.confirmPassword}
                            onChange={e => setAdminCredentials({ ...adminCredentials, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Moderator Confirmation */}
            <ConfirmModal
                isOpen={deleteMod !== null}
                onClose={() => setDeleteMod(null)}
                onConfirm={deleteModerator}
                title="Remove Moderator"
                message={`Are you sure you want to remove "${deleteMod?.fullName || deleteMod?.username}"? This action cannot be undone.`}
                confirmText="Remove"
                variant="danger"
            />
        </div>
    );
}
