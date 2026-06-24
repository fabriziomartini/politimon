const TOTAL_SEATS = 630;
const MAJORITY = Math.floor(TOTAL_SEATS / 2) + 1;

const PARTIES = [
    {
        id: 'fdi',
        nome: "Fratelli d'Italia",
        sigla: 'FdI',
        emoji: '🦅',
        leader: 'Giorgia Meloni',
        seggi: 119,
        desc: "Destra nazionale con la fiamma sempre accesa"
    },
    {
        id: 'lega',
        nome: 'Lega',
        sigla: 'Lega',
        emoji: '🌿',
        leader: 'Matteo Salvini',
        seggi: 66,
        desc: "Prima il Nord. Anzi, prima gli italiani. Anzi..."
    },
    {
        id: 'fi',
        nome: 'Forza Italia',
        sigla: 'FI',
        emoji: '⚡',
        leader: 'Antonio Tajani',
        seggi: 45,
        desc: "L'eterno centro-destra, dal 1994 ad oggi"
    },
    {
        id: 'pd',
        nome: 'Partito Democratico',
        sigla: 'PD',
        emoji: '🌹',
        leader: 'Elly Schlein',
        seggi: 69,
        desc: "Sinistra moderna, sempre in cerca di identità"
    },
    {
        id: 'm5s',
        nome: 'Movimento 5 Stelle',
        sigla: 'M5S',
        emoji: '⭐',
        leader: 'Giuseppe Conte',
        seggi: 52,
        desc: "Né destra né sinistra. O forse tutte e due."
    }
];

const POLITICIANS = [
    // -- FdI --
    {
        id: 'meloni',
        nome: 'Giorgia Meloni',
        partito: 'fdi',
        emoji: '👩‍💼',
        carisma: 9,
        fedelta: 9,
        scandali: 2,
        potere: 9,
        seggi: 119,
        quote: '"Sono Giorgia, sono una donna, sono una madre, sono italiana..."'
    },
    {
        id: 'lollobrigida',
        nome: 'F. Lollobrigida',
        partito: 'fdi',
        emoji: '🍝',
        carisma: 5,
        fedelta: 9,
        scandali: 5,
        potere: 6,
        seggi: 30,
        quote: '"La sostituzione etnica? Parlo solo di pasta."'
    },
    {
        id: 'fitto',
        nome: 'Raffaele Fitto',
        partito: 'fdi',
        emoji: '🇪🇺',
        carisma: 6,
        fedelta: 8,
        scandali: 2,
        potere: 7,
        seggi: 25,
        quote: '"Il PNRR è sotto controllo. Più o meno."'
    },
    // -- Lega --
    {
        id: 'salvini',
        nome: 'Matteo Salvini',
        partito: 'lega',
        emoji: '🫡',
        carisma: 8,
        fedelta: 4,
        scandali: 8,
        potere: 7,
        seggi: 66,
        quote: '"Prima gli italiani! (selfie in piscina inclusi)"'
    },
    {
        id: 'calderoli',
        nome: 'Roberto Calderoli',
        partito: 'lega',
        emoji: '🏔️',
        carisma: 4,
        fedelta: 8,
        scandali: 6,
        potere: 5,
        seggi: 20,
        quote: '"L\'autonomia differenziata risolve anche il mal di schiena"'
    },
    // -- Forza Italia --
    {
        id: 'tajani',
        nome: 'Antonio Tajani',
        partito: 'fi',
        emoji: '👔',
        carisma: 5,
        fedelta: 8,
        scandali: 2,
        potere: 6,
        seggi: 45,
        quote: '"Il Cavaliere mi guardava dall\'alto... e ancora mi guarda."'
    },
    {
        id: 'bernini',
        nome: 'A.M. Bernini',
        partito: 'fi',
        emoji: '🎓',
        carisma: 5,
        fedelta: 7,
        scandali: 2,
        potere: 5,
        seggi: 15,
        quote: '"L\'università italiana è eccellente. Lo dice la classifica... di chi?"'
    },
    // -- PD --
    {
        id: 'schlein',
        nome: 'Elly Schlein',
        partito: 'pd',
        emoji: '✊',
        carisma: 8,
        fedelta: 8,
        scandali: 1,
        potere: 7,
        seggi: 69,
        quote: '"Il cambiamento è adesso. Anzi, è quasi adesso."'
    },
    {
        id: 'orlando',
        nome: 'Andrea Orlando',
        partito: 'pd',
        emoji: '🏭',
        carisma: 5,
        fedelta: 7,
        scandali: 3,
        potere: 5,
        seggi: 20,
        quote: '"Il lavoro prima di tutto, il salario minimo dopo."'
    },
    {
        id: 'provenzano',
        nome: 'G. Provenzano',
        partito: 'pd',
        emoji: '📊',
        carisma: 4,
        fedelta: 7,
        scandali: 1,
        potere: 4,
        seggi: 15,
        quote: '"Il Sud può farcela. Con i fondi europei."'
    },
    // -- M5S --
    {
        id: 'conte',
        nome: 'Giuseppe Conte',
        partito: 'm5s',
        emoji: '⚖️',
        carisma: 7,
        fedelta: 6,
        scandali: 4,
        potere: 6,
        seggi: 52,
        quote: '"Sono l\'avvocato del popolo. Ho anche il curriculum aggiornato."'
    },
    {
        id: 'grillo',
        nome: 'Beppe Grillo',
        partito: 'm5s',
        emoji: '🤡',
        carisma: 7,
        fedelta: 2,
        scandali: 9,
        potere: 3,
        seggi: 5,
        quote: '"Vaffanculo! (detto con amore, ovviamente)"'
    },
    // -- Indipendenti / alleati --
    {
        id: 'renzi',
        nome: 'Matteo Renzi',
        partito: 'iv',
        emoji: '🔄',
        carisma: 8,
        fedelta: 1,
        scandali: 7,
        potere: 5,
        seggi: 9,
        quote: '"Sono tornato. Di nuovo. Come sempre."'
    },
    {
        id: 'calenda',
        nome: 'Carlo Calenda',
        partito: 'az',
        emoji: '🏗️',
        carisma: 6,
        fedelta: 3,
        scandali: 3,
        potere: 4,
        seggi: 7,
        quote: '"Sono l\'unico adulto in sala. Sempre."'
    },
    {
        id: 'draghi',
        nome: 'Mario Draghi',
        partito: 'ind',
        emoji: '🏦',
        carisma: 7,
        fedelta: 9,
        scandali: 0,
        potere: 10,
        seggi: 0,
        quote: '"Whatever it takes. (E lo intendo davvero.)"'
    },
    {
        id: 'mattarella',
        nome: 'Sergio Mattarella',
        partito: 'ind',
        emoji: '🕊️',
        carisma: 9,
        fedelta: 10,
        scandali: 0,
        potere: 8,
        seggi: 0,
        quote: '"Scioglierò le Camere. Non adesso, ma lo so fare."'
    }
];
