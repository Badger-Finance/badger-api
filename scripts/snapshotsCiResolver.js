const path = require('path');

// Resolve snapshot file path given test file path
// and snapshot extension to be used (defaults to .snap)
// turns dist/src/__test__/Post.spec.js into
// src/__test__/__snapshot__/Post.spec.ts.snap
function resolveSnapshotPath(testPath, snapshotExtension) {
  // Get source path of test file (assuming the build
  // output is stored in dist/ and a TypeScript file)
  const testSourcePath = testPath.replace('build/', '').replace('.js', '.ts');

  // Get directory of test source file
  const testDirectory = path.dirname(testSourcePath);

  // Get file name of test source file
  const testFilename = path.basename(testSourcePath);

  // Construct file path for snapshot, saved next to original test source file
  return `${testDirectory}/__snapshots__/${testFilename}${snapshotExtension}`;
}

// Resolve test file path given snapshot file path and extension
// of snapshot files (defaults to .snap)
// turns src/__test__/__snapshot__/Post.spec.ts.snap into
// dist/src/__test__/Post.spec.js
function resolveTestPath(snapshotFilePath, snapshotExtension) {
  // Transform snapshot file path
  const testSourceFile = snapshotFilePath
    // Remove __snapshot__ directory
    .replace(`/__snapshots__`, '')
    // Convert .ts (TypeScript) to .js to reach built test file
    .replace('.ts', '.js')
    // Remove snapshot extension so we end up with .js
    .replace(snapshotExtension, '');

  // Return test file path in dist directory
  return `build/${testSourceFile}`;
}

module.exports = {
  resolveSnapshotPath,
  resolveTestPath,
  testPathForConsistencyCheck: 'build/./src',
};
