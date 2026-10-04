package com.example.hkhj5.lib;

import android.app.Activity;
import android.content.Context;
import android.widget.Toast;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.JavascriptInterface;
import android.annotation.SuppressLint;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Objects;

public class WebView2 {
    WebView webView;
    Context context;

    public WebView2(WebView webView, Context context) {
        this.webView = webView;
        this.context = context;
        this.initWebview();
    }

    public void Destroy() {
        this.webView.destroy();
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
        this.webView.setWebViewClient(new WebViewClient());
        this.webView.addJavascriptInterface(new Object() {
            @JavascriptInterface
            @SuppressWarnings("unused")
            public void onJsMessage(String message) {
                ((Activity) context).runOnUiThread(() -> handleJsMessage(message));
            }
        }, "webview");
        this.webView.loadUrl("http://192.168.0.100:5173");
    }

    private void handleJsMessage(String message) {
        try {
            JSONObject json = new JSONObject(message);
            String id = json.optString("id");
            String type = json.optString("type");
            Object value = json.opt("value");

            switch (type) {
                case "client":
                    break;
                case "http":
                    JSONObject req = json.optJSONObject("value");
                    if (req == null) {
                        Toast.makeText(context, "http 参数为空", Toast.LENGTH_SHORT).show();
                        break;
                    }
                    String url = req.optString("url");
                    String method = req.optString("method");
                    String body = req.optString("body");
                    JSONObject headers = req.optJSONObject("headers");

                    new Request(url, method).setHeaders(headers).setBody(body).send((response, code, errorMessage) -> {
                        try {
                            JSONObject re = new JSONObject();
                            re.put("status", code);
                            re.put("body", response);
                            re.put("error", errorMessage);
                            sendToJs(id, type, re);
                        } catch (JSONException e) {
                            Log.d("http_json", Objects.requireNonNull(e.getMessage()));
                        }
                    });
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
