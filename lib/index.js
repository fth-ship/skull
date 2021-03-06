// skull main lib
(function () {
    var root = exports,
        // contants
        OWNER = 'node-skull',
        PFIX = 'skull',
        SEP = '-',
        S = '',
        // modules
        mustache = require('mustache'),
        mkdirp = require('mkdirp'),
        fs = require('fs'),
        path = require('path'),
        Git = require('git-wrapper'),
        Github = require('github'),
        spawn = require('child_process').exec,
        // skull methods
        create = null, search = null,
        use = null;

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
                [ PFIX, SEP, template ].join( S )
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

    search = root.search = {};

    search.template = function ( keyword, cb ) {     
        var out = [],
            gh = new Github({
                version: '3.0.0',
                timeout: 4000
            });

        function searchHandler ( err, res ) {

            if ( !err ) {
                var repos = res['repositories'];
                repos.map(function ( repo ) {
                    if ( OWNER === repo.owner || OWNER === repo.username ) {
                        out.push( repo );    
                    }
                });

                cb( out );
            } else {
                cb( out );    
            }
        }

        gh.search.repos({
            keyword: [ PFIX, SEP, keyword ].join( S )
        }, searchHandler );
    };

    use = root.use = {};

    use.template = function ( obj, cb ) {
        var out = false;

        function searchHandler ( templates ) {
            if ( !templates.length ) return cb( out );

            var repo = templates[ obj['index'] ],
                git  = new Git(),
                repoDst = path.join(
                    obj['path'],
                    repo['name']
                        .split( SEP )
                        .slice( 1 )
                        .join( SEP )
                );

            function cloneHandler ( err, msg ) {
                if ( !err ) {
                    fs.exists( repoDst, cb );
                } else {
                    cb( out );    
                } 
            }
            git.exec('clone', [
                repo['url'],
                repoDst
            ], cloneHandler);
        }
        search.template( obj['template'], searchHandler );
    };
}).call( this );
