package com.easytask;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {

    @Override
    protected String getMainComponentName() {
        return "EasyTask";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(
                this,
                getMainComponentName(),
                // Aktiverer Fabric som standard
                true
        );
    }
}