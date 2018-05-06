const createMatcher = options => {
  const { readConfig } = require('jest-config')
  const { cwd = process.cwd() } = options
  const { projectConfig } = readConfig({}, cwd)

  if (projectConfig.testRegex) {
    return filename => filename.match(projectConfig.testRegex)
  }

  if (projectConfig.testMatch && projectConfig.testMatch.length) {
    const micromatch = require('micromatch')
    return filename => micromatch.any(filename, projectConfig.testMatch)
  }

  throw new Error(
    'Failed to find testRegex or testMatch settings in your jest config'
  )
}

module.exports = (pluginOptions = {}) => (nextConfig = {}) => {
  const { testPattern } = pluginOptions
  const isTest = testPattern
    ? path => path.match(testPattern)
    : createMatcher(pluginOptions)

  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        )
      }
      const originalEntry = config.entry
      config.entry = async () => {
        const entries = await originalEntry()

        return Object.keys(entries).reduce((nextEntries, entryName) => {
          if (!isTest(entryName)) {
            return Object.assign(nextEntries, {
              [entryName]: entries[entryName].filter(
                filename => !isTest(filename)
              ),
            })
          }
          return nextEntries
        }, {})
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  })
}
