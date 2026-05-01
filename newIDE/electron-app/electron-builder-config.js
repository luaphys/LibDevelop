/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: 'com.gdevelop-app.ide',
  directories: {
    app: 'app',
    buildResources: 'build',
    output: 'dist',
  },
  extraResources: [
    {
      from: '../app/resources/GDJS',
      to: 'GDJS',
    },
    {
      from: '../app/resources/preview_node_modules',
      to: 'preview_node_modules',
    },
  ],
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64', 'arm64'],
      },
      {
        target: 'zip',
        arch: ['x64', 'arm64'],
      },
      {
        target: 'deb',
        arch: ['x64', 'arm64'],
      },
    ],
  },
  mac: {
    category: 'public.app-category.developer-tools',
    hardenedRuntime: true,
    entitlements: './build/entitlements.mac.inherit.plist',
    target: {
      target: 'default',
      arch: ['universal'],
    },
    mergeASARs: false,
    x64ArchFiles:
      'Contents/Resources/app.asar.unpacked/node_modules/steamworks.js/dist/osx/steamworksjs.darwin-*.node',
  },
  win: {
    executableName: 'GDevelop',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
  appx: {
    publisherDisplayName: 'GDevelop game engine',
    displayName: 'GDevelop',
    publisher: 'CN=B13CB8D3-97AA-422C-A394-0EE51B9ACAD3',
    identityName: 'GDevelopgameengine.GDevelop',
    backgroundColor: '#524F9C',
    languages: [
      'EN-US',
      'ZH-HANS',
      'DE',
      'IT',
      'JA',
      'PT-BR',
      'RU',
      'ES',
      'FR',
      'SL',
    ],
  },
  afterSign: 'scripts/electron-builder-after-sign.js',

  // ✅ FIXED: safe GitHub publish config
  publish: process.env.CI
    ? [
        {
          provider: 'github',
          owner: 'luaphys',
          repo: 'Bones-Engine',
        },
      ]
    : null,
};

// ----------------------
// Windows signing config
// ----------------------
if (
  process.env.GD_SIGNTOOL_SUBJECT_NAME &&
  process.env.GD_SIGNTOOL_THUMBPRINT
) {
  config.win.signtoolOptions = {
    certificateSubjectName: process.env.GD_SIGNTOOL_SUBJECT_NAME,
    certificateSha1: process.env.GD_SIGNTOOL_THUMBPRINT,
    signingHashAlgorithms: ['sha256'],
  };

  if (!process.env.SIGNTOOL_PATH) {
    console.error(
      "❌ SIGNTOOL_PATH is not specified - signing won't work with builtin signtool."
    );
  } else {
    console.log(
      'ℹ️ SIGNTOOL_PATH:',
      process.env.SIGNTOOL_PATH
    );
  }

  console.log(
    'ℹ️ Windows signing enabled:',
    config.win.signtoolOptions
  );
} else {
  console.log('ℹ️ No Windows build signing options set.');
}

module.exports = config;
