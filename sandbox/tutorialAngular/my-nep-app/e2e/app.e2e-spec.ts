import { MyNepAppPage } from './app.po';

describe('my-nep-app App', function() {
  let page: MyNepAppPage;

  beforeEach(() => {
    page = new MyNepAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
