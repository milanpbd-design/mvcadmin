import { useMemo, useState } from "react"
import { useSiteData } from "../context/SiteDataContext"
import Header from "../components/Header"
import FooterSection from "../components/FooterSection"
import Dashboard from "./pages/Dashboard"
import CategoryView from "./pages/CategoryView"
import CalculatorView from "./pages/CalculatorView"
import FormularyView from "./pages/FormularyView"
import ProtocolsView from "./pages/ProtocolsView"
import data from "./data/drugs_data.json"

export default function App() {
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedDrug, setSelectedDrug] = useState(null)
    const [showCalculator, setShowCalculator] = useState(false)
    const [showFormulary, setShowFormulary] = useState(false)
    const [showProtocols, setShowProtocols] = useState(false)

    const { siteData } = useSiteData() || {}
    const categories = useMemo(() => data, [])

    let content

    if (showCalculator) {
        content = <CalculatorView onBack={() => setShowCalculator(false)} />
    } else if (showFormulary) {
        content = <FormularyView onBack={() => setShowFormulary(false)} />
    } else if (showProtocols) {
        content = <ProtocolsView onBack={() => setShowProtocols(false)} />
    } else if (selectedCategory) {
        const cat = categories.find(c => c.category === selectedCategory)
        content = (
            <CategoryView
                category={selectedCategory}
                drugs={cat?.drugs ?? []}
                onBack={() => setSelectedCategory(null)}
                onSelectDrug={setSelectedDrug}
                selectedDrug={selectedDrug}
                onCloseDrug={() => setSelectedDrug(null)}
                onOpenCalculator={() => setShowCalculator(true)}
            />
        )
    } else {
        content = (
            <Dashboard
                categories={categories}
                onSelectCategory={setSelectedCategory}
                onSelectDrug={setSelectedDrug}
                selectedDrug={selectedDrug}
                onCloseDrug={() => setSelectedDrug(null)}
                onOpenCalculator={() => setShowCalculator(true)}
                onOpenFormulary={() => setShowFormulary(true)}
                onOpenProtocols={() => setShowProtocols(true)}
            />
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
            <Header siteName={siteData?.site?.name} navigation={siteData?.navigation} />
            <div className="flex-1">
                {content}
            </div>
            <FooterSection siteName={siteData?.site?.name} footer={siteData?.footer} />
        </div>
    )
}
