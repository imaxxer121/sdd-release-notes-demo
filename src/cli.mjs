import {formatNotes} from './format.mjs';
let input='';
for await (const chunk of process.stdin) input+=chunk;
try {
  const out=formatNotes(JSON.parse(input));
  process.stdout.write(out ? out+'\n' : '');
} catch(error) {
  process.stderr.write(error.message+'\n');
  process.exitCode=2;
}
