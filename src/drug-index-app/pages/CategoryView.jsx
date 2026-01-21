import { ArrowLeft, Pill, ChevronRight } from "lucide-react"
import DrugModal from "../components/DrugModal"

export default function CategoryView({
    category,
    drugs,
    onBack,
    onSelectDrug,
    selectedDrug,
    onCloseDrug,
    onOpenCalculator
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
            <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="group flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{category}</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{drugs.length} drugs found</p>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {drugs.map((d, i) => (
                        <button
                            key={`${d.name}-${d.active_ingredient}`}
                            onClick={() => onSelectDrug(d)}
                            className="group flex flex-col items-start rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 text-left shadow-sm transition-all hover:border-teal-500/50 hover:shadow-md hover:ring-1 hover:ring-teal-500/50"
                            style={{ animationDelay: `${i * 30}ms` }}
                        >
                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 dark:bg-slate-700 text-teal-600 dark:text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                <Pill className="h-5 w-5" />
                            </div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors capitalize">{d.name}</div>
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{d.active_ingredient || "Active ingredient not listed"}</div>

                            <div className="mt-4 flex w-full items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3">
                                <div className="flex flex-wrap gap-1">
                                    {d.species?.slice(0, 2).map(s => (
                                        <span key={s} className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/10">{s}</span>
                                    ))}
                                    {d.species && d.species.length > 2 && (
                                        <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/10">+{d.species.length - 2}</span>
                                    )}
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 transition-colors" />
                            </div>
                        </button>
                    ))}
                </div>
            </main>
            <DrugModal drug={selectedDrug} onClose={onCloseDrug} onOpenCalculator={onOpenCalculator} />
        </div>
    )
}
