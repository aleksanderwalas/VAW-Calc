# Plan: Rozbudowa Bazy Wiedzy VAW Calc (v1.0.8)

## Kontekst
Użytkownik uważa, że obecna Baza Wiedzy jest zbyt uboga. Wymaga znaczącego rozszerzenia o więcej kategorii, norm i praktycznych porad inżynierskich.

## Planowana implementacja

### 1. Rozszerzenie danych (`src/data/normsData.js`)
- **Dodanie nowych kategorii:**
    - **Oświetlenie:** Normy natężenia oświetlenia (PN-EN 12464-1), rodzaje źródeł światła.
    - **Pomiary elektryczne:** Zakresy pomiarów (impedancja pętli zwarcia, rezystancja izolacji, uziomy).
    - **WLZ / Przyłącza:** Przepisy dotyczące warunków technicznych przyłączy, wymagań dla złącz kablowych.
    - **Kody usterek:** Najczęstsze kody błędów inwerterów (do uzupełnienia przez użytkownika).

### 2. Ulepszenie UI (`src/screens/KnowledgeScreen.js`)
- **Wyszukiwarka:** Dodanie paska wyszukiwania na górze ekranu.
- **Dodatkowe formatowanie:** Wsparcie dla bullet-points wewnątrz `summary` (może wymagać zmiany w strukturze danych na tablicę stringów).
- **Zasoby:** Dodanie sekcji "Szybkie tabele" (np. przekroje kabli w zależności od prądu).

## Weryfikacja
- Sprawdzenie czy nowa treść jest poprawnie renderowana.
- Weryfikacja szybkości działania wyszukiwarki.
- Czytelność formatowania na małych ekranach.

## Kroki (Phases)
1. Rozbudowa pliku `normsData.js` o nowe, techniczne dane.
2. Aktualizacja `KnowledgeScreen.js` (wyszukiwarka, lepsze formatowanie treści).
3. Dodanie nowych ikon z `lucide-react-native` dla nowych kategorii.
