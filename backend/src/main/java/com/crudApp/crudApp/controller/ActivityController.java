package com.crudApp.crudApp.controller;

import com.crudApp.crudApp.model.Activity;
import com.crudApp.crudApp.repo.ActivityRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PreDestroy;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    @Autowired
    private ActivityRepo activityRepo;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String FILE_PATH = "activities.json";

    @GetMapping("/getAllActivities")
    public ResponseEntity<List<Activity>> getAllActivities() {
        try {
            List<Activity> activityList = new ArrayList<>();
            for (Activity activity : activityRepo.findAll()) {
                activityList.add(activity);
            }
            if (activityList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(activityList, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getActivityById/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable Long id) {
        Optional<Activity> activityData = activityRepo.findById(id);
        if (activityData.isPresent()) {
            return new ResponseEntity<>(activityData.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/addActivity")
    public ResponseEntity<Activity> addActivity(@RequestBody Activity activity) {
        Activity activityObj = activityRepo.save(activity);
        return new ResponseEntity<>(activityObj, HttpStatus.OK);
    }

    @PutMapping("/updateActivityById/{id}")
    public ResponseEntity<Activity> updateActivityById(@PathVariable Long id, @RequestBody Activity newActivityData) {
        Optional<Activity> oldActivityData = activityRepo.findById(id);
        if (oldActivityData.isPresent()) {
            Activity updatedActivityData = oldActivityData.get();
            updatedActivityData.setTitle(newActivityData.getTitle());
            updatedActivityData.setDescription(newActivityData.getDescription());
            Activity activityObj = activityRepo.save(updatedActivityData);
            return new ResponseEntity<>(activityObj, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deleteActivityById/{id}")
    public ResponseEntity<Activity> deleteActivityById(@PathVariable Long id) {
        activityRepo.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreDestroy
    public void saveActivitiesToFile() {
        List<Activity> activityList = activityRepo.findAll();
        try {
            objectMapper.writeValue(new File(FILE_PATH), activityList);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @PostConstruct
    public void loadActivitiesFromFile() {
        try {
            File file = new File(FILE_PATH);
            if (file.exists()) {
                Activity[] activities = objectMapper.readValue(file, Activity[].class);
                for (Activity activity : activities) {
                    activityRepo.save(activity);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
