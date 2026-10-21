import AsyncStorage from '@react-native-async-storage/async-storage';

const ESTIMATES_KEY = '@vawcalc_saved_estimates';
const CUSTOM_RATES_KEY = '@vawcalc_custom_rates';

// Domyślny cennik bazowy
export const DEFAULT_RATES = {
  pvLaborPerKwp: '600',
  pvMaterialPerKwp: '1200',
  houseLaborPerPoint: '130',
  houseMaterialPerPoint: '85',
  wlzLaborPerMeter: '70',
  wlzMaterialPerMeter: '55',
  logisticsPerKm: '2.5',
  equipmentDailyRate: '800',
  measurementsProtocolsFlat: '450',
  defaultMarginPercent: '20',
};

// Zapisywanie listy ofert
export const getSavedEstimates = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(ESTIMATES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Błąd odczytu ofert:', e);
    return [];
  }
};

export const saveEstimateToStorage = async (estimate) => {
  try {
    const current = await getSavedEstimates();
    const updated = [estimate, ...current.filter(item => item.id !== estimate.id)];
    await AsyncStorage.setItem(ESTIMATES_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Błąd zapisu oferty:', e);
    return false;
  }
};

export const deleteEstimateFromStorage = async (id) => {
  try {
    const current = await getSavedEstimates();
    const updated = current.filter(item => item.id !== id);
    await AsyncStorage.setItem(ESTIMATES_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Błąd usuwania oferty:', e);
    return false;
  }
};

// Zapisywanie własnych stawek instalatora
export const getCustomRates = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CUSTOM_RATES_KEY);
    return jsonValue != null ? { ...DEFAULT_RATES, ...JSON.parse(jsonValue) } : DEFAULT_RATES;
  } catch (e) {
    return DEFAULT_RATES;
  }
};

export const saveCustomRates = async (rates) => {
  try {
    await AsyncStorage.setItem(CUSTOM_RATES_KEY, JSON.stringify(rates));
    return true;
  } catch (e) {
    console.error('Błąd zapisu stawek:', e);
    return false;
  }
};
