
import React, { useState, useEffect, useCallback } from 'react';
import { ROADMAP_DATA } from './constants';
import { Phase, Milestone } from './types';
import PhaseCard from './components/PhaseCard';
import AIChat from './components/AIChat';
import LoginPage from './components/LoginPage';

const SESSION_LIMIT_MS = 4 * 60 * 60 * 1000; // 4 hours

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-zinc-900 border border-blue-500/50 text-blue-100 text-[10px] px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap max-w-xs mono">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-900"></div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(localStorage.getItem('session_user'));
  const [activePhaseId, setActivePhaseId] = useState<number>(1);
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set());
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(SESSION_LIMIT_MS);

  const handleLogout = useCallback((reason?: string) => {
    if (reason === 'LOCKOUT') {
      localStorage.setItem('lockout_date', new Date().toDateString());
    }
    localStorage.removeItem('session_user');
    localStorage.removeItem('session_start');
    setUser(null);
  }, []);

  // Check Session Expiry
  useEffect(() => {
    if (!user) return;

    const start = parseInt(localStorage.getItem('session_start') || '0');
    if (!start) {
      handleLogout();
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = SESSION_LIMIT_MS - elapsed;
      
      if (remaining <= 0) {
        clearInterval(interval);
        handleLogout('LOCKOUT');
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user, handleLogout]);

  if (!user) {
    return <LoginPage onLogin={(username) => {
      localStorage.setItem('session_user', username);
      localStorage.setItem('session_start', Date.now().toString());
      setUser(username);
    }} />;
  }

  const activePhase = ROADMAP_DATA.find(p => p.id === activePhaseId) || ROADMAP_DATA[0];

  const toggleMilestone = (id: string, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.milestone-check')) {
      setCompletedMilestones(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else {
      setExpandedMilestone(expandedMilestone === id ? null : id);
    }
  };

  const calculateProgress = (phase: Phase) => {
    const total = phase.milestones.length;
    const completed = phase.milestones.filter(m => completedMilestones.has(m.id)).length;
    return Math.round((completed / total) * 100);
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resourceGroups = [
    {
      title: "News Outlets",
      icon: "📰",
      links: [
        { name: "The Hacker News", url: "https://thehackernews.com/" },
        { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/" },
        { name: "Threatpost", url: "https://threatpost.com/" }
      ]
    },
    {
      title: "Expert Blogs",
      icon: "✍️",
      links: [
        { name: "Krebs on Security", url: "https://krebsonsecurity.com/" },
        { name: "Dark Reading", url: "https://www.darkreading.com/" },
        { name: "Schneier on Security", url: "https://www.schneier.com/" }
      ]
    },
    {
      title: "Communities",
      icon: "🤝",
      links: [
        { name: "r/cybersecurity", url: "https://www.reddit.com/r/cybersecurity/" },
        { name: "Hack The Box Forums", url: "https://forum.hackthebox.com/" },
        { name: "Wilders Security", url: "https://www.wilderssecurity.com/" }
      ]
    }
  ];

  return (
    <div className="min-h-screen pb-20 animate-in fade-in duration-1000">
      {/* Header Section */}
      <header className="py-12 px-6 border-b border-zinc-800 bg-gradient-to-b from-blue-900/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Tooltip text="Initial rank for new security trainees.">
                  <span className="bg-blue-600 text-xs font-bold px-2 py-0.5 rounded text-white mono uppercase cursor-help">Level 0: Recruit</span>
                </Tooltip>
                <span className="text-blue-400 text-xs mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">AGENT: {user.toUpperCase()}</span>
                <Tooltip text="Your local lab subnet address.">
                  <span className="text-zinc-500 text-xs mono cursor-help">IP: 192.168.1.104</span>
                </Tooltip>
                <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-red-400 mono font-bold">SESSION: {formatTime(timeLeft)}</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
                CyberShield <span className="text-blue-500">Roadmap</span>
              </h1>
              <p className="text-zinc-400 max-w-xl text-lg">
                Your tactical path from fundamental networking to professional penetration testing. 90 days of intense growth.
              </p>
            </div>
            <div className="flex gap-4">
              <Tooltip text="Overall mastery across all 3 months.">
                <div className="glass p-4 rounded-xl text-center min-w-[120px] border-b-2 border-b-blue-500 cursor-help">
                  <div className="text-2xl font-bold text-blue-400">{Math.round((completedMilestones.size / 9) * 100)}%</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total Completion</div>
                </div>
              </Tooltip>
              <Tooltip text="Standard training window for core proficiency.">
                <div className="glass p-4 rounded-xl text-center min-w-[120px] border-b-2 border-b-green-500 cursor-help">
                  <div className="text-2xl font-bold text-green-400">90</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Target Days</div>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        {/* Phase Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {ROADMAP_DATA.map((phase) => (
            <PhaseCard 
              key={phase.id} 
              phase={phase} 
              isActive={activePhaseId === phase.id}
              onClick={() => {
                setActivePhaseId(phase.id);
                setExpandedMilestone(null);
                setExpandedTopic(null);
              }}
            />
          ))}
        </div>

        {/* Detailed View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left Column: Topics & Milestones */}
          <div className="lg:col-span-2 space-y-8">
            <section className="glass rounded-2xl p-8 cyber-border">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-blue-500">#</span> Learning Milestones
              </h2>
              <div className="space-y-4">
                {activePhase.milestones.map((milestone) => (
                  <div 
                    key={milestone.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      completedMilestones.has(milestone.id) 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600'
                    }`}
                    onClick={(e) => toggleMilestone(milestone.id, e)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="milestone-check mt-1 w-5 h-5 rounded border flex items-center justify-center transition-all bg-zinc-900 border-zinc-700">
                        {completedMilestones.has(milestone.id) && (
                          <div className="w-full h-full bg-green-500 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className={`font-semibold ${completedMilestones.has(milestone.id) ? 'text-zinc-400 line-through' : 'text-white'}`}>
                            {milestone.title}
                          </h4>
                          {milestone.guide && (
                            <svg className={`w-4 h-4 text-zinc-500 transition-transform ${expandedMilestone === milestone.id ? 'rotate-180 text-blue-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-zinc-400 mt-1">{milestone.description}</p>
                        
                        {/* Expanded Guide */}
                        {expandedMilestone === milestone.id && milestone.guide && (
                          <div className="mt-4 pt-4 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-300">
                            <h5 className="text-xs font-bold text-blue-500 mb-3 tracking-widest uppercase">Tactical Insights</h5>
                            <ul className="space-y-3">
                              {milestone.guide.map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-xs text-zinc-300 leading-relaxed bg-zinc-800/30 p-2 rounded border border-zinc-700/50">
                                  <span className="text-blue-500 font-bold">{idx + 1}.</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activePhase.labs.map((lab, i) => (
                <div key={i} className="glass rounded-2xl p-6 hover:border-blue-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <Tooltip text={lab.tooltip || "Hands-on virtual environment exercise."}>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase cursor-help ${
                        lab.difficulty === 'Easy' ? 'bg-green-600/20 text-green-400' :
                        lab.difficulty === 'Medium' ? 'bg-yellow-600/20 text-yellow-400' : 'bg-red-600/20 text-red-400'
                      }`}>
                        {lab.difficulty} Lab
                      </span>
                    </Tooltip>
                    <div className="flex gap-1">
                      {lab.tools.map(t => <span key={t} className="text-[10px] text-zinc-500 mono">{t}</span>)}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{lab.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">{lab.objective}</p>
                  <Tooltip text="Spin up instance and deploy tools.">
                    <button className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 group/btn">
                      START LAB
                      <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </Tooltip>
                </div>
              ))}
            </section>
          </div>

          {/* Right Column: Month Project & Topics */}
          <div className="space-y-8">
            <section className="bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:scale-175 transition-transform duration-500">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-80">Final Capstone Project</h2>
              <h3 className="text-2xl font-black mb-4 leading-tight">{activePhase.project.title}</h3>
              <p className="text-sm text-blue-100 mb-6 leading-relaxed">
                {activePhase.project.description}
              </p>
              <div className="space-y-2">
                {activePhase.project.deliverables.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium bg-blue-700/50 p-2 rounded">
                    <div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
                    {d}
                  </div>
                ))}
              </div>
            </section>

            <section className="glass rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm border-b border-zinc-800 pb-2">Core Topics</h3>
              <div className="flex flex-col gap-3">
                {activePhase.topics.map((topic, i) => (
                  <div key={i} className="group">
                    <Tooltip text={topic.tooltip || "Click to view curated study materials."}>
                      <button 
                        onClick={() => setExpandedTopic(expandedTopic === topic.name ? null : topic.name)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                          expandedTopic === topic.name 
                            ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                            : 'bg-zinc-800/30 border-zinc-700/50 text-zinc-300 hover:border-zinc-500'
                        }`}
                      >
                        <span className="text-xs font-bold uppercase tracking-tight">{topic.name}</span>
                        <svg className={`w-3.5 h-3.5 transition-transform ${expandedTopic === topic.name ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </Tooltip>
                    {expandedTopic === topic.name && (
                      <div className="mt-2 p-3 bg-zinc-900 rounded-xl border border-zinc-800 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Study Materials</p>
                        <ul className="space-y-2">
                          {topic.resources.map((res, ridx) => (
                            <li key={ridx} className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white cursor-help transition-colors">
                              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                              {res}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="glass rounded-2xl p-6 text-center">
              <p className="text-xs text-zinc-500 mb-2">Current Phase Progress</p>
              <div className="text-4xl font-black text-white mb-4">{calculateProgress(activePhase)}%</div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                  style={{ width: `${calculateProgress(activePhase)}%` }}
                ></div>
              </div>
            </section>
          </div>
        </div>

        {/* Global Intelligence Resources Section */}
        <section className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-zinc-800"></div>
            <h2 className="text-xl font-bold text-white mono uppercase tracking-widest px-4">Cyber Intelligence Hub</h2>
            <div className="h-px flex-1 bg-zinc-800"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resourceGroups.map((group, idx) => (
              <div key={idx} className="glass rounded-2xl p-6 border-b-4 border-b-blue-600/30">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{group.icon}</span>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">{group.title}</h3>
                </div>
                <ul className="space-y-4">
                  {group.links.map((link, lidx) => (
                    <li key={lidx}>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
                      >
                        <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">{link.name}</span>
                        <svg className="w-3 h-3 text-zinc-600 group-hover:text-blue-500 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <AIChat />

      <footer className="mt-20 py-8 border-t border-zinc-800 text-center text-zinc-600 text-xs mono">
        The14Hacker &copy; 2024 CYBERSHIELD SEC // SYSTEM_UPTIME: 99.9% // [FOR EDUCATIONAL PURPOSES ONLY]
      </footer>
    </div>
  );
};

export default App;
