package com.example.hkhj5;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;

import com.example.hkhj5.lib.MessageBox;
import com.example.hkhj5.lib.WebView2;

public class MainActivity extends AppCompatActivity {
    private WebView2 webView2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        this.webView2 = new WebView2(findViewById(R.id.webview), this);
        // 拦截返回键：能回退就回退，不能回退才退出
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView2 != null && webView2.canGoBack()) {
                    webView2.goBack();
                } else {
                    MessageBox.AlertDialog(MainActivity.this, "确定退出程序吗？", (dialog, which) -> {
                        setEnabled(false);
                        getOnBackPressedDispatcher().onBackPressed();
                    });
                }
            }
        });
    }

    @Override
    protected void onDestroy() {
        this.webView2.Destroy();
        super.onDestroy();
    }
}