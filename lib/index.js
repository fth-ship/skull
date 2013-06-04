// skull main lib
(function () {
    var root = exports,
        // modules
        mustache = require('mustache'),
        mkdirp = require('mkdirp'),
        fs = require('fs'),
        path = require('path'),
        // skull methods
        create = null;

    create = root.create = {};

    create.rc = function ( obj ) {
        var out = JSON.stringify({
            name: '{{name}}',
            description: '{{description}}',
            version: '{{version}}',
            tree: '{{tree}}'
        });

        out = mustache.render( out, obj );

        return out;
    };

    create.template = function ( obj, cb ) { 
        var out = false,
            template = obj['template'], 
            dst = path.join(
                __dirname,
                obj['dir'],
                'skull-' + template
            ),
            skrc = create.rc( obj ),
            skrcPath = path.join( dst, '.skrc' ),
            skrcContent = null;

        function dstHandler ( err ) {
            if ( !err ) {
                skrcContent = fs.createWriteStream( skrcPath );
                skrcContent.write( skrc );
                skrcContent.end();
                out = true;

                cb( out );
            } else {
                cb( out );
            }
        }

        mkdirp( dst, dstHandler );
    };
}).call( this );
