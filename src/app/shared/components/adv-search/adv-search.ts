import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  model,
  output,
  untracked,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DropdownOption, DropdownSelect } from '../dropdown-select/dropdown-select';
import { AdvSearchField, AdvSearchOption, AdvSearchRow } from './adv-search.model';
import { SINGLE_VALUE_TYPES } from './adv-search.model';
import { DEFAULT_CONDITIONS } from './adv-search.model';

let nextKey = 0;

@Component({
  selector: 'app-adv-search',
  standalone: true,
  imports: [TranslatePipe, DropdownSelect],
  templateUrl: './adv-search.html',
  styleUrl: './adv-search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvSearch {
  private readonly i18n = inject(TranslateService);

  readonly fields = input<AdvSearchField[]>([]);
  readonly conditionLists = input<Record<string, AdvSearchOption[]>>({});
  readonly typeLists = input<Record<string, AdvSearchOption[]>>({});
  readonly rows = model<AdvSearchRow[]>([]);

  readonly search = output<AdvSearchRow[]>();
  readonly lovChange = output<{ row: AdvSearchRow; value: string }>();

  constructor() {
    effect(() => {
      const fields = this.fields();
      if (fields.length === 0 || this.rows().length > 0) {
        return;
      }
      untracked(() => this.rows.set([this.createRow(fields[0])]));
    });
  }

  isSingleType(datatype: string): boolean {
    return datatype === 'simplesearch' || this.isLovType(datatype);
  }

  isLovType(datatype: string): boolean {
    return !SINGLE_VALUE_TYPES.has(datatype) || datatype in this.typeLists();
  }

  isBetween(row: AdvSearchRow): boolean {
    return row.t3 === 'true';
  }

  conditionList(row: AdvSearchRow): AdvSearchOption[] {
    return this.conditionLists()[row.datatype] ?? DEFAULT_CONDITIONS[row.datatype] ?? [];
  }

  typeList(datatype: string): AdvSearchOption[] {
    return this.typeLists()[datatype] ?? [];
  }

  fieldOptions(): DropdownOption[] {
    return this.fields().map((field) => ({ value: field.itemid, label: field.caption }));
  }

  conditionOptions(row: AdvSearchRow): DropdownOption[] {
    this.i18n.currentLang();
    return this.conditionList(row).map((item) => ({
      value: item.value,
      label: this.optionLabel(item.caption),
    }));
  }

  typeOptions(datatype: string): DropdownOption[] {
    this.i18n.currentLang();
    return this.typeList(datatype).map((item) => ({
      value: item.value,
      label: this.optionLabel(item.caption),
    }));
  }

  onFieldChange(index: number, itemid: string): void {
    const field = this.fields().find((item) => item.itemid === itemid);
    if (!field) {
      return;
    }
    this.patchRow(index, {
      itemid: field.itemid,
      datatype: field.datatype,
      condition: this.defaultCondition(field.datatype),
      t1: '',
      t2: '',
      t3: '',
    });
  }

  onConditionChange(index: number, condition: string): void {
    const between = condition === 'between' || condition === 'btw';
    this.patchRow(index, {
      condition,
      t2: between ? this.rows()[index]?.t2 ?? '' : '',
      t3: between ? 'true' : '',
    });
  }

  onValueChange(index: number, key: 't1' | 't2', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.patchRow(index, { [key]: value });
  }

  onLovChange(index: number, value: string): void {
    this.patchRow(index, { t1: value });
    const row = this.rows()[index];
    if (row) {
      this.lovChange.emit({ row, value });
    }
  }

  addFilter(): void {
    const field = this.fields()[0];
    if (!field) {
      return;
    }
    this.rows.update((rows) => [...rows, this.createRow(field)]);
  }

  removeFilter(index: number): void {
    const current = this.rows();
    if (current.length <= 1) {
      const field = this.fields().find((item) => item.itemid === current[0]?.itemid) ?? this.fields()[0];
      const existing = current[0];
      if (!field || !existing) {
        this.rows.set([]);
        return;
      }
      this.rows.set([
        {
          ...existing,
          itemid: field.itemid,
          datatype: field.datatype,
          condition: this.defaultCondition(field.datatype),
          t1: '',
          t2: '',
          t3: '',
        },
      ]);
      return;
    }
    this.rows.set(current.filter((_, rowIndex) => rowIndex !== index));
  }

  doFilter(): void {
    this.search.emit(this.rows().map((row) => ({ ...row })));
  }

  private createRow(field: AdvSearchField): AdvSearchRow {
    return {
      key: `filter-${++nextKey}`,
      itemid: field.itemid,
      datatype: field.datatype,
      condition: this.defaultCondition(field.datatype),
      t1: '',
      t2: '',
      t3: '',
    };
  }

  private defaultCondition(datatype: string): string {
    const lists = this.conditionLists();
    return (lists[datatype] ?? DEFAULT_CONDITIONS[datatype] ?? [])[0]?.value ?? '';
  }

  private optionLabel(caption: string): string {
    const translated = this.i18n.instant(caption);
    return typeof translated === 'string' ? translated : caption;
  }

  private patchRow(index: number, patch: Partial<AdvSearchRow>): void {
    this.rows.update((rows) =>
      rows.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)),
    );
  }
}
