import { createContext, useContext, useEffect, useState } from "react";
import defaultData from "../data";
import { apiGetSite } from "../utils/api";

const SiteDataContext = createContext();

export function SiteDataProvider({ children }) {
  const [siteData, setSiteData] = useState(() => {
    const stored = localStorage.getItem("vetCornerData");
    return stored ? JSON.parse(stored) : defaultData;
  });
  useEffect(() => {
    localStorage.setItem("vetCornerData", JSON.stringify(siteData));
  }, [siteData]);
  useEffect(() => {
    let active = true;
    apiGetSite().then(d => {
      if (!active) return;
      if (d && Object.keys(d).length) {
        setSiteData(s => ({ ...s, ...d }));
      }
    });
    return () => { active = false };
  }, []);
  return (
    <SiteDataContext.Provider value={{ siteData, setSiteData }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
