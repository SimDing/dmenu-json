import { Menu } from './menu';
import { assertNever } from 'assert-never';
import { JSON } from './json';

class UnexpectdNullError extends Error {
  constructor() {
    super(`'null' not permitted here`);
  }
}

class UnexpectedBooleanError extends Error {
  constructor() {
    super('booleans not permitted');
  }
}

export class JSONTree {
  private pointer: JSON[];
  private menu = new Menu();
  private readonly backString = '(back)';

  constructor(tree: JSON) {
    this.pointer = [tree];
  }

  private async choose(from: string[]): Promise<string | undefined> {
    if (this.pointer.length > 1) {
      const value = await this.menu.choose([this.backString, ...from]);
      if (value === this.backString) {
        this.pointer.pop();
        return undefined;
      } else {
        return value;
      }
    } else {
      return this.menu.choose(from);
    }
  }

  private arrayEntryName(arrayEntry: JSON): string {
    if (typeof arrayEntry === 'string') {
      return arrayEntry;
    }
    if (typeof arrayEntry === 'number') {
      return String(arrayEntry);
    }
    if (arrayEntry instanceof Object) {
      let names: string[];
      if (arrayEntry instanceof Array) {
        names = arrayEntry.map(x => this.arrayEntryName(x));
      } else {
        names = Array.from(Object.keys(arrayEntry));
      }
      return names.join(', ');
    }
    if (arrayEntry === null) {
      throw new UnexpectdNullError();
    }
    if (typeof arrayEntry === 'boolean') {
      throw new UnexpectedBooleanError();
    }
    return assertNever(arrayEntry);
  }

  public async navigate(): Promise<string> {
    const current = this.pointer[this.pointer.length - 1];

    if (typeof current === 'string' || typeof current === 'number') {
      this.pointer = [this.pointer[0]];
      return String(current);
    }

    if (current instanceof Array) {
      const names = current.map(x => this.arrayEntryName(x));
      const chosenName = await this.choose(names);
      if (chosenName !== undefined) {
        const index = names.indexOf(chosenName);
        const value = current[index];
        this.pointer.push(value);
      }
      return this.navigate();
    }

    if (current instanceof Object) {
      const key = await this.choose(Array.from(Object.keys(current)));
      if (key !== undefined) {
        const value = current[key];
        this.pointer.push(value === null ? key : value);
      }
      return this.navigate();
    }

    if (current === null) {
      throw new UnexpectdNullError();
    }

    if (typeof current === 'boolean') {
      throw new UnexpectedBooleanError();
    }

    return assertNever(current);
  }
}
