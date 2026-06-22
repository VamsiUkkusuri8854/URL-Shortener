package com.quicklink.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "analytics")
public class Analytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "url_id", nullable = false)
    private Long urlId;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "browser")
    private String browser;

    @Column(name = "device")
    private String device;

    @Column(name = "operating_system")
    private String operatingSystem;

    @Column(name = "country")
    private String country;

    @Column(name = "city")
    private String city;

    @Column(name = "clicked_at", nullable = false, updatable = false)
    private LocalDateTime clickedAt = LocalDateTime.now();
}
