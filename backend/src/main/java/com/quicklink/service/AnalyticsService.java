package com.quicklink.service;

import com.quicklink.model.Analytics;
import com.quicklink.repository.AnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {

    @Autowired
    private AnalyticsRepository analyticsRepository;

    public void saveAnalytics(Analytics analytics) {
        analyticsRepository.save(analytics);
    }

    public List<Analytics> getAnalyticsByUrlId(Long urlId) {
        return analyticsRepository.findByUrlId(urlId);
    }
    
    public List<Analytics> getAllAnalytics() {
        return analyticsRepository.findAll();
    }
}
