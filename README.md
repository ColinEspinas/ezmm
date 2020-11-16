# EZMM
[![NPM Badge](https://img.shields.io/npm/v/ezmm?style=for-the-badge)](https://www.npmjs.com/package/ezmm)
[![Licence Badge](https://img.shields.io/github/license/ColinEspinas/ezmm?style=for-the-badge)](https://github.com/ColinEspinas/ezmm/blob/master/LICENSE)


An easy ES Module Manager using modern javascript.

## Table of Content

- [Getting Started](#getting-started)
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

## :desktop_computer: Usage

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