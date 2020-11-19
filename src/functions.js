const providers = require('../providers.json');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const boxen = require('boxen');
const fs = require('fs');
const https = require('https');

const writeModuleToModulesJSON = (name, tag, provider, url, callback) => {
	let spinner = ora({
		text: `Adding ${name} to "modules.json".`,
		spinner: 'simpleDotsScrolling'
	}).start();
	fs.readFile(path.resolve('modules.json'), 'utf8', (err, data) => {
		if (err && err.code === 'ENOENT') {
			fs.writeFileSync(path.resolve('modules.json'), '{}');
		}
		else if (err) {
			spinner.fail('Cannot read/write in the "modules.json" file.');
			console.error(err.message);
			return;
		}
		let modules = data ? JSON.parse(data) : {};
		modules[name] = {};
		if (!url) {
			modules[name].provider = provider;
			modules[name].tag = tag;
		}
		else {
			modules[name].url = url;
		}
		fs.writeFile('modules.json', JSON.stringify(modules, null, 4), err => {
			if (!err) {
				spinner.succeed(`${name} has been successfully added to "modules.json".`);
			}
			else {
				spinner.fail('Cannot read/write in the "modules.json" file.');
				console.error(err.message);
				return;
			}
			if (callback) callback(err);
		});
	});
}

const removeModuleToModulesJSON = (name, callback) => {
	let spinner = ora({
		text: `Deleting ${name} from "modules.json".`,
		spinner: 'simpleDotsScrolling'
	}).start();
	fs.readFile(path.resolve('modules.json'), 'utf8', (err, data) => {
		if (err) {
			spinner.fail('Cannot read/write in the "modules.json" file.');
			console.error(err.message);
			return;
		}
		let modules = data ? JSON.parse(data) : {};
		if (modules[name]) {
			delete modules[name];
		}
		fs.writeFile('modules.json', JSON.stringify(modules, null, 4), err => {
			if (!err) {
				spinner.succeed(`${name} has been successfully deleted from "modules.json".`);
			}
			else {
				spinner.fail('Cannot read/write in the "modules.json" file.');
				console.error(err.message);
				return;
			}
			if (callback) callback(err);
		});
	});
}

const writeModuleFile = (name, url, callback) => {
	let spinner = ora({
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
			}
			if (callback) callback(err);
		}
	);
}

const getModulesFromModulesJSON = (callback) => {
	let spinner = ora({
		text: `Getting modules from "modules.json".`,
		spinner: 'simpleDotsScrolling'
	}).start();
	fs.readFile(path.resolve('modules.json'), 'utf8', (err, data) => {
		if (err) {
			spinner.fail('Cannot read/write in the "modules.json" file.');
			console.error(err.message);
			return;
		}
		spinner.succeed('Successfully retrieved modules from "modules.json".');
		let modules = data ? JSON.parse(data) : {};
		console.log();
		callback(modules);
	});
}

const linkModule = (name, options, callback) => {
	if (options.check === undefined) {
		options.check = true;
	}
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
						writeModuleToModulesJSON(name, options.tag, options.provider, options.url, err => {
							if (!err)
								writeModuleFile(name, moduleUrl, callback);
							else console.error(err.message);
						});
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
				writeModuleToModulesJSON(name, options.tag, options.provider, options.url, err => {
					if (!err)
						writeModuleFile(name, moduleUrl, callback);
					else console.error(err.message);
				});
			}
		}
		else {
			writeModuleToModulesJSON(name, options.tag, options.provider, options.url, err => {
				if (!err)
					writeModuleFile(name, moduleUrl, callback);
				else console.error(err.message);
			});
		}
	});
};

const linkModules = modules => {
	let modulesCopy = {...modules};
	const name = Object.keys(modulesCopy)[0];
	linkModule(name, modulesCopy[name], (err) => {
		if (!err) {
			delete modulesCopy[name];
			if (Object.keys(modulesCopy).length > 0) {
				console.log();
				linkModules(modulesCopy);
			}
		}
		else console.error(err.message);
	});
}

exports.writeModuleToModulesJSON = writeModuleToModulesJSON;
exports.removeModuleToModulesJSON = removeModuleToModulesJSON;
exports.writeModuleFile = writeModuleFile;
exports.getModulesFromModulesJSON = getModulesFromModulesJSON;
exports.linkModule = linkModule;
exports.linkModules = linkModules;