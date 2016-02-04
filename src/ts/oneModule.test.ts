/// <reference path="../../typings/browser.d.ts" />
import OneClass from './oneModule';

describe('oneModule test', function() {

    it('test simple', function() {
        let myClass: OneClass = new OneClass();

        expect(myClass instanceof OneClass).toBeTruthy();
        expect(myClass.setText).toBeDefined();
    });

});
