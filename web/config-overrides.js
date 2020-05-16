const path = require('path');
const { addWebpackAlias, override, fixBabelImports, addLessLoader } = require('customize-cra');
const { getThemeVariables } = require('antd/dist/theme');

// Add just the necessary icons to decrease bundle size
function overrides(config, env) {
  config.resolve.alias['@ant-design/icons/lib/dist$'] = path.join(__dirname, 'src/icons.js')

  return config
}

module.exports = override(
  overrides,
  addWebpackAlias({
    '@assets': path.join(__dirname, 'src/assets'),
    '@constants': path.join(__dirname, 'src/constants'),
    '@components': path.join(__dirname, 'src/shared/components'),
    '@icons': path.join(__dirname, 'src/shared/icons'),
    '@layout': path.join(__dirname, 'src/layout'),
    '@utils': path.join(__dirname, 'src/utils')
  }),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    paths: ['./src/styles', './node_modules'],
    javascriptEnabled: true,
    modifyVars: getThemeVariables({
        dark: true,
        compact: false,
    }),
  }),
);
