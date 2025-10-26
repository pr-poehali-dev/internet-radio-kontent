import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({ artist: 'Загрузка...', title: '' });
  const [listeners, setListeners] = useState(778);
  const [displayedListeners, setDisplayedListeners] = useState(778);
  const [trackHistory, setTrackHistory] = useState<Array<{artist: string, title: string}>>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

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

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    
    setDeferredPrompt(null);
  };

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
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-32">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-2 text-lg font-bold text-white hover:opacity-80 transition-opacity"
            >
              <Icon name="Radio" size={20} className="text-red-500" />
              <span>КонтентМедиа<span className="text-red-500">PRO</span></span>
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-16 px-4">
        <section id="home" className="container mx-auto max-w-2xl">
          <div className="mb-6 pt-6">
            <div className="text-center mb-6">
              <img 
                src="https://cdn.poehali.dev/files/0b6cba82-83b0-43c5-8a66-cd437a298dc4.jpg" 
                alt="КонтентМедиа PRO" 
                className="w-32 h-auto mx-auto mix-blend-screen mb-4"
              />
              <h1 className="text-2xl font-bold mb-2">
                <span className="text-white">КонтентМедиа</span><span className="text-red-500">PRO</span>
              </h1>
              <p className="text-sm text-gray-400">
                Твоя музыка. Твой ритм. Твоя радиостанция.
              </p>
            </div>

            <Card className="bg-gray-800/90 backdrop-blur border-gray-700 shadow-xl mb-4 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Icon name="Music" size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Сейчас играет</div>
                      <div className="font-semibold text-white text-sm">{currentTrack.artist}</div>
                      <div className="text-xs text-gray-400">{currentTrack.title}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Icon name="Users" size={14} />
                    <span>{displayedListeners} слушателей</span>
                  </div>
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    <Icon name="Share2" size={14} />
                    <span>Поделиться</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {showInstallBanner && (
              <Card className="bg-gradient-to-r from-red-500 to-red-600 border-0 shadow-xl mb-4 rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Icon name="Download" size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">Установить приложение</div>
                        <div className="text-xs text-white/80">Слушай радио в любое время</div>
                      </div>
                    </div>
                    <button
                      onClick={handleInstallClick}
                      className="bg-white text-red-600 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Установить
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Icon name="Clock" size={18} className="text-red-500" />
                История треков
              </h2>
              <div className="space-y-2">
                {trackHistory.map((track, index) => (
                  <Card key={index} className="bg-gray-800/70 backdrop-blur border-gray-700 rounded-xl overflow-hidden hover:bg-gray-800/90 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white text-sm truncate">{track.artist}</div>
                          <div className="text-xs text-gray-400 truncate">{track.title}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="news" className="container mx-auto max-w-2xl mb-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Icon name="Newspaper" size={18} className="text-red-500" />
            Новости
          </h2>
          <div className="space-y-2">
            {news.map((item, index) => (
              <Card key={index} className="bg-gray-800/70 backdrop-blur border-gray-700 rounded-xl overflow-hidden hover:bg-gray-800/90 transition-colors">
                <CardContent className="p-4">
                  <div className="text-xs text-gray-500 mb-1">{item.date}</div>
                  <div className="font-semibold text-white text-sm mb-1">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.text}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="contacts" className="container mx-auto max-w-2xl mb-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Icon name="MessageCircle" size={18} className="text-red-500" />
            Контакты
          </h2>
          <Card className="bg-gray-800/70 backdrop-blur border-gray-700 rounded-xl overflow-hidden">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-300 mb-4">
                По всем вопросам и предложениям пишите нам в лс сообщества
              </p>
              <a
                href="https://vk.com/kontentmediapro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.39 14.74c-.29.37-.85.64-1.38.64-.03 0-.05 0-.08-.01-.7-.07-1.35-.53-2.17-1.13-.69-.51-1.47-1.08-2.37-1.08-.03 0-.06 0-.09.01-.95.07-1.65.7-2.31 1.29-.47.43-.95.86-1.51 1.09-.21.09-.43.13-.65.13-.49 0-.96-.19-1.31-.54-.69-.69-.88-1.82-.5-2.88.36-1 1.22-1.94 2.36-2.58.88-.49 1.88-.74 2.89-.74.39 0 .78.04 1.16.11 1.5.28 2.7 1.2 3.32 2.54.55 1.19.59 2.57.09 3.79-.11.27-.27.4-.45.4z"/>
                </svg>
                Написать ВКонтакте
              </a>
            </CardContent>
          </Card>
        </section>
      </main>

      <div className="fixed bottom-16 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-t border-gray-700/50 shadow-2xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <Icon name="Radio" size={20} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white text-sm truncate">{currentTrack.artist}</div>
                <div className="text-xs text-gray-400 truncate">{currentTrack.title}</div>
              </div>
            </div>
            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 flex-shrink-0 ml-3"
            >
              <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700/50 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around max-w-2xl mx-auto">
            <button
              onClick={() => scrollToSection('home')}
              className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
                currentSection === 'home' ? 'text-red-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon name="Home" size={20} />
              <span className="text-xs font-medium">Главная</span>
            </button>
            <button
              onClick={() => scrollToSection('home')}
              className="flex flex-col items-center gap-1 py-3 px-4 text-gray-400 hover:text-white transition-colors"
            >
              <Icon name="ListMusic" size={20} />
              <span className="text-xs font-medium">Треки</span>
            </button>
            <button
              onClick={() => scrollToSection('news')}
              className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
                currentSection === 'news' ? 'text-red-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon name="Newspaper" size={20} />
              <span className="text-xs font-medium">Новости</span>
            </button>
            <button
              onClick={() => scrollToSection('contacts')}
              className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
                currentSection === 'contacts' ? 'text-red-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon name="MessageCircle" size={20} />
              <span className="text-xs font-medium">Контакты</span>
            </button>
          </div>
        </div>
      </nav>

      <audio
        ref={audioRef}
        src="https://myradio24.org/kontentmediapro"
        preload="none"
        className="hidden"
      />
    </div>
  );
};

export default Index;