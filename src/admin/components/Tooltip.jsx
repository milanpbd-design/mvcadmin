export default function Tooltip({ children, text, position = 'top' }) {
    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrows = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-l-transparent border-r-transparent border-b-transparent',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-l-transparent border-r-transparent border-t-transparent',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-t-transparent border-b-transparent border-r-transparent',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-t-transparent border-b-transparent border-l-transparent',
    };

    return (
        <div className="relative inline-block group">
            {children}
            <div className={`
        absolute ${positions[position]} z-50
        invisible opacity-0 group-hover:visible group-hover:opacity-100
        transition-all duration-200 pointer-events-none
      `}>
                <div className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                    {text}
                </div>
                <div className={`absolute w-0 h-0 border-4 ${arrows[position]}`} />
            </div>
        </div>
    );
}
