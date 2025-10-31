import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({ artist: 'Загрузка...', title: '' });
  const [listeners, setListeners] = useState(778);
  const [displayedListeners, setDisplayedListeners] = useState(778);
  const [trackHistory, setTrackHistory] = useState<Array<{artist: string, title: string}>>([]);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const updateTrack = async () => {
      try {
        console.log('Fetching track info...');
        const response = await fetch('https://functions.poehali.dev/a14b9d39-d9b7-4c20-8ba3-a0ca8d113122');
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Track data:', data);
          
          if (data && data.artist && data.title) {
            const newTrack = { artist: data.artist, title: data.title };
            
            setCurrentTrack(newTrack);
            
            setTrackHistory(prev => {
              if (prev.length === 0 || prev[0].artist !== data.artist || prev[0].title !== data.title) {
                return [newTrack, ...prev].slice(0, 9);
              }
              return prev;
            });
          }
        } else {
          console.error('Response not OK:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching track:', error);
      }
    };

    updateTrack();
    const interval = setInterval(updateTrack, 900000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateListeners = () => {
      setListeners(prev => {
        const change = Math.floor(Math.random() * 21) - 10;
        const newValue = prev + change;
        return Math.max(778, Math.min(2000, newValue));
      });
    };

    const getRandomInterval = () => Math.floor(Math.random() * 3000) + 5000;
    
    const scheduleNext = () => {
      const delay = getRandomInterval();
      return setTimeout(() => {
        updateListeners();
        scheduleNext();
      }, delay);
    };
    
    const timeoutId = scheduleNext();
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const duration = 1500;
    const startValue = displayedListeners;
    const endValue = listeners;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      const currentValue = Math.round(startValue + (endValue - startValue) * easedProgress);
      setDisplayedListeners(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [listeners]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'КонтентМедиаPRO',
      text: `Слушаю: ${currentTrack.artist} — ${currentTrack.title}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Ссылка скопирована в буфер обмена!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const scrollToSection = (section: string) => {
    setCurrentSection(section);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-2 text-base md:text-2xl font-bold font-heading text-white hover:opacity-80 transition-opacity"
            >
              <Icon name="Radio" size={24} className="text-primary" />
              <span>КонтентМедиа<span className="text-primary">PRO</span></span>
            </button>
            
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>

            <div className="hidden md:flex gap-6">
              {[
                { id: 'home', label: 'Главная' },
                { id: 'contacts', label: 'Контакты' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-colors ${
                    currentSection === item.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-fade-in">
              {[
                { id: 'home', label: 'Главная' },
                { id: 'contacts', label: 'Контакты' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-colors text-left ${
                    currentSection === item.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <main className="pt-20">
        <section id="home" className="min-h-screen flex items-center justify-center px-4">
          <div className="container mx-auto max-w-4xl animate-fade-in">
            <div className="text-center mb-12 md:mb-16">
              <div className="mb-8 md:mb-12 flex justify-center">
                <img 
                  src="https://cdn.poehali.dev/files/0b6cba82-83b0-43c5-8a66-cd437a298dc4.jpg" 
                  alt="КонтентМедиа PRO" 
                  className="w-64 md:w-96 h-auto mix-blend-screen"
                />
              </div>
              <h1 className="text-3xl md:text-7xl font-bold font-heading mb-6 md:mb-8">
                <span className="text-white">КонтентМедиа</span><span className="text-primary">PRO</span>
              </h1>
              <p className="text-base md:text-2xl text-gray-400">
                Твоя музыка. Твой ритм.<br className="md:hidden" /> Твоя радиостанция.
              </p>
            </div>

            <Card className="bg-black/80 backdrop-blur-sm border-2 border-white/10 shadow-2xl animate-scale-in">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col items-center gap-6 md:gap-8 mb-8 md:mb-12">
                  <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-primary to-orange-700 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow">
                      <Icon name="Radio" size={48} className="text-white md:w-16 md:h-16" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-black animate-pulse"></div>
                  </div>

                  <div className="text-center w-full">
                    <div className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">Сейчас в эфире</div>
                    <div className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2 truncate px-4">
                      {currentTrack.artist}
                    </div>
                    <div className="text-base md:text-xl text-gray-400 truncate px-4">
                      {currentTrack.title}
                    </div>
                  </div>

                  <Button
                    onClick={togglePlay}
                    size="lg"
                    className="w-full md:w-auto bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white font-bold py-4 md:py-6 px-8 md:px-12 text-base md:text-lg rounded-full shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                  >
                    <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} className="mr-2 md:mr-3" />
                    {isPlaying ? 'Пауза' : 'Слушать'}
                  </Button>
                </div>

                <Separator className="my-6 md:my-8 bg-white/10" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <Icon name="Users" size={24} className="text-primary flex-shrink-0" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm text-gray-500">Сейчас слушают</div>
                      <div className="text-lg md:text-2xl font-bold text-white">{displayedListeners}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 bg-white/5 rounded-lg">
                    <Icon name="Clock" size={24} className="text-primary flex-shrink-0" />
                    <div>
                      <div className="text-xs md:text-sm text-gray-500">В эфире</div>
                      <div className="text-lg md:text-2xl font-bold text-white">24/7</div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 text-sm md:text-base py-3 md:py-4"
                >
                  <Icon name="Share2" size={18} className="mr-2" />
                  Поделиться с друзьями
                </Button>
              </CardContent>
            </Card>

            <div className="mt-8 md:mt-12 animate-fade-in">
              <h2 className="text-xl md:text-3xl font-bold font-heading text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                <Icon name="Clock" size={24} className="text-primary" />
                История треков
              </h2>
              <div className="space-y-2 md:space-y-3">
                {trackHistory.map((track, index) => (
                  <Card key={index} className="bg-black/60 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm md:text-base flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-sm md:text-base truncate">{track.artist}</div>
                          <div className="text-xs md:text-sm text-gray-400 truncate">{track.title}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contacts" className="min-h-screen flex items-center justify-center px-4 py-12 md:py-20">
          <div className="container mx-auto max-w-4xl animate-fade-in">
            <h2 className="text-2xl md:text-5xl font-bold font-heading text-white mb-6 md:mb-12 text-center">
              Свяжитесь с нами
            </h2>
            
            <Card className="bg-black/80 backdrop-blur-sm border-2 border-white/10 shadow-2xl">
              <CardContent className="p-6 md:p-12 text-center">
                <p className="text-sm md:text-lg text-gray-300 mb-6 md:mb-8">
                  По всем вопросам и предложениям пишите нам в лс сообщества
                </p>
                <a
                  href="https://vk.com/kontentmediapro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-base md:text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.39 14.74c-.29.37-.85.64-1.38.64-.03 0-.05 0-.08-.01-.7-.07-1.35-.53-2.17-1.13-.69-.51-1.47-1.08-2.37-1.08-.03 0-.06 0-.09.01-.95.07-1.65.7-2.31 1.29-.47.43-.95.86-1.51 1.09-.21.09-.43.13-.65.13-.49 0-.96-.19-1.31-.54-.69-.69-.88-1.82-.5-2.88.36-1 1.22-1.94 2.36-2.58.88-.49 1.88-.74 2.89-.74.39 0 .78.04 1.16.11 1.5.28 2.7 1.2 3.32 2.54.55 1.19.59 2.57.09 3.79-.11.27-.27.4-.45.4z"/>
                  </svg>
                  Написать ВКонтакте
                </a>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <audio
        ref={audioRef}
        src="http://myradio24.org/54137"
        preload="none"
      />
    </div>
  );
};

export default Index;