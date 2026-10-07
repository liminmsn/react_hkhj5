package com.example.hkhj5.lib.util;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
public class MessageBox {
    public interface Callback extends DialogInterface.OnClickListener {
    }

    public static void AlertDialog(Context context, String msg, Callback callback) {
        new AlertDialog.Builder(context)
                .setTitle("提示")
                .setMessage(msg)
                .setPositiveButton("确定", callback)
                .setNegativeButton("取消", null)
                .show();
    }
}