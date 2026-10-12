package com.example.hkhj5.lib.util;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.snackbar.Snackbar;

public class MessageBox {

    public interface Callback extends DialogInterface.OnClickListener {
    }

    public interface SnackbarCallback {
        void onClick(View v);
    }

    // ================== AlertDialog ==================

    public static void AlertDialog(Context context, String msg, Callback callback) {
        new AlertDialog.Builder(context)
                .setTitle("提示")
                .setMessage(msg)
                .setPositiveButton("确定", callback)
                .setNegativeButton("取消", null)
                .show();
    }

    // ================== Snackbar ==================

    /**
     * 显示一个底部 Snackbar 提示
     *
     * @param view  锚点 View，一般传 Activity 的根布局，例如 findViewById(android.R.id.content)
     * @param msg   显示的消息
     */
    public static void Snackbar(@NonNull View view, @NonNull String msg) {
        Snackbar.make(view, msg, Snackbar.LENGTH_SHORT).show();
    }

    /**
     * 显示一个底部 Snackbar 提示（自定义时长）
     */
    public static void Snackbar(@NonNull View view, @NonNull String msg, int duration) {
        Snackbar.make(view, msg, duration).show();
    }

    /**
     * 带操作按钮的 Snackbar
     *
     * @param actionText 按钮文字，如 "撤销"、"确定"
     * @param callback   点击回调，可为 null
     */
    public static void Snackbar(@NonNull View view,
                                @NonNull String msg,
                                @NonNull String actionText,
                                @Nullable final SnackbarCallback callback) {
        Snackbar sb = Snackbar.make(view, msg, Snackbar.LENGTH_LONG);
        sb.setAction(actionText, v -> {
            if (callback != null) {
                callback.onClick(v);
            }
        });
        sb.show();
    }
}