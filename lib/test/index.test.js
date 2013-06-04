// skull main lib test
var assert = require('assert'),
    should = require('should'),
    mustache = require('mustache'),
    ch = require('charlatan'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
    skull = require('../');

suite('Skull lib', function () {
    suite('create', function () {
        var templateInfo = {
            template: ch.letterify('?????'),
            name: ch.Name.title(),
            description: ch.Lorem.text(),
            version: '0.0.1',
            tree: [],
            dir: './test'
        },
        skrc = JSON.stringify({
            name: "{{name}}",
            description: "{{description}}",
            version: "{{version}}",
            tree: "{{tree}}"
        });

        skrc = mustache.render( skrc, templateInfo ); 

        var current = path.join(
                templateInfo.dir,
                'skull-' + templateInfo.template
            ),
            skrcPath = path.join(
                current, '/.skrc'
            );

        test('rc', function () {
            var rc = skull.create.rc( templateInfo );

            rc.should.equal( skrc );
        });

        test('template', function (done) {
            skull.create.template( templateInfo, function ( res ) {
                res.should.equal( true );
                done();
            });
        });    

        after(function () {
            spawn( 'rm', [ 
                '-rf',
                path.join( __dirname, '..', current ) 
            ]);
        });
    });    
});
