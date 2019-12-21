#!/usr/bin/env node
import { JSONTree } from './jsonTree';

let data = '';
process.stdin.on('data', chunk => {
  data += chunk;
});
process.stdin.on('end', () => {
  const json = JSON.parse(data);
  const tree = new JSONTree(json);
  tree.navigate().then(x => console.log(x));
});
