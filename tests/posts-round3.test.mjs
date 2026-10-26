import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as utils from '../lib/utils.ts';
import * as posts from '../lib/post-tools.ts';
test('reused formatters preserve locale output across repeated metric rendering',()=>{const compact=new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1}),currency=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2});for(const value of [0,1,1234,9999999,-12.5])for(let i=0;i<100;i++){assert.equal(utils.formatCompactNumber(value),compact.format(value));assert.equal(utils.formatCurrency(value),currency.format(value));}});
