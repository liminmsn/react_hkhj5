package com.example.hkhj5;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class Request {
    private final String url;
    private final String method;
    private final Map<String, String> headers = new HashMap<>();
    private String body;
    private final String contentType = "application/json; charset=utf-8";
    private final int connectTimeout = 10_000;
    private final int readTimeout = 30_000;

    public interface Callback {
        void onResponse(String response, int code, String errorMessage);
    }

    public Request(String url, String method) {
        this.url = url;
        this.method = method == null ? "GET" : method.toUpperCase();
    }

    public Request setHeaders(org.json.JSONObject headers) {
        if (headers == null) return this;
        java.util.Iterator<String> it = headers.keys();
        while (it.hasNext()) {
            String key = it.next();
            String val = headers.optString(key);
            if (key != null) this.headers.put(key, val);
        }
        return this;
    }

    public Request setBody(String body) {
        this.body = body;
        return this;
    }

    /**
     * 异步发送（默认在子线程执行，回调也在子线程）
     * 如果需要在 UI 线程更新 UI，回调里自己 post 回主线程。
     */
    public void send(Callback callback) {
        new Thread(() -> {
            String respBody = null;
            int code = -1;
            String err = null;

            HttpURLConnection conn = null;
            try {
                URL u = new URL(url);
                conn = (HttpURLConnection) u.openConnection();
                conn.setRequestMethod(method);
                conn.setConnectTimeout(connectTimeout);
                conn.setReadTimeout(readTimeout);
                conn.setUseCaches(false);
                conn.setInstanceFollowRedirects(true);
                conn.setRequestProperty("Accept", "application/json, text/plain, */*");
                for (Map.Entry<String, String> e : headers.entrySet()) {
                    conn.setRequestProperty(e.getKey(), e.getValue());
                }
                if (body != null && !body.isEmpty() && !"GET".equals(method) && !"HEAD".equals(method)) {
                    conn.setDoOutput(true);
                    conn.setRequestProperty("Content-Type", contentType);
                    byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
                    conn.setFixedLengthStreamingMode(bytes.length);
                    try (OutputStream os = conn.getOutputStream()) {
                        os.write(bytes);
                        os.flush();
                    }
                }
                code = conn.getResponseCode();
                InputStream is = (code >= 200 && code < 400) ? conn.getInputStream() : conn.getErrorStream();
                if (is != null) {
                    respBody = readStream(is);
                }
            } catch (Exception e) {
                err = e.getClass().getSimpleName() + ": " + e.getMessage();
            } finally {
                if (conn != null) conn.disconnect();
            }

            final String fResp = respBody;
            final int fCode = code;
            final String fErr = err;
            if (callback != null) {
                callback.onResponse(fResp, fCode, fErr);
            }
        }, "Request-" + method).start();
    }

    private static String readStream(InputStream is) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
        }
        return sb.toString();
    }
}