import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { 
  Shield, Flame, Crown, Trophy, Lock, CheckCircle2, 
  ChevronRight, Upload, BookOpen, Activity, 
  Sparkles, LogOut, AlertCircle, Brain, Zap, Target, Heart
} from 'lucide-react';
import { MalaTracker } from './components/MalaTracker';
import { analyzeJournalEntry } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { UserState, AppScreen, Badge, JournalEntry } from './types';

// --- MOCK DATA ---

const DAILY_QUOTES = [
  "Today I choose strength over weakness.",
  "Veerya (vital energy) is the essence of life. Protect it.",
  "A disciplined mind brings happiness.",
  "He who conquers himself is the mightiest warrior.",
  "Energy flows where attention goes."
];

const GITA_VERSES = [
  { sanskrit: "क्रोधाद्भवति सम्मोह: सम्मोहात्स्मृतिविभ्रम: |", trans: "From anger comes delusion; from delusion, confusion of memory.", ref: "2.63" },
  { sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन |", trans: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.", ref: "2.47" },
  { sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् |", trans: "Elevate yourself through the power of your mind, and not degrade yourself.", ref: "6.5" }
];

const BADGES: Badge[] = [
  { id: 'warrior', name: 'Warrior', icon: 'shield', dayRequired: 7, description: 'Complete 7 days of discipline', color: 'text-amber-700' },
  { id: 'elite', name: 'Elite', icon: 'crown', dayRequired: 37, description: 'Achieve 37 days of mastery', color: 'text-purple-700' },
  { id: 'champion', name: 'Champion', icon: 'flame', dayRequired: 79, description: 'Reach 79 days of transformation', color: 'text-blue-700' },
  { id: 'master', name: 'Master', icon: 'trophy', dayRequired: 108, description: 'Complete the sacred 108-day path', color: 'text-yellow-600' },
];

const MILESTONES = [
  { day: 7, title: "Discipline Warrior", sub: "First Week Champion", desc: "Complete 7 days of unwavering commitment" },
  { day: 37, title: "Energy Master", sub: "Power Unleashed", desc: "Harness 37 days of pure brahmacharya energy" },
  { day: 79, title: "Transformation Guardian", sub: "Diamond Mind", desc: "Witness 79 days of complete metamorphosis" },
  { day: 108, title: "Sacred Completion", sub: "Brahmacharya Master Certificate", desc: "Achieve the ultimate 108-day mastery" },
];

// INDIAN COW IMAGE URL (Verified)
const INDIAN_COW_IMG = "https://images.unsplash.com/photo-1560706249-14a9386a3e0c?q=80&w=200&auto=format&fit=crop"; 
// Alternative: "https://images.unsplash.com/photo-1628147690161-002d2516484e?q=80&w=200&auto=format&fit=crop"

// --- COMPONENTS ---

// 1. SPLASH / LANDING SCREEN (Temple Theme)
const LandingScreen = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between pt-16 pb-12 bg-[#1a0f0d] overflow-hidden text-center px-6 font-serif">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1599577002010-3882f0c76751?q=80&w=1974&auto=format&fit=crop" 
          alt="Sacred Temple" 
          className="w-full h-full object-cover opacity-60"
        />
        {/* Deep Gradient: Earth to Fire */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1810]/70 via-[#4A2C2A]/50 to-[#1a0f0d] opacity-90"></div>
      </div>

      {/* Top Section */}
      <div className="z-10 flex flex-col items-center w-full">
        <div className="w-24 h-24 rounded-full border-2 border-orange-500/30 flex items-center justify-center bg-black/20 backdrop-blur-md shadow-[0_0_30px_rgba(234,88,12,0.3)] mb-8 animate-float">
           <div className="absolute inset-0 rounded-full border border-orange-400 opacity-20 animate-pulse"></div>
           <span className="text-5xl text-orange-100 font-hindi drop-shadow-[0_0_10px_rgba(234,88,12,0.8)]">ॐ</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-amber-100 mb-4 tracking-wide drop-shadow-lg">
          Brahma Path
        </h1>
        
        <div className="flex items-center gap-2 mb-8 opacity-80">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-orange-500"></div>
          <div className="w-2 h-2 rotate-45 bg-orange-500"></div>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-orange-500"></div>
        </div>
        
        <h2 className="text-orange-50 font-semibold text-lg tracking-wide mb-3 px-4 leading-snug drop-shadow-md">
          The Sacred 108-Day Journey to Self-Mastery
        </h2>

        <p className="max-w-xs text-orange-100/70 text-xs leading-relaxed font-light px-4">
          Reclaim your energy (Ojas), strength, and spiritual power through the ancient wisdom of the Vedas.
        </p>

        <div className="mt-12 w-full max-w-xs">
          <button 
            onClick={onStart}
            className="w-full py-4 btn-saffron rounded-lg font-bold tracking-widest text-lg border border-orange-400/20"
          >
            BEGIN YOUR VOW
          </button>
        </div>
      </div>

      {/* Bottom Section Cards */}
      <div className="z-10 w-full max-w-xs flex flex-col gap-3 mt-auto">
        {/* Gau Seva Card - Indian Cow */}
        <div className="bg-[#2C1810]/60 backdrop-blur-md rounded-xl p-3 flex items-center gap-4 text-left border border-orange-500/20 shadow-lg relative overflow-hidden group">
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-amber-600"></div>
           <div className="w-10 h-10 rounded-full bg-stone-800 overflow-hidden flex-shrink-0 border border-orange-200/20 ring-1 ring-orange-500/30">
              <img src={INDIAN_COW_IMG} alt="Indian Desi Cow" className="w-full h-full object-cover" />
           </div>
           <div>
              <h4 className="text-[10px] font-bold text-orange-100 uppercase flex items-center gap-1 tracking-wider">
                <Sparkles size={10} className="text-orange-500"/> Supporting Gau Seva
              </h4>
              <p className="text-[9px] text-orange-200/60 leading-tight mt-0.5">
                Your sacred offering supports the protection of Desi Gau Mata.
              </p>
           </div>
        </div>

        {/* 108 Count Card */}
        <div className="bg-[#2C1810]/50 backdrop-blur-sm pt-4 pb-4 rounded-xl border border-orange-500/10 relative overflow-hidden">
           <div className="relative z-10">
              <div className="text-5xl font-display text-orange-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-tight">108</div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-orange-500 font-bold mt-1">Sacred Days of Transformation</div>
           </div>
           <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// 2. ONBOARDING SCREEN
const OnboardingScreen = ({ onComplete }: { onComplete: (data: any) => void }) => {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState<number | ''>('');
  const [reason, setReason] = useState('');

  const REASONS = [
    { text: "I'm tired of being controlled by my urges", sub: "I want to take back control of my mind and body." },
    { text: "I want to rebuild my discipline and self-respect", sub: "I want to feel proud of myself again." },
    { text: "I want more energy, focus, and clarity", sub: "My mind feels drained and I want to fix it." },
    { text: "I want to break my porn & masturbation addiction", sub: "I'm stuck in a loop and I want to end it." },
    { text: "I want to improve my physical and mental health", sub: "I want better sleep, better mood, better confidence." },
    { text: "I want a spiritual reset and a deeper connection with myself", sub: "I want to follow a path of purity, strength, and the Gita." },
    { text: "I want to transform myself in these 108 days", sub: "I'm ready to become a stronger version of myself." }
  ];

  const handleReasonSelect = (r: string) => {
    setReason(r);
    setTimeout(() => {
        onComplete({ age: Number(age), reason: r });
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 pb-6 px-4 font-serif bg-mandala">
       {/* Progress Pill */}
       <div className="flex gap-2 mb-8">
          <div className={`w-12 h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-brahma-saffron' : 'bg-stone-300'}`}></div>
          <div className={`w-12 h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-brahma-saffron' : 'bg-stone-300'}`}></div>
       </div>

      <div className="w-full max-w-md animate-fade-in flex-1 flex flex-col">
        {step === 1 ? (
          <div className="bg-[#FFFBF7] p-8 rounded-2xl shadow-xl card-tilak">
            <h2 className="text-3xl font-display text-brahma-dark mb-2 text-center">Begin Your Journey</h2>
            <p className="text-stone-500 mb-8 text-center text-sm italic">"The journey of a thousand miles begins with a single step."</p>
            
            <label className="block text-brahma-dark font-bold mb-2">How old are you?</label>
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full bg-[#FFF8F0] border border-orange-200 rounded-lg p-4 text-xl text-center text-brahma-dark focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none mb-6 transition-all"
              placeholder="Your age"
              min={15} max={60}
            />
            <button 
              disabled={!age || age < 15 || age > 80}
              onClick={() => setStep(2)}
              className="w-full py-4 btn-saffron disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold tracking-wide"
            >
              CONTINUE
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-display text-center text-brahma-dark mb-2">Your Sacred Intention</h2>
            <p className="text-stone-500 text-center mb-6">Share your truth, build accountability</p>
            
            <div className="space-y-3 overflow-y-auto pb-6">
              {REASONS.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => handleReasonSelect(r.text)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 bg-[#FFFBF7] shadow-sm hover:shadow-md hover:border-orange-300 ${reason === r.text ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-200' : 'border-transparent'}`}
                >
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border ${reason === r.text ? 'bg-brahma-saffron text-white border-brahma-saffron' : 'bg-stone-100 text-stone-400 border-stone-200'}`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-brahma-dark mb-0.5">{r.text}</div>
                    <div className="text-xs text-stone-500">{r.sub}</div>
                  </div>
                </button>
              ))}
            </div>
            
             <button 
              onClick={() => setStep(1)}
              className="w-full py-3 text-brahma-dark hover:text-brahma-saffron font-bold mt-auto mb-4 uppercase text-xs tracking-widest"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. COMMITMENT SCREEN
const CommitmentScreen = ({ onConfirm }: { onConfirm: () => void }) => {
  return (
    <div className="min-h-screen bg-mandala flex flex-col p-4 items-center overflow-y-auto pt-8 font-serif">
      <div className="w-20 h-20 rounded-full border-2 border-orange-200 flex items-center justify-center bg-white shadow-[0_0_20px_rgba(234,88,12,0.2)] mb-6 animate-pulse-glow">
        <span className="text-4xl text-brahma-saffron font-hindi">ॐ</span>
      </div>
      
      <h2 className="text-3xl font-display text-center text-brahma-dark mb-2">The Sacred Commitment</h2>
      <p className="text-stone-500 text-center mb-8 text-sm italic">108 days that will transform your life forever</p>

      <div className="grid grid-cols-1 gap-4 w-full max-w-md mb-8">
        {[
          { 
            title: "Physical Transformation", 
            hindi: "शारीरिक परिवर्तन", 
            icon: <div className="bg-orange-100 p-3 rounded-full mb-2 text-orange-700"><span className="text-2xl">💪</span></div>, 
            points: ["Increased energy (Ojas) and vitality", "Deep restorative sleep", "Enhanced physical strength", "Radiant skin (Tejas)"]
          },
          { 
            title: "Mental Clarity", 
            hindi: "मानसिक स्पष्टता", 
             icon: <div className="bg-amber-100 p-3 rounded-full mb-2 text-amber-700"><span className="text-2xl">🧠</span></div>,
            points: ["Sharp focus (Ekagrata)", "Improved memory", "Reduced anxiety and brain fog", "Decisive willpower"]
          },
          { 
            title: "Spiritual Growth", 
            hindi: "आध्यात्मिक वृद्धि", 
             icon: <div className="bg-red-100 p-3 rounded-full mb-2 text-red-700"><span className="text-2xl">🕉️</span></div>,
            points: ["Connection with inner self (Atman)", "Enhanced meditation", "Purpose and Dharma", "Awakening spiritual energy"]
          },
          { 
            title: "Life Success", 
            hindi: "जीवन में सफलता", 
             icon: <div className="bg-yellow-100 p-3 rounded-full mb-2 text-yellow-700"><span className="text-2xl">🌟</span></div>,
            points: ["Magnetic personality", "Better relationships", "Career excellence", "Respect and admiration"]
          }
        ].map((item, i) => (
          <div key={i} className="bg-[#FFFBF7] p-6 rounded-xl shadow-md card-tilak flex flex-col items-center text-center">
            {item.icon}
            <h3 className="text-brahma-saffron font-hindi font-bold text-lg">{item.hindi}</h3>
            <h4 className="text-stone-700 font-serif font-bold text-lg mb-4">{item.title}</h4>
            <div className="w-full text-left space-y-3">
              {item.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-brahma-saffron mt-1.5 flex-shrink-0"></div>
                   <p className="text-stone-600 text-xs leading-relaxed">{pt}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#4A2C2A] to-[#2C1810] text-[#FDFBF7] p-6 rounded-xl max-w-md mb-8 w-full border border-orange-900 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Om_symbol.svg/1200px-Om_symbol.svg.png" className="w-20" /></div>
        <p className="text-center text-lg font-hindi mb-2 text-orange-200">"ब्रह्मचर्येण तपसा देवा मृत्युमुपाघ्नत"</p>
        <p className="text-orange-50/80 text-xs text-center border-t border-orange-800/50 pt-3 mt-2 font-light">
          Through Brahmacharya and discipline, the gods conquered death itself.
          <br/><span className="italic text-orange-400 font-serif">- Atharva Veda 11.5.19</span>
        </p>
      </div>

      <button 
        onClick={onConfirm}
        className="w-full max-w-md py-4 btn-saffron rounded-lg font-bold tracking-widest text-lg mb-8"
      >
        I AM READY • मैं तैयार हूं
      </button>
    </div>
  );
};

// 4. AUTH & PAYMENT SCREEN
const AuthPaymentScreen = ({ onComplete, tempUser }: { onComplete: (user: Partial<UserState>) => void, tempUser: UserState }) => {
  const [view, setView] = useState<'auth' | 'payment'>('auth');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (authMode === 'signup') {
        result = await supabase.auth.signUp({ email, password });
        if (result.error) throw result.error;
        if (result.data.user && !result.data.session) {
           setError("Account created. Please check your email.");
           setLoading(false); return;
        }
        if (result.data.user && result.data.session) {
          await supabase.from('profiles').upsert({
             id: result.data.user.id, email: email, age: Number(tempUser.age) || 0,
             reason: tempUser.reason || "Not specified", start_date: new Date().toISOString(),
             current_day: 1, unlocked_badges: [], journal_entries: {}, has_paid: false, is_onboarded: true
          });
          setView('payment');
        }
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
        if (result.data.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', result.data.user.id).single();
          if (!profile) {
              await supabase.from('profiles').upsert({
                 id: result.data.user.id, email: email, age: Number(tempUser.age) || 0,
                 reason: tempUser.reason || "Not specified", start_date: new Date().toISOString(),
                 current_day: 1, has_paid: false, is_onboarded: true
              });
              setView('payment');
          } else if (profile.has_paid) {
            onComplete({ email, hasPaid: true, isAuthenticated: true, ...profile });
          } else {
            setView('payment');
          }
        }
      }
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed.');
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) await supabase.from('profiles').update({ has_paid: true }).eq('id', user.id);
      } catch (e) { console.error(e); }
      setLoading(false);
      onComplete({ name: email.split('@')[0], email, hasPaid: true, isAuthenticated: true });
    }, 2000);
  };

  if (view === 'auth') {
    return (
      <div className="min-h-screen bg-mandala flex flex-col p-6 items-center justify-center">
        <div className="bg-[#FFFBF7] p-8 rounded-2xl shadow-xl w-full max-w-sm card-tilak">
          <h2 className="text-2xl font-display text-brahma-dark mb-6 text-center">
            {authMode === 'signup' ? 'Join the Path' : 'Welcome Back'}
          </h2>
          
          {error && (
            <div className={`p-3 rounded-lg mb-4 text-xs flex items-center gap-2 ${error.includes("check") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"}`}>
              <AlertCircle size={12} /> {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <input 
              type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-white border border-orange-200 rounded-lg p-3 text-brahma-dark outline-none focus:border-orange-500" 
            />
            <input 
              type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-white border border-orange-200 rounded-lg p-3 text-brahma-dark outline-none focus:border-orange-500" 
            />
            <button 
              type="submit" disabled={loading}
              className="w-full py-3 btn-saffron rounded-lg font-bold tracking-wide"
            >
              {loading ? "Processing..." : (authMode === 'signup' ? "Create Account" : "Sign In")}
            </button>
          </form>

          <button onClick={() => { setAuthMode(authMode === 'signup' ? 'signin' : 'signup'); setError(''); }} className="mt-6 text-stone-500 hover:text-brahma-saffron text-xs w-full text-center">
            {authMode === 'signup' ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mandala flex flex-col p-4 items-center overflow-y-auto pt-8 pb-10 font-serif">
       <div className="w-20 h-20 rounded-full border-2 border-orange-300 flex items-center justify-center bg-white shadow-lg mb-6">
          <span className="text-4xl text-brahma-saffron font-hindi">ॐ</span>
       </div>

       <h2 className="text-3xl font-display text-center text-brahma-dark mb-2">You Are One Decision Away</h2>
       <p className="text-stone-500 text-center mb-8 italic">From becoming the strongest version of yourself</p>

       <div className="w-full max-w-md bg-[#FFF3E0] p-6 rounded-xl mb-6 text-center border border-orange-200">
          <div className="flex justify-center mb-2">
            <div className="text-2xl text-red-600">📿</div>
          </div>
          <p className="font-hindi text-lg text-brahma-dark mb-2 font-bold">"ऊर्ध्वरेतो विरजो ज्योतिरमृतं विश्वजित्"</p>
          <p className="text-xs text-stone-600 leading-relaxed">
            One who practices Brahmacharya becomes radiant, pure, luminous, and victorious.
            <br/> <span className="text-stone-500 italic">— Shandilya Upanishad</span>
          </p>
       </div>

       <div className="w-full max-w-md bg-[#FFFBF7] rounded-xl p-6 mb-6 shadow-md card-tilak">
         <h3 className="text-lg font-display font-bold text-brahma-dark mb-6 text-center border-b pb-4 border-stone-100">What Awaits You</h3>
         <ul className="space-y-4">
           {[
             '108 days of guided journey with daily teachings',
             'Daily accountability system to keep you strong',
             'Personal journal for self-reflection',
             'Milestone celebrations to honor your progress',
             'Sacred completion certificate',
             'Complete life transformation'
           ].map((i, idx) => (
             <li key={idx} className="flex items-start text-stone-700 bg-orange-50/50 p-3 rounded-lg border border-orange-100/50">
               <span className="text-brahma-saffron mr-3 font-bold">✓</span> 
               <span className="text-sm">{i}</span>
             </li>
           ))}
         </ul>
       </div>

       <div className="w-full max-w-md bg-white p-4 rounded-xl flex items-center gap-4 border border-orange-200 shadow-sm mb-6">
         {/* INDIAN COW IMAGE */}
         <img src={INDIAN_COW_IMG} className="w-14 h-14 rounded-full object-cover border-2 border-orange-100" alt="Indian Desi Cow"/>
         <div>
            <div className="text-sm font-bold text-brahma-dark flex items-center gap-1">
               <span className="text-orange-500">🐄</span> Supporting Gau Mata
            </div>
            <p className="text-[10px] text-stone-500 mt-1">Your offering protects and cares for sacred Desi cows.</p>
         </div>
       </div>

       <button 
         onClick={handlePayment}
         disabled={loading}
         className="w-full max-w-md py-4 btn-saffron rounded-xl font-bold text-lg mb-4 tracking-wide shadow-xl"
       >
         BEGIN MY JOURNEY • ₹10
       </button>
       <button onClick={() => setView('auth')} className="w-full max-w-md py-3 text-brahma-dark border border-brahma-dark rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-brahma-dark hover:text-white transition-colors">
          Back
       </button>
    </div>
  );
};

// 5. DASHBOARD LAYOUT & TABS
const Dashboard = ({ user, updateUser, onLogout }: { user: UserState, updateUser: (u: Partial<UserState>) => void, onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'home'|'progress'|'journal'|'wisdom'|'badges'>('home');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [journalText, setJournalText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const isLocked = () => {
    if (!user.lastCompletionTime) return false;
    const last = new Date(user.lastCompletionTime).getTime();
    return (new Date().getTime() - last) < 24 * 60 * 60 * 1000;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (user.lastCompletionTime) {
        const last = new Date(user.lastCompletionTime).getTime();
        const diff = (24 * 60 * 60 * 1000) - (new Date().getTime() - last);
        if (diff > 0) {
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${h}h ${m}m`);
          setVideoUploaded(true); 
        } else {
          setTimeLeft('');
          setVideoUploaded(false);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user.lastCompletionTime]);

  const handleVideoUpload = async () => {
    if (!videoFile) return;
    setVideoUploaded(true);
    const now = new Date().toISOString();
    const newDay = user.currentDay + 1;
    const newUnlocked = [...user.unlockedBadges];
    BADGES.forEach(b => {
      if (newDay >= b.dayRequired && !newUnlocked.includes(b.id)) newUnlocked.push(b.id);
    });

    const newData = { lastCompletionTime: now, currentDay: Math.min(newDay, 108), unlockedBadges: newUnlocked };
    updateUser(newData);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) await supabase.from('profiles').update({ last_completion_time: now, current_day: newData.currentDay, unlocked_badges: newUnlocked }).eq('id', authUser.id);
    } catch (e) { console.warn("Sync failed:", e); }
  };

  const handleJournalSubmit = async () => {
    if(!journalText) return;
    setIsAnalyzing(true);
    const analysis = await analyzeJournalEntry(journalText);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
    const entry: JournalEntry = { whyStarted: user.reason, temptations: "", dailyAnswer: journalText, date: new Date().toISOString() };
    const newEntries = { ...user.journalEntries, [user.currentDay]: entry };
    updateUser({ journalEntries: newEntries });
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) await supabase.from('profiles').update({ journal_entries: newEntries }).eq('id', authUser.id);
    } catch (e) { console.warn("Sync failed:", e); }
  };

  const Header = () => (
    <div className="bg-[#FFF8F0]/80 pt-6 pb-8 px-4 text-center border-b border-orange-200 relative backdrop-blur-sm">
       <div className="absolute top-4 right-4 text-xs font-bold text-brahma-dark flex gap-2 items-center cursor-pointer hover:text-brahma-saffron" onClick={onLogout}>
         <LogOut size={14} /> Logout
       </div>
       <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-md border-2 border-orange-100 mb-3 relative">
         <div className="absolute inset-0 rounded-full border border-brahma-saffron opacity-30 animate-pulse"></div>
         <span className="text-4xl text-brahma-saffron font-hindi">ॐ</span>
       </div>
       <h1 className="text-3xl font-hindi text-brahma-dark font-bold mb-1">ब्रह्म पथ</h1>
       <p className="text-xs text-stone-500 uppercase tracking-widest">Brahma Path • Your Journey</p>
       
       <div className="mt-4">
          <div className="text-5xl font-display text-brahma-saffron drop-shadow-sm">{user.currentDay}</div>
          <div className="text-xs font-bold text-stone-500 uppercase mt-1 tracking-wider">Day {user.currentDay} of 108</div>
       </div>
    </div>
  );

  const renderHome = () => (
    <div className="animate-fade-in p-4 pb-24">
      <Header />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 -mt-6 mb-6 px-2">
         {[
           { val: user.currentDay, label: 'Current Day', sub: 'वर्तमान दिन', icon: '📿' },
           { val: 108 - user.currentDay, label: 'Days Remaining', sub: 'शेष दिन', icon: '⏳' },
           { val: `${Math.floor((user.currentDay/108)*100)}%`, label: 'Complete', sub: 'पूर्ण', icon: '🎯' }
         ].map((stat, i) => (
           <div key={i} className="bg-white p-3 rounded-xl shadow-md border-t-2 border-orange-300 text-center flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-sm mb-2 text-orange-600">{stat.icon}</div>
              <div className="text-2xl font-bold text-stone-800">{stat.val}</div>
              <div className="text-[10px] font-hindi text-stone-600 font-bold mt-1">{stat.sub}</div>
              <div className="text-[9px] text-stone-400 uppercase">{stat.label}</div>
           </div>
         ))}
      </div>

      {/* Task Card */}
      <div className="bg-[#FFFBF7] rounded-2xl p-6 border border-orange-200 shadow-md card-tilak">
        <h3 className="text-xl font-hindi text-center text-brahma-dark font-bold mb-1">दैनिक जवाबदेही वीडियो</h3>
        <p className="text-xs text-center text-stone-500 mb-6 italic">Daily Accountability • Record yourself with conviction</p>

        {timeLeft ? (
           <div className="bg-green-50 rounded-xl p-8 text-center border border-dashed border-green-500">
             <CheckCircle2 size={48} className="mx-auto text-green-600 mb-4" />
             <h4 className="text-lg font-bold text-green-800 mb-2">Sadhana Complete</h4>
             <p className="text-green-600 text-sm">Next session unlocks in:</p>
             <p className="text-2xl font-mono text-green-700 mt-2 font-bold">{timeLeft}</p>
           </div>
        ) : (
          <div>
            <div className="bg-[#FFF8F0] border-l-4 border-brahma-saffron p-4 rounded-r-lg mb-6 relative">
               <div className="absolute -top-3 right-4 bg-brahma-saffron text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                 <span className="font-hindi">ॐ</span> आज का उद्धरण
               </div>
               <p className="text-brahma-dark font-serif italic text-lg pt-1 leading-relaxed">
                 "{DAILY_QUOTES[user.currentDay % DAILY_QUOTES.length]}"
               </p>
            </div>

            <div className="space-y-4 mb-8 px-2">
              <div className="flex items-start text-sm text-stone-600">
                <span className="font-bold text-brahma-saffron mr-2">1. Record:</span>
                5-10 second video of yourself (अपना वीडियो रिकॉर्ड करें)
              </div>
              <div className="flex items-start text-sm text-stone-600">
                <span className="font-bold text-brahma-saffron mr-2">2. Speak:</span>
                The quote clearly and with conviction (दृढ़ता से बोलें)
              </div>
              <div className="flex items-start text-sm text-stone-600">
                <span className="font-bold text-brahma-saffron mr-2">3. Upload:</span>
                Submit to unlock today's teachings (आज की शिक्षा अनलॉक करें)
              </div>
            </div>

            <label className="block w-full mb-4">
              <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)} />
              <div className="w-full py-4 btn-saffron rounded-lg font-bold text-center cursor-pointer flex items-center justify-center gap-2">
                {videoFile ? <><CheckCircle2 size={20}/> {videoFile.name}</> : <><Upload size={20}/> वीडियो अपलोड करें (Upload Video)</>}
              </div>
            </label>
            
            {videoFile && (
               <button onClick={handleVideoUpload} className="w-full py-3 bg-green-600 text-white rounded-lg font-bold shadow-md hover:bg-green-700 transition-colors">
                 SUBMIT SADHANA
               </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 mt-4">
              <Lock size={10} /> Your video is completely private and used only for accountability
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="animate-fade-in pb-24">
      <div className="pt-8 pb-4 text-center">
         <h2 className="text-4xl font-display text-brahma-saffron mb-1">Day {user.currentDay}</h2>
         <p className="text-stone-500 text-sm">{108 - user.currentDay} days remaining</p>
         <p className="text-xs text-stone-400 mt-1 font-bold uppercase tracking-widest">{Math.floor((user.currentDay/108)*100)}% complete</p>
      </div>

      <MalaTracker progress={user.currentDay} />
      
      <div className="px-4 mt-8">
        <div className="bg-[#FFFBF7] rounded-2xl p-6 shadow-lg border border-orange-100 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-brahma-saffron rounded-b-lg"></div>
          <h3 className="text-center font-display text-xl text-brahma-dark mb-2 flex items-center justify-center gap-2 mt-2">
             <Target className="text-brahma-saffron"/> Your Milestone Rewards
          </h3>
          <p className="text-center text-xs text-stone-500 mb-8">Unlock sacred badges as you progress on your journey</p>

          <div className="space-y-6 relative">
             <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-stone-200"></div>
             {MILESTONES.map((m, i) => {
               const unlocked = user.currentDay >= m.day;
               return (
                 <div key={i} className={`relative flex gap-4 ${unlocked ? 'opacity-100' : 'opacity-60 grayscale'}`}>
                    <div className={`w-12 h-12 rounded-full border-4 flex-shrink-0 z-10 flex items-center justify-center bg-white ${unlocked ? 'border-brahma-gold text-brahma-gold' : 'border-stone-300 text-stone-300'}`}>
                      {unlocked ? <CheckCircle2 size={20}/> : <Lock size={16} />}
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                       <h4 className="font-serif font-bold text-brahma-dark text-lg">{m.title}</h4>
                       <p className="text-xs text-stone-500 mb-3">{m.desc}</p>
                       <div className="flex gap-2">
                          <span className="text-[10px] bg-stone-100 px-2 py-1 rounded border border-stone-200 text-stone-600">Day {m.day}</span>
                          <span className="text-[10px] bg-amber-50 px-2 py-1 rounded border border-amber-100 text-amber-700 flex items-center gap-1">
                            <span className="text-amber-500">⚜️</span> {m.sub}
                          </span>
                       </div>
                    </div>
                 </div>
               );
             })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBadges = () => (
    <div className="animate-fade-in p-4 pb-24 pt-8">
      <h2 className="text-3xl font-display text-center text-brahma-dark mb-2">Achievement Badges</h2>
      <p className="text-center text-stone-500 text-sm mb-8">Unlock sacred badges as you progress on your journey</p>

      <div className="grid grid-cols-2 gap-4">
        {BADGES.map(badge => {
          const unlocked = user.unlockedBadges.includes(badge.id);
          const Icon = { shield: Shield, crown: Crown, flame: Flame, trophy: Trophy }[badge.icon] || Shield;
          
          return (
            <div key={badge.id} className={`bg-[#FFFBF7] rounded-xl p-6 shadow-md border-t-4 ${unlocked ? 'border-brahma-saffron' : 'border-stone-300'} flex flex-col items-center text-center ${!unlocked && 'opacity-70'}`}>
               <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${unlocked ? 'bg-orange-100 text-orange-600' : 'bg-stone-200 text-stone-400'}`}>
                 <Icon size={32} />
               </div>
               <h4 className="font-bold text-stone-700 text-lg mb-1">{badge.name}</h4>
               <p className="text-[10px] text-stone-500 mb-4">{badge.description}</p>
               
               {/* Progress Bar */}
               <div className="w-full bg-stone-200 h-2 rounded-full mb-1">
                  <div className={`h-full rounded-full ${unlocked ? 'bg-brahma-saffron' : 'bg-stone-400'}`} style={{ width: unlocked ? '100%' : `${Math.min((user.currentDay/badge.dayRequired)*100, 100)}%` }}></div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderJournal = () => (
    <div className="animate-fade-in p-4 pb-24 pt-8 flex flex-col items-center justify-center min-h-[60vh]">
      {!timeLeft && !isLocked() ? (
         <div className="bg-[#FFFBF7] p-8 rounded-2xl border border-orange-200 text-center max-w-sm shadow-inner relative overflow-hidden">
           <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600 border-4 border-white shadow-sm">
             <Lock size={32} />
           </div>
           <h2 className="text-2xl font-serif text-brahma-dark mb-2">Journal Locked</h2>
           <p className="text-stone-600 mb-6">Complete today's sadhana video to unlock your sacred journal.</p>
         </div>
      ) : (
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-serif text-brahma-dark mb-6 text-center">Daily Reflection</h2>
          <div className="bg-[#FFFBF7] p-6 rounded-xl shadow-md border-t-4 border-brahma-saffron">
             <div className="mb-4">
               <label className="text-sm font-bold text-brahma-dark block mb-2">How do you feel today?</label>
               <textarea 
                 value={journalText} onChange={(e) => setJournalText(e.target.value)}
                 className="w-full h-40 bg-white border border-stone-200 rounded-lg p-4 text-stone-700 focus:border-brahma-saffron focus:ring-1 focus:ring-brahma-saffron outline-none resize-none"
                 placeholder="Reflect on your energy..."
               ></textarea>
             </div>
             
             {!aiAnalysis && (
               <button onClick={handleJournalSubmit} disabled={isAnalyzing || !journalText} className="w-full py-3 btn-saffron rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                 {isAnalyzing ? <Sparkles size={16} className="animate-spin" /> : <Sparkles size={16} />}
                 {isAnalyzing ? "Seeking Wisdom..." : "REFLECT"}
               </button>
             )}

             {aiAnalysis && (
                <div className="mt-6 bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <div className="flex items-center gap-2 mb-2 text-orange-700 font-bold text-xs uppercase tracking-wide">
                     <Brain size={14} /> Sage Guidance
                  </div>
                  <p className="text-stone-700 text-sm italic leading-relaxed">"{aiAnalysis}"</p>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );

  const renderWisdom = () => {
    const verse = GITA_VERSES[user.currentDay % GITA_VERSES.length];
    return (
      <div className="animate-fade-in p-4 pb-24 pt-8">
        <h2 className="text-2xl font-display text-center text-brahma-dark mb-8">Sacred Wisdom</h2>
        
        <div className="relative bg-[#FFFBF7] rounded-xl p-8 border border-orange-100 shadow-xl mb-8 text-center overflow-hidden card-tilak">
           <div className="absolute -top-6 -right-6 text-orange-50 transform rotate-12">
             <BookOpen size={120} />
           </div>
           <span className="relative z-10 text-[10px] bg-brahma-dark text-white px-2 py-1 rounded uppercase tracking-widest">Bhagavad Gita {verse.ref}</span>
           <p className="relative z-10 text-2xl font-hindi text-brahma-dark mt-6 mb-4 leading-relaxed font-bold">{verse.sanskrit}</p>
           <p className="relative z-10 text-stone-600 italic font-serif text-sm">"{verse.trans}"</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex gap-4">
           <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 flex-shrink-0">
             <Zap size={24} />
           </div>
           <div>
             <h3 className="font-bold text-brahma-dark mb-1">Practice for Today</h3>
             <p className="text-xs text-stone-500 leading-relaxed">
               When an urge arises, do 10 deep belly breaths. Visualize the energy moving up from your spine to your brain (Ojas).
             </p>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans bg-mandala">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'progress' && renderProgress()}
        {activeTab === 'badges' && renderBadges()}
        {activeTab === 'journal' && renderJournal()}
        {activeTab === 'wisdom' && renderWisdom()}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#FFFBF7]/95 backdrop-blur-md border-t border-orange-200 h-20 flex items-center justify-around px-2 z-50 pb-2 shadow-[0_-4px_20px_rgba(217,119,6,0.1)]">
        {[
          { id: 'home', icon: CheckCircle2, label: 'Home' },
          { id: 'progress', icon: Activity, label: 'Progress' },
          { id: 'journal', icon: BookOpen, label: 'Journal' },
          { id: 'wisdom', icon: Brain, label: 'Teachings' },
          { id: 'badges', icon: Shield, label: 'Badges' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${activeTab === tab.id ? 'text-brahma-saffron' : 'text-stone-400 hover:text-stone-600'}`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === tab.id ? 'bg-orange-100 transform -translate-y-1' : 'bg-transparent'}`}>
              <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP CONTAINER ---

const App = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.LANDING);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('brahma_user');
    return saved ? JSON.parse(saved) : {
      isOnboarded: false, isAuthenticated: false, hasPaid: false, name: '', email: '', age: 0, reason: '', startDate: new Date().toISOString(), currentDay: 1, lastCompletionTime: null, journalEntries: {}, unlockedBadges: []
    };
  });

  const saveUser = (updates: Partial<UserState>) => {
    const newUser = { ...user, ...updates };
    setUser(newUser);
    localStorage.setItem('brahma_user', JSON.stringify(newUser));
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data?.session?.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.session.user.id).single();
          if (profile) {
            saveUser({
              ...user, isAuthenticated: true, email: data.session.user.email || '', name: data.session.user.email?.split('@')[0] || '',
              age: profile.age, reason: profile.reason, currentDay: profile.current_day || 1, lastCompletionTime: profile.last_completion_time,
              unlockedBadges: profile.unlocked_badges || [], journalEntries: profile.journal_entries || {}, hasPaid: profile.has_paid, isOnboarded: profile.is_onboarded || true
            });
            if(profile.has_paid) setScreen(AppScreen.DASHBOARD);
            else setScreen(AppScreen.PAYMENT);
          } else setScreen(AppScreen.ONBOARDING); 
        } else {
          if (!user.isOnboarded) setScreen(AppScreen.LANDING);
          else if (!user.isAuthenticated) setScreen(AppScreen.AUTH);
          else setScreen(AppScreen.LANDING);
        }
      } catch (e) {
        if (!user.isOnboarded) setScreen(AppScreen.LANDING);
        else setScreen(AppScreen.LANDING);
      } finally { setLoading(false); }
    };
    initAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => { if (!session) setScreen(AppScreen.LANDING); });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try { await supabase.auth.signOut(); } catch (e) { console.warn("Logout error:", e); }
    localStorage.removeItem('brahma_user');
    window.location.reload();
  };

  if (loading) return <div className="min-h-screen bg-brahma-bg flex items-center justify-center"><div className="text-brahma-saffron font-hindi text-6xl animate-pulse">ॐ</div></div>;

  const renderScreen = () => {
    switch (screen) {
      case AppScreen.LANDING: return <LandingScreen onStart={() => setScreen(AppScreen.ONBOARDING)} />;
      case AppScreen.ONBOARDING: return <OnboardingScreen onComplete={(data) => { saveUser({ ...data, isOnboarded: true }); setScreen(AppScreen.COMMITMENT); }} />;
      case AppScreen.COMMITMENT: return <CommitmentScreen onConfirm={() => setScreen(AppScreen.AUTH)} />;
      case AppScreen.AUTH: case AppScreen.PAYMENT: return <AuthPaymentScreen tempUser={user} onComplete={(data) => { saveUser({ ...data, hasPaid: true }); setScreen(AppScreen.DASHBOARD); }} />;
      case AppScreen.DASHBOARD: return <Dashboard user={user} updateUser={saveUser} onLogout={handleLogout} />;
      default: return <LandingScreen onStart={() => setScreen(AppScreen.ONBOARDING)} />;
    }
  };

  return <HashRouter><div className="text-stone-800 antialiased selection:bg-orange-200 selection:text-brahma-dark">{renderScreen()}</div></HashRouter>;
};

export default App;