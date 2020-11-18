#! /usr/bin/env node

const { program } = require('commander');
const pkgjson = require('../package.json');
const providers = require('../providers.json');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const boxen = require('boxen');
const fs = require('fs');
const https = require('https');

const writeModuleFile = (name, url) => {
	spinner = ora({
		text: `Writing "${name}.js" module link file.`,
		spinner: 'simpleDotsScrolling'
	}).start();
	fs.writeFile(path.resolve(
		`modules/${name}.js`), 
		`export * from '${url}'; export { default } from '${url}';`, 
		'utf8',
		err => {
			if (!err) {
				spinner.succeed(`The "${name}.js" module link file has been successfully written.`);
				console.log();
				console.log(`${chalk.green.bold(name)} is now linked, you can now import it:`);
				console.log(boxen(chalk.whiteBright(`${chalk.cyan.bold('import')} <default or {*}> ${chalk.cyan.bold('from')} 'modules/${name}.js';`), {
					borderStyle: 'classic'
				}));
			}
			else {
				spinner.fail(`Cannot create "${name}.js" module link file.`);
				console.error(err.message);
				return;
			}
		}
	);
}

program
	.version(pkgjson.version)
	.name("ezmm");

program
	.command('link <name>')
	.alias("l")
	.description('Links a module in the "modules" directory.')
	.option('-p, --provider <provider>', 'Defines the CDN provider.', providers.default)
	.option('-u, --url <url>', 'If used, uses this value as the CDN url.')
	.option('-t, --tag <tag>', 'Specifies a version/dist tag to the module (only if the provider is compatible).')
	.option('-nc, --no-check', 'If used, do not check the status of the CDN provider.')
	.action((name, options) => {
		let spinner = ora({
			text: 'Creating "modules" directory.',
			spinner: 'simpleDotsScrolling'
		}).start();
		fs.mkdir(path.resolve('modules'), err => {
			if (err && err.code === 'EEXIST') {
				spinner.succeed('The "modules" directory already exists.');
			}
			else if (!err) {
				spinner.succeed('The "modules" directory has been successfully created.');
			}
			else {
				spinner.fail('Cannot create "modules" directory.');
				console.error(err);
				return;
			}
			
			let moduleUrl = options.url;

			if (!options.url) {
				if (providers.providers[options.provider]) {
					moduleUrl = providers.providers[options.provider].replace('%n', name)
					if (options.tag) {
						moduleUrl = moduleUrl.replace('%t', options.tag);
					}
					else {
						moduleUrl = moduleUrl.replace('@%t', '');
					}
				}
				else {
					console.error(new Error('No provider corresponding to given provider name.').message);
					return;
				}
				if (options.check) {
					spinner = ora({
						text: `Finding ${name} on ${options.provider}.`,
						spinner: 'simpleDotsScrolling'
					}).start();
					https.get(moduleUrl, res => { 
						if (res.statusCode === 200) {
							spinner.succeed(`A module named ${chalk.green.bold(`${name}${ options.tag ? '@' + options.tag : ''}`)} was found on ${chalk.green.bold(options.provider)}.`);
							writeModuleFile(name, moduleUrl);
						}
						else {
							spinner.fail(`No module named ${chalk.green.bold(`${name}${ options.tag ? '@' + options.tag : ''}`)} was found on ${options.provider}.`);
							console.log();
							console.log(`If you want to link ${chalk.green.bold(`${name}${options.tag ? '@' + options.tag : ''}`)} anyway, use the ${chalk.red.bold('-nc/--no-check')} option.`);
							return;
						}
					});
				}
				else {
					writeModuleFile(name, moduleUrl);
				}
			}
			else {
				writeModuleFile(name, moduleUrl);
			}
		});
	});

program
	.command('unlink <name>')
	.alias("ul")
	.description('Unlinks a module in the "modules" directory.')
	.action((name) => {
		let spinner = ora({
			text: `Deleting "${name}.js" module link file.`,
			spinner: 'simpleDotsScrolling'
		}).start();
		fs.unlink(path.resolve(`modules/${name}.js`), err => {
			if (!err) {
				spinner.succeed(`The "${name}.js" module link file has been successfully deleted.`);
				console.log();
				console.log(`${chalk.green.bold(name)} is now unlinked, be sure to remove any import from it.`);
			}
			else if (err && err.code === 'ENOENT') {
				spinner.fail(`The "${name}.js" module link file does not exist.`);
			}
			else {
				spinner.fail(`Cannot remove "${name}.js" module link file.`);
				console.error(err);
				return
			}
		})
	});

program.parse(process.argv);