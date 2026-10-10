package com.example.hkhj5.config;

public class EnvConfig {
    public enum Environment {
        DEV,
        RELEASE
    }
    public static Environment env = Environment.DEV;
}
