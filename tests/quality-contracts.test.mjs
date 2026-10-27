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

test("unicode-search-contract-ligature", () => {
const p=Object.freeze({...post,title:"\ufb00 tools"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"ff"),[p]);assert.deepEqual(api.filterPosts(input,"ff absent"),[]);assert.equal(p.title,"\ufb00 tools");
});

test("unicode-search-contract-fullwidth", () => {
const p=Object.freeze({...post,title:"\uff26\uff35\uff2c\uff2c"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"full"),[p]);assert.deepEqual(api.filterPosts(input,"full absent"),[]);assert.equal(p.title,"\uff26\uff35\uff2c\uff2c");
});

test("unicode-search-contract-circled", () => {
const p=Object.freeze({...post,title:"\u2460 ideas"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"1"),[p]);assert.deepEqual(api.filterPosts(input,"1 absent"),[]);assert.equal(p.title,"\u2460 ideas");
});

test("unicode-search-contract-space-order", () => {
const p=Object.freeze({...post,title:"Camera Gear Review"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"review camera"),[p]);assert.deepEqual(api.filterPosts(input,"review camera absent"),[]);assert.equal(p.title,"Camera Gear Review");
});

test("unicode-search-contract-greek", () => {
const p=Object.freeze({...post,title:"\u03ac\u03bb\u03c6\u03b1"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"\u03b1\u03bb\u03c6\u03b1"),[p]);assert.deepEqual(api.filterPosts(input,"\u03b1\u03bb\u03c6\u03b1 absent"),[]);assert.equal(p.title,"\u03ac\u03bb\u03c6\u03b1");
});

test("unicode-search-contract-case", () => {
const p=Object.freeze({...post,title:"MiXeD"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"mixed"),[p]);assert.deepEqual(api.filterPosts(input,"mixed absent"),[]);assert.equal(p.title,"MiXeD");
});

test("unicode-search-contract-tabs", () => {
const p=Object.freeze({...post,title:"Video Camera"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"video\tcamera"),[p]);assert.deepEqual(api.filterPosts(input,"video\tcamera absent"),[]);assert.equal(p.title,"Video Camera");
});

test("unicode-search-contract-emoji", () => {
const p=Object.freeze({...post,title:"\ud83c\udfa5 camera"});const input=Object.freeze([p]);assert.deepEqual(api.filterPosts(input,"\ud83c\udfa5"),[p]);assert.deepEqual(api.filterPosts(input,"\ud83c\udfa5 absent"),[]);assert.equal(p.title,"\ud83c\udfa5 camera");
});

test("metric-sanitization-1", () => {
const p={views:NaN,likes:0,comments:0,shares:0,watchTime:NaN,estimatedEarnings:NaN};const s=api.summarizePosts([p]);assert.equal(s.totalViews,0);assert.equal(s.watchTimeHours,0);assert.equal(s.estimatedRevenue,0);assert.ok(Object.values(s).every(Number.isFinite));
});

test("metric-sanitization-2", () => {
const p={views:Infinity,likes:0,comments:0,shares:0,watchTime:Infinity,estimatedEarnings:Infinity};const s=api.summarizePosts([p]);assert.equal(s.totalViews,0);assert.equal(s.watchTimeHours,0);assert.equal(s.estimatedRevenue,0);assert.ok(Object.values(s).every(Number.isFinite));
});

test("metric-sanitization-3", () => {
const p={views:-Infinity,likes:0,comments:0,shares:0,watchTime:-Infinity,estimatedEarnings:-Infinity};const s=api.summarizePosts([p]);assert.equal(s.totalViews,0);assert.equal(s.watchTimeHours,0);assert.equal(s.estimatedRevenue,0);assert.ok(Object.values(s).every(Number.isFinite));
});

test("metric-sanitization-4", () => {
const p={views:-1,likes:0,comments:0,shares:0,watchTime:-1,estimatedEarnings:-1};const s=api.summarizePosts([p]);assert.equal(s.totalViews,0);assert.equal(s.watchTimeHours,0);assert.equal(s.estimatedRevenue,0);assert.ok(Object.values(s).every(Number.isFinite));
});

test("metric-sanitization-5", () => {
const p={views:0,likes:0,comments:0,shares:0,watchTime:0,estimatedEarnings:0};const s=api.summarizePosts([p]);assert.equal(s.totalViews,0);assert.equal(s.watchTimeHours,0);assert.equal(s.estimatedRevenue,0);assert.ok(Object.values(s).every(Number.isFinite));
});

test("metric-sanitization-6", () => {
const p={views:null,likes:0,comments:0,shares:0,watchTime:null,estimatedEarnings:null};const s=api.summarizePosts([p]);assert.equal(s.totalViews,0);assert.equal(s.watchTimeHours,0);assert.equal(s.estimatedRevenue,0);assert.ok(Object.values(s).every(Number.isFinite));
});

test("metric-sanitization-7", () => {
const p={views:'100',likes:0,comments:0,shares:0,watchTime:'100',estimatedEarnings:'100'};const s=api.summarizePosts([p]);assert.equal(s.totalViews,0);assert.equal(s.watchTimeHours,0);assert.equal(s.estimatedRevenue,0);assert.ok(Object.values(s).every(Number.isFinite));
});

test("metric-sanitization-8", () => {
const p={views:undefined,likes:0,comments:0,shares:0,watchTime:undefined,estimatedEarnings:undefined};const s=api.summarizePosts([p]);assert.equal(s.totalViews,0);assert.equal(s.watchTimeHours,0);assert.equal(s.estimatedRevenue,0);assert.ok(Object.values(s).every(Number.isFinite));
});
