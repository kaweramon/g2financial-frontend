import { G2financialFrontendPage } from './app.po';

describe('g2financial-frontend App', () => {
  let page: G2financialFrontendPage;

  beforeEach(() => {
    page = new G2financialFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
