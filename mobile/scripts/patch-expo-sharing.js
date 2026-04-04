/**
 * Patches expo-sharing SharingModule.swift to fix:
 * "type 'FileSystemUtilities' has no member 'isReadableFile'"
 * This is a known bug in expo-sharing when used with newer Xcode versions.
 */
const fs = require('fs')
const path = require('path')

const filePath = path.join(
  __dirname,
  '../node_modules/expo-sharing/ios/SharingModule.swift'
)

if (!fs.existsSync(filePath)) {
  console.log('expo-sharing SharingModule.swift not found — skipping patch')
  process.exit(0)
}

let content = fs.readFileSync(filePath, 'utf8')

const OLD = `      guard FileSystemUtilities.isReadableFile(appContext, url) else {
        throw FilePermissionException()
      }`

const NEW = `      // Patched: FileSystemUtilities.isReadableFile removed — use FileManager directly
      guard FileManager.default.isReadableFile(atPath: url.path) else {
        throw FilePermissionException()
      }`

if (content.includes(OLD)) {
  content = content.replace(OLD, NEW)
  fs.writeFileSync(filePath, content, 'utf8')
  console.log('✅ Patched expo-sharing SharingModule.swift — fixed isReadableFile')
} else if (content.includes('FileManager.default.isReadableFile')) {
  console.log('✅ Already patched — skipping')
} else {
  console.log('⚠️  Pattern not found — manual review needed')
  console.log('File content around line 17:')
  console.log(content.split('\n').slice(14, 22).join('\n'))
}
