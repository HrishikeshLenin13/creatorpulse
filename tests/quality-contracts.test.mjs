import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../lib/post-tools.ts';
import * as out from '../lib/export.ts';
import * as utils from '../lib/utils.ts';
const post={title:'Creator gear',views:100,likes:5,comments:2,shares:3,watchTime:3600,estimatedEarnings:2,engagementRate:10};

function csvRows(source){const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<source.length;i++){const c=source[i];if(c==='"'){if(quoted&&source[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if(c==='\r'&&source[i+1]==='\n'&&!quoted){row.push(cell);rows.push(row);row=[];cell='';i++;}else cell+=c;}assert.equal(quoted,false);return rows;}

test("csv-title-roundtrip-comma", () => {
const p={...post,title:"A, B"};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"A, B");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("csv-title-roundtrip-quote", () => {
const p={...post,title:"A \"B\""};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"A \"B\"");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("csv-title-roundtrip-crlf", () => {
const p={...post,title:"A\r\nB"};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"A\r\nB");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("csv-title-roundtrip-tab", () => {
const p={...post,title:"A\tB"};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"A\tB");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("csv-title-roundtrip-unicode", () => {
const p={...post,title:"Caf\u00e9 \u5b66\u7fd2 \ud83d\udcda"};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"Caf\u00e9 \u5b66\u7fd2 \ud83d\udcda");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("csv-title-roundtrip-formula", () => {
const p={...post,title:"=SUM(A1:A2)"};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"'=SUM(A1:A2)");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("csv-title-roundtrip-plus", () => {
const p={...post,title:"+2+3"};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"'+2+3");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("csv-title-roundtrip-minus", () => {
const p={...post,title:"-2+3"};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"'-2+3");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("csv-title-roundtrip-at", () => {
const p={...post,title:"@test"};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"'@test");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("csv-title-roundtrip-spaced-formula", () => {
const p={...post,title:"  =1+2"};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"'  =1+2");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("csv-title-roundtrip-tab-formula", () => {
const p={...post,title:"\t=1"};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"'\t=1");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("csv-title-roundtrip-line-leading", () => {
const p={...post,title:"\nlabel"};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"'\nlabel");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("csv-title-roundtrip-empty", () => {
const p={...post,title:""};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("csv-title-roundtrip-backslash", () => {
const p={...post,title:"A\\B"};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"A\\B");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("csv-title-roundtrip-html", () => {
const p={...post,title:"<script>title</script>"};const rows=csvRows(out.exportPostsCsv([p]));assert.equal(rows.length,2);assert.equal(rows[1].length,7);assert.equal(rows[1][0],"<script>title</script>");assert.equal(rows[1][6],'Demo data');assert.equal(JSON.parse(out.exportPostsJson([p])).posts[0].title,p.title);
});

test("unicode-search-contract-accent", () => {
const p=Object.freeze({...post,title:"Caf\u00e9 guide"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"cafe"),[p]);assert.deepEqual(api.filterPosts(input,"cafe absent"),[]);assert.equal(p.title,"Caf\u00e9 guide");
});

test("unicode-search-contract-ring", () => {
const p=Object.freeze({...post,title:"\u00c5ngstr\u00f6m"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"angstrom"),[p]);assert.deepEqual(api.filterPosts(input,"angstrom absent"),[]);assert.equal(p.title,"\u00c5ngstr\u00f6m");
});

test("unicode-search-contract-diaeresis", () => {
const p=Object.freeze({...post,title:"\u00dcber ideas"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"uber"),[p]);assert.deepEqual(api.filterPosts(input,"uber absent"),[]);assert.equal(p.title,"\u00dcber ideas");
});

test("unicode-search-contract-tilde", () => {
const p=Object.freeze({...post,title:"Ma\u00f1ana"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"manana"),[p]);assert.deepEqual(api.filterPosts(input,"manana absent"),[]);assert.equal(p.title,"Ma\u00f1ana");
});

test("unicode-search-contract-cedilla", () => {
const p=Object.freeze({...post,title:"Fa\u00e7ade"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"facade"),[p]);assert.deepEqual(api.filterPosts(input,"facade absent"),[]);assert.equal(p.title,"Fa\u00e7ade");
});

test("unicode-search-contract-macron", () => {
const p=Object.freeze({...post,title:"T\u014dky\u014d"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"tokyo"),[p]);assert.deepEqual(api.filterPosts(input,"tokyo absent"),[]);assert.equal(p.title,"T\u014dky\u014d");
});

test("unicode-search-contract-combining", () => {
const p=Object.freeze({...post,title:"Cafe\u0301"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"cafe"),[p]);assert.deepEqual(api.filterPosts(input,"cafe absent"),[]);assert.equal(p.title,"Cafe\u0301");
});
