package com.example.hkhj5;

import org.junit.Test;

import static org.junit.Assert.*;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

public class ExampleUnitTest {

    @Test
    public void addition_isCorrect() {
        System.out.println("hello world");
        assertEquals(4, 2 + 2);
    }

    @Test
    public void search_isCorrect() {
        HttpURLConnection conn = null;
        try {
            URL url = new URL("https://www.9hanju.com/search/");
            conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type",
                    "application/x-www-form-urlencoded; charset=UTF-8");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Android)");

            String postData = "show=" + URLEncoder.encode("searchkey", "UTF-8")
                    + "&keyboard=" + URLEncoder.encode("15", "UTF-8");

            DataOutputStream os = new DataOutputStream(conn.getOutputStream());
            os.writeBytes(postData);
            os.flush();
            os.close();

            int code = conn.getResponseCode();
            InputStream is = (code == 200) ? conn.getInputStream() : conn.getErrorStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            reader.close();

            System.out.println("HTTP_CODE >>> " + code);
            System.out.println("HTTP_BODY >>> " + sb);

            assertEquals(200, code);

        } catch (Exception e) {
            e.printStackTrace();
            fail("请求异常: " + e.getMessage());
        } finally {
            if (conn != null) conn.disconnect();
        }
    }
}