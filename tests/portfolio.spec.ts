import { test, expect } from '@playwright/test';

test.describe('Consulta Segura', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/index.html');
  });

  test('deve carregar a página corretamente', async ({ page }) => {
    await expect(page).toHaveTitle('Consulta Segura - Análise de URL Pro');
    await expect(page.locator('h2')).toHaveText('Consulta Segura');
    await expect(page.locator('#urlInput')).toBeVisible();
  });

  test('deve mostrar erro quando campo vazio', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Por favor, cole um endereço web');
      await dialog.accept();
    });
    await page.click('button.btn-primary');
  });
});