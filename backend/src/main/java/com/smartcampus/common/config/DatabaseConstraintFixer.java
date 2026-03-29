package com.smartcampus.common.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConstraintFixer {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConstraintFixer.class);

    private final JdbcTemplate jdbcTemplate;

    public DatabaseConstraintFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void fixRoleConstraint() {
        try {
            jdbcTemplate.execute("ALTER TABLE app_user DROP CONSTRAINT IF EXISTS app_user_role_check");
            jdbcTemplate.execute(
                "ALTER TABLE app_user ADD CONSTRAINT app_user_role_check CHECK (role in ('ADMIN','MANAGER','TECHNICIAN','USER'))"
            );
            logger.info("Ensured app_user_role_check supports ADMIN, MANAGER, TECHNICIAN, USER");
        } catch (Exception exception) {
            logger.warn("Could not enforce app_user_role_check automatically: {}", exception.getMessage());
        }
    }
}
