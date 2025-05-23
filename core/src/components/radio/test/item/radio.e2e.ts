import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('radio: item'), () => {
    test('should render correctly in list', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-radio-group>
            <ion-item>
              <ion-radio>Enable Notifications</ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`radio-list`));
    });
    test('should render correctly in inset list', async ({ page }) => {
      await page.setContent(
        `
        <ion-list inset="true">
          <ion-radio-group>
            <ion-item>
              <ion-radio>Enable Notifications</ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`radio-inset-list`));
    });
  });
});

configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('radio: long label in item'), () => {
    test('should render margins correctly when using long label in item', async ({ page }) => {
      await page.setContent(
        `
          <ion-list>
            <ion-radio-group>
              <ion-item>
                <ion-radio justify="start">
                  <ion-label class="ion-text-wrap">Enable Notifications Enable Notifications Enable Notifications</ion-label>
                </ion-radio>
              </ion-item>
            </ion-radio-group>
          </ion-list>
        `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`radio-long-label-in-item`));
    });
  });

  test.describe(title('radio: stacked label in item'), () => {
    test('should render margins correctly when using stacked label in item', async ({ page }) => {
      await page.setContent(
        `
          <ion-list>
            <ion-radio-group>
              <ion-item>
                <ion-radio label-placement="stacked">Enable Notifications</ion-radio>
              </ion-item>
            </ion-radio-group>
          </ion-list>
        `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`radio-stacked-label-in-item`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('radio: item functionality'), () => {
    test('clicking padded space within item should click the radio', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/27169',
      });

      await page.setContent(
        `
        <ion-radio-group>
          <ion-item>
            <ion-radio>
              <ion-label>Enable Notifications</ion-label>
            </ion-radio>
          </ion-item>
        </ion-radio-group>
      `,
        config
      );
      const item = page.locator('ion-item');
      const ionChange = await page.spyOnEvent('ionChange');

      // Clicks the padded space within the item
      await item.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      expect(ionChange).toHaveReceivedEvent();
    });

    test('clicking padded space within item should fire one click event', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29758',
      });

      await page.setContent(
        `
        <ion-item>
          <ion-radio>
            Radio
          </ion-radio>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');
      const onClick = await page.spyOnEvent('click');

      // Click the padding area (5px from left edge)
      await item.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      expect(onClick).toHaveReceivedEventTimes(1);

      // Verify that the event target is the radio and not the item
      const event = onClick.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-radio');
    });
  });
});
