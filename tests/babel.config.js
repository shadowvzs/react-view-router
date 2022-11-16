module.exports = {
    plugins: ['@babel/plugin-transform-modules-commonjs'],
    presets: [
        '@babel/preset-env',
        {
            targets: { esmodules: true },
        },
        '@babel/preset-typescript',
        '@babel/preset-react',
    ],
};
