import { Search } from "lucide-react"

export default function SearchBar({ value, onChange, placeholder, className = "" }) {
    return (
        <div className={`group flex items-center gap-3 rounded-2xl border border-clinical-gray dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 shadow-sm transition-all focus-within:border-clinical-blue focus-within:ring-4 focus-within:ring-clinical-blue/10 ${className}`}>
            <Search className="h-5 w-5 text-clinical-slate dark:text-slate-400 group-focus-within:text-clinical-blue transition-colors" />
            <input
                className="w-full bg-transparent text-base outline-none placeholder:text-clinical-slate/50 dark:placeholder:text-slate-500 text-clinical-navy dark:text-white"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder ?? "Search..."}
            />
        </div>
    )
}
