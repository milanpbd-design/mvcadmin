import { useState } from "react"
import { ArrowLeft, Calculator, Syringe, Scale, FlaskConical, Pill } from "lucide-react"

export default function CalculatorView({ onBack }) {
    const [activeTab, setActiveTab] = useState("basic")

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
            <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="group flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-teal-500 hover:text-teal-600 transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Dose Calculator</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Accurate dosage calculations</p>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Tab Switcher */}
                <div className="mb-8 flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
                    <button
                        onClick={() => setActiveTab("basic")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === "basic" ? "bg-white dark:bg-slate-600 text-teal-700 dark:text-teal-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700"}`}
                    >
                        <Calculator className="w-4 h-4" />
                        Basic Dose
                    </button>
                    <button
                        onClick={() => setActiveTab("liquid")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === "liquid" ? "bg-white dark:bg-slate-600 text-teal-700 dark:text-teal-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700"}`}
                    >
                        <Syringe className="w-4 h-4" />
                        Liquid/Injectable
                    </button>
                </div>

                {activeTab === "basic" ? <BasicCalculator /> : <LiquidCalculator />}

            </main>
        </div>
    )
}

function BasicCalculator() {
    const [weight, setWeight] = useState("")
    const [weightUnit, setWeightUnit] = useState("kg")
    const [dosage, setDosage] = useState("")
    const [tabletStrength, setTabletStrength] = useState("")

    const calculate = () => {
        const w = parseFloat(weight)
        const d = parseFloat(dosage)
        const strength = parseFloat(tabletStrength)

        if (isNaN(w) || isNaN(d)) return null

        const weightInKg = weightUnit === "lb" ? w / 2.20462 : w
        const totalDose = weightInKg * d

        let tablets = null
        if (!isNaN(strength) && strength > 0) {
            tablets = totalDose / strength
        }

        return {
            total: totalDose,
            weightKg: weightInKg,
            tablets
        }
    }

    const result = calculate()

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 space-y-6">

                {/* Weight Input */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Patient Weight</label>
                    <div className="flex rounded-xl shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus-within:ring-2 focus-within:ring-inset focus-within:ring-teal-500">
                        <input
                            type="number"
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                            className="block flex-1 border-0 bg-transparent py-3 pl-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-lg font-medium"
                            placeholder="0.0"
                        />
                        <div className="flex bg-slate-50 dark:bg-slate-700 border-l border-slate-200 dark:border-slate-600 rounded-r-xl">
                            <button
                                onClick={() => setWeightUnit("kg")}
                                className={`px-4 text-sm font-bold transition-colors ${weightUnit === "kg" ? "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-slate-600" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600"}`}
                            >
                                kg
                            </button>
                            <button
                                onClick={() => setWeightUnit("lb")}
                                className={`px-4 text-sm font-bold transition-colors rounded-r-xl ${weightUnit === "lb" ? "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-slate-600" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600"}`}
                            >
                                lb
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Dosage Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Target Dosage</label>
                        <div className="relative rounded-xl shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-teal-500">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Scale className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="number"
                                value={dosage}
                                onChange={e => setDosage(e.target.value)}
                                className="block w-full border-0 bg-transparent py-3 pl-10 pr-12 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-lg font-medium"
                                placeholder="0.0"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-slate-500 sm:text-sm font-medium">mg/kg</span>
                            </div>
                        </div>
                    </div>

                    {/* Tablet Strength Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tablet/Bolus Strength <span className="text-slate-400 font-normal">(Optional)</span></label>
                        <div className="relative rounded-xl shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus-within:ring-2 focus-within:ring-inset focus-within:ring-teal-500">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Pill className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="number"
                                value={tabletStrength}
                                onChange={e => setTabletStrength(e.target.value)}
                                className="block w-full border-0 bg-transparent py-3 pl-10 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-lg font-medium"
                                placeholder="0.0"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-slate-500 sm:text-sm font-medium">mg</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Result Section */}
            <div className="bg-teal-50/50 dark:bg-teal-900/10 border-t border-teal-100 dark:border-teal-900/30 p-6">
                {result ? (
                    <div className="space-y-6 animate-in slide-in-from-bottom-2">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-sm font-medium text-teal-800 dark:text-teal-300">Total Dose Required</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-teal-700 dark:text-teal-400">{result.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                    <span className="text-lg font-semibold text-teal-600 dark:text-teal-500">mg</span>
                                </div>
                                {weightUnit === "lb" && (
                                    <div className="text-xs text-teal-600/70 mt-1">
                                        (Based on {result.weightKg.toFixed(2)} kg body weight)
                                    </div>
                                )}
                            </div>
                        </div>

                        {result.tablets !== null && (
                            <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 border border-teal-100 dark:border-slate-600">
                                <div className="text-sm font-medium text-teal-800 dark:text-teal-300 mb-1">Tablets/Bolus to Administer</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-teal-700 dark:text-teal-400">{result.tablets.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                    <span className="text-base font-medium text-teal-600 dark:text-teal-500">tablets</span>
                                </div>
                                <div className="text-xs text-teal-600/70 mt-1">
                                    ({result.tablets.toFixed(1)} tablets of {parseFloat(tabletStrength)} mg)
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-4 text-slate-400 text-sm">
                        Enter weight and dosage to calculate
                    </div>
                )}
            </div>
        </div>
    )
}

function LiquidCalculator() {
    const [weight, setWeight] = useState("")
    const [weightUnit, setWeightUnit] = useState("kg")
    const [dosage, setDosage] = useState("")
    const [concentration, setConcentration] = useState("")

    const calculate = () => {
        const w = parseFloat(weight)
        const d = parseFloat(dosage)
        const c = parseFloat(concentration)

        if (isNaN(w) || isNaN(d) || isNaN(c) || c === 0) return null

        const weightInKg = weightUnit === "lb" ? w / 2.20462 : w
        const totalDoseMg = weightInKg * d
        const volumeMl = totalDoseMg / c

        return {
            totalMg: totalDoseMg,
            volume: volumeMl,
            weightKg: weightInKg
        }
    }

    const result = calculate()

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 space-y-6">

                {/* Weight Input */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Patient Weight</label>
                    <div className="flex rounded-xl shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus-within:ring-2 focus-within:ring-inset focus-within:ring-teal-500">
                        <input
                            type="number"
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                            className="block flex-1 border-0 bg-transparent py-3 pl-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-lg font-medium"
                            placeholder="0.0"
                        />
                        <div className="flex bg-slate-50 dark:bg-slate-700 border-l border-slate-200 dark:border-slate-600 rounded-r-xl">
                            <button
                                onClick={() => setWeightUnit("kg")}
                                className={`px-4 text-sm font-bold transition-colors ${weightUnit === "kg" ? "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-slate-600" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600"}`}
                            >
                                kg
                            </button>
                            <button
                                onClick={() => setWeightUnit("lb")}
                                className={`px-4 text-sm font-bold transition-colors rounded-r-xl ${weightUnit === "lb" ? "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-slate-600" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600"}`}
                            >
                                lb
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Dosage Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Target Dosage</label>
                        <div className="relative rounded-xl shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-teal-500">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Scale className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="number"
                                value={dosage}
                                onChange={e => setDosage(e.target.value)}
                                className="block w-full border-0 bg-transparent py-3 pl-10 pr-12 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-lg font-medium"
                                placeholder="0.0"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-slate-500 sm:text-sm font-medium">mg/kg</span>
                            </div>
                        </div>
                    </div>

                    {/* Concentration Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Concentration</label>
                        <div className="relative rounded-xl shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus-within:ring-2 focus-within:ring-inset focus-within:ring-teal-500">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <FlaskConical className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="number"
                                value={concentration}
                                onChange={e => setConcentration(e.target.value)}
                                className="block w-full border-0 bg-transparent py-3 pl-10 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-lg font-medium"
                                placeholder="0.0"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-slate-500 sm:text-sm font-medium">mg/ml</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Result Section */}
            <div className="bg-teal-50/50 dark:bg-teal-900/10 border-t border-teal-100 dark:border-teal-900/30 p-6">
                {result ? (
                    <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-2">
                        <div>
                            <div className="text-sm font-medium text-teal-800 dark:text-teal-300">Volume to Administer</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-teal-700 dark:text-teal-400">{result.volume.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                <span className="text-lg font-semibold text-teal-600 dark:text-teal-500">ml</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-teal-800 dark:text-teal-300">Total Dose</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-teal-700/80 dark:text-teal-400/80">{result.totalMg.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                                <span className="text-sm font-semibold text-teal-600/80 dark:text-teal-500/80">mg</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-slate-400 text-sm">
                        Enter all fields to calculate
                    </div>
                )}
            </div>
        </div>
    )
}
