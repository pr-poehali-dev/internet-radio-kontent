import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({ artist: 'КонтентМедиаPRO', title: 'Загрузка...' });
  const [trackHistory, setTrackHistory] = useState<Array<{artist: string, title: string}>>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const updateTrack = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/a74bc916-c4b8-4156-8eaa-650265cf0145');
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.artist && data.title) {
            setCurrentTrack({ 
              artist: data.artist, 
              title: data.title
            });
          }
        }
      } catch (error) {
        console.error('Error fetching track info:', error);
      }
    };

    const updateHistory = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/df037205-f54b-48b7-8a61-648b24abdfd5');
        if (response.ok) {
          const data = await response.json();
          if (data && data.tracks) {
            setTrackHistory(data.tracks);
          }
        }
      } catch (error) {
        console.error('Error fetching track history:', error);
      }
    };

    updateTrack();
    updateHistory();
    const trackInterval = setInterval(updateTrack, 10000);
    const historyInterval = setInterval(updateHistory, 30000);
    return () => {
      clearInterval(trackInterval);
      clearInterval(historyInterval);
    };
  }, []);

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
                { id: 'news', label: 'Новости' },
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
                { id: 'news', label: 'Новости' },
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
                <span className="text-white">КонтентМедиа</span><span className="text-red-600">Pro</span>
              </h1>
              <p className="text-base md:text-2xl text-gray-400">
                Твоя музыка. Твой ритм.<br className="md:hidden" /> Твоя радиостанция.
              </p>
            </div>

            <Card className="bg-black/80 backdrop-blur-sm border-2 border-white/10 shadow-2xl animate-scale-in">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col items-center gap-8">
                  <audio
                    ref={audioRef}
                    preload="none"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={(e) => console.error('Audio error:', e)}
                  >
                    <source src="https://myradio24.org/54137" type="audio/mpeg" />
                  </audio>

                  <div className="w-full space-y-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-red-600' : 'bg-gray-500'}`}></div>
                      <span className="text-white text-lg md:text-xl font-medium">
                        {isPlaying ? 'В эфире' : 'Оффлайн'}
                      </span>
                    </div>

                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-5xl font-bold text-white">
                        {currentTrack.title || 'Non-Stop'}
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-400">
                        {currentTrack.artist || 'КонтентМедиаPro'}
                      </p>
                    </div>

                    <Button
                      size="lg"
                      onClick={togglePlay}
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-lg md:text-xl py-6 md:py-8 rounded-xl transition-all duration-300 font-semibold"
                    >
                      <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} className="mr-3" />
                      {isPlaying ? 'Пауза' : 'Слушать эфир'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {trackHistory.length > 0 && (
              <Card className="mt-8 bg-black/60 backdrop-blur-sm border-2 border-white/10">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Icon name="ListMusic" size={24} className="text-red-600" />
                    Недавно играло
                  </h3>
                  <div className="space-y-3">
                    {trackHistory.map((track, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center">
                          <span className="text-red-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{track.title}</p>
                          <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <section id="news" className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-8 md:mb-12 text-center">
              Последние <span className="text-primary">новости</span>
            </h2>
            <div className="grid gap-4 md:gap-6">
              {news.map((item, index) => (
                <Card
                  key={index}
                  className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-xs md:text-sm text-muted-foreground mb-2">{item.date}</p>
                        <h3 className="text-lg md:text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm md:text-base text-muted-foreground">{item.text}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="contacts" className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-8 md:mb-12">
              Свяжитесь <span className="text-red-600">с нами</span>
            </h2>
            <Card className="bg-card/50 backdrop-blur-sm border-border animate-scale-in">
              <CardContent className="p-8 md:p-12">
                <div className="grid gap-6 md:gap-8">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <p className="text-lg text-muted-foreground">Свяжитесь с нами в социальных сетях</p>
                    <Button
                      size="lg"
                      className="rounded-full bg-primary hover:bg-primary/90 transition-all hover:scale-105 px-8"
                      asChild
                    >
                      <a href="https://vk.com/kontentmediapro" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.25 14.99h-1.57c-.55 0-.72-.45-1.71-1.44-.86-.83-1.24-.94-1.45-.94-.3 0-.39.09-.39.51v1.32c0 .36-.11.57-1.07.57-1.58 0-3.33-.95-4.56-2.73-1.86-2.62-2.37-4.59-2.37-4.99 0-.21.09-.4.51-.4h1.57c.38 0 .52.17.67.58.75 2.14 2.01 4.02 2.52 4.02.2 0 .29-.09.29-.59v-2.29c-.07-.95-.55-1.03-.55-1.37 0-.17.14-.34.36-.34h2.47c.31 0 .43.17.43.55v3.09c0 .31.14.44.23.44.2 0 .36-.13.73-.5 1.14-1.28 1.95-3.26 1.95-3.26.11-.23.28-.4.66-.4h1.57c.47 0 .57.24.47.58-.16.85-1.91 3.65-1.91 3.65-.17.27-.23.39 0 .7.17.23.73.72 1.11 1.15.69.79 1.22 1.45 1.36 1.91.15.46-.08.69-.54.69z"/>
                        </svg>
                        <span>Написать ВКонтакте</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 md:py-8 px-4">
        <div className="container mx-auto text-center text-sm md:text-base text-muted-foreground">
          <p>© 2025 КонтентМедиаPRO. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;