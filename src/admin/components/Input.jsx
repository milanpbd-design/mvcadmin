export default function Input({
    label,
    value,
    onChange,
    type = 'text',
    placeholder = '',
    required = false,
    disabled = false,
    error = '',
    helpText = '',
    icon,
    className = '',
    ...props
}) {
    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">{icon}</span>
                    </div>
                )}

                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
            w-full px-3 py-2 border rounded-lg transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                        }
            ${disabled
                            ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
                            : 'bg-white dark:bg-gray-700'
                        }
            text-gray-900 dark:text-white
            focus:ring-2 focus:outline-none
            placeholder:text-gray-400 dark:placeholder:text-gray-500
          `}
                    {...props}
                />
            </div>

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </p>
            )}

            {helpText && !error && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
            )}
        </div>
    );
}

export function TextArea({
    label,
    value,
    onChange,
    placeholder = '',
    required = false,
    disabled = false,
    error = '',
    helpText = '',
    rows = 3,
    className = '',
    ...props
}) {
    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                className={`
          w-full px-3 py-2 border rounded-lg transition-all duration-200
          ${error
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    }
          ${disabled
                        ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
                        : 'bg-white dark:bg-gray-700'
                    }
          text-gray-900 dark:text-white
          focus:ring-2 focus:outline-none
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          resize-none
        `}
                {...props}
            />

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </p>
            )}

            {helpText && !error && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
            )}
        </div>
    );
}

export function Select({
    label,
    value,
    onChange,
    options = [],
    required = false,
    disabled = false,
    error = '',
    helpText = '',
    className = '',
    ...props
}) {
    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`
          w-full px-3 py-2 border rounded-lg transition-all duration-200
          ${error
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    }
          ${disabled
                        ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
                        : 'bg-white dark:bg-gray-700'
                    }
          text-gray-900 dark:text-white
          focus:ring-2 focus:outline-none
        `}
                {...props}
            >
                {options.map((option, i) => (
                    <option key={i} value={option.value ?? option}>
                        {option.label ?? option}
                    </option>
                ))}
            </select>

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </p>
            )}

            {helpText && !error && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
            )}
        </div>
    );
}
