import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { CaseStoreProvider } from './contexts/CaseStore';
import { ThemeProvider } from './contexts/ThemeContext';
import { Dashboard } from './pages/Dashboard';
import { QuotesPage } from './pages/QuotesPage';
import { NewQuotePage } from './pages/NewQuotePage';
import { WorkspacePage } from './pages/WorkspacePage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { OverviewTab } from './pages/workspace/OverviewTab';
import { PricingTab } from './pages/workspace/PricingTab';
import { CensusTab } from './pages/workspace/CensusTab';
import { ConfigTab } from './pages/workspace/ConfigTab';
import { IllustrationTab } from './pages/workspace/IllustrationTab';
import { RoundsTab } from './pages/workspace/RoundsTab';
import { HistoryTab } from './pages/workspace/HistoryTab';
import { EvidenceTab } from './pages/workspace/EvidenceTab';

export function App(): JSX.Element {
  return (
    <ThemeProvider>
      <CaseStoreProvider>
        <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="/quotes" element={<QuotesPage />} />
            <Route path="/quotes/new" element={<NewQuotePage />} />
            <Route path="/quotes/:caseId" element={<WorkspacePage />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<OverviewTab />} />
              <Route path="pricing" element={<PricingTab />} />
              <Route path="census" element={<CensusTab />} />
              <Route path="config" element={<ConfigTab />} />
              <Route path="illustration" element={<IllustrationTab />} />
              <Route path="rounds" element={<RoundsTab />} />
              <Route path="history" element={<HistoryTab />} />
              <Route path="evidence" element={<EvidenceTab />} />
            </Route>

            <Route
              path="/analytics"
              element={
              <PlaceholderPage
                title="Analytics"
                subtitle="Portfolio-level pricing analytics."
                panels={['Pricing Trends', 'MVP Distribution', 'Round Activity']} />

              } />
            
            <Route
              path="/case-compare"
              element={
              <PlaceholderPage
                title="Case Compare"
                subtitle="Compare cases side by side."
                panels={['Case Selection', 'Input Differences', 'Result Differences']} />

              } />
            
            <Route
              path="/brd-references"
              element={
              <PlaceholderPage
                title="BRD References"
                subtitle="Business requirement references for the pricing engine."
                panels={['Reference Index', 'Sections', 'Change Log']} />

              } />
            
            <Route
              path="/sheet-configuration"
              element={
              <PlaceholderPage
                title="Sheet Configuration"
                subtitle="Engine workbook and sheet mappings."
                panels={['Sheet Map', 'Named Ranges', 'Validation']} />

              } />
            
            <Route
              path="/ai-insights"
              element={
              <PlaceholderPage
                title="AI Insights"
                subtitle="Model-assisted observations across your cases."
                panels={['Suggested Reviews', 'Anomalies', 'Saved Insights']} />

              } />
            
            <Route
              path="/actuarial-admin"
              element={
              <PlaceholderPage
                title="Actuarial Admin"
                subtitle="Governance thresholds, gold standards, and user roles."
                panels={['Governance Thresholds', 'Gold Standards', 'Roles']} />

              } />
            
            <Route
              path="/engine-health"
              element={
              <PlaceholderPage
                title="Engine Health"
                subtitle="Pricing engine status and run diagnostics."
                panels={['Engine Status', 'Recent Runs', 'Diagnostics']} />

              } />
            
            <Route
              path="/user-guide"
              element={
              <PlaceholderPage
                title="User Guide"
                subtitle="How to price, review, and submit a case."
                panels={['Getting Started', 'Pricing a Case', 'Submitting Evidence']} />

              } />
            
            <Route
              path="/welcome-tour"
              element={
              <PlaceholderPage
                title="Restart Welcome Tour"
                subtitle="Replay the guided introduction to the Pricing Portal."
                panels={['Tour Steps', 'Progress', 'Preferences']} />

              } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </CaseStoreProvider>
    </ThemeProvider>);

}