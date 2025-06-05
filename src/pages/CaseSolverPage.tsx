import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProblemById } from '../data/mockData';
import SolutionSubmissionForm from '../components/solutions/SolutionSubmissionForm';
import { Clock, Lightbulb, HelpCircle } from 'lucide-react';
import CaseContextPanel from '../components/solutions/CaseContextPanel';
import Sidebar from '../components/Sidebar';
import PremiumCard from '../components/ui/PremiumCard';

const CaseSolverPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const problem = id ? getProblemById(id) : null;
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showFrameworks, setShowFrameworks] = useState(true);
  const [recentFrameworks] = useState([
    "SWOT Analysis",
    "Porter's Five Forces",
  ]);
  const [recommendedFrameworks] = useState([
    "PESTEL Analysis",
    "Value Chain Analysis",
  ]);
  // Framework templates (mock)
  const frameworkTemplates: { [key: string]: string } = {
    "SWOT Analysis": '<b>SWOT Analysis</b>\n- Strengths:\n- Weaknesses:\n- Opportunities:\n- Threats:',
    "Porter's Five Forces": "<b>Porter's Five Forces</b>\n- Threat of New Entrants:\n- Bargaining Power of Buyers:\n- Bargaining Power of Suppliers:\n- Threat of Substitutes:\n- Industry Rivalry:",
    "PESTEL Analysis": '<b>PESTEL Analysis</b>\n- Political:\n- Economic:\n- Social:\n- Technological:\n- Environmental:\n- Legal:',
    "Value Chain Analysis": '<b>Value Chain Analysis</b>\n- Inbound Logistics:\n- Operations:\n- Outbound Logistics:\n- Marketing & Sales:\n- Service:',
  };
  // Ref to pass insert function to child
  const rteInsertRef = useRef<(template: string) => void>();

  useEffect(() => {
    if (problem) {
      document.title = `Solve: ${problem.title} - CaseForge`;
    }
  }, [problem]);

  if (!problem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark-50 mb-2">Problem Not Found</h1>
          <button
            onClick={() => navigate('/problems')}
            className="px-4 py-2 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-400 mt-4"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row min-h-screen bg-dark-900 font-sans">
      {/* ReactBits Sidebar with CaseContextPanel as content */}
      <Sidebar className="bg-dark-800 border-r border-dark-700 sticky top-0 h-screen z-30" style={{ minWidth: 320, maxWidth: 520 }}>
        <CaseContextPanel
          onQuickInsert={template => {
            if (rteInsertRef.current) rteInsertRef.current(template);
          }}
        />
      </Sidebar>
      {/* Main Answer Workspace */}
      <main className="flex-1 flex flex-col items-center justify-start bg-dark-900 p-6 min-h-screen">
        <div className="w-full max-w-3xl">
          <PremiumCard className="mb-8 shadow-xl">
            <SolutionSubmissionForm
              problemId={problem.id}
              timeLimit={problem.timeLimit}
              questions={problem.questions}
              refInsert={rteInsertRef}
              onSubmit={() => navigate(`/problem/${problem.id}`)}
              onCancel={() => navigate(`/problem/${problem.id}`)}
            />
          </PremiumCard>
        </div>
      </main>
    </div>
  );
};

export default CaseSolverPage; 