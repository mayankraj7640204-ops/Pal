'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import dynamic from 'next/dynamic';
import { ArrowRight, Download, Eraser } from 'lucide-react';

const SignaturePad = dynamic(() => import('react-signature-canvas'), { ssr: false }) as any;

const AVATAR_SEEDS = ['Felix', 'Aneka', 'Mia', 'Oliver', 'Caleb', 'Abby', 'Jack', 'Jocelyn', 'Jasper', 'Chloe', 'Garfield', 'Leo'];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const sigCanvas = useRef<any>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [step, setStep] = useState<'form' | 'id_card'>('form');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: '',
    specialisation: '3D DESIGN',
    website: '',
  });
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_SEEDS[0]);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      
      const metadata = user.user_metadata || {};
      setUser(user);
      setFormData(prev => ({
        ...prev,
        name: metadata.name || prev.name,
        phone: metadata.phone || prev.phone,
        country: metadata.country || prev.country,
        specialisation: metadata.specialisation || prev.specialisation,
        website: metadata.website || prev.website,
      }));
      
      if (metadata.avatar_seed) {
        setSelectedAvatar(metadata.avatar_seed);
      }
      
      if (metadata.has_profile && window.location.search !== '?edit=true') {
        setStep('id_card');
      }
      setLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  const handleGenerateId = async () => {
    if (sigCanvas.current) {
      setSignatureData(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
    }

    // Update user metadata in Supabase
    await supabase.auth.updateUser({
      data: {
        has_profile: true,
        avatar_seed: selectedAvatar,
        phone: formData.phone,
        country: formData.country,
        specialisation: formData.specialisation,
      }
    });

    setStep('id_card');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e5e5e5] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (step === 'id_card') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Subtle background red glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#780014] blur-[150px] opacity-20 pointer-events-none"></div>
        
        {/* The ID Card */}
        <div className="bg-[#f5f5f5] w-full max-w-[800px] rounded-[30px] p-10 flex flex-col relative z-10 shadow-2xl transform transition-all hover:scale-[1.02] duration-500">
          
          <div className="flex justify-between items-start mb-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">PALS ID</span>
              <h2 className="text-3xl font-black text-black tracking-tight">CREATIVE IDENTITY</h2>
            </div>
            {/* Hologram fake icon */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-200 to-gray-400 border border-white/50 shadow-inner flex items-center justify-center opacity-70">
              <div className="w-8 h-8 border-2 border-gray-300 border-dashed rounded-full animate-[spin_10s_linear_infinite]"></div>
            </div>
          </div>

          <div className="flex gap-10">
            {/* Left: Avatar & Barcode */}
            <div className="flex flex-col items-center gap-8">
              <div className="w-[180px] h-[200px] bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedAvatar}&backgroundColor=ffffff`} 
                  alt="Avatar" 
                  className="w-[150px] h-[150px]"
                />
              </div>
              
              {/* Fake Barcode */}
              <div className="w-full h-12 bg-transparent flex flex-col justify-end">
                <div className="w-full flex justify-between h-8">
                  {Array.from({length: 30}).map((_, i) => (
                    <div key={i} className="bg-black h-full" style={{ width: `${Math.random() * 4 + 1}px` }}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="flex-1 grid grid-cols-2 gap-y-6 content-start">
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Name</span>
                <span className="text-sm font-bold text-black uppercase">{formData.name || 'PALS USER'}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Country</span>
                <span className="text-sm font-bold text-black uppercase">{formData.country || 'N/A'}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Specialisation</span>
                <span className="text-sm font-bold text-black uppercase">{formData.specialisation}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Phone</span>
                <span className="text-sm font-bold text-black uppercase">{formData.phone || 'N/A'}</span>
              </div>

              <div className="flex flex-col col-span-2">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Email</span>
                <span className="text-sm font-bold text-black uppercase">{user?.email}</span>
              </div>

              {formData.website && (
                <div className="flex flex-col col-span-2">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Website</span>
                  <span className="text-sm font-bold text-black uppercase">{formData.website}</span>
                </div>
              )}

              <div className="flex flex-col col-span-2 mt-4 relative">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2">Signature</span>
                <div className="relative border-b border-gray-300 pb-2 w-full max-w-[300px]">
                  {signatureData && (
                    <img src={signatureData} alt="Signature" className="h-12 w-auto -mb-4 ml-4 filter brightness-0" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <button 
            onClick={() => setStep('form')}
            className="flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white hover:bg-white/10 px-6 py-4 rounded-full font-bold transition-all"
          >
            Edit Profile
          </button>
          
          <button 
            onClick={() => router.push('/dashboard')}
            className="group flex items-center justify-center gap-3 bg-white text-black hover:bg-[#e3000f] hover:text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg"
          >
            Enter Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebebeb] flex font-sans text-black">
      {/* Left side: Avatar picker */}
      <div className="flex-1 flex flex-col p-6 border-r border-gray-300 max-h-screen">
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-400">PALS ID.</span>
            <span className="text-sm font-bold">Select Avatar</span>
          </div>
          
          <div className="flex-1 flex p-6 gap-8">
            {/* Grid selector */}
            <div className="w-[180px] grid grid-cols-2 gap-3 overflow-y-auto pr-2 content-start custom-scrollbar">
              {AVATAR_SEEDS.map((seed) => (
                <button 
                  key={seed}
                  onClick={() => setSelectedAvatar(seed)}
                  className={`w-[80px] h-[80px] rounded-xl flex items-center justify-center transition-all ${selectedAvatar === seed ? 'border-2 border-black bg-gray-50' : 'border border-gray-200 hover:border-gray-400 bg-white'}`}
                >
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=transparent`} alt={seed} className="w-16 h-16" />
                </button>
              ))}
            </div>

            {/* Big Preview */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                <img 
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedAvatar}&backgroundColor=transparent`} 
                  alt="Selected Avatar" 
                  className="w-[350px] h-[350px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-[450px] bg-[#f5f5f5] flex flex-col p-8 overflow-y-auto max-h-screen">
        <h2 className="text-lg font-bold mb-8 tracking-tight">Identity Details</h2>
        
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Name / Nickname</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors font-medium text-sm placeholder-gray-400"
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors font-medium text-sm placeholder-gray-400"
              placeholder="Where can we reach you?"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Country</label>
            <input 
              type="text" 
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              className="bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors font-medium text-sm placeholder-gray-400"
              placeholder="Where are you based?"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Specialisation</label>
            <select 
              value={formData.specialisation}
              onChange={(e) => setFormData({...formData, specialisation: e.target.value})}
              className="bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors font-medium text-sm appearance-none"
            >
              <option value="3D DESIGN">3D Design</option>
              <option value="DEVELOPER">Developer</option>
              <option value="ARTIST">Artist</option>
              <option value="CREATOR">Creator</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
            <input 
              type="email" 
              value={user?.email || ''}
              disabled
              className="bg-transparent border-b border-gray-300 py-2 focus:outline-none font-medium text-sm text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Website (Optional)</label>
            <input 
              type="text" 
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              className="bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors font-medium text-sm placeholder-gray-400"
              placeholder="https://"
            />
          </div>

          <div className="flex flex-col mt-2">
            <div className="flex justify-between items-end mb-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Signature</label>
              <button onClick={() => sigCanvas.current?.clear()} className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest flex items-center gap-1">
                <Eraser size={12} /> Clear
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-[120px]">
              <SignaturePad 
                ref={sigCanvas}
                canvasProps={{ className: 'w-full h-full' }}
                penColor="black"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleGenerateId}
          className="w-full bg-black hover:bg-[#222] text-white py-4 rounded-xl mt-8 font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
        >
          GET ID <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
