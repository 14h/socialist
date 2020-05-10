const {build} = require('esbuild')

const options = {
    _stdio: 'inherit',
    entryPoints: ['./src/main.ts'],
    outfile: './dist/main.js',
    minify: true,
    bundle: true,
    stdio: 'ignore',
};

(async () => {
    await build(options);

    if (process.env.RUN === '1') {
        require('./dist/main');
    }
})();
