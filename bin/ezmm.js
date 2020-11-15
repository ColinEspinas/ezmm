const { program } = require('commander');
const pkgjson = require('../package.json');
const providers = require('../providers.json');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const boxen = require('boxen');
const fs = require('fs');

const writeModuleFile = (name, provider, url, callback) => {

	if (!url) {
		if (providers.providers[provider]) {
			url = providers.providers[provider].replace('%n', name);
		}
		else {
			callback(new Error('No provider corresponding to given provider name.'));
			return;
		}
	}

	fs.writeFile(path.resolve(
		`modules/${name}.js`), 
		`export * from '${url}'; export { default } from '${url}';`, 
		'utf8',
		err => {callback(err)}
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
			
			spinner = ora({
				text: `Writing "${name}.js" module link file.`,
				spinner: 'simpleDotsScrolling'
			}).start();

			writeModuleFile(name, options.provider, options.url, err => {
					if (!err) {
						spinner.succeed(`The "${name}.js" module link file has been successfully written.`);
						console.log();
						console.log(`${chalk.green.bold(name.charAt(0).toUpperCase() + name.slice(1))} is now linked, you can now import it:`);
						console.log(boxen(chalk.whiteBright(`${chalk.cyan.bold('import')} <default or {*}> ${chalk.cyan.bold('from')} 'modules/${name}.js';`), {
							borderStyle: 'classic'
						}));
					}
					else {
						spinner.fail(`Cannot create "${name}.js" module link file.`);
						console.error(err);
						return;
					}
			});
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
				console.log(`${chalk.green.bold(name.charAt(0).toUpperCase() + name.slice(1))} is now unlinked, be sure to remove any import from it.`);
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