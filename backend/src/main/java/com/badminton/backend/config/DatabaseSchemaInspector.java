
package com.badminton.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;

@Configuration
public class DatabaseSchemaInspector {

    @Bean
    CommandLineRunner inspectDatabase(DataSource dataSource) {
        return args -> {

            System.out.println("\n========== DATABASE SCHEMA INSPECTION ==========");

            try (Connection connection = dataSource.getConnection()) {

                DatabaseMetaData metadata = connection.getMetaData();

                System.out.println("Database: " +
                        metadata.getDatabaseProductName());

                System.out.println("Version: " +
                        metadata.getDatabaseProductVersion());

                try (ResultSet tables = metadata.getTables(
                        null, "public", "%", new String[]{"TABLE"})) {

                    while (tables.next()) {

                        String tableName = tables.getString("TABLE_NAME");

                        System.out.println("\n--------------------------------");
                        System.out.println("TABLE: " + tableName);
                        System.out.println("--------------------------------");

                        System.out.println("COLUMNS:");

                        try (ResultSet columns = metadata.getColumns(
                                null, "public", tableName, "%")) {

                            while (columns.next()) {
                                System.out.println(
                                        columns.getString("COLUMN_NAME") +
                                                " | TYPE: " +
                                                columns.getString("TYPE_NAME") +
                                                " | SIZE: " +
                                                columns.getInt("COLUMN_SIZE") +
                                                " | NULLABLE: " +
                                                columns.getInt("NULLABLE") +
                                                " | DEFAULT: " +
                                                columns.getString("COLUMN_DEF")
                                );
                            }
                        }

                        System.out.println("PRIMARY KEYS:");

                        try (ResultSet keys = metadata.getPrimaryKeys(
                                null, "public", tableName)) {

                            while (keys.next()) {
                                System.out.println(
                                        keys.getString("COLUMN_NAME")
                                );
                            }
                        }

                        System.out.println("FOREIGN KEYS:");

                        try (ResultSet keys = metadata.getImportedKeys(
                                null, "public", tableName)) {

                            while (keys.next()) {
                                System.out.println(
                                        keys.getString("FKCOLUMN_NAME") +
                                                " -> " +
                                                keys.getString("PKTABLE_NAME") +
                                                "." +
                                                keys.getString("PKCOLUMN_NAME")
                                );
                            }
                        }
                    }
                }

            } catch (Exception e) {
                System.err.println("Schema inspection failed:");
                e.printStackTrace();
            }

            System.out.println("\n========== INSPECTION FINISHED ==========");
        };
    }
}
