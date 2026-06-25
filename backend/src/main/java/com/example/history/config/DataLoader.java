package com.example.history.config;

import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.nio.charset.StandardCharsets;

// @Component (disabled - schema.sql handles init)
public class DataLoader {

    private final DataSource dataSource;

    public DataLoader(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @PostConstruct
    public void init() throws Exception {
        // 使用 ScriptUtils 显式指定 UTF-8 编码加载 data.sql
        ClassPathResource resource = new ClassPathResource("data.sql");
        var connection = dataSource.getConnection();
        try {
            // 先清空旧数据
            var stmt = connection.createStatement();
            stmt.execute("DELETE FROM royal_member");
            stmt.execute("DELETE FROM ruler");
            stmt.execute("DELETE FROM dynasty");
            stmt.close();

            // 用 UTF-8 编码重新加载数据
            ScriptUtils.executeSqlScript(connection, resource);
        } finally {
            connection.close();
        }
    }
}
