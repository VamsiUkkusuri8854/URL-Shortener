package com.quicklink.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "urls")
public class Url {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_url", nullable = false, length = 2048)
    private String originalUrl;

    @Column(name = "short_code", nullable = false, unique = true, length = 20)
    private String shortCode;

    @Column(name = "custom_alias", unique = true, length = 50)
    private String customAlias;

    @Column(name = "title", length = 512)
    private String title;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "click_count")
    private Integer clickCount = 0;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "status")
    private String status = "ACTIVE"; // ACTIVE, EXPIRED, DISABLED
}
