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

    suite('search', function () {
        test('template', function ( done ) {
            skull.search.template('hello', function ( templates ) {
                templates.should.have.length(1);
                done();
            });    
        });    
    });

    suite('use', function () {
        var templateInfo = {
            template: 'hello',
            path: path.join(
                'lib',
                'test'
            ),
            index: 0
        };

        test('template', function (done) {
            skull.use.template( templateInfo, function ( template ) {  
                var templatePath
                template.should.be.true;
                fs.existsSync( 
                    path.join(
                        templateInfo.path,
                        templateInfo.template
                    ) 
                ).should.be.true;
                done();
            });    
        });

        after(function () {
            spawn( 'rm', [ 
                '-rf',
                path.join(
                    templateInfo.path,
                    templateInfo.template
                )
            ]);
        });
    });
});
