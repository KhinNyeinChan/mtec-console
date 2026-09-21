import {
  booleanAttribute,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';

const LATIN_LETTER_OR_SPACE = /[a-zA-Z\s]/;
const ASCII_DIGIT = /[0-9]/;
const MYANMAR_DIGIT = /[\u1040-\u1049]/;
const MYANMAR_LETTER = /[\u1000-\u103F\u104A-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF]/;

@Directive({
  selector: 'input[appInputControl], textarea[appInputControl]',
  standalone: true,
})
export class InputControlDirective {
  readonly isAllowSpecialCharacter = input(false, { transform: booleanAttribute });
  readonly isAllowNumber = input(false, { transform: booleanAttribute });
  readonly isAllowMyanmar = input(false, { transform: booleanAttribute });
  readonly isAllowMyanmarNumber = input(false, { transform: booleanAttribute });

  private readonly el = inject(ElementRef<HTMLInputElement | HTMLTextAreaElement>);

  @HostListener('paste', ['$event'])
  onPaste(event: Event): void {
    const clipboardEvent = event as ClipboardEvent;
    const pasted = clipboardEvent.clipboardData?.getData('text') ?? '';
    if (!pasted) {
      return;
    }

    clipboardEvent.preventDefault();
    this.insertText(this.filterText(pasted));
  }

  @HostListener('compositionend')
  onCompositionEnd(): void {
    this.applyFilteredValue();
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    if ((event as InputEvent).isComposing) {
      return;
    }
    this.applyFilteredValue();
  }

  private isAllowedChar(char: string): boolean {
    if (LATIN_LETTER_OR_SPACE.test(char)) {
      return true;
    }
    if (ASCII_DIGIT.test(char)) {
      return this.isAllowNumber();
    }
    if (MYANMAR_DIGIT.test(char)) {
      return this.isAllowMyanmarNumber();
    }
    if (MYANMAR_LETTER.test(char)) {
      return this.isAllowMyanmar();
    }
    return this.isAllowSpecialCharacter();
  }

  private filterText(value: string): string {
    let result = '';
    for (const char of value) {
      if (this.isAllowedChar(char)) {
        result += char;
      }
    }
    return result;
  }

  private applyFilteredValue(): void {
    const target = this.el.nativeElement;
    const filtered = this.filterText(target.value);
    if (filtered === target.value) {
      return;
    }

    const start = target.selectionStart ?? filtered.length;
    const removed = target.value.length - filtered.length;
    target.value = filtered;
    const nextPos = Math.max(0, start - removed);
    target.setSelectionRange(nextPos, nextPos);
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private insertText(text: string): void {
    if (!text) {
      return;
    }

    const target = this.el.nativeElement;
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    const next = this.filterText(
      `${target.value.slice(0, start)}${text}${target.value.slice(end)}`,
    );
    const caret = Math.min(start + text.length, next.length);

    target.value = next;
    target.setSelectionRange(caret, caret);
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

//usage
// <input appInputControl />
// <input appInputControl isAllowNumber />
// <input
//   appInputControl
//   [isAllowNumber]="true"
//   [isAllowMyanmar]="true"
//   [isAllowMyanmarNumber]="true"
//   [isAllowSpecialCharacter]="false"
// />
// <textarea appInputControl isAllowMyanmar isAllowMyanmarNumber></textarea>
