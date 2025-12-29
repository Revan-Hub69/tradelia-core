import { useEffect } from 'react'

export function useLockBodyScroll(lock: boolean) {
  useEffect(() => {
    if (lock) {
      // Salva la posizione corrente dello scroll
      const scrollY = window.scrollY
      
      // Applica il blocco dello scroll
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
      
      // Aggiungi classe per stili CSS aggiuntivi
      document.body.classList.add('drawer-open')
      
      return () => {
        // Rimuovi classe CSS
        document.body.classList.remove('drawer-open')
        
        // Ripristina gli stili inline
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.overflow = ''
        
        // Ripristina la posizione dello scroll
        window.scrollTo(0, scrollY)
      }
    }
  }, [lock])
}