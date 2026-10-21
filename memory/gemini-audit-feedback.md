---
name: gemini-audit-feedback
description: Wnioski z audytu Gemini dla VAW Calc (v1.0.4) - propozycje rozwoju.
metadata:
  type: feedback
---

**Why:** Audyt Gemini wskazuje na konieczność przejścia z narzędzia czysto obliczeniowego na profesjonalny, biznesowy system wspierający pracę instalatora.

**How to apply:**
1. **Funkcje Biznesowe:** [[raporty-pdf]], [[baza-projektow]], [[konfigurowalny-cennik]].
2. **Nowe Moduły:** [[magazyny-energii]], [[dobor-agregatow]], [[baza-norm]].
3. **Architektura UX:** [[ustawienia-globalne]], [[kalkulator-rozdzielnic]].

---

**Szczegóły wniosków:**
*   **Generatory Raportów PDF:** Eksport wyników do profesjonalnego PDF (WhatsApp/E-mail).
*   **Baza Projektów:** Przechowywanie danych lokalnie (SQLite/AsyncStorage).
*   **Moduł Kosztorysowy:** Własne cenniki usług użytkownika.
*   **Magazyny Energii:** Kalkulator pojemności BESS.
*   **Agregaty:** Obliczanie mocy z prądami rozruchowymi.
*   **Baza Wiedzy:** Szybka ściągawka norm (IP/IK, strefy łazienkowe).
*   **Kalkulator Rozdzielnicy:** Liczenie modułów DIN.
*   **Globalne Ustawienia:** Preferencje użytkownika (cena prądu, VAT, materiał).
