#!/bin/bash
# Monta e compila o app de iPhone do Clover RPG (roda num Mac do GitHub). O ESign assina depois.
set -e
# Montar o projeto do app
(
mkdir -p app/CloverRPG/Assets.xcassets/AppIcon.appiconset app/www
cp index.html app/www/index.html
curl -fsSL https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js -o app/www/three.min.js
sed -i '' 's#https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js#three.min.js#' app/www/index.html
cp icon.png app/CloverRPG/Assets.xcassets/AppIcon.appiconset/icon-1024.png
cat > app/CloverRPG/Assets.xcassets/Contents.json <<'JSON'
{"info":{"author":"xcode","version":1}}
JSON
cat > app/CloverRPG/Assets.xcassets/AppIcon.appiconset/Contents.json <<'JSON'
{"images":[{"filename":"icon-1024.png","idiom":"universal","platform":"ios","size":"1024x1024"}],"info":{"author":"xcode","version":1}}
JSON
cat > app/CloverRPG/App.swift <<'SWIFT'
import UIKit
import WebKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = GameViewController()
        window?.makeKeyAndVisible()
        return true
    }
}

class GameViewController: UIViewController, WKUIDelegate {
    var web: WKWebView!
    override func loadView() {
        let cfg = WKWebViewConfiguration()
        cfg.allowsInlineMediaPlayback = true
        cfg.mediaTypesRequiringUserActionForPlayback = []
        cfg.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        web = WKWebView(frame: .zero, configuration: cfg)
        web.scrollView.isScrollEnabled = false
        web.scrollView.bounces = false
        web.scrollView.contentInsetAdjustmentBehavior = .never
        web.isOpaque = false
        web.backgroundColor = UIColor(red: 0.08, green: 0.10, blue: 0.17, alpha: 1)
        web.uiDelegate = self
        view = web
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        if let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") {
            web.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        }
    }
    override var prefersStatusBarHidden: Bool { return true }
    override var prefersHomeIndicatorAutoHidden: Bool { return true }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { return .landscape }
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let a = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        a.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler() })
        present(a, animated: true)
    }
    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let a = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        a.addAction(UIAlertAction(title: "Cancelar", style: .cancel) { _ in completionHandler(false) })
        a.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(true) })
        present(a, animated: true)
    }
    func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
        let a = UIAlertController(title: nil, message: prompt, preferredStyle: .alert)
        a.addTextField { $0.text = defaultText }
        a.addAction(UIAlertAction(title: "Cancelar", style: .cancel) { _ in completionHandler(nil) })
        a.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(a.textFields?.first?.text) })
        present(a, animated: true)
    }
}
SWIFT
cat > app/project.yml <<'YML'
name: CloverRPG
options:
  bundleIdPrefix: com.cloverrpg
  projectFormat: xcode15_3
  deploymentTarget:
    iOS: "14.0"
targets:
  CloverRPG:
    type: application
    platform: iOS
    sources:
      - path: CloverRPG
      - path: www
        type: folder
        buildPhase: resources
    info:
      path: CloverRPG/Info.plist
      properties:
        CFBundleDisplayName: Clover RPG
        CFBundleName: $(PRODUCT_NAME)
        CFBundleExecutable: $(EXECUTABLE_NAME)
        CFBundleIdentifier: $(PRODUCT_BUNDLE_IDENTIFIER)
        CFBundlePackageType: APPL
        CFBundleInfoDictionaryVersion: "6.0"
        CFBundleShortVersionString: "1.0"
        CFBundleVersion: "1"
        LSRequiresIPhoneOS: true
        UILaunchScreen: {}
        UIRequiresFullScreen: true
        UIStatusBarHidden: true
        UIViewControllerBasedStatusBarAppearance: true
        UISupportedInterfaceOrientations: [UIInterfaceOrientationLandscapeLeft, UIInterfaceOrientationLandscapeRight]
        UISupportedInterfaceOrientations~ipad: [UIInterfaceOrientationLandscapeLeft, UIInterfaceOrientationLandscapeRight]
        NSAppTransportSecurity:
          NSAllowsArbitraryLoads: true
        ITSAppUsesNonExemptEncryption: false
    settings:
      base:
        PRODUCT_BUNDLE_IDENTIFIER: com.cloverrpg.game
        PRODUCT_NAME: CloverRPG
        ASSETCATALOG_COMPILER_APPICON_NAME: AppIcon
        TARGETED_DEVICE_FAMILY: "1,2"
        SWIFT_VERSION: "5.0"
        GENERATE_INFOPLIST_FILE: NO
        CODE_SIGNING_ALLOWED: NO
        CODE_SIGNING_REQUIRED: NO
        CODE_SIGN_IDENTITY: ""
YML
)
# Instalar o XcodeGen
(
brew install xcodegen
)
# Gerar o projeto Xcode
(
X=$(ls -d /Applications/Xcode_16*.app 2>/dev/null | sort -V | tail -1); if [ -n "$X" ]; then sudo xcode-select -s "$X"; fi
cd app && xcodegen generate
)
# Compilar o app (sem assinatura; o ESign assina no iPhone)
(
X=$(ls -d /Applications/Xcode_16*.app 2>/dev/null | sort -V | tail -1); if [ -n "$X" ]; then sudo xcode-select -s "$X"; fi; xcodebuild -version
cd app
xcodebuild -project CloverRPG.xcodeproj -target CloverRPG -configuration Release -sdk iphoneos SYMROOT="$PWD/build" CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY="" build
)
# Empacotar o .ipa
(
cd app
mkdir -p Payload
cp -R build/Release-iphoneos/CloverRPG.app Payload/
zip -qry ../CloverRPG.ipa Payload
ls -la ../CloverRPG.ipa
)
