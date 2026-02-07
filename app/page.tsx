'use client';

import Link from "next/link";
import {useEffect, useRef, useState} from "react";

// Custom hook for scroll animations
function useScrollAnimation() {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        {
          threshold: 0.1, // Trigger when 10% of element is visible
          rootMargin: '0px 0px -50px 0px' // Start animation 50px before element fully enters
        }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return {elementRef, isVisible};
}

function CountdownTimer({targetDate}: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 2,
    minutes: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      console.log('Time difference (ms):', difference);

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);

        console.log('Countdown:', {days, hours, minutes});

        setTimeLeft({days, hours, minutes});
      } else {
        console.log('Target date reached or passed');
        setTimeLeft({days: 0, hours: 0, minutes: 0});
      }
    };

    console.log('Countdown started for:', targetDate);
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => {
      console.log('Countdown cleanup');
      clearInterval(timer);
    };
  }, [targetDate]);

  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center transform rotate-2 hover:rotate-0 transition-transform">
          <div className="text-4xl md:text-5xl font-black animate-bounce">
            {timeLeft.days}
          </div>
          <div className="text-sm font-bold uppercase tracking-wide">Nap</div>
        </div>
        <div
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center transform -rotate-1 hover:rotate-0 transition-transform">
          <div className="text-4xl md:text-5xl font-black animate-pulse">
            {timeLeft.hours}
          </div>
          <div className="text-sm font-bold uppercase tracking-wide">Óra</div>
        </div>
        <div
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center transform rotate-1 hover:rotate-0 transition-transform">
          <div className="text-4xl md:text-5xl font-black animate-bounce" style={{animationDelay: '0.5s'}}>
            {timeLeft.minutes}
          </div>
          <div className="text-sm font-bold uppercase tracking-wide">Perc</div>
        </div>
      </div>
  );
}

export default function Design9() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attendance: '',
    meal: '',
    dietary: ''
  });

  // Scroll animations for each section
  const heroAnimation = useScrollAnimation();
  const storyAnimation = useScrollAnimation();
  const detailsAnimation = useScrollAnimation();
  const rsvpAnimation = useScrollAnimation();

  // Mouse parallax effect state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100; // -50 to 50
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100; // -50 to 50
        setMousePosition({ x, y });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('RSVP submitted successfully!');
  };

  return (
      <div
          className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 relative overflow-hidden"
          style={{fontFamily: 'Poppins, sans-serif'}}>
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl opacity-70 animate-spin"
               style={{animationDelay: '0s', animationDuration: '4s'}}>🍷
          </div>
          <div className="absolute top-40 right-20 text-5xl opacity-60 animate-pulse"
               style={{animationDelay: '1s'}}>⭐
          </div>
          <div className="absolute bottom-32 left-1/4 text-4xl opacity-80 animate-spin"
               style={{animationDuration: '4s', animationDelay: '2s'}}>🎪
          </div>
          <div className="absolute bottom-20 right-10 text-5xl opacity-70 animate-bounce"
               style={{animationDelay: '3s'}}>🥙
          </div>
          <div className="absolute top-60 left-1/4 text-3xl opacity-60 animate-pulse"
               style={{animationDelay: '1.5s'}}>🦄
          </div>
          <div className="absolute top-80 right-1/4 text-4xl opacity-75"
               style={{animationDelay: '2.5s'}}>🌸
          </div>
          <div className="absolute top-1/2 left-20 text-3xl opacity-50 animate-spin"
               style={{animationDuration: '6s'}}>🍾
          </div>
          <div className="absolute bottom-60 right-20 text-4xl opacity-65 animate-pulse"
               style={{animationDelay: '3.5s'}}>🎊
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b-4 border-pink-300 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link href="/"
                    className="text-pink-600 hover:text-pink-700 transition-colors font-bold flex items-center transform hover:scale-105">
                <span className="mr-2 text-2xl">💖</span>
                Marci & Gréti
              </Link>
              <div className="hidden md:flex space-x-4">
                <a href="#home"
                   className="text-pink-600 hover:text-white hover:bg-pink-600 transition-all font-bold transform hover:scale-110 bg-pink-100 px-4 py-2 rounded-full shadow-md border-2 border-pink-300">💍</a>
                <a href="#story"
                   className="text-purple-600 hover:text-white hover:bg-purple-600 transition-all font-bold transform hover:scale-110 bg-purple-100 px-4 py-2 rounded-full shadow-md border-2 border-purple-300">🌄</a>
                <a href="#details"
                   className="text-blue-600 hover:text-white hover:bg-blue-600 transition-all font-bold transform hover:scale-110 bg-blue-100 px-4 py-2 rounded-full shadow-md border-2 border-blue-300">🍾</a>
                <a href="#rsvp"
                   className="text-green-600 hover:text-white hover:bg-green-600 transition-all font-bold transform hover:scale-110 bg-green-100 px-4 py-2 rounded-full shadow-md border-2 border-green-300">💌</a>
                <a href="#registry"
                   className="text-orange-600 hover:text-white hover:bg-orange-600 transition-all font-bold transform hover:scale-110 bg-orange-100 px-4 py-2 rounded-full shadow-md border-2 border-orange-300">🎁</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section
            ref={(el) => {
              heroAnimation.elementRef.current = el;
              heroRef.current = el;
            }}
            id="home"
            className={` py-24  relative transition-all duration-1000 ease-out ${
                heroAnimation.isVisible
                    ? 'opacity-100 transform translate-y-0'
                    : 'opacity-0 transform translate-y-8'
            }`}
        >
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 animate-gentle-bounce transition-transform duration-100"
                   style={{
                     animationDuration: '2s',
                   }}>
                <div
                    className="inline-flex items-center justify-center w-40 h-40 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-full shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                  <span className="text-6xl">💍</span>
                </div>
              </div>

              <div className="relative">
                <h1 className="text-8xl font-black mb-6 pb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent transform -rotate-2"
                    style={{fontFamily: 'Dancing Script, cursive'}}>
                  Marci & Gréti
                </h1>
                <div className="absolute -top-4 -right-4 text-4xl animate-spin transition-transform duration-100"
                     style={{
                       animationDuration: '3s',
                     }}>✨
                </div>
                <div className="absolute -bottom-4 -left-4 text-3xl animate-tick transition-transform duration-100"
                >🎈</div>
              </div>

              <p className="text-3xl md:text-5xl font-bold mb-12 pb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent transform rotate-1">
                Megházasodnak!
              </p>

              <div className="flex items-center justify-center mb-8">
                <div className="flex space-x-2 animate-ping transition-transform duration-100"
                     style={{
                       animationDuration: '10.5s',
                       opacity: '1 !important',
                       transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
                     }}>
                  <span className="text-4xl transform "> 🤵‍♂️ </span>
                  <span className="text-4xl transform ">💖</span>
                  <span className="text-4xl transform "> 👰‍♀️ </span>
                </div>
              </div>
              ️


              <div
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl border-4 border-rainbow transform -rotate-1 hover:rotate-0 transition-transform duration-500"
                  style={{
                    borderImage: 'linear-gradient(45deg, #ff6b9d, #c44bfe, #4fb3ff, #51cf8a) 1',
                    transform: `rotate(-1deg)`
                  }}>
                <div className="flex items-center justify-center mb-6">
                                <span className="text-5xl mr-3 animate-bounce transition-transform duration-100"
                                      style={{
                                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
                                      }}>🎉</span>
                  <h3 className="text-3xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">A
                    Nagy Nap:</h3>
                  <span className="text-5xl ml-3 animate-bounce transition-transform duration-100"
                        style={{
                          animationDelay: '0.5s',
                        }}>🎉</span>
                </div>
                <p className="text-3xl font-black text-purple-600 mb-3 animate-pulse">Augusztus 29, 2026</p>
                <p className="text-xl text-pink-600 mb-2">A helyszin</p>
                <p className="text-lg text-blue-600 mb-4">1145 Budapest csirke utca 17</p>
                <div
                    className="flex items-center justify-center bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-3">
                  <span className="text-lg text-purple-700 font-bold">16:00 Egyházi szertartás • 19:00 Lagzi</span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mt-16 max-w-4xl mx-auto">
                <div
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-8 rounded-3xl shadow-2xl border-4 border-white transform rotate-1 hover:-rotate-1 transition-transform duration-500">
                  <h3 className="text-3xl font-black mb-8 text-center animate-pulse transition-transform duration-100"
                      style={{
                        fontFamily: 'Dancing Script, cursive',
                        opacity: '1 !important',
                      }}>
                    ⏰ Ez már csak:
                  </h3>
                  <CountdownTimer targetDate="2026-08-29T16:00:00"/>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section
            ref={storyAnimation.elementRef}
            id="story"
            className={`py-20 bg-gradient-to-r from-pink-300 via-purple-400 to-blue-400 relative overflow-hidden transition-all duration-1000 ease-out ${
                storyAnimation.isVisible
                    ? 'opacity-100 transform translate-x-0'
                    : 'opacity-0 transform -translate-x-12'
            }`}
        >
          {/* Playful shapes */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div
                className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full transform rotate-45 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-green-300 transform rotate-12 animate-spin"
                 style={{animationDuration: '8s'}}></div>
            <div
                className="absolute bottom-20 left-1/3 w-40 h-20 bg-orange-300 rounded-full transform -rotate-12"></div>
          </div>

          <div className="relative container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-7xl font-black text-white mb-6 transform -rotate-1"
                  style={{fontFamily: 'Dancing Script, cursive'}}>
                Röpke 11 év után
              </h2>
              <div className="flex justify-center space-x-3">
                <span className="text-5xl animate-pulse">🇮🇹️</span>
                <span className="text-5xl animate-shake">🗻</span>
                <span className="text-5xl animate-bounce" style={{animationDelay: '0.5s'}}>💍</span>
              </div>
            </div>

            <img src={
              "/photo.jpeg"
            } alt="Our Story"
                 className="mx-auto mb-12 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"/>

            {/*<div className="grid md:grid-cols-2 gap-16 items-center">*/}
            {/*  <div>*/}
            {/*    <div className="bg-white rounded-3xl p-6 shadow-2xl transform rotate-2 hover:-rotate-1 transition-transform duration-500">*/}
            {/*      <div className="bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 h-80 rounded-2xl flex items-center justify-center relative overflow-hidden">*/}
            {/*        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>*/}
            {/*        <div className="relative text-center">*/}
            {/*          <div className="text-8xl mb-4 animate-spin" style={{animationDuration: '4s'}}>🎪</div>*/}
            {/*          <p className="text-xl font-black text-purple-800">ESCAPE ROOM</p>*/}
            {/*          <p className="text-lg font-bold text-pink-700">Where we got stuck together... literally!</p>*/}
            {/*        </div>*/}
            {/*        /!* Floating elements *!/*/}
            {/*        <div className="absolute top-2 right-2 text-2xl animate-bounce">⭐</div>*/}
            {/*        <div className="absolute bottom-2 left-2 text-xl animate-pulse">🔐</div>*/}
            {/*      </div>*/}
            {/*      <div className="mt-4 text-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-3 transform -rotate-1">*/}
            {/*        <p className="text-purple-700 font-black">"Escaped the room, but couldn't escape love!" 💕</p>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*  <div>*/}
            {/*    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform -rotate-1 hover:rotate-1 transition-transform duration-500">*/}
            {/*      <h3 className="text-5xl font-black mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent" style={{fontFamily: 'Dancing Script, cursive'}}>*/}
            {/*        Plot Twist: We're Perfect Together!*/}
            {/*      </h3>*/}
            {/*      <div className="space-y-6">*/}
            {/*        <div className="flex items-start bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 transform rotate-1">*/}
            {/*          <span className="text-3xl mr-3 mt-1 animate-spin" style={{animationDuration: '3s'}}>🧩</span>*/}
            {/*          <p className="text-lg leading-relaxed text-purple-800 font-medium">*/}
            {/*            We met at an escape room birthday party where we got paired together for "The Haunted Carnival" challenge. After 90 minutes of Ruby's creative chaos and Felix's logical puzzles, we escaped with 2 seconds to spare... and phone numbers exchanged!*/}
            {/*          </p>*/}
            {/*        </div>*/}
            {/*        <div className="flex items-start bg-gradient-to-r from-blue-100 to-pink-100 rounded-2xl p-4 transform -rotate-1">*/}
            {/*          <span className="text-3xl mr-3 mt-1 animate-bounce">🎨</span>*/}
            {/*          <p className="text-lg leading-relaxed text-blue-800 font-medium">*/}
            {/*            Three years of adventures later—from midnight donut runs to building the world's most elaborate blanket forts—Felix proposed during a scavenger hunt he designed around Austin. The final clue led Ruby to a photo booth filled with all our silly memories and one very important question!*/}
            {/*          </p>*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*      <div className="mt-8 text-center bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl p-4 transform rotate-1">*/}
            {/*        <p className="text-purple-700 italic font-black text-xl">"Life's too short for boring love stories!" 🌈</p>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
        </section>

        {/* Wedding Details */}
        <section
            ref={detailsAnimation.elementRef}
            id="details"
            className={`py-20 bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 transition-all duration-1000 ease-out ${
                detailsAnimation.isVisible
                    ? 'opacity-100 transform translate-y-0 scale-100'
                    : 'opacity-0 transform translate-y-8 scale-95'
            }`}
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-7xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-6 transform rotate-1"
                  style={{fontFamily: 'Dancing Script, cursive'}}>
                Szeretettl várunk Téged az Esküvőnkön!
              </h2>
              <div className="flex justify-center space-x-3">
                <span className="text-5xl animate-spin" style={{animationDuration: '2s'}}>🎊</span>
                <span className="text-5xl animate-bounce">🎈</span>
                <span className="text-5xl animate-spin" style={{animationDuration: '3s'}}>🎊</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Ceremony */}
              <div
                  className="bg-gradient-to-br from-pink-300 to-purple-400 text-white rounded-3xl p-8 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="text-center mb-8">
                  <div
                      className="w-28 h-28 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform">
                    <span className="text-5xl animate-bounce">💒</span>
                  </div>
                  <h3 className="text-5xl font-black" style={{fontFamily: 'Dancing Script, cursive'}}>
                    Egyházi Szertartás
                  </h3>
                </div>
                <div className="space-y-4">
                  <div
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 transform rotate-1 hover:-rotate-1 transition-transform">
                    <div className="flex items-center mb-2">
                                        <span className="text-2xl mr-3 animate-spin"
                                              style={{animationDuration: '4s'}}>⏰</span>
                      <span className="font-black text-xl">Érkezés:</span>
                    </div>
                    <p className="ml-12 font-bold text-lg">16:00 (seggek a padon)</p>
                  </div>
                  <div
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 transform -rotate-1 hover:rotate-1 transition-transform">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3 animate-pulse">🎪</span>
                      <span className="font-black text-xl">Helyszin:</span>
                    </div>
                    <p className="ml-12 font-bold text-lg">Nagyon engedékeny katolikus kápolna</p>
                  </div>
                  <div
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 transform rotate-1 hover:-rotate-1 transition-transform">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">📍</span>
                      <span className="font-black text-xl">Cim:</span>
                    </div>
                    <p className="ml-12 font-bold text-lg">1111 Budapest Kecske utca 66</p>
                  </div>
                  <div
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 transform -rotate-1 hover:rotate-1 transition-transform">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3 animate-bounce">👙</span>
                      <span className="font-black text-xl">Dressz kód:</span>
                    </div>
                    <p className="ml-12 font-bold text-lg">A kedvenc Disney karaktered jelmezében</p>
                  </div>
                </div>
                <button
                    className="mt-6 w-full bg-white text-purple-600 py-4 rounded-2xl font-black text-xl hover:bg-yellow-200 transition-all transform hover:scale-105">
                  💍 OTT TALI
                </button>
              </div>

              {/* Reception */}
              <div
                  className="bg-gradient-to-br from-blue-400 to-green-400 text-white rounded-3xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="text-center mb-8">
                  <div
                      className="w-28 h-28 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg transform -rotate-12 hover:rotate-0 transition-transform">
                    <span className="text-5xl animate-pulse">🎉</span>
                  </div>
                  <h3 className="text-5xl font-black" style={{fontFamily: 'Dancing Script, cursive'}}>
                    Vacsi & Lagzi
                  </h3>
                </div>
                <div className="space-y-4">
                  <div
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 transform -rotate-1 hover:rotate-1 transition-transform">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3 animate-bounce">🕐</span>
                      <span className="font-black text-xl">Kezdés</span>
                    </div>
                    <p className="ml-12 font-bold text-lg">19:00 - Siess mert elfogy a kaja</p>
                  </div>
                  <div
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 transform rotate-1 hover:-rotate-1 transition-transform">
                    <div className="flex items-center mb-2">
                                        <span className="text-2xl mr-3 animate-bounce"
                                              style={{animationDuration: '2s'}}>🏚️</span>
                      <span className="font-black text-xl">Helyszin:</span>
                    </div>
                    <p className="ml-12 font-bold text-lg">Kurva drága tornaterem</p>
                  </div>
                  <div
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 transform -rotate-1 hover:rotate-1 transition-transform">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3 animate-pulse">🍕</span>
                      <span className="font-black text-xl">Vacsi</span>
                    </div>
                    <p className="ml-12 font-bold text-lg">16 fogásos korátlan kaviár</p>
                  </div>
                  <div
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 transform rotate-1 hover:-rotate-1 transition-transform">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3 animate-bounce">🎵</span>
                      <span className="font-black text-xl">Buli:</span>
                    </div>
                    <p className="ml-12 font-bold text-lg">Tánc és megborulás hajnali 3ig</p>
                  </div>
                </div>
                <button
                    className="mt-6 w-full bg-white text-green-600 py-4 rounded-2xl font-black text-xl hover:bg-yellow-200 transition-all transform hover:scale-105">
                  🎊 BULIZZUNK
                </button>
              </div>
            </div>

            {/* Accommodations */}
            <div
                className="mt-16 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-white rounded-3xl p-10 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="text-center mb-10">
                <div
                    className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl transform  hover:rotate-0 transition-transform">
                  <span className="text-6xl animate-bounce" style={{animationDuration: '4s'}}>🏨</span>
                </div>
                <h3 className="text-5xl font-black mb-4" style={{fontFamily: 'Dancing Script, cursive'}}>
                  Szállás & Közlekedés
                </h3>
              </div>


              {/*<div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform">*/}
              {/*  <div className="text-center mb-4">*/}
              {/*    <div className="text-4xl mb-2 animate-pulse">🏙️</div>*/}
              {/*    <h4 className="text-2xl font-black">DOWNTOWN AUSTIN</h4>*/}
              {/*  </div>*/}
              {/*  <div className="space-y-2 text-sm font-bold">*/}
              {/*    <p><span className="text-yellow-200">DISTANCE:</span> 10 minutes to venue</p>*/}
              {/*    <p><span className="text-yellow-200">PERKS:</span> Live music & food scene</p>*/}
              {/*    <p><span className="text-yellow-200">STYLE:</span> Hip & happening</p>*/}
              {/*  </div>*/}
              {/*  <button className="mt-4 w-full bg-white text-pink-600 py-2 font-black rounded-xl hover:bg-yellow-200 transition-colors">*/}
              {/*    EXPLORE OPTIONS*/}
              {/*  </button>*/}
              {/*</div>*/}

              <div className="grid md:grid-cols-2 gap-8 justify-between align-middle ">
                <div
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform -rotate-2 hover:rotate-0 transition-transform">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2 animate-bounce">🎪</div>
                    <h4 className="text-2xl font-black"> Ha kell Szállás</h4>
                  </div>
                  <div className="space-y-2 text-xl font-bold">
                    <p><span className="text-yellow-200 text-m">Akkor:</span> Ne keljen</p>
                  </div>
                  {/*<button className="mt-4 w-full bg-white text-purple-600 py-2 font-black rounded-xl hover:bg-yellow-200 transition-colors">*/}
                  {/*  BOOK THE FUN!*/}
                  {/*</button>*/}
                </div>


                <div
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform -rotate-2 hover:rotate-0 transition-transform">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2 animate-spin" style={{animationDuration: '3s'}}>🚗
                    </div>
                    <h4 className="text-2xl font-black">Fuvar</h4>
                  </div>
                  <div className="space-y-2 text-xl font-bold">
                    <p><span className="text-yellow-200">Oda: </span>Könyörögd be magad egy nyugger
                      rokon kocsijába</p>
                  </div>
                  <div className="space-y-2 text-xl font-bold">
                    <p><span className="text-yellow-200">Vissza: </span>Hivj taxit</p>
                  </div>
                  {/*<div className="mt-4 text-center text-yellow-200 text-sm font-black">*/}
                  {/*  "Let's keep the party going safely!" 🎉*/}
                  {/*</div>*/}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RSVP Section */}
        <section
            ref={rsvpAnimation.elementRef}
            id="rsvp"
            className={`py-20 bg-white relative overflow-hidden transition-all duration-1000 ease-out ${
                rsvpAnimation.isVisible
                    ? 'opacity-100 transform translate-x-0'
                    : 'opacity-0 transform translate-x-12'
            }`}
        >
          {/* Playful background elements */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute top-20 left-20 text-9xl text-pink-400 animate-spin"
                 style={{animationDuration: '10s'}}>🍷
            </div>
            <div className="absolute bottom-20 right-20 text-8xl text-purple-400 animate-bounce">🥙</div>
          </div>

          <div className="relative container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-7xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 pb-6 transform -rotate-1"
                  style={{fontFamily: 'Dancing Script, cursive'}}>
                Várjuk visszajelzésed!
              </h2>
              <div className="flex justify-center space-x-3 mb-8">
                <span className="text-5xl animate-bounce">💌</span>
                <span className="text-5xl animate-spin" style={{animationDuration: '2s'}}>❓</span>
                <span className="text-5xl animate-bounce" style={{animationDelay: '0.5s'}}>💌</span>
              </div>
              <p className="text-2xl font-bold text-purple-600 transform rotate-1">
                Legkésőbb Junius 1ig!
              </p>
            </div>

            <div
                className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-10 shadow-2xl border-4 border-rainbow transform rotate-1  transition-transform duration-500">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="transform -rotate-1 hover:rotate-0 transition-transform">
                    <label className="block text-purple-800 font-black mb-3 text-lg flex items-center">
                      <span className="text-2xl mr-2 ">🤠</span>
                      Név
                    </label>
                    <input
                        type="text"
                        className="w-full p-4 border-4 border-pink-300 rounded-2xl focus:outline-none focus:border-purple-500 bg-white/90 text-lg font-bold transform hover:scale-105 transition-transform"
                        placeholder="Név"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                    />
                  </div>
                  <div className="transform rotate-1 hover:rotate-0 transition-transform">
                    <label className="block text-purple-800 font-black mb-3 text-lg flex items-center">
                      <span className="text-2xl mr-2 animate-pulse">📧</span>
                      email cim
                    </label>
                    <input
                        type="email"
                        className="w-full p-4 border-4 border-blue-300 rounded-2xl focus:outline-none focus:border-purple-500 bg-white/90 text-lg font-bold transform hover:scale-105 transition-transform"
                        placeholder="email@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                  </div>
                </div>

                <div className="transform rotate-1 ">
                  <label className="block text-purple-800 font-black mb-3 text-lg flex items-center">
                                    <span className="text-2xl mr-2 animate-spin"
                                          style={{animationDuration: '3s'}}>❓</span>
                    Számíthatunk Rád?
                  </label>
                  <div className="flex gap-6">
                    <label
                        className="flex items-center text-purple-700 font-bold cursor-pointer transform hover:scale-105 transition-transform">
                      <input
                          type="radio"
                          name="attendance"
                          value="yes"
                          checked={formData.attendance === 'yes'}
                          onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                          className="mr-3 w-5 h-5 text-purple-600"
                          required
                      />
                      <span>Igen 🎉</span>
                    </label>
                    <label
                        className="flex items-center text-purple-700 font-bold cursor-pointer transform hover:scale-105 transition-transform">
                      <input
                          type="radio"
                          name="attendance"
                          value="no"
                          checked={formData.attendance === 'no'}
                          onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                          className="mr-3 w-5 h-5 text-purple-600"
                          required
                      />
                      <span>Nem 😢</span>
                    </label>
                  </div>
                </div>

                {formData.attendance === 'yes' && (
                    <>
                      <div className="transform -rotate-1 hover:rotate-1 transition-transform">
                        <label
                            className="block text-purple-800 font-black mb-3 text-lg flex items-center">
                          <span className="text-2xl mr-2 animate-bounce">🍕</span>
                          Kaja Választás
                        </label>
                        <select
                            className="w-full p-4 pr-12 border-4 border-orange-300 rounded-2xl focus:outline-none focus:border-purple-500 bg-white/90 text-lg font-bold transform hover:scale-105 transition-transform appearance-none cursor-pointer"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f97316'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 1rem center',
                              backgroundSize: '1.5rem'
                            }}
                            value={formData.meal}
                            onChange={(e) => setFormData({...formData, meal: e.target.value})}
                            required
                        >
                          <option value="">Kaja?</option>
                          <option value="gourmet-burger">🍔 Eszek kaját</option>
                          <option value="veggie-magic">🥗 Vega vagyok</option>
                        </select>
                      </div>

                      <div className="transform rotate-1 hover:-rotate-1 transition-transform">
                        <label
                            className="block text-purple-800 font-black mb-3 text-lg flex items-center">
                          <span className="text-2xl mr-2 animate-pulse">🌈</span>
                          Egyéni üzi
                        </label>
                        <textarea
                            className="w-full p-4 border-4 border-yellow-300 rounded-2xl focus:outline-none focus:border-purple-500 bg-white/90 text-lg font-bold transform hover:scale-105 transition-transform"
                            rows={4}
                            placeholder="Ha van valami extra amit el szeretnél mondnai itt megteheted"
                            value={formData.dietary}
                            onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                        />
                      </div>

                      {/*<div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-3xl p-6 transform -rotate-1 hover:rotate-0 transition-transform">*/}
                      {/*  <h4 className="text-2xl font-black text-purple-800 mb-4 flex items-center">*/}
                      {/*    <span className="text-3xl mr-2 animate-spin" style={{animationDuration: '2s'}}>🎮</span>*/}
                      {/*    Party Activities!*/}
                      {/*  </h4>*/}
                      {/*  <div className="grid md:grid-cols-2 gap-4">*/}
                      {/*    <label className="flex items-center text-purple-700 font-bold transform hover:scale-105 transition-transform">*/}
                      {/*      <input type="checkbox" className="mr-3 w-5 h-5 text-purple-600 rounded" />*/}
                      {/*      <span>🎪 Pre-party carnival games (1:00 PM)</span>*/}
                      {/*    </label>*/}
                      {/*    <label className="flex items-center text-purple-700 font-bold transform hover:scale-105 transition-transform">*/}
                      {/*      <input type="checkbox" className="mr-3 w-5 h-5 text-purple-600 rounded" />*/}
                      {/*      <span>📸 Crazy photo booth marathon</span>*/}
                      {/*    </label>*/}
                      {/*    <label className="flex items-center text-purple-700 font-bold transform hover:scale-105 transition-transform">*/}
                      {/*      <input type="checkbox" className="mr-3 w-5 h-5 text-purple-600 rounded" />*/}
                      {/*      <span>🕺 Dance-off competition</span>*/}
                      {/*    </label>*/}
                      {/*    <label className="flex items-center text-purple-700 font-bold transform hover:scale-105 transition-transform">*/}
                      {/*      <input type="checkbox" className="mr-3 w-5 h-5 text-purple-600 rounded" />*/}
                      {/*      <span>🎨 DIY craft corner chaos</span>*/}
                      {/*    </label>*/}
                      {/*  </div>*/}
                      {/*</div>*/}
                    </>
                )}

                <div className="text-center pt-6">
                  <button
                      type="submit"
                      className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-16 py-4 rounded-3xl text-2xl font-black hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all transform hover:scale-110 hover:rotate-2 shadow-2xl animate-pulse"
                  >💌 Elküld
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Registry Section */}
        {/*<section id="registry" className="py-20 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">*/}
        {/*  <div className="container mx-auto px-6 max-w-6xl text-center">*/}
        {/*    <div className="text-center mb-16">*/}
        {/*      <h2 className="text-7xl font-black bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-6 transform rotate-1" style={{fontFamily: 'Dancing Script, cursive'}}>*/}
        {/*        Gifts for Our Adventure!*/}
        {/*      </h2>*/}
        {/*      <div className="flex justify-center space-x-3 mb-8">*/}
        {/*        <span className="text-5xl animate-bounce">🎁</span>*/}
        {/*        <span className="text-5xl animate-spin" style={{animationDuration: '4s'}}>🌟</span>*/}
        {/*        <span className="text-5xl animate-bounce" style={{animationDelay: '0.5s'}}>🎁</span>*/}
        {/*      </div>*/}
        {/*    </div>*/}

        {/*    <p className="text-2xl font-bold text-purple-600 mb-12 max-w-4xl mx-auto transform -rotate-1">*/}
        {/*      Your presence is the best present! But if you want to add to our fun,*/}
        {/*      we've got some wild ideas that'll help us keep the party going at home!*/}
        {/*    </p>*/}

        {/*    <div className="grid md:grid-cols-3 gap-10">*/}
        {/*      <div className="bg-white rounded-3xl p-8 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-pink-300">*/}
        {/*        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 mx-auto mb-6 flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform">*/}
        {/*          <span className="text-5xl animate-bounce">🎮</span>*/}
        {/*        </div>*/}
        {/*        <h3 className="text-2xl font-black text-pink-600 mb-4">FUN & GAMES</h3>*/}
        {/*        <p className="text-purple-700 font-bold mb-6">Board games, video games, party supplies!</p>*/}
        {/*        <div className="bg-pink-100 rounded-2xl p-4 mb-6 transform rotate-1">*/}
        {/*          <p className="text-sm font-bold text-pink-800">*/}
        {/*            <strong>Target:</strong> Board games & party gear<br />*/}
        {/*            <strong>GameStop:</strong> Video game adventures<br />*/}
        {/*            <strong>Party City:</strong> Celebration supplies*/}
        {/*          </p>*/}
        {/*        </div>*/}
        {/*        <button className="bg-pink-500 text-white px-6 py-3 rounded-2xl hover:bg-pink-600 transition-colors font-black transform hover:scale-105">*/}
        {/*          🎮 GAME ON!*/}
        {/*        </button>*/}
        {/*      </div>*/}

        {/*      <div className="bg-white rounded-3xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-purple-300">*/}
        {/*        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 mx-auto mb-6 flex items-center justify-center shadow-lg transform -rotate-12 hover:rotate-0 transition-transform">*/}
        {/*          <span className="text-5xl animate-spin" style={{animationDuration: '3s'}}>🏠</span>*/}
        {/*        </div>*/}
        {/*        <h3 className="text-2xl font-black text-purple-600 mb-4">COLORFUL HOME</h3>*/}
        {/*        <p className="text-blue-700 font-bold mb-6">Funky furniture & rainbow decorations!</p>*/}
        {/*        <div className="bg-purple-100 rounded-2xl p-4 mb-6 transform -rotate-1">*/}
        {/*          <p className="text-sm font-bold text-purple-800">*/}
        {/*            <strong>IKEA:</strong> Colorful & affordable finds<br />*/}
        {/*            <strong>Urban Outfitters:</strong> Quirky home decor<br />*/}
        {/*            <strong>World Market:</strong> Global fun vibes*/}
        {/*          </p>*/}
        {/*        </div>*/}
        {/*        <button className="bg-purple-500 text-white px-6 py-3 rounded-2xl hover:bg-purple-600 transition-colors font-black transform hover:scale-105">*/}
        {/*          🏠 DECORATE!*/}
        {/*        </button>*/}
        {/*      </div>*/}

        {/*      <div className="bg-white rounded-3xl p-8 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-orange-300">*/}
        {/*        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 mx-auto mb-6 flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform">*/}
        {/*          <span className="text-5xl animate-pulse">✈️</span>*/}
        {/*        </div>*/}
        {/*        <h3 className="text-2xl font-black text-orange-600 mb-4">EPIC ADVENTURES</h3>*/}
        {/*        <p className="text-yellow-700 font-bold mb-6">Honeymoon fun fund!</p>*/}
        {/*        <div className="bg-orange-100 rounded-2xl p-4 mb-6 transform rotate-1">*/}
        {/*          <p className="text-sm font-bold text-orange-800">*/}
        {/*            <strong>Destination:</strong> Japan (theme parks!)<br />*/}
        {/*            <strong>Activities:</strong> Tokyo Disney, food tours<br />*/}
        {/*            <strong>Goal:</strong> Maximum fun & kawaii overload!*/}
        {/*          </p>*/}
        {/*        </div>*/}
        {/*        <button className="bg-orange-500 text-white px-6 py-3 rounded-2xl hover:bg-orange-600 transition-colors font-black transform hover:scale-105">*/}
        {/*          ✈️ FUND FUN!*/}
        {/*        </button>*/}
        {/*      </div>*/}
        {/*    </div>*/}

        {/*    <div className="mt-12 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 rounded-3xl p-8 shadow-2xl transform rotate-1 hover:-rotate-1 transition-transform duration-500">*/}
        {/*      <h3 className="text-4xl font-black text-white mb-4 flex items-center justify-center">*/}
        {/*        <span className="text-5xl mr-3 animate-spin" style={{animationDuration: '2s'}}>🎪</span>*/}
        {/*        Support Local Fun!*/}
        {/*      </h3>*/}
        {/*      <p className="text-xl font-bold text-white max-w-3xl mx-auto">*/}
        {/*        We love supporting local artists, small businesses, and Austin's creative community!*/}
        {/*        Anything handmade, locally sourced, or just plain weird and wonderful would make us super happy! 🌈*/}
        {/*      </p>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</section>*/}

        {/* Footer */}
        <footer
            className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white py-16 relative overflow-hidden">
          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-4 left-4 text-4xl animate-bounce">🎈</div>
            <div className="absolute top-4 right-4 text-3xl animate-pulse">⭐</div>
            <div className="absolute bottom-4 left-4 text-4xl animate-spin"
                 style={{animationDuration: '4s'}}>🎪
            </div>
            <div className="absolute bottom-4 right-4 text-3xl animate-bounce"
                 style={{animationDelay: '1s'}}>🎭
            </div>
          </div>

          <div className="relative container mx-auto px-6 text-center">
            <div className="flex justify-center space-x-3 text-6xl mb-6">
              <span className="animate-bounce">🥙</span>
              <span className="animate-pulse">💕</span>
              <span className="animate-bounce" style={{animationDelay: '0.5s'}}>🍷️</span>
            </div>
            <h3 className="text-5xl font-black mb-6 transform -rotate-1"
                style={{fontFamily: 'Dancing Script, cursive'}}>
              Marci & Gréti
            </h3>
            <p className="text-2xl font-bold mb-4">AUG 29, 2026</p>
            <p className="text-xl mb-8">Templom + Helyszin</p>
            <div
                className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 max-w-2xl mx-auto transform rotate-1 hover:-rotate-1 transition-transform">
              <p className="text-2xl font-black">
                Ünneplejük örök húségünk legendás megborulással!
              </p>
            </div>
          </div>
        </footer>

        {/* Custom CSS animations */}
        <style jsx global>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }

                @keyframes gentleBounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                .animate-gentle-bounce {
                    animation: gentleBounce 2s ease-in-out infinite;
                }

                @keyframes tick {
                    0% {
                        transform: rotate(0deg);
                    }
                    25% {
                        transform: rotate(90deg);
                    }
                    50% {
                        transform: rotate(180deg);
                    }
                    75% {
                        transform: rotate(270deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                @keyframes shake {
                    0%, 100% {
                        transform: translateX(0);
                    }
                    10%, 30%, 50%, 70%, 90% {
                        transform: translateX(-2px);
                    }
                    20%, 40%, 60%, 80% {
                        transform: translateX(2px);
                    }
                }

                .animate-tick {
                    animation: tick 4s linear infinite;
                }

                .animate-shake {
                    animation: shake 0.8s ease-in-out infinite;
                }

                /* Scroll animation enhancements */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                .scroll-smooth {
                    scroll-behavior: smooth;
                }
            `}</style>
      </div>
  );
}