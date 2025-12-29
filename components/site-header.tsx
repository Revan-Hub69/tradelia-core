"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { LogoIcon } from "@/components/icons/logo-icon";
import { Menu, User, LogOut, Settings, UserCircle } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/components/providers/AppProviders";
import { authManager } from "@/lib/auth/supabase-auth";

const menuSections = [
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Start · Orientamento',
        description: 'Capire da dove iniziare, senza decidere nulla',
        href: '/dashboard/start',
        badge: 'Nuovo'
      },
      {
        title: 'Microlearning',
        description: 'Capire prima di credere - Brevi lezioni educative',
        href: '/dashboard/microlearning',
        badge: null
      },
      {
        title: 'Misuratori di Contesto',
        description: 'Numeri per orientarsi, non per decidere',
        href: '/dashboard/misuratori',
        badge: 'Live'
      },
      {
        title: 'Libreria Truffe',
        description: 'Riconoscere prima di cadere - Schemi ricorrenti',
        href: '/dashboard/truffe',
        badge: 'Importante'
      }
    ]
  },
  {
    title: 'Strumenti',
    items: [
      {
        title: 'Check Piattaforme',
        description: 'Checklist per valutare piattaforme crypto',
        href: '/dashboard/check-piattaforme',
        badge: 'Fase 2'
      },
      {
        title: 'Fear & Greed Index',
        description: 'Sentiment di mercato con analisi AI',
        href: '/dashboard/misuratori/fear-greed',
        badge: 'AI'
      },
      {
        title: 'Metodo & Fonti',
        description: 'Come funziona Tradelia, trasparenza completa',
        href: '/dashboard/metodo',
        badge: 'Fondamentale'
      },
      {
        title: 'Progresso Personale',
        description: 'Il tuo percorso di apprendimento',
        href: '/dashboard/progresso',
        badge: null
      }
    ]
  },
  {
    title: 'Risorse',
    items: [
      {
        title: 'Biblioteca Educativa',
        description: 'Contenuti educativi e materiali di studio',
        href: '/library',
        badge: null
      },
      {
        title: 'Principi Antifuffa',
        description: 'Metodologia e approccio educativo',
        href: '/about',
        badge: 'Fondamentale'
      },
      {
        title: 'Glossario Crypto',
        description: 'Termini e concetti spiegati chiaramente',
        href: '/library/glossary',
        badge: null
      },
      {
        title: 'FAQ',
        description: 'Domande frequenti su indicatori e metodologia',
        href: '/faq',
        badge: null
      }
    ]
  }
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent double-click
    
    setIsLoggingOut(true);
    try {
      await authManager.logout();
      // Optional: Show success message or redirect
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optional: Show error message
    } finally {
      setIsLoggingOut(false);
    }
  };

  const UserMenu = () => {
    if (isLoading) {
      return (
        <Button variant="ghost" size="sm" disabled>
          <UserCircle className="w-4 h-4 animate-pulse" />
        </Button>
      );
    }

    if (!isAuthenticated || !user) {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowAuthModal(true)}
          className="flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Accedi</span>
        </Button>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {/* User Info + Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 max-w-[200px]">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-primary" />
              </div>
              <span className="hidden sm:inline truncate text-sm">
                {user.displayName || user.email.split('@')[0]}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">{user.displayName || 'Utente'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account/profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profilo
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/preferences" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Preferenze
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              className="flex items-center gap-2 text-red-600 focus:text-red-600"
            >
              <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
              {isLoggingOut ? 'Disconnessione...' : 'Esci'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Quick Logout Button (fallback) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-muted-foreground hover:text-red-600 p-1"
          title="Logout rapido"
        >
          <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity" aria-label="Tradelia - Torna alla homepage">
              <LogoIcon className="h-8 w-8 text-primary" aria-hidden="true" />
              <div className="block">
                <p className="text-lg font-semibold">Tradelia</p>
                <p className="text-xs text-muted-foreground hidden sm:block">Educazione al rischio</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    <span className="flex items-center gap-1">
                      Dashboard
                      <Badge variant="secondary" className="ml-1 text-xs">Crypto</Badge>
                    </span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[600px] p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {menuSections[0].items.map((item) => (
                          <Link key={item.title} href={item.href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium leading-none">{item.title}</div>
                              {item.badge && (
                                <Badge variant="outline" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    Strumenti
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[600px] p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {menuSections[1].items.map((item) => (
                          <Link key={item.title} href={item.href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium leading-none">{item.title}</div>
                              {item.badge && (
                                <Badge variant="outline" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/dashboard/start"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                  >
                    Inizia Qui
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              <Button asChild variant="ghost" size="sm" aria-label="Accedi alla dashboard">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="premium" size="sm" aria-label="Inizia il percorso di orientamento">
                <Link href="/dashboard/start">Inizia Qui</Link>
              </Button>
              <Separator orientation="vertical" className="mx-2 h-6" aria-hidden="true" />
              <UserMenu />
              <ModeToggle />
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu di navigazione</SheetTitle>
                </SheetHeader>
                
                {/* Mobile Logo - Fixed at top */}
                <div className="flex items-center space-x-2 py-4 border-b">
                  <LogoIcon className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">Tradelia</p>
                    <p className="text-xs text-muted-foreground">Educazione al rischio</p>
                  </div>
                </div>

                {/* Scrollable Content */}
                <ScrollArea className="flex-1 py-4">
                  <div className="space-y-6">
                    {/* Mobile Navigation Links */}
                    <nav className="space-y-4">
                      <div>
                        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Dashboard</h3>
                        <div className="space-y-2">
                          {menuSections[0].items.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-accent transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span>{item.title}</span>
                              {item.badge && (
                                <Badge variant="outline" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Strumenti</h3>
                        <div className="space-y-2">
                          {menuSections[1].items.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-accent transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span>{item.title}</span>
                              {item.badge && (
                                <Badge variant="outline" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Risorse</h3>
                        <div className="space-y-2">
                          {menuSections[2].items.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-accent transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span>{item.title}</span>
                              {item.badge && (
                                <Badge variant="outline" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </nav>
                  </div>
                </ScrollArea>

                {/* Mobile Actions - Fixed at bottom */}
                <div className="space-y-3 pt-4 border-t">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/start" onClick={() => setMobileMenuOpen(false)}>
                      Inizia Qui
                    </Link>
                  </Button>
                  
                  {/* Mobile Auth */}
                  <div className="space-y-2">
                    {isAuthenticated && user ? (
                      <>
                        <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user.displayName || 'Utente'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex-1"
                          >
                            <Link href="/account/profile" onClick={() => setMobileMenuOpen(false)}>
                              <User className="w-4 h-4 mr-2" />
                              Profilo
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              handleLogout();
                            }}
                            disabled={isLoggingOut}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <LogOut className={`w-4 h-4 mr-2 ${isLoggingOut ? 'animate-spin' : ''}`} />
                            {isLoggingOut ? 'Uscita...' : 'Esci'}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setShowAuthModal(true);
                        }}
                        className="flex items-center gap-2 w-full justify-center"
                      >
                        <User className="w-4 h-4" />
                        Accedi
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tema</span>
                    <ModeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}