var gmWatch = true;
const gulp = require('gulp');
const  babel = require('gulp-babel');
const  jshint = require('gulp-jshint');
var  nodemon  = require('gulp-nodemon');
const uglify = require('gulp-uglify');
const util = require('gulp-util');
const mocha = require('gulp-mocha');
// const todo = require('gulp-todo');
const webpack = require('webpack-stream');
const fs = require('fs');
const path = require('path');
const { doesNotMatch } = require('assert');

// gulp.task('build', gulp.series('build_client', 'build_server', 'test', (done) => {}));

function testf(done){
  gulp.src([path.resolve(__dirname, "./test/**/*.js")])
  .pipe(mocha());
  done();
}

function lint(done){
  gulp.src(['**/*.js', '!node_modules/**/*.js', '!bin/**/*.js'])
    .pipe(jshint({
          esnext: true
      }))
    .pipe(jshint.reporter('default', { verbose: true}))
    .pipe(jshint.reporter('fail'));
    done();
}

function build_clientf(done){
  gulp.src([path.resolve(__dirname, "./src/client/js/app.js")])
    .pipe(uglify())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(babel())
    // .pipe(gulp.dest('bin/client/js/'));
    .pipe(gulp.dest(path.resolve(__dirname, "./bin/client/js/")));
    done();
}

function move_client(done){
  gulp.src([path.resolve(__dirname,'./src/client/**/*.*'), '!client/js/*.js'])
    .pipe(gulp.dest(path.resolve(__dirname,'./bin/client/')));
  done();
}

function build_serverf(done){
  gulp.src(path.resolve(__dirname,'./src/server/lib/*.*'))
    .pipe(babel())
    .pipe(gulp.dest(path.resolve(__dirname,'./bin/server/lib/')));
  gulp.src(path.resolve(__dirname,'./src/server/server.js'))
    .pipe(babel())
    .pipe(gulp.dest(path.resolve(__dirname,'./bin/server/')));
  done();
}

function watchf(done){
  gulp.watch(['src/client/**/*.*'], gulp.series('build_client', 'move_client'));
  gulp.watch(['src/server/*.*', 'src/server/**/*.js'], gulp.series('build_server'));
  gulp.start('run_only');
  done();
}

function todof(done){
  gulp.src('src/**/*.js')
      .pipe(todo())
      .pipe(gulp.dest('./'));
  done();
}

function runf(done){
   nodemon({
      delay: 10,
      script: 'bin/server/server.js',
      // cwd: path.resolve(__dirname, "./bin/"),
      args: ["config.json"],
      ext: 'html js css',
      done: done
  })
  .on('restart', function () {
      util.log('server restarted!');
  });
  done();
}

function run_only(done){
  nodemon({
      delay: 10,
      script: 'bin/server/server.js',
      // cwd: path.resolve(__dirname, "./bin/"),
      args: ["config.json"],
      ext: 'html js css'
  })
  .on('restart', function () {
      util.log('server restarted!');
  });
  done();
}

function buildf(done){
  done();
}
// define complex tasks
const test = gulp.series(testf, gulp.parallel(lint));
const build_client = gulp.series(build_clientf, gulp.parallel(lint,move_client));
const build_server = gulp.series(build_serverf, gulp.parallel(lint));
// const build = gulp.parallel(build_client, build_server, test);
const build = gulp.series(buildf, gulp.parallel(build_client, build_server, test));
const watch = gulp.series(watchf, gulp.parallel(build));
const todo = gulp.series(todof, gulp.parallel(lint));
const run = gulp.series(runf, gulp.parallel(build));

// export tasks
exports.build = build;
exports.test = test;
exports.build_client = build_client;
exports.build_server = build_server;
exports.watch = watch;
exports.todo = todo;
exports.run = run;
exports.default = run;