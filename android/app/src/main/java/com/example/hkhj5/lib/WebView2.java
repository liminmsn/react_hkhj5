package com.example.hkhj5.lib;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.widget.Toast;

import androidx.webkit.WebViewAssetLoader;

import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.JavascriptInterface;
import android.annotation.SuppressLint;

import com.example.hkhj5.config.EnvConfig;
import com.example.hkhj5.lib.handle.WebviewClientHandle;
import com.example.hkhj5.lib.handle.WebviewHttpHandle;

import org.json.JSONException;
import org.json.JSONObject;

public class WebView2 {
    WebView webView;
    Activity context;

    public WebView2(WebView webView, Activity context) {
        this.webView = webView;
        this.context = context;
        WebView.setWebContentsDebuggingEnabled(true);
        this.initWebview();
    }

    public void Destroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.loadUrl("about:blank");
            webView.clearHistory();
            webView.removeAllViews();
            webView.destroy();
            webView = null;
        }
    }

    public boolean canGoBack() {
        return webView != null && webView.canGoBack();
    }

    public void goBack() {
        if (webView != null) webView.goBack();
    }

    private void sendToJs(String id, String type, Object value) {
        try {
            JSONObject json = new JSONObject();
            json.put("id", id);
            json.put("type", type);
            json.put("value", value);
            String script = "window.__webviewReceive && window.__webviewReceive(" + JSONObject.quote(json.toString()) + ")";
            webView.post(() -> webView.evaluateJavascript(script, null));
        } catch (JSONException e) {
            Toast.makeText(context, "消息格式错误: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    protected void initWebview() {
        this.webView.getSettings().setJavaScriptEnabled(true);
        this.webView.getSettings().setDomStorageEnabled(true);
        this.webView.getSettings().setDatabaseEnabled(true);
        this.webView.getSettings().setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        this.webView.addJavascriptInterface(new Object() {
            @JavascriptInterface
            @SuppressWarnings("unused")
            public void onJsMessage(String message) {
                context.runOnUiThread(() -> handleJsMessage(message));
            }
        }, "webview");

        if (EnvConfig.env == EnvConfig.Environment.DEV) {
            this.webView.loadUrl("http://192.168.0.103:5173/");
        }

        if (EnvConfig.env == EnvConfig.Environment.RELEASE) {
            final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder().addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(context)).build();
            this.webView.setWebViewClient(new WebViewClient() {
                @Override
                public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                    return assetLoader.shouldInterceptRequest(request.getUrl());
                }

                @Override
                public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                    return false;
                }
            });
            this.webView.loadUrl("https://appassets.androidplatform.net/assets/www/index.html");
        }
    }

    private void handleJsMessage(String message) {
        try {
            JSONObject json = new JSONObject(message);
            String type = json.optString("type");
            Object value = json.opt("value");
//          String id = json.optString("id");

            switch (type) {
                case "open_url":
                    String url = json.optString("value");
                    // 2. 创建 Intent 并指定动作和数据
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    // 3. 启动系统浏览器
                    try {
                        context.startActivity(intent);
                    } catch (Exception e) {
                        // 异常处理：防止某些极端情况下手机没有可用的浏览器
                        Toast.makeText(context, "未找到可用的浏览器", Toast.LENGTH_SHORT).show();
                    }
                    Log.println(Log.INFO, "open_url", url);
                    break;
                case "client":
                    new WebviewClientHandle(json, this::sendToJs, this.context);
                    break;
                case "http":
                    new Thread(() -> new WebviewHttpHandle(json, this::sendToJs)).start();
                    break;
                default:
                    Toast.makeText(context, "收到 JS 消息: " + type + " / " + value, Toast.LENGTH_SHORT).show();
                    break;
            }
        } catch (JSONException e) {
            Toast.makeText(context, "web端JSON消息格式错误: " + message, Toast.LENGTH_SHORT).show();
        }
    }
}
