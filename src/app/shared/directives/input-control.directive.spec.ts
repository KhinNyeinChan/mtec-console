import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputControlDirective } from './input-control.directive';

@Component({
  standalone: true,
  imports: [InputControlDirective],
  template: `
    <input
      appInputControl
      [isAllowNumber]="allowNumber"
      [isAllowSpecialCharacter]="allowSpecial"
      [isAllowMyanmar]="allowMyanmar"
      [isAllowMyanmarNumber]="allowMyanmarNumber"
    />
  `,
})
class HostComponent {
  allowNumber = false;
  allowSpecial = false;
  allowMyanmar = false;
  allowMyanmarNumber = false;
}

describe('InputControlDirective', () => {
  async function setup(overrides: Partial<HostComponent> = {}) {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    return { fixture, input };
  }

  function typeValue(input: HTMLInputElement, value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  it('should allow latin letters by default and strip numbers', async () => {
    const { input } = await setup();
    typeValue(input, 'Hello123');
    expect(input.value).toBe('Hello');
  });

  it('should keep numbers when isAllowNumber is true', async () => {
    const { input } = await setup({ allowNumber: true });
    typeValue(input, 'Hello123');
    expect(input.value).toBe('Hello123');
  });

  it('should keep Myanmar letters when isAllowMyanmar is true', async () => {
    const { input } = await setup({ allowMyanmar: true });
    typeValue(input, 'Helloမန္တလေး');
    expect(input.value).toBe('Helloမန္တလေး');
  });

  it('should keep Myanmar digits only when isAllowMyanmarNumber is true', async () => {
    const blocked = await setup();
    typeValue(blocked.input, 'No၀၁၂');
    expect(blocked.input.value).toBe('No');

    const allowed = await setup({ allowMyanmarNumber: true });
    typeValue(allowed.input, 'No၀၁၂');
    expect(allowed.input.value).toBe('No၀၁၂');
  });

  it('should keep special characters when isAllowSpecialCharacter is true', async () => {
    const blocked = await setup();
    typeValue(blocked.input, 'Hi@#');
    expect(blocked.input.value).toBe('Hi');

    const allowed = await setup({ allowSpecial: true });
    typeValue(allowed.input, 'Hi@#');
    expect(allowed.input.value).toBe('Hi@#');
  });
});
