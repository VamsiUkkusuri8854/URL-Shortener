package com.quicklink.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

@Service
public class ContentAnalyzerService {

    public static class AnalysisResult {
        public String title;
        public String category;
        public boolean isSuspicious;

        public AnalysisResult(String title, String category, boolean isSuspicious) {
            this.title = title;
            this.category = category;
            this.isSuspicious = isSuspicious;
        }
    }

    public AnalysisResult analyzeContent(String url) {
        String title = "Unknown Title";
        String category = "General";
        boolean isSuspicious = false;

        // Basic heuristic spam checks on URL
        String urlLower = url.toLowerCase();
        if (urlLower.contains(".xyz") || urlLower.contains(".top") || urlLower.contains("free-")
                || urlLower.contains("casino") || urlLower.contains("login-update")
                || urlLower.matches(".*\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}.*")) {
            isSuspicious = true;
        }

        try {
            // Fetch the HTML document
            Document doc = Jsoup.connect(url).timeout(5000).get();

            // Extract Title
            if (doc.title() != null && !doc.title().isEmpty()) {
                title = doc.title();
            }

            // Extract Description for categorization
            String description = "";
            if (doc.select("meta[name=description]").first() != null) {
                description = doc.select("meta[name=description]").first().attr("content");
            }

            // Combine title and description for keyword analysis
            String contentToAnalyze = (title + " " + description).toLowerCase();

            // Basic heuristic categorization
            if (contentToAnalyze.contains("tutorial") || contentToAnalyze.contains("course")
                    || contentToAnalyze.contains("learn") || contentToAnalyze.contains("education")
                    || contentToAnalyze.contains("university")) {
                category = "Education";
            } else if (contentToAnalyze.contains("tech") || contentToAnalyze.contains("software")
                    || contentToAnalyze.contains("programming") || contentToAnalyze.contains("developer")
                    || contentToAnalyze.contains("code")) {
                category = "Technology";
            } else if (contentToAnalyze.contains("shop") || contentToAnalyze.contains("store")
                    || contentToAnalyze.contains("buy") || contentToAnalyze.contains("price")
                    || contentToAnalyze.contains("cart")) {
                category = "E-commerce";
            } else if (contentToAnalyze.contains("news") || contentToAnalyze.contains("article")
                    || contentToAnalyze.contains("blog") || contentToAnalyze.contains("journal")) {
                category = "News & Media";
            } else if (contentToAnalyze.contains("movie") || contentToAnalyze.contains("music")
                    || contentToAnalyze.contains("game") || contentToAnalyze.contains("entertainment")) {
                category = "Entertainment";
            } else if (contentToAnalyze.contains("social") || contentToAnalyze.contains("community")
                    || contentToAnalyze.contains("forum") || contentToAnalyze.contains("network")) {
                category = "Social Media";
            }

        } catch (Exception e) {
            System.err.println("Failed to fetch content for URL: " + url + " - " + e.getMessage());
        }

        return new AnalysisResult(title, category, isSuspicious);
    }
}
