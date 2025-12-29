"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { LogoIcon } from "@/components/icons/logo-icon";
import { Menu, User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/components/providers/AppProviders";
import { authManager } from "@/lib/auth/supabase-auth";

const mobileLinks = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Start', href: '/dashboard/start' },
  { title: 'Microlearning', href: '/dashboard/microlearning' },
  { title: 'Misuratori', href: '/dashboard/misuratori' },
  { title: 'Truffe', href: '/dashboard/truffe' },
  { title: 'Metodo', href: '/dashboard/metodo' }
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await authManager.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <LogoIcon className="h-8 w-8 text-primary" />
            <div>
              <span className="text-lg font-semibold">Tradelia</span>
              <p className="text-xs text-muted-foreground hidden sm:block">Educazione al rischio</p>
            </div>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/start">Inizia Qui</Link>
            </Button>
            
            {/* Auth */}
            {isLoading ? (
              <Button variant="ghost" size="icon" disabled>
                <User className="h-4 w-4 animate-pulse" />
              </Button>
            ) : !isAuthenticated ? (
              <Button variant="ghost" size="icon" onClick={() => setShowAuthModal(true)}>
                <User className="h-4 w-4" />
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{user?.displayName || 'Utente'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/profile">
                      <User className="w-4 h-4 mr-2" />
                      Profilo
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/preferences">
                      <Settings className="w-4 h-4 mr-2" />
                      Preferenze
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                    <LogOut className={`w-4 h-4 mr-2 ${isLoggingOut ? 'animate-spin' : ''}`} />
                    {isLoggingOut ? 'Uscita...' : 'Esci'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <ModeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Button asChild size="sm">
              <Link href="/dashboard/start">Inizia</Link>
            </Button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu di navigazione</SheetTitle>
                  <SheetDescription className="sr-only">
                    Menu principale per navigare tra le sezioni di Tradelia
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  
                  {/* Mobile Header */}
                  <div className="flex items-center space-x-2 pb-6 border-b">
                    <LogoIcon className="h-6 w-6 text-primary" />
                    <div>
                      <span className="font-semibold">Tradelia</span>
                      <p className="text-xs text-muted-foreground">Educazione al rischio</p>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 py-6 space-y-1">
                    {mobileLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.title}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Actions */}
                  <div className="pt-6 border-t space-y-3">
                    <Button asChild className="w-full">
                      <Link href="/dashboard/start" onClick={() => setMobileMenuOpen(false)}>
                        Inizia Qui
                      </Link>
                    </Button>
                    
                    {isAuthenticated && user ? (
                      <div className="space-y-2">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium">{user.displayName || 'Utente'}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild className="flex-1">
                            <Link href="/account/profile" onClick={() => setMobileMenuOpen(false)}>
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
                            className="flex-1"
                          >
                            Esci
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setShowAuthModal(true);
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Accedi
                      </Button>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">Tema</span>
                      <ModeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}