---
name: critical-engineering-bugs
description: Krytyczne błędy w obliczeniach inżynierskich (V, I, ΔU, zwarcia, PV) wymagające poprawy.
metadata:
  type: feedback
---

**Why:** Audyt techniczny wykazał szereg błędów w kalkulatorach inżynierskich, które mogą prowadzić do zaniżenia przekrojów przewodów, błędnego doboru zabezpieczeń oraz nieprawidłowej weryfikacji prądów zwarciowych. 

**How to apply:** 
1. **CableSizingCalc:** Fix 400V/1-phase voltage logic, fix cos phi usage in 1-phase/3-phase drops, adjust temperature coefficients, fix tables for >50mm2.
2. **pvCalculations (AC Current):** Fix operator precedence in voltage division, fix power/kVA/cos phi logic.
3. **ShortCircuitCalc:** Replace ad-hoc formulas with standardized IEC 60909 approach (factor c, Z_source).
4. **SWZCalc:** Use `systemType` (TN/TT) to implement proper Ra*IΔn conditions.
5. **Miscellaneous:** Fix 0-value fallbacks (||), fix double-counting yield losses, implement 1.25*Isc for PV string design.

---

**Lista wykrytych błędów:**
- **CableSizingCalc.js:** Błędne napięcie dla 1-faz (400V zamiast 230V), błędne traktowanie cos φ, nierealistyczny liniowy współczynnik temperatury, brak metody D dla ziemi.
- **pvCalculations.js:** Błędna priorytet operatorów (dzielenie przez V bez cos φ), podwójne uwzględnianie strat falownika w uzysku, błędne założenia dla Isc w PV.
- **ShortCircuitCalc.js:** Uproszczone, nieprofesjonalne wzory (magiczna stała 10mΩ), brak współczynnika 'c'.
- **SWZCalc.js:** Nieużywana zmienna układu sieci (TN/TT), brak korekcji temperatury dla Zs.
- **Inne:** Niespójna rezystywność Cu, błędy w obsłudze wartości `0` (błędy logiczne przy `||`).
