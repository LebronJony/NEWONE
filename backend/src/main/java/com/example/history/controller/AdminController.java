package com.example.history.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final DataSource dataSource;

    public AdminController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/reload")
    public ResponseEntity<Map<String, Object>> reloadData() {
        Map<String, Object> result = new HashMap<>();
        try (Connection conn = dataSource.getConnection()) {
            // 清空旧数据
            try (Statement stmt = conn.createStatement()) {
                stmt.execute("DELETE FROM royal_member");
                stmt.execute("DELETE FROM ruler");
                stmt.execute("DELETE FROM dynasty");
            }

            // 用 UTF-8 编码重新加载 data.sql
            ClassPathResource resource = new ClassPathResource("data.sql");
            ScriptUtils.executeSqlScript(conn, resource);

            result.put("success", true);
            result.put("message", "数据已成功用 UTF-8 编码重新加载");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "重载失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(result);
        }
    }
}
