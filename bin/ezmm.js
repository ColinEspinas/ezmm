#! /usr/bin/env node

const { program } = require('commander');
const pkgjson = require('../package.json');
const providers = require('../providers.json');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs');
const { 
	removeModuleToModulesJSON, 
	getModulesFromModulesJSON, 
	linkModule, 
	linkModules 
} = require('../src/functions');

program
	.version(pkgjson.version)
	.name("ezmm");

program
	.command('link [name]')
	.alias("l")
	.description('Links a module in the "modules" directory.')
	.option('-p, --provider <provider>', 'Defines the CDN provider.', providers.default)
	.option('-u, --url <url>', 'If used, uses this value as the CDN url.')
	.option('-t, --tag <tag>', 'Specifies a version/dist tag to the module (only if the provider is compatible).')
	.option('-nc, --no-check', 'If used, do not check the status of the CDN provider.')
	.action((name, options) => {
		if (name) {
			linkModule(name, options);
		}
		else {
			getModulesFromModulesJSON((modules) => {
					linkModules(modules);
			});
		}
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
		removeModuleToModulesJSON(name, err => {
			if (!err) {
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
				});
			}
			else console.error(err.message);
		});
	});

program.parse(process.argv);