const providers = require('../providers.json');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const boxen = require('boxen');
const fs = require('fs');
const https = require('https');

/**
 * Adds a module to the modules.json file.
 * @param {String} name Name of the module.
 * @param {String} tag Version/dist tag associated with the module.
 * @param {String} provider Name of the provider used for the module.
 * @param {String} url Custom url of the module.
 * @param {Function} callback 
 */
const writeModuleToModulesJSON = (name, tag, provider, url, callback) => {
	let spinner = ora({
		text: `Adding ${name} to "modules.json".`,
		spinner: 'simpleDotsScrolling'
	}).start();
	// Reading the modules.json file.
	fs.readFile(path.resolve('modules.json'), 'utf8', (err, data) => {
		// If the modules.json file does not exist creates one.
		if (err && err.code === 'ENOENT') {
			fs.writeFileSync(path.resolve('modules.json'), '{}');
		}
		else if (err) {
			spinner.fail('Cannot read/write in the "modules.json" file.');
			console.error(err.message);
			return;
		}

		// Creating/Updating the module entry with the given name.
		let modules = data ? JSON.parse(data) : {};
		modules[name] = {};
		if (!url) {
			modules[name].provider = provider;
			modules[name].tag = tag;
		}
		else {
			modules[name].url = url;
		}
		// Updating modules.json file.
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

/**
 * Removes a module from the modules.json file.
 * @param {String} name Name of the module.
 * @param {Function} callback 
 */
const removeModuleToModulesJSON = (name, callback) => {
	let spinner = ora({
		text: `Deleting ${name} from "modules.json".`,
		spinner: 'simpleDotsScrolling'
	}).start();
	// Reading the modules.json file.
	fs.readFile(path.resolve('modules.json'), 'utf8', (err, data) => {
		if (err) {
			spinner.fail('Cannot read/write in the "modules.json" file.');
			console.error(err.message);
			return;
		}
		// Deleting the module with the given name.
		let modules = data ? JSON.parse(data) : {};
		if (modules[name]) {
			delete modules[name];
		}
		// Updating the modules.json file.
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

/**
 * Creates a module file in the modules directory.
 * @param {String} name Name of the module.
 * @param {String} url Url of the module.
 * @param {Function} callback
 */
const writeModuleFile = (name, url, options, callback) => {
	let spinner = ora({
		text: `Writing "${name}.js" module link file.`,
		spinner: 'simpleDotsScrolling'
	}).start();
	// Writing module file with params. Might want to change the import snippet in the future.
	fs.writeFile(path.resolve(
		`modules/${name}.js`), 
		`export * from '${url}'; ${ options.default ? `export { default } from '${url}';` : ''}`, 
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
/**
 * Get the modules from the modules.json file.
 * @param {Function} callback Function called when the modules have been successfully retrieved.
 */
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

/**
 * 
 * @param {String} name Name of the module we want to link.
 * @param {Object} options Options of the link command.
 * @param {Function} callback Function to call once the module is linked.
 */
const linkModule = (name, options, callback) => {
	// Default of the check option is true.
	if (options.check === undefined) {
		options.check = true;
	}
	// Default of the default option is true.
	if (options.default === undefined) {
		options.default = true;
	}

	let spinner = ora({
		text: 'Creating "modules" directory.',
		spinner: 'simpleDotsScrolling'
	}).start();

	// Creates the modules directory.
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

		/**
		 * If there is no url specified, uses the 
		 * provider from provider.json file to create one.
		 */
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
			/**
			 * If check option is true, checks for the provider 
			 * response before linking the package.
			 */
			if (options.check) {
				spinner = ora({
					text: `Finding ${name} on ${options.provider}.`,
					spinner: 'simpleDotsScrolling'
				}).start();
				// Sends a ping request to the moduleUrl, if response code is 200 then we link the package.
				https.get(moduleUrl, res => { 
					if (res.statusCode === 200) {
						spinner.succeed(`A module named ${name}${ options.tag ? '@' + options.tag : ''} was found on ${options.provider}.`);
						writeModuleToModulesJSON(name, options.tag, options.provider, options.url, err => {
							if (!err)
								writeModuleFile(name, moduleUrl, options, callback);
							else console.error(err.message);
						});
					}
					else {
						spinner.fail(`No module named ${name}${ options.tag ? '@' + options.tag : ''} was found on ${options.provider}.`);
						console.log();
						console.log(`If you want to link ${chalk.green.bold(`${name}${options.tag ? '@' + options.tag : ''}`)} anyway, use the ${chalk.red.bold('-nc/--no-check')} option.`);
						return;
					}
				});
			}
			else {
				writeModuleToModulesJSON(name, options.tag, options.provider, options.url, err => {
					if (!err)
						writeModuleFile(name, moduleUrl, options, callback);
					else console.error(err.message);
				});
			}
		}
		else {
			writeModuleToModulesJSON(name, options.tag, options.provider, options.url, err => {
				if (!err)
					writeModuleFile(name, moduleUrl, options, callback);
				else console.error(err.message);
			});
		}
	});
};

/**
 * Link all modules recursively, this is done this way 
 * to avoid parallel link of modules (mainly for display 
 * reason, might change in the future for faster linking).
 * @param {Object} modules An object of the modules, given from the getModulesFromModulesJSON function.
 */
const linkModules = modules => {
	let modulesCopy = {...modules};
	const name = Object.keys(modulesCopy)[0];
	linkModule(name, modulesCopy[name], (err) => {
		if (!err) {
			/* Deletes the linked module from the modules, 
			 * then if there are modules left links the next one. */
			delete modulesCopy[name];
			if (Object.keys(modulesCopy).length > 0) {
				console.log(); // To add a newline between modules
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