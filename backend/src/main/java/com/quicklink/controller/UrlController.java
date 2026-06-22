package com.quicklink.controller;

import com.quicklink.model.Analytics;
import com.quicklink.model.Url;
import com.quicklink.service.AnalyticsService;
import com.quicklink.service.UrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/urls")
@CrossOrigin(origins = "*") // For development, allow all
public class UrlController {

    @Autowired
    private UrlService urlService;

    @Autowired
    private AnalyticsService analyticsService;

    @PostMapping("/create")
    public ResponseEntity<Url> createUrl(@RequestBody Url requestUrl) {
        Url url = urlService.createShortUrl(requestUrl.getOriginalUrl(), requestUrl.getCustomAlias(), requestUrl.getExpiryDate());
        return ResponseEntity.ok(url);
    }

    @GetMapping
    public ResponseEntity<List<Url>> getAllUrls() {
        return ResponseEntity.ok(urlService.getAllUrls());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Url> getUrl(@PathVariable Long id) {
        return urlService.getAllUrls().stream()
                .filter(u -> u.getId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Url> updateUrl(@PathVariable Long id, @RequestBody Url updatedUrl) {
        return ResponseEntity.ok(urlService.updateUrl(id, updatedUrl));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUrl(@PathVariable Long id) {
        urlService.deleteUrl(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<List<Analytics>> getUrlAnalytics(@PathVariable Long id) {
        return ResponseEntity.ok(analyticsService.getAnalyticsByUrlId(id));
    }
}
