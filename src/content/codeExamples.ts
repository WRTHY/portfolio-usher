// Literal-string content model, intentionally simple for now: each file's
// `code` is hand-written to render correctly per framework/language. A
// future pass may move this to a step-based schema (a list of
// `{ action, target, label }` steps) so the same source can drive both the
// rendered code *and* a live playback demo against the page — that
// generator/player is out of scope here.

export type CodeFile = {
  filename: string
  language: 'typescript'
  code: string
}

export type AutomationExample = {
  id: string
  framework: 'playwright' | 'cypress'
  files: CodeFile[]
}

export const codeExamples: readonly AutomationExample[] = [
  {
    id: 'playwright-case-study-modal',
    framework: 'playwright',
    files: [
      {
        filename: 'playwright/case-study-modal.spec.ts',
        language: 'typescript',
        code: `import { test, expect } from '@playwright/test';
import { openCaseStudy } from './fixtures';

test.describe('Portfolio — case studies', () => {
  test('opens a case study modal and shows its tags', async ({ page }) => {
    await page.goto('/');

    const modal = await openCaseStudy(page, 'Placeholder case study one');

    await expect(
      modal.getByRole('heading', { name: 'Placeholder case study one' }),
    ).toBeVisible();
    await expect(modal.getByText('Placeholder', { exact: false })).toBeVisible();

    await modal.getByRole('button', { name: 'Close' }).click();
    await expect(modal).toBeHidden();
  });

  test('nav link scrolls the automation examples section into view', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Automation Examples' }).click();

    await expect(page.locator('#code-samples')).toBeInViewport();
  });
});
`,
      },
      {
        filename: 'playwright/fixtures.ts',
        language: 'typescript',
        code: `import type { Locator, Page } from '@playwright/test';

// Shared helper so every spec opens a case study the same way, instead of
// duplicating the tile-click + modal-wait sequence in each test.
export async function openCaseStudy(page: Page, title: string): Promise<Locator> {
  await page.getByRole('button', { name: new RegExp(title) }).click();

  const modal = page.getByRole('dialog');
  await modal.waitFor({ state: 'visible' });
  return modal;
}
`,
      },
    ],
  },
  {
    id: 'cypress-case-study-modal',
    framework: 'cypress',
    files: [
      {
        filename: 'cypress/e2e/case-study-modal.cy.ts',
        language: 'typescript',
        code: `describe('Portfolio — case studies', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('opens a case study modal and shows its tags', () => {
    cy.contains('button', 'Placeholder case study one').click();

    cy.get('[role="dialog"]').within(() => {
      cy.contains('h2', 'Placeholder case study one').should('be.visible');
      cy.contains('Placeholder').should('be.visible');
      cy.contains('button', 'Close').click();
    });

    cy.get('[role="dialog"]').should('not.exist');
  });

  it('scrolls the automation examples section into view from the nav', () => {
    cy.contains('a', 'Automation Examples').click();

    cy.get('#code-samples').should('be.inViewport');
  });
});
`,
      },
    ],
  },
] as const
