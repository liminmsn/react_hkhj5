package com.example.hkhj5;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView2 webView2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        this.webView2 = new WebView2(findViewById(R.id.webview), this);
    }

    @Override
    protected void onDestroy() {
        webView2.Destroy();
        super.onDestroy();
    }
}