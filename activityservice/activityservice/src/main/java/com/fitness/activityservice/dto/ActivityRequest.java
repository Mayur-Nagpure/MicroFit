package com.fitness.activityservice.dto;

import com.fitness.activityservice.model.ActivityType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityRequest {

    private String userId;
    private ActivityType type;
    private Integer duration;
    private Double weight;
    private Double height;
    private String gender;
    private LocalDateTime startTime;
    public Map<String, Object> additionalMetrics;
}
