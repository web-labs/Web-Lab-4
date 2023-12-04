package com.weblab.web_lab4_pushable.controllers;

import com.weblab.web_lab4_pushable.database.PointEntity;
import com.weblab.web_lab4_pushable.models.Coordinates;
import com.weblab.web_lab4_pushable.models.Point;
import com.weblab.web_lab4_pushable.services.PointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/points")
public class DBPointsController {

    private final PointService pointService;

    @Autowired
    public DBPointsController(PointService pointService){
        this.pointService = pointService;
    }

    @GetMapping
    public ResponseEntity<List<PointEntity>> getAllPoints(@RequestParam String username){
        List<PointEntity> points = pointService.getAllPoints(username);
        return ResponseEntity.ok(points);
    }

    @PostMapping("/check")
    public ResponseEntity<Point> checkPoint(@RequestBody Coordinates coordinates){
        Point point = pointService.checkPoint(coordinates);
        return ResponseEntity.ok(point);
    }


    @PostMapping("/r-value")
    public ResponseEntity<Void> updateAllR(@RequestBody Map<String, Object> body) {
        Object rValueObj = body.get("currentRVal");
        double currentRVal = parseDouble(rValueObj);

        String username = (String) body.get("username");
        pointService.updateRValues(currentRVal, username);
        return ResponseEntity.ok().build();
    }


    private double parseDouble(Object rValueObj) {
        if (rValueObj instanceof Number) {
            if (((Number) rValueObj).doubleValue() > 0) {
                return ((Number) rValueObj).doubleValue();
            } else{
                throw new NumberFormatException("Invalid R value format");
            }
        } else if (rValueObj instanceof String) {
            return Double.parseDouble((String) rValueObj);
        } else {
            throw new NumberFormatException("Invalid R value format");
        }
    }


    @DeleteMapping
    public ResponseEntity<List<PointEntity>> clearPoints(@RequestParam String username){
       pointService.clearPoints(username);
       return ResponseEntity.ok().build();
    }

}
