const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

function compileAsync(compiler) {
    return new Promise(function(resolve, reject) {
        compiler.run(function(error, stats) {
            if (error || stats.hasErrors()) {
                const resolvedError = error || stats.toJson('errors-only').errors[0]
                reject(resolvedError.message)
            }
            resolve(stats)
        });
    });
}

function webpackCompiler(component, source) {
    process.env.COMPONENT = component;
    const distFile = crypto.randomBytes(10).toString('hex') + '.js';
    return [distFile, webpack({
        mode: "development",
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: distFile
        },
        entry: path.resolve(__dirname, './' + source),
        module: {
            rules: [
                {
                    test: /\.twig$/,
                    use: ['phosphor-twig-webpack-loader'],
                },
            ],
        },
        resolveLoader: {
            alias: {
                'phosphor-twig-webpack-loader': path.resolve(__dirname, './../src/loader.js'),
            },
        },
    })];
}

test('Successful compilation', async function() {
    const [distFile, compiler] = webpackCompiler('Counter.html.twig', 'success.js');
    await compileAsync(compiler);
    require('./dist/' + distFile);
    const Counter = global['Counter'];
    expect(Counter.name).toEqual('Counter');
    expect(Counter.props).toEqual(["initialCount"]);
    expect(typeof Counter.setup).toEqual('function');
});

test('Missing openning tag', async function() {
    const [,compiler] = webpackCompiler('MissingOpenningTag.html.twig', 'missingOpenningTag.js');
    let error;
    try {
      await compileAsync(compiler);
    } catch (compilationError) {
      error = compilationError;
    }
    expect(error).toContain('Missing openning tag');
});


test('Missing closing tag', async function() {
  const [,compiler] = webpackCompiler('MissingClosingTag.html.twig', 'missingClosingTag.js');
  let error;
  try {
    await compileAsync(compiler);
  } catch (compilationError) {
    error = compilationError;
  }
  expect(error).toContain('Missing closing tag');
});

afterAll(function() {
    const directory = path.resolve(__dirname, 'dist');
    fs.readdir(directory, function(err, files) {
        files.forEach(function(file) {
            if (file.endsWith('.js')) {
                fs.unlink(path.join(directory, file), function(err) {
                    if (err) {
                        throw err;
                    }
                });
            }
        });
    });
});
