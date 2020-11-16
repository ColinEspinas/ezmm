# EZMM
[![NPM Badge](https://img.shields.io/npm/v/ezmm?style=for-the-badge)](https://www.npmjs.com/package/ezmm)
[![Licence Badge](https://img.shields.io/github/license/ColinEspinas/ezmm?style=for-the-badge)](https://github.com/ColinEspinas/ezmm/blob/master/LICENSE)


An easy ES Module Manager using modern javascript.

## Table of Content

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisite)
  - [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Providers](#providers)
- [License](#license)

## 🚀 Getting Started

### :house: Prerequisites

* [NodeJS](https://nodejs.org)
* [NPM](https://www.npmjs.com) or [Yarn](https://yarnpkg.com) (or your favorite node package manager)


### :package: Installation
The installation is pretty simple, just install the package.

```sh
# NPM
npm install [-g] ezmmm

# Yarn
yarn [global] add ezmm
```

## :keyboard: Usage

### `link <name>`

- **-p, --provider** : Defines the CDN provider. (default: "skypack")
- **-u, --url** : If used, uses this value as the CDN url.

The `link` command will link a module `<name>` in your `modules` directory (will create a new directory if it does not exist).

```sh
# Using the default provider
ezmm link darken

# Using a custom CDN url
ezmm link darken -u https://unpkg.com/darken@latest/dist/darken.mjs 
```

### `unlink <name>`

The `unlink` command will delete a module `<name>` of your `modules` directory.

```sh
ezmm unlink darken
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

## :gear: Configuration

### 📫 Providers

You can configure the providers of ezmm by editing the `provider.json` file in the package directory.

The default file will look like this:
```json
{
  "default": "skypack",
  "providers": {
    "skypack": "https://cdn.skypack.dev/%n"
  }
}
```

On any provider you add you will probably need to give the name of the module with `%n`.

Do not hesitate to do a pull request to add providers to ezmm default `provider.json`.

## 📜 License

EZMM is distributed under the MIT License. See `LICENSE` for more information.

## :e-mail: Contact

I am **Colin Espinas** you can contact me using my

[![Website](https://img.shields.io/badge/-website-brightgreen?style=for-the-badge)](https://colinespinas.com/contact)
[![Website](https://img.shields.io/badge/email-contact@colinespinas.com-orange?style=for-the-badge)](contact@colinespinas.com)
[![Website](https://img.shields.io/badge/-LinkedIn-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/colin-espinas)
[![Website](https://img.shields.io/badge/-Github-lightgrey?style=for-the-badge&logo=github)](https://github.com/ColinEspinas)

This project source's are at [https://github.com/ColinEspinas/ezmm](https://github.com/ward-framework/ezmm).