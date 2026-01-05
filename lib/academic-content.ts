// Academic Content Structure - Following Scientific Publication Standards

export const academicContent = {
  it: {
    // Abstract/Summary
    abstract: {
      title: "Sommario Esecutivo",
      content: "Il presente strumento implementa un framework di verifica della coerenza tra obiettivi di investimento dichiarati e caratteristiche degli strumenti finanziari selezionati. La metodologia si basa su parametri derivati dalla letteratura accademica in finanza comportamentale, con particolare riferimento agli studi di Barber & Odean (2000), Kahneman & Tversky (1979), e Thaler & Sunstein (2008)."
    },

    // Introduction/Context
    introduction: {
      title: "1. Contesto e Razionale",
      subtitle: "1.1 Problema di Ricerca",
      content: [
        "La letteratura accademica documenta sistematicamente l'esistenza di incompatibilità tra obiettivi di investimento dichiarati e strumenti effettivamente selezionati nel trading retail (Barber & Odean, 2000; Odean, 1999).",
        "Barber & Odean (2000) dimostrano che i trader individuali sottoperformano sistematicamente gli indici di mercato del 2.9% annuo, principalmente a causa di:",
        "• Overconfidence bias (Odean, 1998)",
        "• Costi di transazione eccessivi relativi al capitale disponibile",
        "• Selezione di strumenti incompatibili con l'orizzonte temporale dichiarato"
      ],
      citation: "Barber, B. M., & Odean, T. (2000). Trading is hazardous to your wealth: The common stock investment performance of individual investors. Journal of Finance, 55(2), 773-806."
    },

    // Methodology
    methodology: {
      title: "2. Metodologia",
      subtitle: "2.1 Framework di Verifica",
      content: [
        "Il framework implementa sei parametri di verifica derivati dalla ricerca comportamentale:",
        "1. Coerenza orizzonte temporale (Benartzi & Thaler, 1995)",
        "2. Adeguatezza capitale disponibile per diversificazione (Markowitz, 1952)",
        "3. Compatibilità profilo di rischio (Kahneman & Tversky, 1979)",
        "4. Proporzionalità costi di transazione (Barber & Odean, 2000)",
        "5. Complessità strumento vs esperienza dichiarata (Lusardi & Mitchell, 2007)",
        "6. Possibilità di diversificazione effettiva (Goetzmann & Kumar, 2008)"
      ],
      process: {
        title: "2.2 Processo di Verifica",
        steps: [
          {
            phase: "Input",
            description: "Raccolta parametri: obiettivo investimento, orizzonte temporale, tolleranza rischio, capitale disponibile, esperienza pregressa"
          },
          {
            phase: "Analisi",
            description: "Applicazione algoritmi di verifica basati su soglie derivate dalla letteratura accademica"
          },
          {
            phase: "Output", 
            description: "Generazione report con identificazione incompatibilità e riferimenti bibliografici"
          }
        ]
      }
    },

    // Results/Examples
    results: {
      title: "3. Tipologie di Incompatibilità Identificate",
      subtitle: "3.1 Pattern Ricorrenti",
      examples: [
        {
          category: "Incompatibilità Temporale",
          scenario: "Obiettivo: Accumulo pensionistico (orizzonte 20+ anni)",
          instrument: "Strumento: Trading intraday o settimanale",
          issue: "Mismatch orizzonte temporale documentato in Benartzi & Thaler (1995)",
          reference: "Benartzi, S., & Thaler, R. (1995). Myopic loss aversion and the equity premium puzzle. The quarterly journal of Economics, 110(1), 73-92."
        },
        {
          category: "Inadeguatezza Capitale",
          scenario: "Capitale disponibile: €500-2.000",
          instrument: "Strumento: Opzioni complesse o derivati",
          issue: "Capitale insufficiente per diversificazione efficace (Markowitz, 1952)",
          reference: "Markowitz, H. (1952). Portfolio selection. The journal of finance, 7(1), 77-91."
        },
        {
          category: "Incoerenza Profilo Rischio",
          scenario: "Tolleranza dichiarata: Conservativa/Bassa volatilità",
          instrument: "Strumento: Criptovalute con leva finanziaria",
          issue: "Contraddizione con prospect theory (Kahneman & Tversky, 1979)",
          reference: "Kahneman, D., & Tversky, A. (1979). Prospect theory: An analysis of decision under risk. Econometrica, 47(2), 263-291."
        }
      ]
    },

    // Limitations
    limitations: {
      title: "4. Limitazioni e Disclaimer",
      subtitle: "4.1 Limitazioni Metodologiche",
      content: [
        "Il presente strumento presenta le seguenti limitazioni:",
        "• Non fornisce previsioni sui prezzi o performance future",
        "• Non costituisce consulenza finanziaria personalizzata",
        "• La verifica di coerenza non garantisce risultati di investimento positivi",
        "• I parametri sono basati su studi condotti prevalentemente su mercati sviluppati",
        "• L'efficacia può variare in contesti di mercato diversi da quelli studiati"
      ],
      disclaimer: "Questo strumento ha finalità esclusivamente educative e di ricerca. Per decisioni di investimento consultare sempre un consulente finanziario qualificato e autorizzato."
    },

    // Bibliography
    bibliography: {
      title: "5. Bibliografia",
      references: [
        {
          authors: "Barber, B. M., & Odean, T.",
          year: "2000",
          title: "Trading is hazardous to your wealth: The common stock investment performance of individual investors",
          journal: "Journal of Finance",
          volume: "55(2)",
          pages: "773-806",
          doi: "10.1111/0022-1082.00226"
        },
        {
          authors: "Benartzi, S., & Thaler, R.",
          year: "1995", 
          title: "Myopic loss aversion and the equity premium puzzle",
          journal: "The Quarterly Journal of Economics",
          volume: "110(1)",
          pages: "73-92",
          doi: "10.2307/2118511"
        },
        {
          authors: "Kahneman, D., & Tversky, A.",
          year: "1979",
          title: "Prospect theory: An analysis of decision under risk",
          journal: "Econometrica",
          volume: "47(2)", 
          pages: "263-291",
          doi: "10.2307/1914185"
        },
        {
          authors: "Lusardi, A., & Mitchell, O. S.",
          year: "2007",
          title: "Financial literacy and retirement preparedness: Evidence and implications for financial education",
          journal: "Business Economics",
          volume: "42(1)",
          pages: "35-44",
          doi: "10.2145/20070104"
        },
        {
          authors: "Markowitz, H.",
          year: "1952",
          title: "Portfolio selection",
          journal: "The Journal of Finance",
          volume: "7(1)",
          pages: "77-91",
          doi: "10.1111/j.1540-6261.1952.tb01525.x"
        },
        {
          authors: "Odean, T.",
          year: "1998",
          title: "Are investors reluctant to realize their losses?",
          journal: "Journal of Finance",
          volume: "53(5)",
          pages: "1775-1798",
          doi: "10.1111/0022-1082.00072"
        },
        {
          authors: "Thaler, R. H., & Sunstein, C. R.",
          year: "2008",
          title: "Nudge: Improving decisions about health, wealth, and happiness",
          publisher: "Yale University Press",
          isbn: "978-0-14-311526-7"
        }
      ]
    },

    // Call to Action - Academic Style
    verification: {
      title: "Accesso al Framework di Verifica",
      description: "Per applicare il framework di verifica della coerenza al proprio caso specifico, è possibile accedere al sistema di analisi.",
      action: "Accedi al Framework",
      note: "Accesso gratuito per finalità educative e di ricerca"
    }
  }
} as const;