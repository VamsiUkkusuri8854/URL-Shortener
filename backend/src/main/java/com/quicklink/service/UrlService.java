package com.quicklink.service;

import com.quicklink.model.Url;
import com.quicklink.repository.UrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UrlService {

    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private com.quicklink.repository.AnalyticsRepository analyticsRepository;

    @Autowired
    private ContentAnalyzerService contentAnalyzerService;

    public Url createShortUrl(String originalUrl, String customAlias, LocalDateTime expiryDate) {
        Url url = new Url();
        url.setOriginalUrl(originalUrl);
        url.setExpiryDate(expiryDate);
        
        // Analyze content to get title and category
        ContentAnalyzerService.AnalysisResult analysis = contentAnalyzerService.analyzeContent(originalUrl);
        
        if (analysis.isSuspicious) {
            throw new IllegalArgumentException("Security Alert: This URL has been flagged as suspicious by our AI spam detection.");
        }
        
        url.setTitle(analysis.title);
        url.setCategory(analysis.category);
        
        if (customAlias != null && !customAlias.trim().isEmpty()) {
            if (urlRepository.findByCustomAlias(customAlias).isPresent() || urlRepository.findByShortCode(customAlias).isPresent()) {
                throw new IllegalArgumentException("Alias already in use");
            }
            url.setCustomAlias(customAlias);
            url.setShortCode(customAlias); // we can use the same field or just custom alias
        } else {
            url.setShortCode(generateShortCode());
        }

        return urlRepository.save(url);
    }

    public List<Url> getAllUrls() {
        return urlRepository.findAll();
    }

    public Optional<Url> getUrlByShortCode(String shortCode) {
        Optional<Url> byShortCode = urlRepository.findByShortCode(shortCode);
        if (byShortCode.isPresent()) {
            return byShortCode;
        }
        return urlRepository.findByCustomAlias(shortCode);
    }

    public Url updateUrl(Long id, Url updatedUrl) {
        Url existingUrl = urlRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("URL not found"));
        existingUrl.setOriginalUrl(updatedUrl.getOriginalUrl());
        existingUrl.setExpiryDate(updatedUrl.getExpiryDate());
        existingUrl.setStatus(updatedUrl.getStatus());
        return urlRepository.save(existingUrl);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteUrl(Long id) {
        analyticsRepository.deleteByUrlId(id);
        urlRepository.deleteById(id);
    }

    public void incrementClickCount(Url url) {
        url.setClickCount(url.getClickCount() + 1);
        urlRepository.save(url);
    }

    private String generateShortCode() {
        // Simple base62-like string from UUID
        return UUID.randomUUID().toString().replace("-", "").substring(0, 6);
    }
}
