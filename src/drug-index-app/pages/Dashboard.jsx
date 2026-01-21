import { useMemo, useState } from "react"
import { Search, Sparkles, Pill, ChevronRight, Calculator, Stethoscope, BookOpen, Syringe } from "lucide-react"
import SearchBar from "../components/SearchBar"
import CategoryCard from "../components/CategoryCard"
import DrugModal from "../components/DrugModal"

export default function Dashboard({
    categories,
    onSelectCategory,
    onSelectDrug,
    selectedDrug,
    onCloseDrug,
    onOpenCalculator,
    onOpenFormulary,
    onOpenProtocols
}) {
    const [q, setQ] = useState("")

    const flatDrugs = useMemo(() => {
        return categories.flatMap(c => c.drugs.map(d => ({ ...d, _category: c.category })))
    }, [categories])

    const filteredDrugs = useMemo(() => {
        const t = q.trim().toLowerCase()
        if (!t) return []
        return flatDrugs.filter(d => {
            return (
                d.name.toLowerCase().includes(t) ||
                d._category.toLowerCase().includes(t) ||
                (d.active_ingredient && d.active_ingredient.toLowerCase().includes(t)) ||
                (d.indications && d.indications.toLowerCase().includes(t))
            )
        })
    }, [q, flatDrugs])

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">

            {/* Sub-Header / Tools Bar */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 flex justify-center sm:justify-end gap-3">
                    <button
                        onClick={onOpenFormulary}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                    >
                        <BookOpen className="w-4 h-4" />
                        Formulary
                    </button>
                    <button
                        onClick={onOpenCalculator}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                    >
                        <Calculator className="w-4 h-4" />
                        Calculators
                    </button>
                    <button
                        onClick={onOpenProtocols}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                    >
                        <Stethoscope className="w-4 h-4" />
                        Protocols
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-slate-900 pb-32 pt-16 lg:pt-24">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900/40"></div>
                    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal-500 blur-3xl opacity-10"></div>
                    <div className="absolute top-1/2 -left-24 h-72 w-72 rounded-full bg-blue-600 blur-3xl opacity-10"></div>
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                        Precision Medicine for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Veterinary Professionals</span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                        Instant access to verified drug dosages, interactions, and clinical protocols for canine, feline, equine, and bovine patients.
                    </p>

                    <div className="mx-auto mt-10 max-w-xl">
                        <SearchBar
                            value={q}
                            onChange={setQ}
                            placeholder="Search by drug, indication (e.g. 'pain'), or active ingredient..."
                            className="h-14 text-lg shadow-2xl shadow-teal-900/20 border-0 ring-4 ring-white/10 focus:ring-teal-500/50"
                        />

                        {/* Quick Tags */}
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            <span className="text-xs text-slate-400 font-medium mr-1">Quick Access:</span>
                            {["Antibiotics", "Analgesics", "Anesthesia", "Emergency"].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => {
                                        // Find the category that matches roughly or just search
                                        const cat = categories.find(c => c.category.includes(tag) || (tag === "Emergency" && c.category.includes("Cardio"))); // Heuristic
                                        if (cat) onSelectCategory(cat.category);
                                        else setQ(tag);
                                    }}
                                    className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors border border-white/10"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Strip */}
                <div className="absolute bottom-0 w-full border-t border-white/10 bg-white/5 backdrop-blur-sm py-4">
                    <div className="mx-auto max-w-7xl px-4 flex justify-center gap-8 sm:gap-16 text-slate-300 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{flatDrugs.length}+</span> Formulations
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{categories.length}</span> Therapeutic Classes
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">4+</span> Species
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">

                {q ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Search Results</h2>
                            <span className="text-sm text-slate-500 dark:text-slate-400">{filteredDrugs.length} results found</span>
                        </div>

                        {filteredDrugs.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredDrugs.map(d => (
                                    <button
                                        key={`${d.name}-${d.active_ingredient}`}
                                        onClick={() => onSelectDrug(d)}
                                        className="group flex flex-col items-start rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 text-left shadow-sm transition-all hover:border-teal-500/50 hover:shadow-md hover:ring-1 hover:ring-teal-500/50"
                                    >
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                            <Pill className="h-5 w-5" />
                                        </div>
                                        <div className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors capitalize">{d.name}</div>
                                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{d.active_ingredient || "Active ingredient not listed"}</div>
                                        <div className="mt-4 flex w-full items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3">
                                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{d._category}</span>
                                            <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-12 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-sm">
                                    <Search className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No drugs found</h3>
                                <p className="mt-2 text-slate-500 dark:text-slate-400">We couldn't find any drugs matching "{q}". Try checking for typos or using a broader term.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-12">
                        <section>
                            <div className="mb-8 flex items-end justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Therapeutic Classes</h2>
                                    <p className="mt-1 text-slate-500 dark:text-slate-400">Browse drugs by their pharmacological classification</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {categories.map((c, i) => (
                                    <div key={c.category} className="animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                                        <CategoryCard
                                            title={c.category}
                                            count={c.drugs.length}
                                            onClick={() => onSelectCategory(c.category)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </main>

            <DrugModal drug={selectedDrug} onClose={onCloseDrug} onOpenCalculator={onOpenCalculator} />
        </div>
    )
}
