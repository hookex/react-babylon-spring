import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json')
const libraryName = pkg.name

const isProduction = process.env.NODE_ENV === 'production';
console.log('ENV:', process.env.NODE_ENV, libraryName)

export default (async () => {
    const result = {
        input: `src/index.ts`,
        output: [{
            file: pkg.module,
            format: 'es',
            sourcemap: true,
        }],
        context: 'window',
        // external modules not in bundle (i.e.: 'react')
        external: [...Object.keys(pkg.peerDependencies || {})],
        plugins: [
            json(),
            typescript(),
            // minimize production build
            isProduction && (await import('rollup-plugin-terser')).terser()
        ]
    }
    // console.log(`rollup config:\n -> external \n${JSON.stringify(result.external)}\n ->${JSON.stringify(result.output)}`);
    return result;
})
