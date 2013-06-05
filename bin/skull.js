#!/usr/bin/env node

(function () {
    var skull = require('commander'),
        lib = require('../lib'),
        pkg = require('../package'),
        path = require('path');   

    skull
        .version( pkg.version )
        .option('-c, --create', 'Create a template')
        .option('-u, --use [name]', 'Use a template')
        .option('-s, --search [keyword]')
        .parse( process.argv )

    if ( skull.create ) {
        console.log( __dirname );
        skull.prompt('Name: ', function ( name ) {
            skull.prompt('Description: ', function ( description ) {
                skull.prompt('Version: ', function ( version ) {
                    lib.create.template({
                        template: name, 
                        name: name,
                        description: description,
                        version: version,
                        tree: [],
                        dir: path.relative( __dirname ) 
                    }, function ( res ) {
                        if ( res ) {
                            console.log( '%s was created!', name );    
                        } else {
                            console.log( '%s was not created!', name );    
                        }
                        process.stdin.destroy();
                    }); 
                }); 
            }); 
        });
    } if ( undefined !== skull.use ) {
        lib.use.template({
            template: skull.use,
            path: './',
            index: 0
        }, function ( res ) {
            if ( res ) {
                console.log( '%s is ready to use!', skull.use ); 
            } else {
                console.log( '%s not ready to use!', skull.use );
            }
        });    
    } if ( undefined !== skull.search ) {
        lib.search.template( skull.search, function ( repos ) {
            for ( var i in repos ) {
                var repo = repos[ i ],
                    name = repo['name'].split('-').slice( 1 ).join('-'),
                    desc = repo['description'],
                    url = repo['url'];

                if ( i <= 20 ) {
                    if ( desc ) {
                        console.log('[ %s ] - %s :: %s \n',
                            name,
                            desc.length <= 40 ? desc : desc.slice( 0, 40 ) + '...',
                            url
                        ); 
                    } else if ( !desc ) {
                        console.log('[ %s ] :: %s \n',
                            name,
                            url
                        );
                    }
                }
            } 
        });      
    }
}).call( this );
