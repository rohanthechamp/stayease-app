import Navigation from '@/app/_components/Navigation';
import Logo from '@/app/_components/Logo';

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-primary-950/80 backdrop-blur-md border-b border-primary-800 px-4 sm:px-8 py-4 transition-all duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Logo />
        <Navigation />
      </div>
    </header>
  );
}

export default Header;
