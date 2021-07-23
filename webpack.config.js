const path = require('path');

// console.log(path.resolve(__dirname, "./bin/client/js"));

module.exports = {
    entry: path.resolve(__dirname, "./src/client/js/app.js"),
    output: {
        path: require("path").resolve("./src/bin/client/js"),
        // path: path.resolve(__dirname, "./src/bin/client/js"),
        library: "app",
        filename: "app.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            }
        ]
    }
};
