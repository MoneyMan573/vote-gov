var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var pkg = require('../../package.json');
var spawn = require('cross-spawn');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var spanishStateNames = require('./lang/spanish/state-names.json');

gulp.task('clean-translation', function () {
  gutil.log(gutil.colors.cyan('clean-translation'), 'Removing generated register/ files');
  return del([
    './layouts/registrar',
    './content/registrar',
  ]);
});

gulp.task('copy-content-spanish', function (done) {

  return gulp.src('./content/en/register/*.md')
    .pipe(replace(/title = "(.+)"/, function (match, p1) {
      var name = p1.replace(/\s/g, '-').replace(/\./g, '').toLowerCase();
      var title = spanishStateNames[name].title;
      return (
        'title = "' + title + '"'
      );
    }))
    .pipe(gulp.dest('./content/es/registrar'));

});

gulp.task('copy-layouts-spanish', function (done) {

  var copyLayout = spawn('cp', [
    '-rvf',
    './layouts/register',
    './layouts/registrar',
  ]);

  copyLayout.stdout.on('data', function (data) {
    gutil.log(gutil.colors.blue('copy-layouts-spanish'), '\n' + data);
  });

  copyLayout.on('error', done);
  copyLayout.on('close', done);


});

gulp.task('copy-links-spanish', function (done) {
  gutil.log(
    gutil.colors.cyan('copy-links-spanish'),
    'Copying links into state.md files.'
  );
  for (var state in spanishStateNames) {
     fileName = "./content/es/registrar/" + spanishStateNames[state].state_abbreviation + ".md"
     populate(fileName, state);
   };
   done();
});

function populate(fileName,state ){
  return gulp.src(fileName)
    .pipe(replace(/external_link = "(.*)"/, function (match,p1) {
     var link = spanishStateNames[state].external_link;
     if (link != "" ){
         return ( 'external_link = "' + link + '"' )
     } else {
         return ( 'external_link = "' + p1 + '"' )
     }
    }))
    .pipe(gulp.dest('./content/es/registrar'));
}

gulp.task('copy-translation', gulp.series( 'clean-translation', 'copy-content-spanish', 'copy-layouts-spanish', 'copy-links-spanish'  , function (done) {
  gutil.log(
    gutil.colors.cyan('copy-translation'),
    'Copying files from content/ & layouts/ for translated URLs'
  );
  done();
}));
