package com.example.hkhj5.lib.handle;

import static androidx.constraintlayout.helper.widget.MotionEffect.TAG;

import android.util.Log;

import com.example.hkhj5.lib.Webview2SendToJs;
import com.example.hkhj5.lib.util.Request;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Objects;

public class WebviewHttpHandle {
    public WebviewHttpHandle(JSONObject json, Webview2SendToJs callback) {
        String type = json.optString("type");
        String id = json.optString("id");
        JSONObject req = json.optJSONObject("value");

        if (req == null) {
            if (callback != null) {
                JSONObject error = new JSONObject();
                try {
                    error.put("status", -1);
                    error.put("body", "");
                    error.put("error", "http 参数为空");
                } catch (JSONException e) {
                    Log.e(TAG, "构建错误 JSON 失败", e);
                }
                callback.send(id, type, error);
            }
            return;
        }

        String url = req.optString("url");
        String method = req.optString("method");
        String body = req.optString("body");
        JSONObject headers = req.optJSONObject("headers");

        new Request(url, method)
                .setHeaders(headers)
                .setBody(body)
                .send((response, code, errorMessage) -> {
                    try {
                        JSONObject re = new JSONObject();
                        re.put("status", code);
                        re.put("body", response);
                        re.put("error", errorMessage);
                        callback.send(id, type, re);
                    } catch (JSONException e) {
                        Log.d("http_json", Objects.requireNonNull(e.getMessage()));
                    }
                });
    }
}