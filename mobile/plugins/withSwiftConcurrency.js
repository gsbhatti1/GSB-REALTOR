/**
 * Config plugin to set SWIFT_STRICT_CONCURRENCY = minimal
 * Fixes expo-image concurrency errors with Xcode 16.3+
 */
const { withXcodeProject } = require('@expo/config-plugins')

const withSwiftConcurrency = (config) => {
  return withXcodeProject(config, (config) => {
    const project = config.modResults

    // Get all build configurations directly
    const configs = project.pbxXCBuildConfigurationSection()

    for (const key of Object.keys(configs)) {
      if (key.includes('_comment')) continue
      const buildConfig = configs[key]
      if (!buildConfig || !buildConfig.buildSettings) continue
      buildConfig.buildSettings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'
    }

    return config
  })
}

module.exports = withSwiftConcurrency
