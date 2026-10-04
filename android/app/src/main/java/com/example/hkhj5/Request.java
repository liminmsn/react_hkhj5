package com.example.hkhj5;

import android.os.Handler;
import android.os.Looper;

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
    private String contentType = "application/json; charset=utf-8";
    private int connectTimeout = 10_000;
    private int readTimeout = 30_000;

    private static final Handler MAIN = new Handler(Looper.getMainLooper());

    public Request(String url, String method) {
        this.url = url;
        this.method = method == null ? "GET" : method.toUpperCase();
    }

    public Request setBody(String body) {
        this.body = body;
        return this;
    }

    public Request setContentType(String contentType) {
        this.contentType = contentType;
        return this;
    }

    public Request addHeader(String key, String value) {
        if (key != null && value != null) headers.put(key, value);
        return this;
    }

    public Request setHeaders(org.json.JSONObject headers) {
        if (headers == null) return this;
        java.util.Iterator<String> it = headers.keys();
        while (it.hasNext()) {
            String key = it.next();
            String val = headers.optString(key, null);
            if (key != null && val != null) this.headers.put(key, val);
        }
        return this;
    }

    public Request setConnectTimeout(int ms) {
        this.connectTimeout = ms;
        return this;
    }

    public Request setReadTimeout(int ms) {
        this.readTimeout = ms;
        return this;
    }

    // ---------- 回调 ----------
    public interface Callback {
        void onResponse(String response, int code, String errorMessage);
    }

    // ---------- 执行 ----------

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

                // 默认头
                conn.setRequestProperty("Accept", "application/json, text/plain, */*");

                // 用户自定义头
                for (Map.Entry<String, String> e : headers.entrySet()) {
                    conn.setRequestProperty(e.getKey(), e.getValue());
                }

                // 有 body 才写
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

                // 2xx 读 input，其他读 error，否则某些服务端不会返回 body
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

    /**
     * 同步发送（必须在子线程调用）
     */
    public Response sendSync() throws IOException {
        HttpURLConnection conn = null;
        try {
            URL u = new URL(url);
            conn = (HttpURLConnection) u.openConnection();
            conn.setRequestMethod(method);
            conn.setConnectTimeout(connectTimeout);
            conn.setReadTimeout(readTimeout);
            conn.setUseCaches(false);
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

            int code = conn.getResponseCode();
            InputStream is = (code >= 200 && code < 400) ? conn.getInputStream() : conn.getErrorStream();
            String respBody = is != null ? readStream(is) : "";

            return new Response(code, respBody, headers);
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    /**
     * 便捷方法：把结果 post 回主线程
     */
    public void sendOnMain(Callback callback) {
        send((resp, code, err) -> MAIN.post(() -> callback.onResponse(resp, code, err)));
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

    // ---------- 响应对象 ----------

    public static class Response {
        public final int code;
        public final String body;
        public final Map<String, String> headers;

        public Response(int code, String body, Map<String, String> headers) {
            this.code = code;
            this.body = body;
            this.headers = headers;
        }

        public boolean isSuccessful() {
            return code >= 200 && code < 300;
        }

        @Override
        public String toString() {
            return "Response{code=" + code + ", body=" + body + "}";
        }
    }
}