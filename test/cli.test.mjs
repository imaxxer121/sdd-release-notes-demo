import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn, spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const cliPath=fileURLToPath(new URL('../src/cli.mjs',import.meta.url));
const entries=Array.from({length:101},(_,index)=>({title:`Release ${(index * 37) % 101}`,kind:'fix'}));
const expectedLines=Array.from({length:101},(_,index)=>`- **fix**: Release ${(index * 37) % 101}`);

function runCli(args,input=JSON.stringify(entries)) {
  const result=spawnSync(process.execPath,[cliPath,...args],{input,encoding:'utf8',timeout:5000});
  assert.ifError(result.error);
  assert.equal(result.signal,null);
  return result;
}

function assertSuccess(result,stdout) {
  assert.equal(result.status,0);
  assert.equal(result.stdout,stdout);
  assert.equal(result.stderr,'');
}

async function runWithOpenStdin(t,args) {
  const child=spawn(process.execPath,[cliPath,...args],{stdio:['pipe','pipe','pipe']});
  const stdout=[];
  const stderr=[];
  child.stdout.on('data',chunk=>stdout.push(chunk));
  child.stderr.on('data',chunk=>stderr.push(chunk));
  t.after(()=>{
    child.stdin.destroy();
    if (child.exitCode === null && child.signalCode === null) child.kill();
  });
  return await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{
      child.kill();
      reject(new Error(`CLI did not reject ${JSON.stringify(args)} while stdin remained open`));
    },5000);
    child.once('error',error=>{
      clearTimeout(timer);
      reject(error);
    });
    child.once('close',(status,signal)=>{
      clearTimeout(timer);
      resolve({status,signal,stdout:Buffer.concat(stdout).toString('utf8'),stderr:Buffer.concat(stderr).toString('utf8')});
    });
  });
}

test('limit 1 emits only the first of 101 unsorted entries and one final newline',()=>{
  assertSuccess(runCli(['--limit','1']),'- **fix**: Release 0\n');
});

test('limit 100 preserves the first 100 entries in input order',()=>{
  assertSuccess(runCli(['--limit','100']),expectedLines.slice(0,100).join('\n')+'\n');
});

test('leading zeros represent decimal values within the allowed range',()=>{
  assertSuccess(runCli(['--limit','01']),'- **fix**: Release 0\n');
  assertSuccess(runCli(['--limit','00100']),expectedLines.slice(0,100).join('\n')+'\n');
});

test('a limit larger than the input emits all entries unchanged',()=>{
  assertSuccess(runCli(['--limit','100'],JSON.stringify([{title:'B',kind:'fix'},{title:'A',kind:'feat'}])),'- **fix**: B\n- **feat**: A\n');
});

test('the default output retains every entry byte for byte',()=>{
  assertSuccess(runCli([]),expectedLines.join('\n')+'\n');
  assertSuccess(runCli([],JSON.stringify([{title:'B — café',kind:'fix'},{title:'A\ncontinued',kind:'feat'}])),'- **fix**: B — café\n- **feat**: A\ncontinued\n');
});

test('unrelated arguments retain their existing behavior',()=>{
  assertSuccess(runCli(['--unrelated']),expectedLines.join('\n')+'\n');
});

test('the limit counts entries rather than lines in titles',()=>{
  const input=JSON.stringify([{title:'First line\nContinuation',kind:'fix'},{title:'Next entry',kind:'feat'}]);
  assertSuccess(runCli(['--limit','1'],input),'- **fix**: First line\nContinuation\n');
});

test('empty arrays emit zero stdout bytes with and without a limit',()=>{
  assertSuccess(runCli([],'[]'),'');
  assertSuccess(runCli(['--limit','1'],'[]'),'');
});

const argumentFailures=[
  {name:'zero',args:['--limit','0'],reason:/between 1 and 100/},
  {name:'above the maximum',args:['--limit','101'],reason:/between 1 and 100/},
  {name:'very large decimal',args:['--limit','9'.repeat(400)],reason:/between 1 and 100/},
  {name:'zero with leading zeros',args:['--limit','000'],reason:/between 1 and 100/},
  {name:'fraction',args:['--limit','1.5'],reason:/decimal digits/},
  {name:'letters',args:['--limit','abc'],reason:/decimal digits/},
  {name:'missing value',args:['--limit'],reason:/requires a value/},
  {name:'a following option instead of a value',args:['--limit','--limit','1'],reason:/requires a value/},
  {name:'different duplicate values',args:['--limit','1','--limit','2'],reason:/only.*once/},
  {name:'identical duplicate values',args:['--limit','1','--limit','1'],reason:/only.*once/},
  {name:'hexadecimal notation',args:['--limit','0x10'],reason:/decimal digits/},
  {name:'exponent notation',args:['--limit','1e2'],reason:/decimal digits/},
  {name:'positive sign',args:['--limit','+1'],reason:/decimal digits/},
  {name:'negative sign',args:['--limit','-1'],reason:/decimal digits/},
  {name:'leading space',args:['--limit',' 1'],reason:/decimal digits/},
  {name:'trailing space',args:['--limit','1 '],reason:/decimal digits/},
  {name:'embedded space',args:['--limit','1 0'],reason:/decimal digits/},
  {name:'trailing newline',args:['--limit','1\n'],reason:/decimal digits/},
  {name:'trailing carriage return',args:['--limit','1\r'],reason:/decimal digits/},
  {name:'embedded tab',args:['--limit','1\t0'],reason:/decimal digits/},
  {name:'empty string',args:['--limit',''],reason:/decimal digits/},
  {name:'non-ASCII digits',args:['--limit','١'],reason:/decimal digits/},
];

for (const {name,args,reason} of argumentFailures) {
  test(`rejects ${name} with status 2 and no stdout before stdin closes`,async t=>{
    const closedInput=runCli(args);
    assert.equal(closedInput.status,2);
    assert.equal(closedInput.stdout,'');
    assert.match(closedInput.stderr,/--limit/);
    assert.match(closedInput.stderr,reason);

    const openInput=await runWithOpenStdin(t,args);
    assert.equal(openInput.signal,null);
    assert.equal(openInput.status,2);
    assert.equal(openInput.stdout,'');
    assert.match(openInput.stderr,/--limit/);
    assert.match(openInput.stderr,reason);
  });
}

test('the full entries array is validated even after the selected prefix',()=>{
  for (const invalid of [null,{title:1,kind:'fix'},{title:'Invalid kind',kind:1}]) {
    const input=JSON.stringify([{title:'Valid',kind:'fix'},invalid]);
    for (const args of [[],['--limit','1']]) {
      const result=runCli(args,input);
      assert.equal(result.status,2);
      assert.equal(result.stdout,'');
      assert.match(result.stderr,/Invalid entry/);
    }
  }
});

test('wrong shapes, invalid JSON and empty stdin retain their rejection behavior',()=>{
  for (const input of ['{}','null','"text"','{','']) {
    for (const args of [[],['--limit','1']]) {
      const result=runCli(args,input);
      assert.equal(result.status,2);
      assert.equal(result.stdout,'');
      assert.notEqual(result.stderr.trim(),'');
    }
  }
});
