package com.example.history.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // 转发根路径到 index.html
        registry.addViewController("/").setViewName("forward:/index.html");
        // 转发所有非API/非静态资源路径到 index.html（SPA 路由支持）
        // 使用 /** 匹配多段路径（如 /dynasty/2）
        // 排除 /api/**、/assets/**、/h2-console/** 避免冲突
        registry.addViewController("/{spring:(?!api|assets|h2-console|index\\.html$).*$}/**").setViewName("forward:/index.html");
    }
}
