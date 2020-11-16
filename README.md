# EZMM
[![NPM Badge](https://img.shields.io/npm/v/ezmm?style=for-the-badge)](https://www.npmjs.com/package/ezmm)
[![Licence Badge](https://img.shields.io/github/license/ColinEspinas/ezmm?style=for-the-badge)](https://github.com/ColinEspinas/ezmm/blob/master/LICENSE)

An easy ES Module Manager using modern javascript.

## Table of Content

- [Getting Started](#-getting-started)
  - [Prerequisites](#-prerequisites)
  - [Installation](#-installation)
  - [Usage](#-usage)
- [Commands](#️-commands)
- [Configuration](#-configuration)
  - [Providers](#-providers)
- [License](#-license)
- [Contact](#️-contact)

## 🚀 Getting Started

### 🏠 Prerequisites

* [NodeJS](https://nodejs.org)
* [NPM](https://www.npmjs.com) or [Yarn](https://yarnpkg.com) (or your favorite node package manager)


### 📦 Installation
The installation is pretty simple, just install the package.

```sh
# NPM
npm install [-g] ezmm

# Yarn
yarn [global] add ezmm
```

### 🏄 Usage

EZMM is super simple to use, just use the `link` command to add a module to your `modules` directory. If the `modules` directory does not exist it will be created.

```sh
ezmm link react
```

Then in your javascript you can import linked modules from the `modules` directory.

```js
import react from 'modules/react.js';
```
*Note: Be sure to link your javascript in your html with `type="module"`.*

You can overwrite the provider and/or the version you are using with the `link` command.

```sh
ezmm link react -p esm.sh -t 16.10
# React will now use the version 16.10 provided by esm.sh
```

Afterward, if you want to remove a module that you don't use anymore, use the `unlink` command.

```sh
ezmm unlink react
```

## ⌨️ Commands

### `link <name>`

- **-p, --provider** : Defines the CDN provider. (default: "skypack")
- **-u, --url** : If used, uses this value as the CDN url.
- **-t, --tag** : Specifies a version/dist tag to the module (only if the provider is compatible). (default: "latest")

The `link` command will link a module `<name>` in your `modules` directory (will create a new directory if it does not exist).

```sh
# Using the default provider
ezmm link react

# Using a custom CDN url
ezmm link react -u https://unpkg.com/react@16/umd/react.development.js 
```

### `unlink <name>`

The `unlink` command will delete a module `<name>` of your `modules` directory.

```sh
ezmm unlink react
```

### `help [command]`

The `help` command will display the program help or the `[command]` help if specified.

```sh
ezmm help link
```

You can also use the `-h` or `--help` option on any command to display the help.
```sh
ezmm link -h
```

## ⚙️ Configuration

### 📫 Providers

You can configure the providers of ezmm by editing the `provider.json` file in the package directory.

The default file will look like this:
```json
{
  "default": "skypack",
  "providers": {
    "skypack": "https://cdn.skypack.dev/%n@%t",
    "jspm": "https://jspm.dev/%n@%t",
    "esm.sh": "https://esm.sh/%n@%t"
  }
}
```

On any provider you add you will probably need to give the module's name with `%n` and/or the module's version/dist tag with `%t`.

Do not hesitate to do a pull request to add providers to ezmm default `provider.json`.

## 📜 License

EZMM is distributed under the MIT License. See `LICENSE` for more information.

## ✉️ Contact

I am **Colin Espinas** you can contact me using my

[![Website](https://img.shields.io/badge/-website-brightgreen?style=for-the-badge)](https://colinespinas.com/contact)
[![Website](https://img.shields.io/badge/email-contact@colinespinas.com-orange?style=for-the-badge)](mailto:contact@colinespinas.com)
[![Website](https://img.shields.io/badge/-LinkedIn-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/colin-espinas)
[![Website](https://img.shields.io/badge/-Github-lightgrey?style=for-the-badge&logo=github)](https://github.com/ColinEspinas)

This project source's are at [https://github.com/ColinEspinas/ezmm](https://github.com/ward-framework/ezmm).