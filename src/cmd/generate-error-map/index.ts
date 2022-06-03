#!/usr/bin/env node

import fs from 'fs';
import readline from 'readline';
import { $Refs, resolve as swagResolve } from 'swagger-parser'; // eslint-disable-line import/no-extraneous-dependencies

const schemaHttpCode = require('./schema-http-code.json'); // eslint-disable-line @typescript-eslint/no-var-requires

function logUsageHelp() {
    // eslint-disable-next-line no-console
    console.log(
        `
generate-error-map generate [key - value] maps of [error codes - HTTP codes] and [error codes - string values]

usage:
  ./generate-error-map <command>

  commands can be:
    generate: generate map file, will prompt user for output file location
    help: print usage guide
`
    );
}

function readOutFilePath(): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Output file location (./src/util/errors.ts): ', (answer) => {
            if (!answer) {
                resolve('./src/util/errors.ts');
            }
            resolve(answer);
        });
    });
}

function generateErrorCodes(openapiDoc: $Refs): string {
    const errorCodes = new Array<string>();
    Object.keys(schemaHttpCode).forEach((schemaName) => {
        const codes = openapiDoc.get(
            // '/' in node names needs to be escaped as '~1' when used in a $ref
            `#/components/schemas/${schemaName}/properties/error_code/enum`
        );
        errorCodes.push(...codes);
    });
    return `export const ErrorCodes = {\n${errorCodes.reduce(
        (contentStr, schemaName) => `${contentStr}    ${schemaName}: '${schemaName}',\n`,
        ''
    )}};\n`;
}

function generateErrorCodeHttpMap(openapiDoc: $Refs): string {
    let contentStr = 'export const ErrorCodeMap: { [key: string]: number } = {\n';
    Object.keys(schemaHttpCode).forEach((schemaName) => {
        openapiDoc
            .get(
                // '/' in node names needs to be escaped as '~1' when used in a $ref
                `#/components/schemas/${schemaName}/properties/error_code/enum`
            )
            .forEach((code: string) => {
                contentStr += `    ${code}: ${schemaHttpCode[schemaName]},\n`;
            });
    });
    contentStr += '};\n';
    return contentStr;
}

function generateFileContent(): Promise<string> {
    return swagResolve('./docs/openapi.yaml').then((openapiDoc) => {
        let content = `// This file was generated by src/cmd/generate-error-map
// based on docs/openapi.yaml & src/cmd/generate-error-map/schema-http-code.json.
// Please DON'T change this file directly!!!
// Apply your changes in docs/openapi.yaml & src/cmd/generate-error-map/schema-http-code.json
// and run \`npm run generate-error-map\` instead.\n`;
        content += generateErrorCodes(openapiDoc);
        content += generateErrorCodeHttpMap(openapiDoc);
        return content;
    });
}

function generateFile() {
    return Promise.all([readOutFilePath(), generateFileContent()]).then(([filepath, content]) =>
        fs.writeFileSync(filepath, content)
    );
}

const args = process.argv;
switch (args[2]) {
    case 'generate':
        generateFile()
            .then(() => {
                console.log('Successfully generated error files!'); // eslint-disable-line no-console
                process.exit(0);
            })
            .catch((err) => {
                console.error(err); // eslint-disable-line no-console
                process.exit(1);
            });
        break;
    case 'help':
    default:
        logUsageHelp();
}
