import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Clipboard, Wrench, Folder, FileText, FileBarChart, FileSpreadsheet, File } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import PremiumCard from '../ui/PremiumCard';

const MOCK_COMPANY_CONTEXT = 'A leading automotive manufacturer planning to enter the EV market';
const MOCK_PROBLEM_STATEMENT = 'How should the company approach market entry and what are the key risks?';
const MOCK_KEY_INFO = [
  'Market size: $50B (2025 projection)',
  'Financial constraint: $1B max investment',
  'Timeline: Launch within 18 months',
  'EV adoption rate: 12% CAGR',
];
const RECENT_FRAMEWORKS = [
  { name: 'SWOT Analysis', template: '<b>SWOT Analysis</b>\n- Strengths:\n- Weaknesses:\n- Opportunities:\n- Threats:' },
  { name: "Porter's Five Forces", template: "<b>Porter's Five Forces</b>\n- Threat of New Entrants:\n- Bargaining Power of Buyers:\n- Bargaining Power of Suppliers:\n- Threat of Substitutes:\n- Industry Rivalry:" },
];
const RECOMMENDED_FRAMEWORKS = [
  { name: 'PESTEL Analysis', template: '<b>PESTEL Analysis</b>\n- Political:\n- Economic:\n- Social:\n- Technological:\n- Environmental:\n- Legal:' },
  { name: 'Value Chain Analysis', template: '<b>Value Chain Analysis</b>\n- Inbound Logistics:\n- Operations:\n- Outbound Logistics:\n- Marketing & Sales:\n- Service:' },
  { name: 'Market Entry Strategy', template: '<b>Market Entry Strategy</b>\n- Market Attractiveness:\n- Entry Barriers:\n- Go-to-Market Plan:' },
  { name: 'Competitive Matrix', template: '<b>Competitive Matrix</b>\n- Competitor 1:\n- Competitor 2:\n- Key Differentiators:' },
];
const SUPPORTING_DOCS = [
  { name: 'Market Data Sheet', icon: <FileBarChart className="w-4 h-4 text-emerald-400" /> },
  { name: 'Financial Projections', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> },
  { name: 'Competitor Analysis', icon: <FileText className="w-4 h-4 text-emerald-400" /> },
];

const MIN_WIDTH = 280; // px
const MAX_WIDTH = 600; // px
const DEFAULT_WIDTH = 380; // px

interface CaseContextPanelProps {
  onQuickInsert: (template: string) => void;
}

const CaseContextPanel: React.FC<CaseContextPanelProps> = ({ onQuickInsert }) => {
  const [width, setWidth] = useState(() => {
    const stored = localStorage.getItem('casePanelWidth');
    return stored ? Number(stored) : DEFAULT_WIDTH;
  });
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState({
    frameworks: true,
    docs: true,
  });
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle drag to resize
  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e: MouseEvent) => {
      let newWidth = e.clientX - (panelRef.current?.getBoundingClientRect().left || 0);
      newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
      setWidth(newWidth);
      localStorage.setItem('casePanelWidth', String(newWidth));
    };
    const onMouseUp = () => setDragging(false);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  // Responsive: overlay on small screens
  const [isOverlay, setIsOverlay] = useState(false);
  useEffect(() => {
    const check = () => setIsOverlay(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div
      ref={panelRef}
      className={`z-30 bg-dark-800 border-r border-dark-700 shadow-xl flex flex-col sticky top-0 h-[100vh] transition-all duration-300 ${isOverlay ? 'fixed left-0 top-0 h-full w-[80vw] max-w-[90vw] rounded-r-2xl' : ''}`}
      style={{ width: isOverlay ? undefined : width, minWidth: MIN_WIDTH, maxWidth: MAX_WIDTH }}
    >
      {/* Drag handle */}
      {!isOverlay && (
        <div
          className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-40"
          onMouseDown={() => setDragging(true)}
        />
      )}
      <div className="overflow-y-auto h-full space-y-8 scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-dark-900 p-4" style={{ scrollbarColor: '#374151 #18181b', scrollbarWidth: 'thin' }}>
        {/* 1. Case Context */}
        <PremiumCard className="mb-2">
          <div className="flex items-center gap-2 mb-2">
            <Clipboard className="w-5 h-5 text-emerald-400" />
            <span className="text-lg font-bold text-dark-50">Case Overview</span>
          </div>
          <div className="mb-2">
            <span className="text-xs text-dark-400 uppercase tracking-wider">Company Context</span>
            <div className="text-dark-200 text-sm mt-1">{MOCK_COMPANY_CONTEXT}</div>
          </div>
          <div className="mb-2">
            <span className="text-xs text-dark-400 uppercase tracking-wider">Problem Statement</span>
            <div className="text-dark-200 text-sm mt-1">{MOCK_PROBLEM_STATEMENT}</div>
          </div>
          <div>
            <span className="text-xs text-dark-400 uppercase tracking-wider">Key Information</span>
            <ul className="mt-1 space-y-1 text-dark-300 text-sm list-disc list-inside">
              {MOCK_KEY_INFO.map((info, i) => (
                <li key={i}>{info}</li>
              ))}
            </ul>
          </div>
        </PremiumCard>
        {/* 2. Frameworks Section */}
        <PremiumCard className="mb-2">
          <div className="flex items-center gap-2 mb-2 cursor-pointer select-none" onClick={() => setExpanded(e => ({ ...e, frameworks: !e.frameworks }))}>
            <Wrench className="w-5 h-5 text-emerald-400" />
            <span className="text-lg font-bold text-dark-50">Business Frameworks</span>
            <span className="ml-auto">
              {expanded.frameworks ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
          </div>
          <div className={`transition-all duration-300 overflow-hidden ${expanded.frameworks ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="mb-2">
              <span className="text-xs text-emerald-400 font-semibold">Recently Used</span>
              <ul className="mt-1 space-y-1">
                {RECENT_FRAMEWORKS.map(fw => (
                  <li key={fw.name} className="flex items-center group">
                    <span className="text-dark-300 mr-2">{fw.name}</span>
                    <PremiumButton
                      variant="secondary"
                      className="ml-auto px-2 py-0.5 text-xs"
                      onClick={() => onQuickInsert(fw.template)}
                    >
                      + Quick Insert
                    </PremiumButton>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
              <span className="text-xs text-emerald-400 font-semibold">Recommended</span>
              <ul className="mt-1 space-y-1">
                {RECOMMENDED_FRAMEWORKS.map(fw => (
                  <li key={fw.name} className="flex items-center group">
                    <span className="text-dark-300 mr-2">{fw.name}</span>
                    <PremiumButton
                      variant="secondary"
                      className="ml-auto px-2 py-0.5 text-xs"
                      onClick={() => onQuickInsert(fw.template)}
                    >
                      + Quick Insert
                    </PremiumButton>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PremiumCard>
        {/* 3. Supporting Documents Section */}
        <PremiumCard>
          <div className="flex items-center gap-2 mb-2 cursor-pointer select-none" onClick={() => setExpanded(e => ({ ...e, docs: !e.docs }))}>
            <Folder className="w-5 h-5 text-emerald-400" />
            <span className="text-lg font-bold text-dark-50">Case Materials</span>
            <span className="ml-auto">
              {expanded.docs ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
          </div>
          <div className={`transition-all duration-300 overflow-hidden ${expanded.docs ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <ul className="space-y-2 mt-1">
              {SUPPORTING_DOCS.map(doc => (
                <li key={doc.name} className="flex items-center gap-2 text-dark-300 hover:text-emerald-400 cursor-pointer">
                  {doc.icon}
                  <span>{doc.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
};

export default CaseContextPanel; 