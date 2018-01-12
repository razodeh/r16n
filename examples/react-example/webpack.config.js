module.exports = {
    entry: './app.jsx',
    output: {
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ]
    },
};