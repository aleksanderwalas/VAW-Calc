import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const generateEstimatePDF = async (estimateData, subTab) => {
  const getTabName = (tab) => {
    switch (tab) {
      case 'pv': return 'Instalacja Fotowoltaiczna';
      case 'house': return 'Instalacja Domowa';
      case 'wlz': return 'WLZ / Przyłącze';
      default: return 'Wycena Prac';
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
          .header { border-bottom: 2px solid #F59E0B; padding-bottom: 20px; margin-bottom: 30px; }
          .title { color: #F59E0B; font-size: 24px; font-weight: bold; }
          .subtitle { font-size: 14px; color: #666; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-left: 4px solid #F59E0B; padding-left: 10px; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; }
          .highlight { background-color: #FFFBEB; padding: 15px; border-radius: 8px; margin-top: 30px; }
          .total-row { font-size: 18px; color: #F59E0B; font-weight: bold; }
          .footer { margin-top: 50px; font-size: 10px; color: #999; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">VAW Calc - Kosztorys Inwestorski</div>
          <div class="subtitle">Wygenerowano: ${new Date().toLocaleDateString('pl-PL')}</div>
        </div>

        <div class="section">
          <div class="section-title">Typ Inwestycji: ${getTabName(subTab)}</div>
          <div class="row">
            <span class="label">Podstawa wyceny:</span>
            <span>${estimateData.baseUnits} jednostek</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Szczegóły Wykonania</div>
          <div class="row">
            <span class="label">Wartość robocizny:</span>
            <span>${estimateData.laborTotal} PLN</span>
          </div>
          <div class="row">
            <span class="label">Wartość materiałów + osprzętu:</span>
            <span>${estimateData.materialTotal} PLN</span>
          </div>
        </div>

        <div class="highlight">
          <div class="row total-row">
            <span class="label">Suma Netto:</span>
            <span>${estimateData.totalWithMargin} PLN</span>
          </div>
          <div class="row" style="font-size: 16px; font-weight: bold;">
            <span class="label">Suma Brutto (VAT 23%):</span>
            <span>${estimateData.grossTotal} PLN</span>
          </div>
        </div>

        <div class="footer">
          Aplikacja VAW Calc - Profesjonalne wsparcie dla instalatora.
          Autor: Aleksander Walas
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  } catch (error) {
    console.error('Błąd generowania PDF:', error);
  }
};
