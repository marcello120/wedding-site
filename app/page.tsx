'use client';

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

        const el = elementRef.current;
        if (el) {
            observer.observe(el);
        }

        return () => {
            if (el) {
                observer.unobserve(el);
            }
        };
    }, []);

    return {elementRef, isVisible};
}

function CountdownTimer({targetDate}: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                });
            } else {
                setTimeLeft({days: 0, hours: 0, minutes: 0});
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Nap', 'Óra', 'Perc'].map((label) => (
                    <div key={label} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                        <div className="text-4xl md:text-5xl font-black">--</div>
                        <div className="text-sm font-bold uppercase tracking-wide">{label}</div>
                    </div>
                ))}
            </div>
        );
    }

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

const GUEST_NAMES: string[] = [];

export default function Design9() {
    const [formData, setFormData] = useState({ name: '', contact: '', attendance: '', guests: 1, comment: '' });
    const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formLocked, setFormLocked] = useState(false);
    const nameInputRef = useRef<HTMLDivElement>(null);

    // Hydrate state from localStorage on client
    useEffect(() => {
        const saved = localStorage.getItem('rsvp-data');
        if (saved) setFormData(JSON.parse(saved));
        if (localStorage.getItem('rsvp-submitted')) {
            setSubmitStatus('success');
            setFormLocked(true);
        }
    }, []);

    // Scroll animations for each section
    const heroAnimation = useScrollAnimation();
    const storyAnimation = useScrollAnimation();
    const detailsAnimation = useScrollAnimation();
    const rsvpAnimation = useScrollAnimation();

    // Mouse parallax effect state
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const heroRef = useRef<HTMLElement>(null);

    // Handle mouse movement for parallax effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100; // -50 to 50
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100; // -50 to 50
                setMousePosition({x, y});
            }
        };

        const heroElement = heroRef.current;
        if (heroElement) {
            heroElement.addEventListener('mousemove', handleMouseMove);
            return () => heroElement.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (nameInputRef.current && !nameInputRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNameChange = (value: string) => {
        setFormData({...formData, name: value});
        if (value.length > 0) {
            const filtered = GUEST_NAMES.filter(name =>
                name.toLowerCase().includes(value.toLowerCase())
            );
            setNameSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectName = (name: string) => {
        setFormData({...formData, name});
        setShowSuggestions(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('loading');
        try {
            await fetch('https://script.google.com/macros/s/AKfycbxPj2_kUfrY_dnNjfTjmeI5RS0aWcAHPMFwDA66VETBX6VelaTX5JfsDCM112c2TKS5hQ/exec', {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(formData),
            });
            localStorage.setItem('rsvp-data', JSON.stringify(formData));
            localStorage.setItem('rsvp-submitted', 'true');
            setSubmitStatus('success');
            setFormLocked(true);
        } catch {
            setSubmitStatus('error');
        }
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
                        <a href="#home"
                           className="text-pink-600 hover:text-pink-700 transition-colors font-bold flex items-center transform hover:scale-105">
                            <span className="mr-2 text-2xl">💖</span>
                            Gréti & Marci
                        </a>
                        <div className="hidden md:flex space-x-4">
                            <a href="#home"
                               className="text-pink-600 hover:text-white hover:bg-pink-600 transition-all font-bold transform hover:scale-110 bg-pink-100 px-4 py-2 rounded-full shadow-md border-2 border-pink-300">💍</a>
                            <a href="#story"
                               className="text-purple-600 hover:text-white hover:bg-purple-600 transition-all font-bold transform hover:scale-110 bg-purple-100 px-4 py-2 rounded-full shadow-md border-2 border-purple-300">🌄</a>
                            <a href="#details"
                               className="text-blue-600 hover:text-white hover:bg-blue-600 transition-all font-bold transform hover:scale-110 bg-blue-100 px-4 py-2 rounded-full shadow-md border-2 border-blue-300">🍾</a>
                            <a href="#rsvp"
                               className="text-green-600 hover:text-white hover:bg-green-600 transition-all font-bold transform hover:scale-110 bg-green-100 px-4 py-2 rounded-full shadow-md border-2 border-green-300">💌</a>
                            <a href="#timeline"
                               className="text-orange-600 hover:text-white hover:bg-orange-600 transition-all font-bold transform hover:scale-110 bg-orange-100 px-4 py-2 rounded-full shadow-md border-2 border-orange-300">📋</a>
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
                                Gréti &  Marci
                            </h1>
                            <div
                                className="absolute -top-4 -right-4 text-4xl animate-spin transition-transform duration-100"
                                style={{
                                    animationDuration: '3s',
                                }}>✨
                            </div>
                            <div
                                className="absolute -bottom-4 -left-4 text-3xl animate-tick transition-transform duration-100"
                            >🎈
                            </div>
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
                            <p className="text-3xl font-black text-purple-600 mb-3 animate-pulse">Szeptember 19,
                                2026</p>
                            <div
                                className="flex items-center justify-center bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-3">
                                <span className="text-lg text-purple-700 font-bold">15:30 Egyházi szertartás</span>
                            </div>
                            <p className="text-lg text-blue-600 mb-4">1173 Árpád Házi Szent Erzsébet park</p>
                            <div
                                className="flex items-center justify-center bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-3">
                                <span className="text-lg text-purple-700 font-bold">17:00 Polgári szertartás, Vacsora és Party</span>
                            </div>
                            <p className="text-lg text-blue-600 mb-4">1173 Pesti út 115</p>
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
                                <CountdownTimer targetDate="2026-09-19T15:30:00"/>
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
                            Szeretettel várunk Téged az Esküvönkön!
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
                                        <span className="font-black text-xl">Kezdés:</span>
                                    </div>
                                    <p className="ml-12 font-bold text-lg">15:30 (seggek a padon)</p>
                                </div>
                                <div
                                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 transform -rotate-1 hover:rotate-1 transition-transform">
                                    <div className="flex items-center mb-2">
                                        <span className="text-2xl mr-3 animate-pulse">🎪</span>
                                        <span className="font-black text-xl">Helyszin:</span>
                                    </div>
                                    <p className="ml-12 font-bold text-lg">Árpádházi Szent Erzsébet templom</p>
                                </div>
                                <div
                                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 transform rotate-1 hover:-rotate-1 transition-transform">
                                    <div className="flex items-center mb-2">
                                        <span className="text-2xl mr-3">📍</span>
                                        <span className="font-black text-xl">Cim:</span>
                                    </div>
                                    <p className="ml-12 font-bold text-lg">Árpád-házi Szent Erzsébet park 1, 1171</p>
                                </div>
                                <div
                                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 transform -rotate-1 hover:rotate-1 transition-transform">
                                    <div className="flex items-center mb-2">
                                        <span className="text-2xl mr-3 animate-bounce">👙</span>
                                        <span className="font-black text-xl">Dressz kód:</span>
                                    </div>
                                    <p className="ml-12 font-bold text-lg">Kérlek, viselj ruhát. Opcionálisan szépet</p>
                                </div>
                            </div>
                            <a
                                href="https://maps.app.goo.gl/PAAxnTdTW3xvy5kd9"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 block w-full bg-white text-purple-600 py-4 rounded-2xl font-black text-xl hover:bg-yellow-200 transition-all transform hover:scale-105 text-center"
                            >
                                💍 OTT TALI
                            </a>
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
                                    <p className="ml-12 font-bold text-lg">17:00 - Polgári szertartás</p>
                                </div>
                                <div
                                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 transform rotate-1 hover:-rotate-1 transition-transform">
                                    <div className="flex items-center mb-2">
                                        <span className="text-2xl mr-3 animate-bounce"
                                              style={{animationDuration: '2s'}}>🏚️</span>
                                        <span className="font-black text-xl">Helyszin:</span>
                                    </div>
                                    <p className="ml-12 font-bold text-lg">Podmaniczky-Vigyázó Rendezvénykastély</p>
                                </div>
                                <div
                                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 transform -rotate-1 hover:rotate-1 transition-transform">
                                    <div className="flex items-center mb-2">
                                        <span className="text-2xl mr-3 animate-pulse">📍</span>
                                        <span className="font-black text-xl">Cim</span>
                                    </div>
                                    <p className="ml-12 font-bold text-lg">Pesti út 115, 1173</p>
                                </div>
                                <div
                                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 transform rotate-1 hover:-rotate-1 transition-transform">
                                    <div className="flex items-center mb-2">
                                        <span className="text-2xl mr-3 animate-bounce">🎵</span>
                                        <span className="font-black text-xl">Program:</span>
                                    </div>
                                    <p className="ml-12 font-bold text-lg">Vacsora, Játékok, Tánc, Megborulás</p>
                                </div>
                            </div>
                            <a
                                href="https://maps.app.goo.gl/sh9o2jFxEKQobMMx5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 block w-full bg-white text-green-600 py-4 rounded-2xl font-black text-xl hover:bg-yellow-200 transition-all transform hover:scale-105 text-center"
                            >
                                🎊 BULIZZUNK
                            </a>
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



                        <div className="grid md:grid-cols-2 gap-8 justify-between align-middle ">
                            <div
                                className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform -rotate-2 hover:rotate-0 transition-transform">
                                <div className="text-center mb-4">
                                    <div className="text-4xl mb-2 animate-bounce">🎪</div>
                                    <h4 className="text-2xl font-black"> Ha kell Szállás</h4>
                                </div>
                                <div className="space-y-2 text-xl font-bold">
                                    <p><span className="text-yellow-200 text-m">Akkor:</span> Ne keljen.</p>
                                    <p><span className="text-yellow-200 text-m">Ha nagyon kell:</span> Keresd fel pesti rokonaid/barátaid vagy szólj nekünk.</p>

                                </div>
                            </div>


                            <div
                                className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform -rotate-2 gap-3 hover:rotate-0 transition-transform">
                                <div className="text-center mb-4">
                                    <div className="text-4xl mb-2 animate-spin" style={{animationDuration: '3s'}}>🚗
                                    </div>
                                    <h4 className="text-2xl font-black">Fuvar</h4>
                                </div>
                                <div className="space-y-2 text-xl font-bold">
                                    <p><span className="text-yellow-200">Oda: </span>A helyszínek jól megközelíthetők tömegközlekedéssel (Örs vezér teréről: 90E, 161 vagy 169E busz). Vagy kérd be magad egy absztinens kocsijába.</p>
                                </div>
                                <div className="space-y-2 text-xl font-bold">
                                    <p><span className="text-yellow-200">Közben: </span>A templom és a kastély közt gondoskodunk saját buszról</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Wedding Timeline */}
            <section
                id="timeline"
                className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50"
            >
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-7xl p-12 font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
                            style={{fontFamily: 'Dancing Script, cursive'}}>
                            A Nagy Nap Menetrendje
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-pink-400 via-purple-400 to-blue-400 rounded-full"></div>

                        {/* Timeline items */}
                        <div className="space-y-12">
                            {/* 15:00 */}
                            <div className="relative flex items-center">
                                <div className="w-1/2 pr-8 text-right">
                                    <div className="bg-gradient-to-r from-pink-200 to-pink-300 rounded-2xl p-4 transform -rotate-1 hover:rotate-0 transition-transform shadow-lg inline-block">
                                        <p className="font-black text-pink-800 text-xl">15:00</p>
                                        <p className="font-bold text-pink-700">Gyülekezés a templomnál</p>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-pink-400 flex items-center justify-center shadow-lg z-10">
                                    <span className="text-xl">⛪</span>
                                </div>
                                <div className="w-1/2 pl-8"></div>
                            </div>

                            {/* 15:30 */}
                            <div className="relative flex items-center">
                                <div className="w-1/2 pr-8"></div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-purple-400 flex items-center justify-center shadow-lg z-10">
                                    <span className="text-xl">💒</span>
                                </div>
                                <div className="w-1/2 pl-8">
                                    <div className="bg-gradient-to-r from-purple-200 to-purple-300 rounded-2xl p-4 transform rotate-1 hover:rotate-0 transition-transform shadow-lg inline-block">
                                        <p className="font-black text-purple-800 text-xl">15:30</p>
                                        <p className="font-bold text-purple-700">Egyházi szertartás</p>
                                    </div>
                                </div>
                            </div>

                            {/* 16:30 */}
                            <div className="relative flex items-center">
                                <div className="w-1/2 pr-8 text-right">
                                    <div className="bg-gradient-to-r from-orange-200 to-yellow-200 rounded-2xl p-4 transform rotate-1 hover:rotate-0 transition-transform shadow-lg inline-block">
                                        <p className="font-black text-orange-800 text-xl">16:30</p>
                                        <p className="font-bold text-orange-700">Vendégvárás a kastélyba</p>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-orange-400 flex items-center justify-center shadow-lg z-10">
                                    <span className="text-xl">🚗</span>
                                </div>
                                <div className="w-1/2 pl-8"></div>
                            </div>

                            {/* 17:00 */}
                            <div className="relative flex items-center">
                                <div className="w-1/2 pr-8"></div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-blue-400 flex items-center justify-center shadow-lg z-10">
                                    <span className="text-xl">💍</span>
                                </div>
                                <div className="w-1/2 pl-8">
                                    <div className="bg-gradient-to-r from-blue-200 to-blue-300 rounded-2xl p-4 transform -rotate-1 hover:rotate-0 transition-transform shadow-lg inline-block">
                                        <p className="font-black text-blue-800 text-xl">17:00</p>
                                        <p className="font-bold text-blue-700">Polgári szertartás</p>
                                    </div>
                                </div>
                            </div>

                            {/* 18:00 */}
                            <div className="relative flex items-center">
                                <div className="w-1/2 pr-8 text-right">
                                    <div className="bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl p-4 transform -rotate-1 hover:rotate-0 transition-transform shadow-lg inline-block">
                                        <p className="font-black text-green-800 text-xl">19:00</p>
                                        <p className="font-bold text-green-700">Vacsora</p>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-green-400 flex items-center justify-center shadow-lg z-10">
                                    <span className="text-xl">🍽️</span>
                                </div>
                                <div className="w-1/2 pl-8"></div>
                            </div>

                            {/* 20:00 */}
                            <div className="relative flex items-center">
                                <div className="w-1/2 pr-8"></div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-yellow-400 flex items-center justify-center shadow-lg z-10">
                                    <span className="text-xl">🎉</span>
                                </div>
                                <div className="w-1/2 pl-8">
                                    <div className="bg-gradient-to-r from-yellow-200 to-amber-200 rounded-2xl p-4 transform rotate-1 hover:rotate-0 transition-transform shadow-lg inline-block">
                                        <p className="font-black text-yellow-800 text-xl">21:00</p>
                                        <p className="font-bold text-yellow-700">Buli Hajnalig</p>
                                    </div>
                                </div>
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
                            Legkésőbb Augusztus 8.-ig!
                        </p>
                    </div>

                    <div
                        className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-10 shadow-2xl border-4 border-rainbow transform rotate-1  transition-transform duration-500 relative">
                        {formLocked && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-3xl z-40 flex flex-col items-center justify-center space-y-4">
                                <div className="text-5xl">✅</div>
                                <p className="text-2xl font-black text-green-600 text-center px-4">Már visszajeleztél!</p>
                                <p className="text-lg font-bold text-purple-600 text-center px-4">Ha módosítani szeretnéd, kattints ide:</p>
                                <button
                                    type="button"
                                    onClick={() => { setFormLocked(false); setSubmitStatus('idle'); }}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl text-lg font-black hover:scale-105 transition-transform shadow-xl"
                                >🔓 Módosítás
                                </button>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-8" inert={formLocked || undefined}>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="transform -rotate-1 hover:rotate-0 transition-transform relative z-10" ref={nameInputRef}>
                                    <label className="block text-purple-800 font-black mb-3 text-lg flex items-center">
                                        <span className="text-2xl mr-2 ">🤠</span>
                                        Név
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-4 border-4 border-pink-300 rounded-2xl focus:outline-none focus:border-purple-500 bg-white/90 text-lg font-bold transform hover:scale-105 transition-transform"
                                        placeholder="Vendég vagy család neve"
                                        value={formData.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        onFocus={() => { if (formData.name) handleNameChange(formData.name); }}
                                        required
                                        autoComplete="off"
                                    />
                                    {showSuggestions && (
                                        <ul className="absolute z-50 w-full mt-2 bg-white border-4 border-pink-300 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                                            {nameSuggestions.map((name) => (
                                                <li
                                                    key={name}
                                                    className="px-4 py-3 text-lg font-bold text-purple-800 cursor-pointer hover:bg-pink-100 transition-colors"
                                                    onMouseDown={() => selectName(name)}
                                                >
                                                    {name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="transform rotate-1 hover:rotate-0 transition-transform">
                                    <label className="block text-purple-800 font-black mb-3 text-lg flex items-center">
                                        <span className="text-2xl mr-2 animate-pulse">📧</span>
                                        Email vagy telefonszám
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-4 border-4 border-blue-300 rounded-2xl focus:outline-none focus:border-purple-500 bg-white/90 text-lg font-bold transform hover:scale-105 transition-transform"
                                        placeholder="email@gmail.com vagy +36 20 123 4567"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({...formData, contact: e.target.value})}
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
                                        className={`flex-1 flex items-center justify-center gap-3 cursor-pointer rounded-2xl border-4 p-5 text-xl font-black transition-all duration-300 transform hover:scale-105 ${
                                            formData.attendance === 'yes'
                                                ? 'border-green-400 bg-green-100 text-green-700 scale-105 shadow-lg shadow-green-200'
                                                : 'border-pink-300 bg-white/80 text-purple-700 hover:border-green-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="attendance"
                                            value="yes"
                                            checked={formData.attendance === 'yes'}
                                            onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                                            className="hidden"
                                            required
                                        />
                                        <span className="text-3xl">🎉</span>
                                        <span>Igen</span>
                                    </label>
                                    <label
                                        className={`flex-1 flex items-center justify-center gap-3 cursor-pointer rounded-2xl border-4 p-5 text-xl font-black transition-all duration-300 transform hover:scale-105 ${
                                            formData.attendance === 'no'
                                                ? 'border-red-400 bg-red-100 text-red-700 scale-105 shadow-lg shadow-red-200'
                                                : 'border-pink-300 bg-white/80 text-purple-700 hover:border-red-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="attendance"
                                            value="no"
                                            checked={formData.attendance === 'no'}
                                            onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                                            className="hidden"
                                            required
                                        />
                                        <span className="text-3xl">😢</span>
                                        <span>Nem</span>
                                    </label>
                                </div>
                            </div>

                            {formData.attendance === 'yes' && (
                                <>
                                    <div className="transform rotate-1 hover:-rotate-1 transition-transform md:w-1/2">
                                        <label
                                            className="block text-purple-800 font-black mb-3 text-lg flex items-center">
                                            <span className="text-2xl mr-2 animate-bounce">👥</span>
                                            Hány fő?
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({...formData, guests: Math.max(1, (Number(formData.guests) || 1) - 1)})}
                                                className="w-14 h-14 flex items-center justify-center border-4 border-purple-300 rounded-2xl bg-white/90 text-2xl font-black text-purple-600 hover:bg-purple-100 hover:scale-110 transition-all"
                                            >−</button>
                                            <input
                                                type="number"
                                                min="1"
                                                max="10"
                                                className="flex-1 p-4 border-4 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 bg-white/90 text-xl font-black text-center transition-transform [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                value={formData.guests}
                                                onChange={(e) => setFormData({...formData, guests: e.target.value === '' ? '' as unknown as number : parseInt(e.target.value)})}
                                                onBlur={(e) => { if (!e.target.value || parseInt(e.target.value) < 1) setFormData({...formData, guests: 1}); }}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({...formData, guests: Math.min(10, (Number(formData.guests) || 1) + 1)})}
                                                className="w-14 h-14 flex items-center justify-center border-4 border-purple-300 rounded-2xl bg-white/90 text-2xl font-black text-purple-600 hover:bg-purple-100 hover:scale-110 transition-all"
                                            >+</button>
                                        </div>
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
                                            value={formData.comment}
                                            onChange={(e) => setFormData({...formData, comment: e.target.value})}
                                        />
                                    </div>

                                </>
                            )}

                            {submitStatus === 'success' ? (
                                <div className="text-center pt-6 space-y-4">
                                    <div className="text-6xl animate-bounce">🎉</div>
                                    <p className="text-2xl font-black text-green-600">Köszönjük! Megkaptuk a visszajelzésed!</p>
                                </div>
                            ) : submitStatus === 'error' ? (
                                <div className="text-center pt-6 space-y-4">
                                    <div className="text-6xl">😥</div>
                                    <p className="text-2xl font-black text-red-600">Hoppá! Valami hiba történt.</p>
                                    <button
                                        type="button"
                                        onClick={() => setSubmitStatus('idle')}
                                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-3 rounded-2xl text-lg font-black hover:scale-105 transition-transform shadow-xl"
                                    >Próbáld újra
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center pt-6">
                                    <button
                                        type="submit"
                                        disabled={submitStatus === 'loading'}
                                        className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-16 py-4 rounded-3xl text-2xl font-black hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all transform hover:scale-110 hover:rotate-2 shadow-2xl disabled:opacity-50 disabled:hover:scale-100 disabled:hover:rotate-0"
                                    >{submitStatus === 'loading' ? '⏳ Küldés...' : '💌 Elküld'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>

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
                        <span className="animate-bounce">🍷</span>
                        <span className="animate-pulse">💕</span>
                        <span className="animate-bounce" style={{animationDelay: '0.5s'}}>🥙️</span>
                    </div>
                    <h3 className="text-5xl font-black mb-6 transform -rotate-1"
                        style={{fontFamily: 'Dancing Script, cursive'}}>
                        Gréti &  Marci
                    </h3>
                    <p className="text-2xl font-bold mb-4">SEP 19, 2026</p>
                    <p className="text-xl mb-8">Szent Erzsébet templom ● Podmaniczky Kastély</p>
                    <div
                        className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 max-w-2xl mx-auto transform rotate-1 hover:-rotate-1 transition-transform">
                        <p className="text-2xl font-black">
                            Ünnepeljük örök hűségünk legendás megborulással!
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