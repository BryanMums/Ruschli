(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'npm:': 'node_modules/'
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            app: 'app',

            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',

            // other libraries
            'plugin-traceur': 'npm:systemjs-plugin-traceur/plugin-traceur.js',
            'traceur': 'npm:traceur/bin/traceur.js',
            'traceur-runtime': 'npm:traceur/bin/traceur-runtime.js',
            'rxjs': 'npm:rxjs',
            'mydatepicker': 'npm:mydatepicker/bundles/mydatepicker.umd.min.js',
            'angular-2-dropdown-multiselect': 'npm:angular-2-dropdown-multiselect/bundles/dropdown.umd.js',
            'angular2-moment': 'npm:angular2-moment/',
            'moment': 'npm:moment/'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
            'moment': {
                main: './moment.js',
                defaultExtension: 'js'
            },
            'angular2-moment': {
                main: './index.js',
                defaultExtension: 'js'
            }
        },
        meta: {
          'traceur': {
            format: 'global',
            exports: 'traceur',
            scriptLoad: false
          },
          'traceur-runtime': {
            format: 'global',
            exports: '$traceurRuntime'
          }
        },
        transpiler: 'plugin-traceur',
        transpilerRuntime: false
    });
})(this);
