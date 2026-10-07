package com.example.hkhj5.lib.net;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class Request {
    private static final int MAX_REDIRECTS = 5;
    private final int connectTimeout = 10_000;
    private final int readTimeout = 30_000;
    private final Map<String, String> headers = new HashMap<>();
    private final String method;
    private final String url;
    private String body;

    public interface Callback {
        void onResponse(String response, int code, String errorMessage);
    }

    public Request(String url, String method) {
        this.url = url;
        this.method = method == null ? "GET" : method.toUpperCase();
    }

    public Request setHeaders(JSONObject headers) {
        if (headers == null) {
            return this;
        }

        Iterator<String> keys = headers.keys();

        while (keys.hasNext()) {
            String key = keys.next();
            this.headers.put(key, headers.optString(key));
        }

        return this;
    }

    public Request setBody(String body) {
        this.body = body;
        return this;
    }

    public void send(Callback callback) {
        new Thread(() -> {

            String currentUrl = url;
            String currentMethod = method;
            String currentBody = body;

            String response = null;
            String error = null;
            int code = -1;

            try {
                for (int i = 0; i <= MAX_REDIRECTS; i++) {

                    HttpURLConnection conn = (HttpURLConnection) new URL(currentUrl).openConnection();

                    conn.setRequestMethod(currentMethod);
                    conn.setConnectTimeout(connectTimeout);
                    conn.setReadTimeout(readTimeout);
                    conn.setUseCaches(false);
                    conn.setInstanceFollowRedirects(false);

                    // User-Agent
                    conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Android)");

                    // 自定义请求头
                    for (Map.Entry<String, String> entry : headers.entrySet()) {
                        conn.setRequestProperty(entry.getKey(), entry.getValue());
                    }

                    // POST / PUT / DELETE Body
                    if (currentBody != null && !currentBody.isEmpty() && !"GET".equals(currentMethod) && !"HEAD".equals(currentMethod)) {

                        conn.setDoOutput(true);

                        byte[] data = currentBody.getBytes(StandardCharsets.UTF_8);

                        conn.setFixedLengthStreamingMode(data.length);

                        try (DataOutputStream output = new DataOutputStream(conn.getOutputStream())) {

                            output.write(data);
                            output.flush();
                        }
                    }

                    code = conn.getResponseCode();

                    // ==========================
                    // 重定向
                    // ==========================

                    if (code == 301 || code == 302 || code == 303 || code == 307 || code == 308) {

                        String location = conn.getHeaderField("Location");

                        conn.disconnect();

                        if (location == null || location.isEmpty()) {
                            break;
                        }

                        currentUrl = new URL(new URL(currentUrl), location).toString();

                        // 301 / 302 / 303：
                        // POST -> GET
                        if (code == 301 || code == 302 || code == 303) {

                            currentMethod = "GET";
                            currentBody = null;
                        }

                        continue;
                    }

                    // ==========================
                    // 读取响应
                    // ==========================

                    InputStream input = code >= 200 && code < 400 ? conn.getInputStream() : conn.getErrorStream();

                    if (input != null) {
                        response = read(input);
                    }

                    conn.disconnect();

                    break;
                }

            } catch (Exception e) {
                error = e.getClass().getSimpleName() + ": " + e.getMessage();
            }

            if (callback != null) {
                callback.onResponse(response, code, error);
            }

        }, "Request-" + method).start();
    }

    private static String read(InputStream input) throws Exception {

        StringBuilder result = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(input, StandardCharsets.UTF_8))) {

            String line;

            while ((line = reader.readLine()) != null) {
                result.append(line);
            }
        }

        return result.toString();
    }
}