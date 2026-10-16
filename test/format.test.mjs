import test from 'node:test';
import assert from 'node:assert/strict';
import {formatNotes} from '../src/format.mjs';
test('formats without reordering',()=>assert.equal(formatNotes([{title:'B',kind:'fix'},{title:'A',kind:'feat'}]),'- **fix**: B\n- **feat**: A'));
test('empty input has empty output',()=>assert.equal(formatNotes([]),''));
test('rejects wrong shape',()=>assert.throws(()=>formatNotes({}),TypeError));
test('rejects malformed entry',()=>assert.throws(()=>formatNotes([{title:1,kind:'fix'}]),TypeError));

const entries = Array.from({length:101}, (_, index)=>({title:`Release ${(index * 37) % 101}`,kind:'fix'}));
const expectedLines = Array.from({length:101}, (_, index)=>`- **fix**: Release ${(index * 37) % 101}`);

test('limit 1 selects the first entry in unsorted input',()=>assert.equal(formatNotes(entries,1),'- **fix**: Release 0'));
test('limit 100 selects exactly the first 100 of 101 entries in input order',()=>assert.equal(formatNotes(entries,100),expectedLines.slice(0,100).join('\n')));
test('omitting the limit preserves every entry',()=>assert.equal(formatNotes(entries),expectedLines.join('\n')));
test('a limit larger than the entry count preserves all entries',()=>assert.equal(formatNotes([{title:'B',kind:'fix'},{title:'A',kind:'feat'}],100),'- **fix**: B\n- **feat**: A'));
test('an empty array remains empty with a limit',()=>assert.equal(formatNotes([],1),''));
test('a limit does not bypass array validation',()=>assert.throws(()=>formatNotes({},1),TypeError));
test('every malformed entry after the selected prefix is still rejected',()=>{
  for (const invalid of [null, {title:1,kind:'fix'}, {title:'Invalid kind',kind:1}]) {
    assert.throws(()=>formatNotes([{title:'Valid',kind:'fix'},invalid],1),TypeError);
  }
});
test('the limit counts entries even when a title contains multiple lines',()=>assert.equal(formatNotes([{title:'First line\nContinuation',kind:'fix'},{title:'Next entry',kind:'feat'}],1),'- **fix**: First line\nContinuation'));
test('formatting a prefix does not mutate the input',()=>{
  const frozen = Object.freeze([Object.freeze({title:'B',kind:'fix'}),Object.freeze({title:'A',kind:'feat'})]);
  assert.equal(formatNotes(frozen,1),'- **fix**: B');
  assert.deepEqual(frozen,[{title:'B',kind:'fix'},{title:'A',kind:'feat'}]);
});
