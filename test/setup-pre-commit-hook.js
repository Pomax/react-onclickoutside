var fs = require('fs');
var path = require('path');
var precommit = path.join(__dirname, '..', '.git', 'hooks', 'pre-commit'); /* global __dirname */
fs.writeFileSync(precommit, '#!/bin/sh\nnpm test');
