import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/compat',
  timeout: 60000,
  workers: 2,
  reporter: [['list'], ['json', { outputFile: 'docs/compat/results.json' }], ['html', { outputFolder: 'docs/compat/report', open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4173', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  outputDir: 'docs/compat/artifacts',
  webServer: { command: 'npm.cmd run preview -- --host 127.0.0.1', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
  projects: ['chromium', 'firefox', 'webkit'].flatMap((browserName) => [
    { name: `${browserName}-desktop`, use: { browserName: browserName as 'chromium' | 'firefox' | 'webkit', viewport: { width: 1440, height: 900 } } },
    { name: `${browserName}-mobile`, use: { ...devices['iPhone 13'], browserName: browserName as 'chromium' | 'firefox' | 'webkit', isMobile: browserName !== 'firefox', viewport: { width: 390, height: 844 } } },
  ]),
});
