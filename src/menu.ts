import { exec } from 'child_process';

export class Menu {
  public async choose(items: string[]): Promise<string> {
    const stdout = await new Promise<string>((resolve, reject) => {
      const child = exec('dmenu -l 15 ', (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      });
      if (!child.stdin) throw new Error();
      child.stdin.write(items.join('\n'));
      child.stdin.end();
    });
    return stdout.trim();
  }
}
