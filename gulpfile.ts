import gulp = require("gulp");
import ts = require("gulp-typescript");
import del = require("del");
const tsProject = ts.createProject("tsconfig.json");

gulp.task("del", (cb) => {
    del.sync("dist");
    cb();
});

gulp.task("tsc", () => {
    return gulp.src(["src/**/*.ts"])
        .pipe(tsProject())
        .pipe(gulp.dest("dist"));
});

gulp.task("resources", () => {
    return gulp.src(["src/**/*", "!src/**/*.ts"])
        .pipe(gulp.dest("dist"));
});

gulp.task("build", ["del", "tsc", "resources"]);

gulp.task("watch", ["build"], () => {
    return gulp.watch("src/**/*", ["build"]);
});