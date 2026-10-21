// To jest tylko przykład testu, który programista od razu zrozumie
describe('Kalkulator PV - Podstawowe obliczenia', () => {
    it('poprawnie sumuje napięcie szeregowe paneli (Voc)', () => {
        const panelVoc = 40; // Napięcie jednego panelu
        const panelCount = 10; // Ilość paneli
        const totalVoc = panelVoc * panelCount;

        expect(totalVoc).toBe(400);
    });
});