'use client';

import React, { useState } from 'react';
import { 
  DrawerEnterprise, 
  DrawerListItem, 
  AlertEnterprise, 
  ProgressStateBadge, 
  CTAEnterprise,
  FocusChip 
} from './DrawerEnterprise';

/**
 * Example implementation of Enterprise Drawer
 * Shows all the patterns and standards in action
 */
export function DrawerEnterpriseExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleCopyLink = () => {
    const url = `${window.location.href}?drawer=emergency-basics`;
    navigator.clipboard.writeText(url);
    // In real implementation, show toast confirmation
  };
  
  const handleContinue = () => {
    // Navigate to next step
    console.log('Continuing to next step...');
    setIsOpen(false);
  };
  
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="cta-enterprise-primary"
      >
        Apri Drawer Enterprise
      </button>
      
      <DrawerEnterprise
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Crypto in situazioni di emergenza"
        subtitle="Comprendi quando e come utilizzare le criptovalute come sistema di riserva"
        onCopyLink={handleCopyLink}
        footer={
          <div className="flex gap-3">
            <CTAEnterprise variant="primary" onClick={handleContinue}>
              Prosegui nel percorso
            </CTAEnterprise>
            <CTAEnterprise variant="secondary" onClick={() => setIsOpen(false)}>
              Rivedi contenuto
            </CTAEnterprise>
          </div>
        }
      >
        {/* Focus chips with hierarchy */}
        <div className="flex flex-wrap gap-2 mb-6">
          <FocusChip isPrimary>storia e contesto</FocusChip>
          <FocusChip>principi di funzionamento</FocusChip>
          <FocusChip>casi reali</FocusChip>
        </div>
        
        {/* Educational alert - warning, not danger */}
        <AlertEnterprise
          type="warning"
          title="Importante da sapere"
          message="Se usata fuori contesto, può creare più problemi che benefici. Valuta attentamente la tua situazione prima di procedere."
          className="mb-6"
        />
        
        {/* Section with proper heading hierarchy */}
        <section className="mb-8">
          <h3 className="text-enterprise-primary text-base font-semibold mb-4">
            In quali situazioni reali può servire
          </h3>
          
          <div className="space-y-1">
            <DrawerListItem>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-enterprise-body font-medium mb-1">
                    1. Storia e contesto
                  </h4>
                  <p className="text-enterprise-secondary text-sm reading-line-height">
                    Brevi contenuti per capire quando e perché usare questo strumento in situazioni di crisi economica.
                  </p>
                </div>
                <ProgressStateBadge state="fundamental" timeEstimate="~3 min" />
              </div>
            </DrawerListItem>
            
            <DrawerListItem>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-enterprise-body font-medium mb-1">
                    2. Principi di funzionamento
                  </h4>
                  <p className="text-enterprise-secondary text-sm reading-line-height">
                    Come funzionano tecnicamente le criptovalute e perché possono essere utili come riserva di valore.
                  </p>
                </div>
                <ProgressStateBadge state="not-started" />
              </div>
            </DrawerListItem>
            
            <DrawerListItem>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-enterprise-body font-medium mb-1">
                    3. Casi di studio reali
                  </h4>
                  <p className="text-enterprise-secondary text-sm reading-line-height">
                    Esempi concreti di utilizzo durante crisi economiche in diversi paesi del mondo.
                  </p>
                </div>
                <ProgressStateBadge state="not-started" />
              </div>
            </DrawerListItem>
            
            <DrawerListItem>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-enterprise-body font-medium mb-1">
                    4. Rischi e precauzioni
                  </h4>
                  <p className="text-enterprise-secondary text-sm reading-line-height">
                    Cosa considerare prima di utilizzare crypto come sistema di emergenza.
                  </p>
                </div>
                <ProgressStateBadge state="completed" />
              </div>
            </DrawerListItem>
          </div>
        </section>
        
        {/* Success alert for completed sections */}
        <AlertEnterprise
          type="success"
          title="Sezione completata"
          message="Hai completato con successo la sezione sui rischi e precauzioni. Ora puoi procedere con il percorso."
          className="mb-6"
        />
        
        {/* Reading-optimized content */}
        <section className="mb-8">
          <h3 className="text-enterprise-primary text-base font-semibold mb-4">
            Perché questo approccio funziona
          </h3>
          
          <div className="reading-width space-y-4">
            <p className="text-enterprise-body reading-line-height reading-paragraph-spacing">
              Le criptovalute possono servire come sistema di riserva di emergenza perché operano 
              indipendentemente dal sistema bancario tradizionale. Questo le rende accessibili anche 
              quando i servizi finanziari convenzionali sono compromessi.
            </p>
            
            <p className="text-enterprise-body reading-line-height reading-paragraph-spacing">
              Tuttavia, è fondamentale comprendere che non sono una soluzione universale. 
              La volatilità e la complessità tecnica richiedono una preparazione adeguata 
              e una comprensione approfondita dei rischi coinvolti.
            </p>
            
            <p className="text-enterprise-secondary reading-line-height">
              Questo modulo ti guiderà attraverso tutti gli aspetti necessari per prendere 
              decisioni informate e utilizzare questi strumenti in modo sicuro ed efficace.
            </p>
          </div>
        </section>
        
        {/* Info alert for additional context */}
        <AlertEnterprise
          type="info"
          title="Prossimi passi"
          message="Dopo aver completato questo modulo, potrai accedere agli strumenti pratici per implementare una strategia di riserva di emergenza."
        />
      </DrawerEnterprise>
    </>
  );
}

/**
 * Network Status Example with correct semantics
 * Shows how to handle network states without causing anxiety
 */
export function NetworkStatusExample() {
  const [networkState, setNetworkState] = useState<'online' | 'offline' | 'unstable'>('online');
  
  const getNetworkAlert = () => {
    switch (networkState) {
      case 'offline':
        return (
          <AlertEnterprise
            type="warning"
            title="Connessione assente"
            message="Alcune funzioni potrebbero non essere disponibili. I tuoi dati non sono a rischio."
          />
        );
      case 'unstable':
        return (
          <AlertEnterprise
            type="warning"
            title="Connessione instabile"
            message="La connessione è intermittente. Salvataggio automatico attivo."
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button 
          onClick={() => setNetworkState('online')}
          className="cta-enterprise-secondary text-sm px-3 py-1"
        >
          Online
        </button>
        <button 
          onClick={() => setNetworkState('offline')}
          className="cta-enterprise-secondary text-sm px-3 py-1"
        >
          Offline
        </button>
        <button 
          onClick={() => setNetworkState('unstable')}
          className="cta-enterprise-secondary text-sm px-3 py-1"
        >
          Instabile
        </button>
      </div>
      
      {getNetworkAlert()}
    </div>
  );
}