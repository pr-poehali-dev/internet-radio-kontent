import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const iframe = document.getElementById('radio-player') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = 'https://myradio24.com/54137';
    }
  }, []);

  const schedule = [
    { time: '06:00', program: 'Утреннее шоу' },
    { time: '10:00', program: 'Музыкальный драйв' },
    { time: '14:00', program: 'Дневной эфир' },
    { time: '18:00', program: 'Вечерний час' },
    { time: '22:00', program: 'Ночная волна' },
  ];

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
              className="text-xl md:text-2xl font-bold font-heading text-primary hover:text-primary/80 transition-colors"
            >
              КонтентМедиа<span className="text-foreground">PRO</span>
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
                { id: 'schedule', label: 'Эфир' },
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
                { id: 'schedule', label: 'Эфир' },
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
              <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4">
                Контент<span className="text-primary">Медиа</span>PRO
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Ваше любимое интернет-радио 24/7
              </p>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-border animate-scale-in">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-full">
                    <iframe
                      id="radio-player"
                      src=""
                      width="100%"
                      height="200"
                      className="border-0 rounded-lg"
                      allow="autoplay"
                    ></iframe>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-primary animate-pulse-slow">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Прямой эфир</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="schedule" className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-8 md:mb-12 text-center">
              Расписание <span className="text-primary">эфиров</span>
            </h2>
            <div className="grid gap-4">
              {schedule.map((item, index) => (
                <Card
                  key={index}
                  className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="text-2xl md:text-3xl font-bold font-heading text-primary min-w-[60px] md:min-w-[80px]">
                        {item.time}
                      </div>
                      <Separator orientation="vertical" className="h-10 md:h-12" />
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold">{item.program}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                  <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
                    <Icon name="Mail" size={24} className="text-primary" />
                    <a
                      href="mailto:info@kontentmediapro.ru"
                      className="text-lg md:text-xl hover:text-primary transition-colors break-all"
                    >
                      info@kontentmediapro.ru
                    </a>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
                    <Icon name="Phone" size={24} className="text-primary" />
                    <a
                      href="tel:+74951234567"
                      className="text-lg md:text-xl hover:text-primary transition-colors"
                    >
                      +7 (495) 123-45-67
                    </a>
                  </div>
                  <Separator />
                  <div className="flex justify-center gap-4 md:gap-6">
                    <Button variant="outline" size="lg" className="rounded-full">
                      <Icon name="Send" size={20} />
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-full">
                      <Icon name="Facebook" size={20} />
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-full">
                      <Icon name="Instagram" size={20} />
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
