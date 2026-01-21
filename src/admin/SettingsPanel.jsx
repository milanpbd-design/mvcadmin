import { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import Card, { CardHeader, CardBody } from './components/Card';
import Button from './components/Button';
import { useToast } from './components/Toast';

export default function SettingsPanel() {
  const { siteData, setSiteData } = useSiteData() || {};
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('general');

  function updateSite(field, value) {
    setSiteData(d => ({
      ...d,
      site: { ...(d.site || {}), [field]: value }
    }));
  }

  function updateSettings(field, value) {
    setSiteData(d => ({
      ...d,
      settings: { ...(d.settings || {}), [field]: value }
    }));
  }

  function updateIntegrations(field, value) {
    setSiteData(d => ({
      ...d,
      integrations: { ...(d.integrations || {}), [field]: value }
    }));
  }

  function updateSecurity(field, value) {
    setSiteData(d => ({
      ...d,
      security: { ...(d.security || {}), [field]: value }
    }));
  }

  function updatePerformance(field, value) {
    setSiteData(d => ({
      ...d,
      performance: { ...(d.performance || {}), [field]: value }
    }));
  }

  function addNavItem() {
    setSiteData(d => ({
      ...d,
      navigation: [...(d.navigation || []), { label: 'New Menu', dropdown: [] }]
    }));
    toast.success('Menu item added');
  }

  function updateNavItem(i, field, value) {
    setSiteData(d => ({
      ...d,
      navigation: (d.navigation || []).map((item, idx) =>
        idx === i ? { ...item, [field]: value } : item
      )
    }));
  }

  function removeNavItem(i) {
    setSiteData(d => ({
      ...d,
      navigation: (d.navigation || []).filter((_, idx) => idx !== i)
    }));
    toast.success('Menu item removed');
  }

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'navigation', label: 'Navigation', icon: '🧭' },
    { id: 'integrations', label: 'Integrations', icon: '🔌' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'advanced', label: 'Advanced', icon: '⚡' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Site Settings"
          subtitle="Configure your website"
        />
        <CardBody>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* General Tab */}
      {activeTab === 'general' && (
        <Card>
          <CardHeader title="General Information" />
          <CardBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={siteData?.site?.name || ''}
                  onChange={e => updateSite('name', e.target.value)}
                  placeholder="My Vet Corner"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-lg font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={siteData?.site?.tagline || ''}
                  onChange={e => updateSite('tagline', e.target.value)}
                  placeholder="Expert Pet & Poultry Health Resources"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={siteData?.site?.description || ''}
                  onChange={e => updateSite('description', e.target.value)}
                  rows={3}
                  placeholder="Your trusted source for veterinary information..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Admin Password
                </label>
                <input
                  type="text"
                  value={siteData?.adminPassword || ''}
                  onChange={e => setSiteData(d => ({ ...d, adminPassword: e.target.value }))}
                  placeholder="Change admin password"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Update this to secure your admin panel
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Navigation Tab */}
      {activeTab === 'navigation' && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Navigation Menu"
              subtitle="Customize your site's main menu"
              action={<Button size="sm" onClick={addNavItem}>+ Add Item</Button>}
            />
          </Card>

          {(siteData?.navigation || []).map((item, i) => (
            <Card key={i}>
              <CardBody>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">Menu Item {i + 1}</h3>
                  <Button variant="ghost" size="sm" onClick={() => removeNavItem(i)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={item.label || ''}
                    onChange={e => updateNavItem(i, 'label', e.target.value)}
                    placeholder="Menu Label"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 font-medium"
                  />

                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Dropdown Items (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(item.dropdown || []).join(', ')}
                      onChange={e => updateNavItem(i, 'dropdown', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      placeholder="Item 1, Item 2, Item 3"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          <Card>
            <CardHeader title="Analytics & Tracking" />
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={siteData?.integrations?.gaId || ''}
                    onChange={e => updateIntegrations('gaId', e.target.value)}
                    placeholder="UA-XXXXX-Y or G-XXXXXXXXXX"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Facebook Pixel ID
                  </label>
                  <input
                    type="text"
                    value={siteData?.integrations?.fbPixel || ''}
                    onChange={e => updateIntegrations('fbPixel', e.target.value)}
                    placeholder="1234567890"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Custom Scripts" />
            <CardBody>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Script Injection (Advanced)
                </label>
                <textarea
                  value={siteData?.settings?.injectScript || ''}
                  onChange={e => updateSettings('injectScript', e.target.value)}
                  rows={6}
                  placeholder="<script>...</script>"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Scripts will be injected in the page header. Use with caution.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card>
          <CardHeader title="Security Settings" />
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Require 2FA for admin access (Mock)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteData?.security?.twoFARequired || false}
                    onChange={e => updateSecurity('twoFARequired', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-4">
          <Card>
            <CardHeader title="Performance" />
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Lazy Load Images</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Improve page load speed</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={siteData?.performance?.lazyImages ?? true}
                      onChange={e => updatePerformance('lazyImages', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Prefetch Routes</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pre-load pages for faster navigation</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={siteData?.performance?.prefetchRoutes || false}
                      onChange={e => updatePerformance('prefetchRoutes', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Localization" />
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Default Locale
                  </label>
                  <select
                    value={siteData?.defaultLocale || 'en'}
                    onChange={e => setSiteData(d => ({ ...d, defaultLocale: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Active Locales: {(siteData?.locales || ['en']).join(', ')}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
