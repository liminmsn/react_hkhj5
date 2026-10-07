package com.example.hkhj5.lib.handle;

import android.util.Log;

import com.example.hkhj5.lib.Webview2SendToJs;

import org.json.JSONObject;

public class WebviewClientHandle {
    public WebviewClientHandle(JSONObject json, Webview2SendToJs callback) {
        Log.println(Log.INFO,"yyy",json.toString());
    }
}
