'use client';

import { useState, useEffect, useRef } from 'react';
import Footer from '../components/Footer';
import Link from 'next/link';
import { createClient } from '../utils/supabase/client';

// Custom Typewriter Hook
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Typewriter effect for hero text
  const { displayed, done } = useTypewriter("Glad you stopped in. Good taste tends to find us. what are we doing now?");

  // Show buttons independently of typewriter
  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // Video scrub by mouse movement
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let prevX = window.innerWidth / 2;
    const SENSITIVITY = 0.8;
    let isSeeking = false;
    let queuedSeekTime: number | null = null;

    const handleSeeked = () => {
      isSeeking = false;
      if (queuedSeekTime !== null) {
        const timeToSeek = queuedSeekTime;
        queuedSeekTime = null;
        isSeeking = true;
        video.currentTime = timeToSeek;
      }
    };

    video.addEventListener('seeked', handleSeeked);

    const handleMouseMove = (e: MouseEvent) => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      const currentX = e.clientX;
      const delta = currentX - prevX;
      prevX = currentX;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      let targetTime = video.currentTime + timeOffset;
      if (targetTime < 0) targetTime = 0;
      if (targetTime > video.duration) targetTime = video.duration;

      if (!isSeeking) {
        isSeeking = true;
        video.currentTime = targetTime;
      } else {
        queuedSeekTime = targetTime;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);



  return (
    <main className="relative min-h-screen w-full text-white selection:bg-white/30">
      {/* HERO WRAPPER - Scrolls naturally */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* BACKGROUND VIDEO */}
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4"
          className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none"
          style={{ objectPosition: '70% center' }}
          muted
          playsInline
          preload="auto"
        />

      {/* NAVBAR */}
      <nav className="fixed left-0 right-0 top-0 z-10 flex w-full items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <div className="flex flex-row items-center gap-3">
          <span className="text-[21px] tracking-tight text-white sm:text-[26px]" style={{ fontFamily: 'var(--font-heading)' }}>
            SAAR&reg;
          </span>
          <span className="select-none text-[25px] tracking-[-0.02em] text-white sm:text-[30px]">
            ✳︎
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden flex-row text-[23px] text-white md:flex">
          <a href="#" className="transition-opacity hover:opacity-60">Summaries</a>
          <span className="mr-2">, </span>
          <a href="#" className="transition-opacity hover:opacity-60">Tasks</a>
          <span className="mr-2">, </span>
          <a href="#" className="transition-opacity hover:opacity-60">Privacy</a>
          <span className="mr-2">, </span>
          <a href="#" className="transition-opacity hover:opacity-60">Demo</a>
        </div>

        {/* Desktop CTA */}
        {user ? (
          <div className="hidden items-center gap-4 md:flex">
            <span className="text-[16px] text-white opacity-80">Hi, {user.user_metadata?.name || 'User'}</span>
            <button 
              onClick={() => supabase.auth.signOut()} 
              className="text-[23px] text-white underline underline-offset-2 transition-opacity hover:opacity-60"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/auth" className="hidden text-[23px] text-white underline underline-offset-2 transition-opacity hover:opacity-60 md:block">
            Get in touch
          </Link>
        )}

        {/* Mobile Hamburger */}
        <button
          className="relative z-50 flex h-6 w-6 flex-col items-center justify-center gap-[5px] md:hidden"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        >
          <div className={`h-[2px] w-6 bg-white transition-all duration-300 ${isMobileNavOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <div className={`h-[2px] w-6 bg-white transition-all duration-300 ${isMobileNavOpen ? 'opacity-0' : ''}`} />
          <div className={`h-[2px] w-6 bg-white transition-all duration-300 ${isMobileNavOpen ? 'translate-y-[-7px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-black/90 px-8 backdrop-blur-md transition-all duration-300 md:hidden ${
          isMobileNavOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <a href="#" className="text-[32px] font-medium text-white">Summaries</a>
        <a href="#" className="text-[32px] font-medium text-white">Tasks</a>
        <a href="#" className="text-[32px] font-medium text-white">Privacy</a>
        <a href="#" className="text-[32px] font-medium text-white">Demo</a>
        {user ? (
          <button onClick={() => supabase.auth.signOut()} className="text-[32px] font-medium text-white underline underline-offset-2 text-left">Sign Out</button>
        ) : (
          <Link href="/auth" className="text-[32px] font-medium text-white underline underline-offset-2">Get in touch</Link>
        )}
      </div>

        {/* HERO SECTION */}
        <section className="relative z-[1] flex h-full flex-col justify-end px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0">
        <div className="relative z-10 w-full max-w-xl">
          {/* Blurred Intro Label */}
          <div className="pointer-events-none mb-5 select-none text-white sm:mb-6" style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: 1.3, fontWeight: 400, filter: 'blur(4px)' }}>
            Hey there, meet A.R.I.A,<br />
            SAAR&apos;s Adaptive Response Interface Agent
          </div>

          {/* Typewriter Text */}
          <p className="mb-5 min-h-[54px] text-white sm:mb-6" style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: 1.35, fontWeight: 400 }}>
            {displayed}
            {!done && (
              <span className="ml-[2px] inline-block w-[2px] bg-white align-middle" style={{ height: '1.1em', animation: 'blink 1s step-end infinite' }} />
            )}
          </p>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}} />

          {/* Action Pills */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: showButtons ? 1 : 0,
              transform: showButtons ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease'
            }}
          >
            {["Upload Chat", "Get Quick Summary", "See My Tasks", "See how we operate"].map((label) => (
              <Link
                href="/auth"
                key={label}
                className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]"
              >
                {label}
              </Link>
            ))}

          </div>
        </div>
      </section>
    </div>
      <Footer />
    </main>
  );
}
