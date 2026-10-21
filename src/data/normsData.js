export const NORMS_DATA = [
  {
    id: 'pv',
    category: 'Fotowoltaika (PV) i Mikroinstalacje',
    icon: 'Sun',
    description: 'Normy projektowania, montażu i odbioru instalacji fotowoltaicznych',
    norms: [
      {
        code: 'PN-HD 60364-7-712',
        title: 'Instalacje elektryczne niskiego napięcia - Wymagania dotyczące specjalnych instalacji lub lokalizacji - Fotowoltaiczne (PV) układy zasilania',
        summary: 'Kluczowa norma regulująca ochronę przed porażeniem, zwarciami, dobiorem przewodów DC/AC, wyłącznikami ppoż. oraz zabezpieczeniami nadprądowymi w PV.'
      },
      {
        code: 'PN-EN 62446-1',
        title: 'Systemy fotowoltaiczne (PV) - Wymagania dotyczące badań, dokumentacji i konserwacji - Część 1: Systemy przyłączone do sieci',
        summary: 'Określa procedury odbiorcze, procedury pomiarowe (pomiary ciągłości, rezystancji izolacji, napięcia Voc, prądu Isc) oraz wzór protokołu odbioru.'
      },
      {
        code: 'PN-EN 61730-1 / -2',
        title: 'Ocena bezpieczeństwa modułu fotowoltaicznego (PV)',
        summary: 'Norma określająca wymagania konstrukcyjne oraz procedury badań i klasę ochrony przeciwporażeniowej modułów fotowoltaicznych.'
      }
    ]
  },
  {
    id: 'installations',
    category: 'Instalacje Elektryczne i Ochrona',
    icon: 'Zap',
    description: 'Podstawowe normy doboru przewodów, ochrony przeciwporażeniowej i układów sieci',
    norms: [
      {
        code: 'PN-HD 60364-4-41',
        title: 'Ochrona dla zapewnienia bezpieczeństwa - Ochrona przed porażeniem elektrycznym',
        summary: 'Podstawowe zasady SWZ (samoczynnego wyłączenia zasilania), dopuszczalne czasy wyłączenia (0.4s dla TN, 0.2s dla TT w obwodach 230V) oraz stosowanie RCD ≤30mA.'
      },
      {
        code: 'PN-HD 60364-5-52',
        title: 'Dobór i montaż wyposażenia elektrycznego - Oprzewodowanie',
        summary: 'Tabele obciążalności prądowej długotrwałej przewodów (Iz), sposoby ułożenia (A1, A2, B1, B2, C, D) oraz współczynniki poprawkowe na temperaturę i grupowanie.'
      },
      {
        code: 'PN-HD 60364-4-43',
        title: 'Ochrona przed prądem przetężeniowym',
        summary: 'Wymagania dotyczące doboru zabezpieczeń nadprądowych (Ib ≤ In ≤ Iz oraz I2 ≤ 1.45 Iz) oraz doboru prądu znamionowego wyłączników i bezpieczników.'
      }
    ]
  },
  {
    id: 'spd',
    category: 'Ochrona Odgromowa i Przepięciowa',
    icon: 'Shield',
    description: 'Przepisy i normy doboru ochronników przepięciowych SPD i instalacji odgromowych',
    norms: [
      {
        code: 'PN-EN 62305-1 do -4',
        title: 'Ochrona odgromowa (LPS)',
        summary: 'Kompleksowe normy analizy ryzyka odgromowego (LPS I - IV), odstępów izolacyjnych (S) oraz strefowej ochrony odgromowej (LPZ 0, LPZ 1, LPZ 2).'
      },
      {
        code: 'PN-HD 60364-5-534',
        title: 'Urządzenia do ochrony przed przepięciami (SPD)',
        summary: 'Zasady rozmieszczania i doboru ograniczników przepięć typu 1, 2 i 3 (T1+T2) w instalacjach niskiego napięcia oraz instalacjach fotowoltaicznych.'
      }
    ]
  },
  {
    id: 'special',
    category: 'Strefy Specjalne',
    icon: 'Home',
    description: 'Wymagania dla lokalizacji o podwyższonym ryzyku i stopnie ochrony obudów',
    norms: [
      {
        code: 'PN-HD 60364-7-701',
        title: 'Lokalizacje wyposażone w wannę lub prysznic',
        summary: 'Wymagania techniczne dotyczące podziału na strefy ochronne, stosowania napięć obniżonych SELV/PELV oraz minimalnych stopni ochrony IP dla osprzętu w strefach 0, 1 i 2.'
      },
      {
        code: 'PN-EN 60529',
        title: 'Stopnie ochrony zapewnianej przez obudowy (Kod IP)',
        summary: 'Klasyfikacja szczelności obudów urządzeń elektrycznych przed penetracją ciał stałych oraz wody. Podstawowe narzędzie doboru urządzeń w zależności od warunków środowiskowych.'
      }
    ]
  }
];
