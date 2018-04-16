> This repository is part of the [Pelias](https://github.com/pelias/pelias) project. Pelias is an open-source, open-data geocoder originally built by [Mapzen](https://www.mapzen.com/). Our official user documentation is [here](https://github.com/pelias/documentation).

# Pelias Text Analyzer

[![Greenkeeper badge](https://badges.greenkeeper.io/pelias/text-analyzer.svg)](https://greenkeeper.io/)

![Travis CI Status](https://travis-ci.org/pelias/text-analyzer.svg)
[![Gitter Chat](https://badges.gitter.im/pelias/pelias.svg)](https://gitter.im/pelias/pelias?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## Overview

Module that performs analysis of a single line of input describing a location, breaking into its constituent parts (street, city, state, country, etc).

**Note: this module has been merged back into [pelias/api](https://github.com/pelias/api) and is now deprecated**

## Installation

```bash
$ npm install pelias-text-analyzer
```

[![NPM](https://nodei.co/npm/pelias-text-analyzer.png?downloads=true&stars=true)](https://nodei.co/npm/pelias-text-analyzer)

## NPM Module

The `pelias-text-analyzer` npm module can be found here:

[https://npmjs.org/package/pelias-text-analyzer](https://npmjs.org/package/pelias-text-analyzer)

#### About

This package is responsible for textually analyzing a single line input into it's constituent parts.  That is, the input `30 West 26th Street, New York, NY 10010` is parsed into:

```
{
  number: '30',
  street: 'west 26th street',
  city: 'new york',
  state: 'ny',
  postalcode: '10010',
  country: 'usa'
}
```

The parsed form is used by the [API](https://npmjs.org/package/pelias-api) for more accurate searching and geocoding.

The point of this module isn't to hardwire Pelias to a certain text analyzer but to provide an interface for future work.  

#### Supported Parsers

Currently, there are 2 supported parsers:

- [AddressIt](https://www.npmjs.com/package/addressit)
- [libpostal](https://github.com/openvenues/libpostal) via [node-postal](https://github.com/openvenues/node-postal)

As libpostal support increases, AddressIt support will be shelved.  

#### Configuration

Selection of AddressIt or libpostal is made using the Pelias configuration value found in `api.textAnalyzer`, defaulting to `addressit` if not found.  For example, this will use libpostal for text analysis in the text-analyzer project:

```
{
  "api": {
    "textAnalyzer": "libpostal"
  }
}
```

To use the libpostal address parser, libpostal must be [installed](https://github.com/openvenues/libpostal/blob/master/README.md#installation) locally.  

Even though this package supports libpostal, the [Pelias API](https://npmjs.org/package/pelias-api) does not yet support everything that libpostal returns.  We expect to fully support libpostal in the API by late August 2016.  
