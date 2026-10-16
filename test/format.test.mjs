import test from 'node:test';
import assert from 'node:assert/strict';
import {formatNotes} from '../src/format.mjs';
test('formats without reordering',()=>assert.equal(formatNotes([{title:'B',kind:'fix'},{title:'A',kind:'feat'}]),'- **fix**: B\n- **feat**: A'));
test('empty input has empty output',()=>assert.equal(formatNotes([]),''));
test('rejects wrong shape',()=>assert.throws(()=>formatNotes({}),TypeError));
test('rejects malformed entry',()=>assert.throws(()=>formatNotes([{title:1,kind:'fix'}]),TypeError));
