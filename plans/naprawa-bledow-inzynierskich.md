# Plan: Naprawa krytycznych błędów inżynierskich (v1.0.8)

## Kontekst
Audyt wykazał szereg poważnych błędów w kalkulatorach inżynierskich, które prowadzą do niebezpiecznych wyników (np. zaniżanie przekrojów kabli). Priorytetem jest natychmiastowa naprawa logiki AC, PV i zwarć.

## Planowana implementacja

### 1. CableSizingCalc.js (Priorytet najwyższy)
- **Napięcie:** Poprawa logiki napięcia (zależność od faz: 230V vs 400V, niezależnie od stanu `voltage`).
- **Cos φ:** Poprawa uwzględniania współczynnika w obliczeniach prądu i spadku napięcia dla 1-fazy (nie można go pomijać).
- **Tabele:** Aktualizacja tablic obciążalności dla kabli > 50mm² zgodnie z normą PN-HD 60364-5-52.
- **Temperatura:** Zmiana współczynnika na nieliniowy (ok. 1.5% na °C).
- **Metody:** Rozróżnienie ułożenia w ziemi (metoda D).

### 2. pvCalculations.js & powiązane moduły
- **Priorytet operacji:** Naprawa wzorów na prąd AC falownika (poprawny nawiasowanie `(U * cosPhi)`).
- **PV logic:** Wdrożenie zasady 1.25 * Isc dla doboru elementów zabezpieczających i falowników.
- **Sprawność:** Usunięcie dublowania strat sprawności w obliczeniach uzysku.

### 3. SWZCalc.js & ShortCircuitCalc.js
- **SWZ:** Implementacja logiki dla układów TT (`Ra * IΔn ≤ 50V`).
- **ShortCircuit:** Implementacja współczynnika c=0.95 (dla Ik_min) lub 1.05 (dla Ik_max) i poprawa wzoru na impedancję.

### 4. Techniczne poprawki "fallbacków"
- Zamiana wszystkich `val || 0` (które psują się przy `0`) na `val === '' ? 0 : parseFloat(val)`.

## Weryfikacja
- Ręczne sprawdzenie wzorów z normami (dla 1-fazy 230V, 3-fazy 400V).
- Weryfikacja, czy przy wyborze 1-fazy w `CableSizingCalc`, obliczenia faktycznie używają 230V.
- Testowanie poprawności działania dla `0` w polach wejściowych.

## Kroki (Phases)
1. Naprawa `CableSizingCalc.js` (najbardziej krytyczne).
2. Naprawa `pvCalculations.js`.
3. Naprawa `ShortCircuitCalc.js` i `SWZCalc.js`.
4. Refaktoryzacja błędnych fallbacków `||` w całej aplikacji.
