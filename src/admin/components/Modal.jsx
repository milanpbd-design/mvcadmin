import { useEffect } from 'react';
import Button from './Button';

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnOverlay = true
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
                    onClick={closeOnOverlay ? onClose : undefined}
                />

                {/* Modal */}
                <div className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] flex flex-col`}>
                    {/* Header */}
                    {title && (
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Body */}
                    <div className="px-6 py-4 overflow-y-auto flex-1">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>{cancelText}</Button>
                    <Button variant={variant} onClick={onConfirm}>{confirmText}</Button>
                </>
            }
        >
            <p className="text-gray-600 dark:text-gray-300">{message}</p>
        </Modal>
    );
}
