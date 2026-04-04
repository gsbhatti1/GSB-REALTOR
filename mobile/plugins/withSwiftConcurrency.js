/**
 * Config plugin to set SWIFT_STRICT_CONCURRENCY = minimal
 * Fixes: "main actor-isolated property cannot be mutated from nonisolated context"
 * errors from expo-image and other packages with Xcode 16.3+
 */
const { withXcodeProject } = require('@expo/config-plugins')

const withSwiftConcurrency = (config) => {
  return withXcodeProject(config, (config) => {
    const project = config.modResults
    const targets = project.pbxNativeTargetSection()

    // Apply to all targets
    for (const key of Object.keys(targets)) {
      if (key.includes('_comment')) continue
      const target = targets[key]
      if (!target || !target.name) continue

      // Get build configuration list
      const buildConfigListKey = target.buildConfigurationList
      if (!buildConfigListKey) continue

      const buildConfigList = project.pbxXCConfigurationListSection()[buildConfigListKey]
      if (!buildConfigList) continue

      const buildConfigs = buildConfigList.buildConfigurations
      if (!buildConfigs) continue

      for (const configRef of buildConfigs) {
        const configKey = configRef.value
        const buildConfig = project.pbxXCBuildConfigurationSection()[configKey]
        if (!buildConfig || !buildConfig.buildSettings) continue

        // Set strict concurrency to minimal — suppresses concurrency warnings as errors
        buildConfig.buildSettings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'
      }
    }

    return config
  })
}

module.exports = withSwiftConcurrency
