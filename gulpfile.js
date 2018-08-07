var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bump = require('gulp-bump'),
    fs = require('fs'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    runSequence = require('run-sequence'),
    configLoc = './config/config.json',
    versionJsLoc = './config/version.js',
    mocha = require('gulp-mocha'),
    tar = require('gulp-tar'),
    gzip = require('gulp-gzip');

/* Retrieves config json based on NODE_ENV */
function generateConfig() {
    var NODE_ENV = gutil.env.NODE_ENV;
    if (!NODE_ENV) gutil.env.NODE_ENV = NODE_ENV = "local";
    var configJson = fs.readFileSync(configLoc, 'utf8');
    configJson = JSON.parse(JSON.stringify(configJson));
    var appConfig = JSON.parse(configJson)[NODE_ENV];

    return appConfig;
}

/* Generate globals.js in config directory */
gulp.task('globals', function () {
    return gulp.src('config/globals.temp')
        .pipe(replace('$version', "'" + generateVersion() + "'"))
        .pipe(replace('$config', JSON.stringify(generateConfig())))
        .pipe(rename('globals.js'))
        .pipe(gulp.dest('config/'));
});

/* Generates a manifest for a specific environment */
gulp.task('generate-single-manifest', function () {
    var appConfig = generateConfig();

    return gulp.src('manifest.yml.template')
        .pipe(rename(gutil.env.NODE_ENV + '.manifest.yml'))
        .pipe(replace('$appName', appConfig.projectInfo.appName))
        .pipe(replace('$hostName', appConfig.projectInfo.hostName))
        .pipe(replace('$memory', appConfig.projectInfo.memory))
        .pipe(replace('$instances', appConfig.projectInfo.instances))
        .pipe(replace('$configJson', JSON.stringify(appConfig)))
        .pipe(replace('$ovq_auth_header', process.env.ovq_auth_header))
        .pipe(gulp.dest('./'));
});

/* Generates a manifest for all environments */
gulp.task('generate-all-manifest', function () {
    var configJson = fs.readFileSync(configLoc, 'utf8');
    configJson = JSON.parse(JSON.stringify(configJson));
    var appConfig = JSON.parse(configJson);

    for (var environment in appConfig) {
        var envConfig = appConfig[environment];

        gulp.src('manifest.yml.template')
            .pipe(rename(environment + '.manifest.yml'))
            .pipe(replace('$appName', envConfig.projectInfo.appName))
            .pipe(replace('$hostName', envConfig.projectInfo.hostName))
            .pipe(replace('$memory', envConfig.projectInfo.memory))
            .pipe(replace('$instances', envConfig.projectInfo.instances))
            .pipe(replace('$configJson', JSON.stringify(envConfig)))
            .pipe(replace('$ovq_auth_header', process.env.ovq_auth_header))
            .pipe(gulp.dest('./'));
    }

    return true;
});

function buildSequence() {
    runSequence(
        'generate-single-manifest',
        'globals',
        'generate-tar'
    );
}

/* Task to execute test scripts and generate build code on success for local */
gulp.task('build-local', function () {
    gutil.env.NODE_ENV = "local";
    gutil.log(gutil.colors.bold.white.bgBlue("BUILDING FOR: " + gutil.env.NODE_ENV));
    buildSequence();
});

/* Task to execute test scripts and generate build code on success for develop */
gulp.task('build-develop', function () {
    gutil.env.NODE_ENV = "develop";
    gutil.log(gutil.colors.bold.white.bgBlue("BUILDING FOR: " + gutil.env.NODE_ENV));
    buildSequence();
});

/* Task to execute test scripts and generate build code on success for production */
gulp.task('build-production', function () {
    gutil.env.NODE_ENV = "production";
    gutil.log(gutil.colors.bold.white.bgBlue("BUILDING FOR: " + gutil.env.NODE_ENV));
    buildSequence();
});

gulp.task('generate-tar', function () {
    gulp.src(['*.manifest.yml', 'package.json', 'buildConfig.json', 'server.js', 'services/**/*', 'delegates/**/*',
        'routes/**/*', 'controllers/**/*', 'logging/**/*', 'middleware/**/*', 'onepager.json', 'managers/**/*',
        'config/**/*', 'utility/**/*'
    ], {
            base: '.'
        })
        .pipe(tar('Locker_Blocker.tar'))
        .pipe(gulp.dest('./'))
});

/* Generates version string from package.json */
function generateVersion() {
    var packageJson = fs.readFileSync('package.json', 'utf8');
    packageJson = JSON.parse(packageJson);

    return packageJson.version;
}

gulp.task('bump-major', function () {
    return bumpVersion('major');
});

gulp.task('bump-minor', function () {
    return bumpVersion('minor');
});

gulp.task('bump-patch', function () {
    return bumpVersion('patch');
});

gulp.task('test', () => {
    gulp.src(['test/unit/**/*.spec.js'], {
        read: false
    })
        // `gulp-mocha` needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            reporter: 'spec'
        }))
        .once('error', err => {
            process.exit(1);
        });
});

gulp.task('test-xunit', () => {
    gulp.src(['test/unit/**/*.spec.js'], {
        read: false
    })
        // `gulp-mocha` needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            reporter: 'xunit',
            reporterOptions: {
                output: './test-results/result.xml'
            }
        }))
        .once('error', err => {
            process.exit(1);
        });
});

gulp.task('test-integration', () => {
    gulp.src(['test/integration/**/*.spec.js'], {
        read: false
    })
        // `gulp-mocha` needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            reporter: 'spec'
        }));
});

function bumpVersion(type) {
    return gulp.src(['./package.json'])
        .pipe(bump({
            type: type
        }))
        .pipe(gulp.dest('./'));
}