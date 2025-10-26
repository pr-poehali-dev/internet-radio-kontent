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
        const response = await fetch('https://functions.poehali.dev/a14b9d39-d9b7-4c20-8ba3-a0ca8d113122');
        if (response.ok) {
          const data = await response.json();
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
        }
      } catch (error) {
        console.error('Error fetching track:', error);
      }
    };

    updateTrack();
    const interval = setInterval(updateTrack, 15000);
    
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

  const news = [
    {
      date: '25 октября 2025',
      title: 'Запуск нового утреннего шоу',
      text: 'С понедельника стартует обновленное утреннее шоу с Анной Смирновой',
    },
    {
      date: '23 октября 2025',
      title: 'Интервью со звездой',
      text: 'В эфире состоялось эксклюзивное интервью с популярным артистом',
    },
    {
      date: '20 октября 2025',
      title: 'Конкурс для слушателей',
      text: 'Объявляем старт нового конкурса с ценными призами для наших слушателей',
    },
  ];

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
              <Icon name="Radio" size={24} className="text-red-600" />
              <span>КонтентМедиа<span className="text-red-600">PRO</span></span>
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
                <span className="text-white">КонтентМедиа</span><span className="text-red-600">PRO</span>
              </h1>
              <p className="text-base md:text-2xl text-gray-400">
                Твоя музыка. Твой ритм.<br className="md:hidden" /> Твоя радиостанция.
              </p>
            </div>

            <Card className="bg-black/80 backdrop-blur-sm border-2 border-white/10 shadow-2xl animate-scale-in">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col items-center gap-6 md:gap-8 mb-8 md:mb-12">
                  <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow">
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
                    className="w-full md:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 md:py-6 px-8 md:px-12 text-base md:text-lg rounded-full shadow-lg hover:shadow-red-600/50 transition-all duration-300 hover:scale-105"
                  >
                    <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} className="mr-2 md:mr-3" />
                    {isPlaying ? 'Пауза' : 'Слушать'}
                  </Button>
                </div>

                <Separator className="my-6 md:my-8 bg-white/10" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 bg-white/5 rounded-lg">
                    <Icon name="Users" size={24} className="text-red-600 flex-shrink-0" />
                    <div>
                      <div className="text-xs md:text-sm text-gray-500">Слушателей онлайн</div>
                      <div className="text-lg md:text-2xl font-bold text-white">{displayedListeners}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 bg-white/5 rounded-lg">
                    <Icon name="Clock" size={24} className="text-red-600 flex-shrink-0" />
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
                <Icon name="Clock" size={24} className="text-red-600" />
                История треков
              </h2>
              <div className="space-y-2 md:space-y-3">
                {trackHistory.map((track, index) => (
                  <Card key={index} className="bg-black/60 backdrop-blur-sm border border-white/10 hover:border-red-600/50 transition-all duration-300">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-red-600/20 rounded-full flex items-center justify-center text-red-600 font-bold text-sm md:text-base flex-shrink-0">
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

            <div className="mt-8 md:mt-12 animate-fade-in">
              <h2 className="text-xl md:text-3xl font-bold font-heading text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                <Icon name="Newspaper" size={24} className="text-red-600" />
                Новости
              </h2>
              <div className="space-y-3 md:space-y-4">
                {news.map((item, index) => (
                  <Card key={index} className="bg-black/60 backdrop-blur-sm border border-white/10 hover:border-red-600/50 transition-all duration-300">
                    <CardContent className="p-4 md:p-6">
                      <div className="text-xs md:text-sm text-gray-500 mb-2">{item.date}</div>
                      <h3 className="text-base md:text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-sm md:text-base text-gray-400">{item.text}</p>
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
              <CardContent className="p-6 md:p-12">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <Icon name="Mail" size={24} className="text-red-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs md:text-sm text-gray-500 mb-1">Email</div>
                      <a href="mailto:info@kontentmediapro.ru" className="text-base md:text-xl text-white hover:text-red-600 transition-colors break-all">
                        info@kontentmediapro.ru
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <Icon name="Phone" size={24} className="text-red-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs md:text-sm text-gray-500 mb-1">Телефон</div>
                      <a href="tel:+79999999999" className="text-base md:text-xl text-white hover:text-red-600 transition-colors">
                        +7 (999) 999-99-99
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <Icon name="MapPin" size={24} className="text-red-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs md:text-sm text-gray-500 mb-1">Адрес</div>
                      <p className="text-base md:text-xl text-white">Москва, Россия</p>
                    </div>
                  </div>
                </div>
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
