# Plan: Rozbudowa modułu kosztorysowania (v1.0.7)

## Kontekst
Użytkownik uważa, że obecny moduł kosztorysowania jest zbyt ubogi. Należy go znacząco rozbudować, aby stał się profesjonalnym narzędziem dla instalatora.

## Planowana implementacja

### 1. Rozszerzenie struktury kosztów (Poza "robocizna" i "materiały")
- **Wprowadzenie kategorii:**
    - **Logistyka/Dojazd:** Koszt kilometrówki lub ryczałt.
    - **Sprzęt specjalistyczny:** Wynajem podnośników, koparek, specjalistycznych mierników.
    - **Dokumentacja/Pomiary:** Koszt wykonania protokołów i dokumentacji powykonawczej.
    - **Koszty nieprzewidziane:** Procentowy dodatek (np. 5-10%).

### 2. Rozbudowa modułu cenników (Personalizacja)
- **Konfigurowalne cenniki:** Możliwość zapisu "profilu" cennika (np. "Standardowy", "Premium", "Dla dewelopera").
- **Baza produktów:** Wprowadzenie prostego mechanizmu "ulubionych produktów" (np. konkretne modele falowników, paneli, kabli) z ich cenami jednostkowymi, które automatycznie uzupełniają koszty materiałów.

### 3. Zaawansowane podsumowanie i eksport
- **Rozbudowany PDF:** PDF powinien zawierać nie tylko sumy, ale szczegółową tabelę (Pozycja | Ilość | Cena jedn. | Wartość).
- **Zapisywanie kosztorysów:** Implementacja prostego zapisu kosztorysu (np. `AsyncStorage` w formacie JSON), aby użytkownik mógł wrócić do wyceny w dowolnej chwili.

## Kroki (Phases)
1. **Analiza:** Wywiad z użytkownikiem o kluczowe brakujące pozycje kosztowe (zrobimy to pytaniem w Plan Mode).
2. **Backend/Utils:** Stworzenie struktury dla konfigurowalnych cenników i bazy produktów.
3. **UI/UX:** Rozbudowa `WorkEstimateCalc.js` o nowe zakładki lub listę pozycji (zamiast prostych suwaków).
4. **Raportowanie:** Aktualizacja `pdfGenerator.js` do obsługi tabelarycznej.

## Weryfikacja
- Test zapisu kosztorysu w aplikacji.
- Eksport PDF ze szczegółową tabelą pozycji.
