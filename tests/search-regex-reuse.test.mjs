import {test} from 'node:test';
import assert from 'node:assert/strict';
import {filterPosts} from '../lib/post-tools.ts';
test('search reuses the Unicode mark expression instead of constructing one per title',()=>{
 const Original=globalThis.RegExp;let calls=0;let result;
 try{globalThis.RegExp=function(...args){calls++;return new Original(...args);};globalThis.RegExp.prototype=Original.prototype;result=filterPosts([{title:'Café camera'},{title:'CAFÉ review'},{title:'Other'}],'cafe');}
 finally{globalThis.RegExp=Original;}
 assert.equal(calls,0);assert.equal(result.length,2);assert.equal(filterPosts([{title:'Café camera'}],'cafe camera').length,1);
});
