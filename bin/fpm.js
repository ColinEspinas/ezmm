const program = require('commander');
const pjson = require('../package.json');
const path = require('path');
const git = require('simple-git');
const ora = require('ora');
const chalk = require('chalk');

program
	.version(pjson.version)
	.name("fpm");

program
	.command('link <package>')
	.alias("l")
	.description('Link a package in the packages.');

program.parse(process.argv);