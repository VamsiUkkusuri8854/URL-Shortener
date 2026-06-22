package com.quicklink.repository;

import com.quicklink.model.Analytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<Analytics, Long> {
    List<Analytics> findByUrlId(Long urlId);
    
    @org.springframework.transaction.annotation.Transactional
    void deleteByUrlId(Long urlId);
}
