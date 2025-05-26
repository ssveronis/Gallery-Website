// scripts/build.cjs
const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['./server.cjs'], // or .js depending on your entry
    bundle: true,
    platform: 'node',
    target: 'node24', // or the version you're targeting
    outfile: 'dist/app.cjs',
    minify: true, // optional: minify output
    sourcemap: false,
    external: ['request', 'yamlparser', 'argon2'],
}).catch(() => process.exit(1));
