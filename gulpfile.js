"use strict";
exports.__esModule = true;
var gulp = require("gulp");
var ts = require("gulp-typescript");
var del = require("del");
var tsProject = ts.createProject("tsconfig.json");
gulp.task("del", function (cb) {
    del.sync("dist");
    cb();
});
gulp.task("tsc", function () {
    return gulp.src(["src/**/*.ts", "!src/**/types.ts"])
        .pipe(tsProject())
        .pipe(gulp.dest("dist"));
});
gulp.task("resources", function () {
    return gulp.src(["src/**/*", "!src/**/*.ts"])
        .pipe(gulp.dest("dist"));
});
gulp.task("build", ["del", "tsc", "resources"]);
gulp.task("watch", ["build"], function () {
    return gulp.watch("src/**/*", ["build"]);
});
