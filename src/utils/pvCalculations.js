/**
 * Narzędzia obliczeniowe dla fotowoltaiki zgodne z normami PN-HD 60364-7-712 i IEC 62548
 */

/**
 * Obliczenie temperatury pracy ogniwa w oparciu o NOCT/NMOT
 * @param {number} tAmb - temp. otoczenia (°C)
 * @param {number} noct - temperatura NOCT modułu (°C)
 * @param {number} irradiance - natężenie promieniowania (W/m²), domyślnie 1000 dla STC/ekstremum letniego
 */
export const calculateCellTemperature = (tAmb, noct = 45, irradiance = 1000) => {
  return tAmb + ((noct - 20) / 800) * irradiance;
};

/**
 * Obliczenie skorygowanych parametrów modułu dla danej temperatury
 */
export const calculatePanelAtTemperature = ({
  vocStc,
  vmpStc,
  iscStc,
  impStc,
  pmpStc,
  tempCoefVoc, // %/°C (ujemny)
  tempCoefIsc, // %/°C (dodatni)
  tempCoefPmp, // %/°C (ujemny)
  cellTemp,    // °C
}) => {
  const deltaT = cellTemp - 25; // Odchylenie od STC (25°C)
  const coefVoc = (tempCoefVoc || -0.26) / 100;
  const coefIsc = (tempCoefIsc || 0.045) / 100;
  const coefPmp = (tempCoefPmp || -0.32) / 100;

  const voc = vocStc * (1 + coefVoc * deltaT);
  const vmp = vmpStc * (1 + coefVoc * deltaT); // Napięcie Vmp zmienia się b. podobnie do Voc
  const isc = iscStc * (1 + coefIsc * deltaT);
  const imp = impStc * (1 + coefIsc * deltaT);
  const pmp = pmpStc * (1 + coefPmp * deltaT);

  return {
    cellTemp,
    deltaT,
    voc: Math.max(0, voc),
    vmp: Math.max(0, vmp),
    isc: Math.max(0, isc),
    imp: Math.max(0, imp),
    pmp: Math.max(0, pmp),
    powerLossPercent: coefPmp * deltaT * 100,
  };
};

/**
 * Obliczenia dopasowania łańcucha modułów do falownika
 */
export const calculateStringConfig = ({
  panel,
  inverter,
  tMin = -20,       // Zimowa minimalna temp. otoczenia (°C)
  tMax = 35,        // Letnia maksymalna temp. otoczenia (°C)
  roofType = 'pitched', // 'pitched' (dach skośny, +35°C nagrzew) | 'flat' (+30°C) | 'ground' (+25°C)
  modulesInSeries = 10,
  parallelStrings = 1,
}) => {
  // Obliczenie temp. ogniwa w skrajnych warunkach
  // Zimą przy braku słońca/słabym słońcu i mrozie temp. ogniwa = temp. otoczenia
  const cellTempMin = tMin;

  // Latem przy silnym słońcu (1000 W/m²) ogniwa nagrzewają się znacząco:
  const tempRise = roofType === 'pitched' ? 35 : roofType === 'flat' ? 30 : 25;
  const cellTempMax = tMax + tempRise; // zazwyczaj 65°C - 70°C

  // Parametry modułu w Tmin (najwyższe napięcia)
  const panelCold = calculatePanelAtTemperature({
    vocStc: panel.voc,
    vmpStc: panel.vmp,
    iscStc: panel.isc,
    impStc: panel.imp || panel.isc * 0.94,
    pmpStc: panel.pmp,
    tempCoefVoc: panel.tempCoefVoc,
    tempCoefIsc: panel.tempCoefIsc,
    tempCoefPmp: panel.tempCoefPmp,
    cellTemp: cellTempMin,
  });

  // Parametry modułu w Tmax (najniższe napięcia, najwyższe prądy)
  const panelHot = calculatePanelAtTemperature({
    vocStc: panel.voc,
    vmpStc: panel.vmp,
    iscStc: panel.isc,
    impStc: panel.imp || panel.isc * 0.94,
    pmpStc: panel.pmp,
    tempCoefVoc: panel.tempCoefVoc,
    tempCoefIsc: panel.tempCoefIsc,
    tempCoefPmp: panel.tempCoefPmp,
    cellTemp: cellTempMax,
  });

  // Maksymalna liczba modułów ograniczona napięciem Voc_max falownika
  const maxSeriesVoc = Math.floor(inverter.vocMax / panelCold.voc);

  // Maksymalna liczba modułów ograniczona górną granicą MPPT w niskiej temperaturze
  const maxSeriesMppt = Math.floor(inverter.mpptMax / panelCold.vmp);

  const absoluteMaxSeries = Math.min(maxSeriesVoc, maxSeriesMppt);

  // Minimalna liczba modułów wymagana dla dolnej granicy MPPT w wysokiej temperaturze
  const minSeriesMppt = Math.ceil(inverter.mpptMin / panelHot.vmp);

  // Maksymalna liczba gałęzi równoległych dla wejścia MPPT falownika
  const maxParallelByIsc = Math.floor((inverter.iscMaxMppt || inverter.imaxPerMppt * 1.3) / panelHot.isc);
  const maxParallelByImp = Math.floor(inverter.imaxPerMppt / panelHot.imp);
  const recommendedMaxParallel = Math.max(1, Math.min(maxParallelByIsc, maxParallelByImp));

  // Weryfikacja aktualnej konfiguracji (N modułów)
  const n = parseInt(modulesInSeries, 10) || 0;
  const p = parseInt(parallelStrings, 10) || 1;

  const currentStringVocCold = n * panelCold.voc;
  const currentStringVmpCold = n * panelCold.vmp;
  const currentStringVmpHot = n * panelHot.vmp;
  const currentStringVmpStc = n * panel.vmp;
  const currentStringPower = n * p * panel.pmp;
  const currentTotalImp = p * panelHot.imp;
  const currentTotalIsc = p * panelHot.isc;

  // Testy bezpieczeństwa i poprawności
  const isVocOk = currentStringVocCold <= inverter.vocMax;
  const isMpptMinOk = currentStringVmpHot >= inverter.mpptMin;
  const isMpptMaxOk = currentStringVmpCold <= inverter.mpptMax;
  const isCurrentImpOk = currentTotalImp <= inverter.imaxPerMppt * 1.05; // 5% tolerancji clippingu prądowego
  const isCurrentIscOk = !inverter.iscMaxMppt || currentTotalIsc <= inverter.iscMaxMppt;

  const isValid = isVocOk && isMpptMinOk && isMpptMaxOk && isCurrentIscOk && n >= minSeriesMppt && n <= absoluteMaxSeries;

  let warning = '';
  if (!isVocOk) {
    warning = `NIEBEZPIECZEŃSTWO! Napięcie Voc stringu w ${tMin}°C (${currentStringVocCold.toFixed(1)}V) przekracza maksymalne napięcie falownika (${inverter.vocMax}V). Ryzyko uszkodzenia falownika!`;
  } else if (!isMpptMinOk) {
    warning = `UWAGA: Napięcie robocze Vmp w temp. ${cellTempMax}°C (${currentStringVmpHot.toFixed(1)}V) jest poniżej dolnego progu MPPT (${inverter.mpptMin}V). Falownik nie osiągnie pełnej mocy latem!`;
  } else if (!isMpptMaxOk) {
    warning = `UWAGA: Napięcie robocze Vmp zimą (${currentStringVmpCold.toFixed(1)}V) przekracza górny zakres MPPT (${inverter.mpptMax}V).`;
  } else if (!isCurrentIscOk) {
    warning = `UWAGA: Prąd zwarciowy gałęzi (${currentTotalIsc.toFixed(1)}A) przekracza dopuszczalny prąd zwarciowy MPPT (${inverter.iscMaxMppt}A).`;
  } else if (!isCurrentImpOk) {
    warning = `INFORMACJA: Prąd roboczy (${currentTotalImp.toFixed(1)}A) nieznacznie przewyższa Imax MPPT (${inverter.imaxPerMppt}A). Może występować ograniczenie prądowe (clipping).`;
  }

  return {
    cellTempMin,
    cellTempMax,
    panelCold,
    panelHot,
    maxSeriesVoc,
    maxSeriesMppt,
    absoluteMaxSeries: Math.max(1, absoluteMaxSeries),
    minSeriesMppt: Math.max(1, minSeriesMppt),
    recommendedMaxParallel,
    // Aktualna konfiguracja
    n,
    p,
    currentStringVocCold,
    currentStringVmpCold,
    currentStringVmpHot,
    currentStringVmpStc,
    currentStringPower,
    currentTotalImp,
    currentTotalIsc,
    isVocOk,
    isMpptMinOk,
    isMpptMaxOk,
    isCurrentImpOk,
    isCurrentIscOk,
    isValid,
    warning,
  };
};

/**
 * Obliczenia weryfikacji i doboru falownika (DC/AC ratio, prądy AC, zabezpieczenia)
 */
export const calculateInverterSizing = ({
  totalDcPowerKwp,     // Łączna moc generatora DC w kWp
  inverterPowerAcKw,   // Moc znamionowa AC falownika w kW
  maxApparentPowerKva, // Maksymalna moc pozorna falownika w kVA (często 1.1x Pac)
  phases = 3,          // 1 lub 3 fazy
  voltageAc = 400,     // 230V lub 400V
  cosPhi = 1.0,        // Współczynnik mocy (0.9 - 1.0)
  inverterEfficiency = 98.2, // %
  orientation = 'south', // 'south' | 'east_west'
}) => {
  const pdc = parseFloat(totalDcPowerKwp) || 0;
  const pac = parseFloat(inverterPowerAcKw) || 0;
  const smax = parseFloat(maxApparentPowerKva) || pac;
  const eff = (parseFloat(inverterEfficiency) || 98) / 100;

  // Stosunek przewymiarowania DC/AC
  const dcAcRatio = pac > 0 ? (pdc / pac) * 100 : 0;

  // Maksymalny prąd wyjściowy AC
  let currentAcMax = 0;
  if (phases === 1) {
    // 1-faza: I = S / U
    currentAcMax = (smax * 1000) / (voltageAc === 400 ? 230 : voltageAc * cosPhi);
  } else {
    // 3-fazy: I = S / (sqrt(3) * U)
    currentAcMax = (smax * 1000) / (Math.sqrt(3) * voltageAc * cosPhi);
  }

  // Dobór wyłącznika nadprądowego (In >= 1.25 * I_ac wg SEP/IEC)
  const targetCurrent = currentAcMax * 1.25;
  const standardBreakers = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];
  const recommendedBreaker = standardBreakers.find(b => b >= targetCurrent) || 125;

  // Ocena DC/AC ratio
  let ratioStatus = 'success';
  let ratioComment = 'Optymalny stosunek DC/AC. Falownik będzie pracował z wysoką sprawnością przez większość roku.';
  let estimatedClippingLoss = 0.1; // % strat z obcinania szczytów

  if (orientation === 'east_west') {
    if (dcAcRatio < 110) {
      ratioStatus = 'warning';
      ratioComment = 'Dla instalacji Wschód-Zachód zaleca się wyższe przewymiarowanie (120-135%), gdyż moduły nie pracują jednocześnie pod słońce.';
    } else if (dcAcRatio <= 135) {
      ratioStatus = 'success';
      ratioComment = 'Idealne przewymiarowanie dla dachu dwuspadowego Wschód-Zachód.';
      estimatedClippingLoss = 0.4;
    } else if (dcAcRatio <= 150) {
      ratioStatus = 'warning';
      ratioComment = 'Dość wysokie przewymiarowanie. Mogą wystąpić niewielkie straty z obcinania mocy w godzinach południowych (1-2%).';
      estimatedClippingLoss = 1.8;
    } else {
      ratioStatus = 'danger';
      ratioComment = 'Zbyt wysokie przewymiarowanie (>150%). Znaczące straty z obcinania mocy.';
      estimatedClippingLoss = 5.0;
    }
  } else {
    // Orientacja Południe
    if (dcAcRatio < 95) {
      ratioStatus = 'warning';
      ratioComment = 'Niedowymiarowany generator PV względem falownika. Falownik rzadko osiągnie pełną moc, wyższy koszt inwestycji w inwerter.';
      estimatedClippingLoss = 0.0;
    } else if (dcAcRatio <= 120) {
      ratioStatus = 'success';
      ratioComment = 'Znakomity stosunek DC/AC dla orientacji południowej. Znikome straty clippingu (<0.3%).';
      estimatedClippingLoss = 0.2;
    } else if (dcAcRatio <= 130) {
      ratioStatus = 'success';
      ratioComment = 'Dobre przewymiarowanie. Zwiększa uzysk w dni pochmurne przy minimalnym clippingu w letnie południa.';
      estimatedClippingLoss = 0.8;
    } else if (dcAcRatio <= 140) {
      ratioStatus = 'warning';
      ratioComment = 'Umiarkowany clipping w słoneczne dni letnie (~1.5 - 2.5% rocznych strat mocy szczytowej).';
      estimatedClippingLoss = 2.2;
    } else {
      ratioStatus = 'danger';
      ratioComment = 'Przewymiarowanie powyżej 140%. Falownik będzie obcinał energię w wielu godzinach szczytowych.';
      estimatedClippingLoss = 4.5;
    }
  }

  // Szacowany roczny uzysk energii (Polska: średnio 1000 kWh/kWp dla S, 880 dla E-W)
  const specificYield = orientation === 'east_west' ? 880 : 1020;
  const estimatedAnnualYieldKwh = pdc * specificYield * eff * (1 - estimatedClippingLoss / 100);

  // Zalecenia RCD
  const rcdRecommendation = phases === 3
    ? 'Typ A (lub Typ B zalecany dla niektórych falowników beztransformatorowych), IΔn = 100mA lub 300mA selektywny'
    : 'Typ A, IΔn = 30mA lub 100mA';

  return {
    dcAcRatio: dcAcRatio.toFixed(1),
    currentAcMax: currentAcMax.toFixed(2),
    recommendedBreaker: `B${recommendedBreaker} (lub C${recommendedBreaker})`,
    recommendedBreakerValue: recommendedBreaker,
    rcdRecommendation,
    ratioStatus,
    ratioComment,
    estimatedClippingLoss: estimatedClippingLoss.toFixed(1),
    estimatedAnnualYieldKwh: Math.round(estimatedAnnualYieldKwh),
  };
};
