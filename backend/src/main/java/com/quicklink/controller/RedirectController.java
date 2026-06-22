package com.quicklink.controller;

import com.quicklink.model.Analytics;
import com.quicklink.model.Url;
import com.quicklink.service.AnalyticsService;
import com.quicklink.service.UrlService;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
public class RedirectController {

    @Autowired
    private UrlService urlService;

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirectToOriginalUrl(@PathVariable String shortCode, HttpServletRequest request) {
        Optional<Url> urlOpt = urlService.getUrlByShortCode(shortCode);

        if (urlOpt.isPresent()) {
            Url url = urlOpt.get();

            // Check if expired or disabled
            if ("DISABLED".equals(url.getStatus()) || 
               ("ACTIVE".equals(url.getStatus()) && url.getExpiryDate() != null && url.getExpiryDate().isBefore(LocalDateTime.now()))) {
                return ResponseEntity.status(HttpStatus.GONE).build();
            }

            // Increment click count
            urlService.incrementClickCount(url);

            // Record Analytics
            Analytics analytics = new Analytics();
            analytics.setUrlId(url.getId());
            analytics.setIpAddress(request.getRemoteAddr());
            
            String userAgent = request.getHeader("User-Agent");
            analytics.setBrowser(parseBrowser(userAgent));
            analytics.setDevice(parseDevice(userAgent));
            analytics.setOperatingSystem(parseOS(userAgent));
            
            // For country and city, you'd typically use a GeoIP service or local DB.
            // Leaving as Unknown for basic implementation.
            analytics.setCountry("Unknown");
            analytics.setCity("Unknown");
            
            analyticsService.saveAnalytics(analytics);

            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(url.getOriginalUrl()))
                    .build();
        }

        return ResponseEntity.notFound().build();
    }

    private String parseBrowser(String userAgent) {
        if (userAgent == null) return "Unknown";
        if (userAgent.contains("Chrome")) return "Chrome";
        if (userAgent.contains("Firefox")) return "Firefox";
        if (userAgent.contains("Safari")) return "Safari";
        if (userAgent.contains("Edge")) return "Edge";
        return "Other";
    }

    private String parseOS(String userAgent) {
        if (userAgent == null) return "Unknown";
        if (userAgent.contains("Windows")) return "Windows";
        if (userAgent.contains("Mac OS X")) return "MacOS";
        if (userAgent.contains("Linux")) return "Linux";
        if (userAgent.contains("Android")) return "Android";
        if (userAgent.contains("iPhone")) return "iOS";
        return "Other";
    }

    private String parseDevice(String userAgent) {
        if (userAgent == null) return "Unknown";
        if (userAgent.contains("Mobile")) return "Mobile";
        if (userAgent.contains("Tablet")) return "Tablet";
        return "Desktop";
    }
}
