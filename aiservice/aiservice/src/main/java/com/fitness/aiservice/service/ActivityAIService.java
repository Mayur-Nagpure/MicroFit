package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {
    private final GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity){
        String promt = createPromtForActivity(activity);
        String aiResponse = geminiService.getAnswer(promt);
        log.info("RESPONSE FROM AI: {} ", aiResponse);
        //processAiResponse(activity, aiResponse);
        return processAiResponse(activity, aiResponse);
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse){
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n", "")
                    .replaceAll("\\n```", "")
                    .trim();

            log.info("PARSED FROM AI: {} ", jsonContent);

            JsonNode analysisJson = mapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");
            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall:");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "HeartRate:");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories:");


            List<String> caloriesburned = extractCaloriesBurned(analysisJson.path("caloriesburned"));
            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety = extractSafetyGuidelines(analysisJson.path("safety"));
            List<String> summary = extractSummary(analysisJson.path("summary").path("summary"));





            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .caloriesBurned(caloriesburned)
                    .improvement(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .summary(summary)
                    .createdAt(LocalDateTime.now())
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return  createDefaultRecommendation(activity);
        }
    }

    private List<String> extractSummary(JsonNode summaryNode) {
        List<String> summary = new ArrayList<>();
        if (summaryNode.isArray()) {
            summaryNode.forEach(item -> summary.add(item.asText()));
        }
        return summary.isEmpty() ?
                Collections.singletonList("No summary report for now") :
                summary;
    }

    private List<String> extractCaloriesBurned(JsonNode caloriesBurnedNode) {
        // If node is object and has a "calories" field, use it:
        if (caloriesBurnedNode.has("calories") && !caloriesBurnedNode.get("calories").isNull()) {
            return Collections.singletonList(caloriesBurnedNode.get("calories").asText());
        }
        // Fallback if unexpected structure:
        if (caloriesBurnedNode.isArray()) {
            List<String> calories = new ArrayList<>();
            caloriesBurnedNode.forEach(item -> calories.add(item.asText()));
            if (!calories.isEmpty()) return calories;
        }
        return Collections.singletonList("No calori data");
    }



    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation("Unable to generate detailed analysis")
                .improvement(Collections.singletonList("Continues with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a fitness professional"))
                .safety(Arrays.asList(
                        "Always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body"
                ))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> safety.add(item.asText()));
        }
        return safety.isEmpty() ?
                Collections.singletonList("No general safety guidelines") :
                safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if (suggestionsNode.isArray()) {
            suggestionsNode.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s", workout, description));

            });
        }
        return suggestions.isEmpty() ?
                Collections.singletonList("No specific suggestions provided") :
                suggestions;
    }

        private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if(improvementsNode.isArray()){
            improvementsNode.forEach(improvement-> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));

            });
        }
            return improvements.isEmpty() ?
                    Collections.singletonList("No specific improvements provided"):
                    improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key , String prefix) {
        if(!analysisNode.path(key).isMissingNode()){
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromtForActivity(Activity activity) {
        return String.format("""
      Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:
      {
        "analysis": {
          "overall": "Overall analysis here",
          "pace": "Pace analysis here",
          "heartRate": "Heart rate analysis here",
          "caloriesBurned": "Calories analysis here"
        },
        "caloriesburned": {
            "calories": "calory burned"
        },
        "improvements": [
          {
            "area": "Area name",
            "recommendation": "Detailed recommendation"
          }  
        ],
        "suggestions": [
          {
            "workout": "Workout name",
            "description": "Detailed workout description"
          }
        ],
        "safety": [
            "Safety point 1",
            "Safety point 2"
        ],
        "summary": {
            "summary": "Concise analysis report in bullet points"
        }
      }

      Analyze this activity:
      Activity Type: %s
      Duration: %d minutes
      Weight: %.2f  kg
      Height: %.2f  cm
      GenderL %s
      Additional Metrics: %s
      
      Provide detailed analysis focusing on performance, improvements, next workout suggestions and safety guidelines.
      Ensure the response follows the EXACT JSON format shown above.
      """,
                activity.getType(),
                activity.getDuration(),
               // activity.getCaloriesBurned(),
                activity.getWeight(),
                activity.getHeight(),
                activity.getGender(),
                activity.getAdditionalMetrics()
        );

    }


}
