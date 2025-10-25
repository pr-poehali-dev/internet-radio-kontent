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
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const updateTrack = () => {
      const tracks = [
        { artist: 'Дискотека Авария', title: 'Новогодняя' },
        { artist: 'Макс Корж', title: 'Малый повзрослел' },
        { artist: 'Звери', title: 'Районы-кварталы' },
        { artist: 'Земфира', title: 'Искала' },
        { artist: 'Би-2', title: 'Полковнику никто не пишет' },
        { artist: 'Сплин', title: 'Выхода нет' },
        { artist: 'Мумий Тролль', title: 'Владивосток 2000' },
        { artist: 'Ленинград', title: 'Экспонат' },
      ];
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      setCurrentTrack(randomTrack);
    };

    updateTrack();
    const interval = setInterval(updateTrack, 180000);
    return () => clearInterval(interval);
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
              className="text-xl md:text-2xl font-bold font-heading text-white hover:opacity-80 transition-opacity"
            >
              КонтентМедиа<span className="text-red-600">PRO</span>
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
            <div className="text-center mb-8 md:mb-12">
              <img
                src="https://cdn.poehali.dev/files/6c095838-e40a-4ee2-a759-d81a449f7ae4.jpg"
                alt="КонтентМедиаPRO"
                className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 md:mb-8 object-contain"
              />
              <h1 className="text-3xl md:text-6xl font-bold font-heading mb-4">
                <span className="text-white">КонтентМедиа</span><span className="text-red-600">PRO</span>
              </h1>
              <p className="text-base md:text-xl text-muted-foreground mb-2">
                Твоя музыка. Твой ритм. Твоя радиостанция.
              </p>
            </div>

            <Card className="bg-black/90 backdrop-blur-sm border-2 border-white/20 shadow-2xl animate-scale-in">
              <CardContent className="p-6 md:p-12">
                <div className="flex flex-col items-center gap-8">
                  <audio
                    ref={audioRef}
                    preload="none"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={(e) => console.error('Audio error:', e)}
                  >
                    <source src="https://stream.zeno.fm/054z7dfztxhvv" type="audio/mpeg" />
                    <source src="https://myradio24.org/54137/radio.mp3" type="audio/mpeg" />
                  </audio>

                  <div className="text-center space-y-6">
                    <h2 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-wider">Прямой эфир</h2>
                    
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-600 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
                      <Button
                        size="lg"
                        onClick={togglePlay}
                        className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-red-600 hover:bg-red-700 hover:scale-110 transition-all duration-300 shadow-xl"
                      >
                        {isPlaying ? (
                          <Icon name="Pause" size={40} className="md:w-12 md:h-12" />
                        ) : (
                          <Icon name="Play" size={40} className="ml-1 md:w-12 md:h-12" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="w-full text-center space-y-4">
                    {isPlaying && (
                      <div className="flex items-center justify-center gap-2 text-sm md:text-base">
                        <div className="flex gap-1">
                          <div className="w-1 h-4 md:h-6 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1 h-6 md:h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1 h-4 md:h-6 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                          <div className="w-1 h-5 md:h-7 bg-white rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                        </div>
                        <span className="text-red-600 font-semibold">В ЭФИРЕ</span>
                        <div className="flex gap-1">
                          <div className="w-1 h-5 md:h-7 bg-white rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                          <div className="w-1 h-4 md:h-6 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                          <div className="w-1 h-6 md:h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1 h-4 md:h-6 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
                      <p className="text-xs md:text-sm text-gray-400 uppercase tracking-wider">Сейчас играет</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-white animate-fade-in">
                        {currentTrack.artist}
                      </h3>
                      <p className="text-lg md:text-xl text-gray-300 animate-fade-in">{currentTrack.title}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              Свяжитесь <span className="text-primary">с нами</span>
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