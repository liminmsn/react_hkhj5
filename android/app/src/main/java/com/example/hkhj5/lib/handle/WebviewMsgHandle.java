package com.example.hkhj5.lib.handle;

import android.app.Activity;
import android.view.View;
import android.widget.Toast;

import com.example.hkhj5.R;
import com.example.hkhj5.lib.util.MessageBox;

import org.json.JSONObject;

public class WebviewMsgHandle {
    public WebviewMsgHandle(JSONObject json, Activity activity) {
        View view = activity.findViewById(R.id.webview);
        var val = json.optJSONObject("value");
        assert val != null;
        var type = val.optString("type");
        var msg = val.optString("msg");
        switch (type) {
            case "0":
                Toast.makeText(activity, msg, Toast.LENGTH_SHORT).show();
                break;
            case "1":
                MessageBox.Snackbar(view, msg);
                break;
        }
    }
}
