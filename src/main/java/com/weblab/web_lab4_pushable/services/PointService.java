package com.weblab.web_lab4_pushable.services;

import com.weblab.web_lab4_pushable.database.PointEntity;
import com.weblab.web_lab4_pushable.database.PointRepository;
import com.weblab.web_lab4_pushable.models.Coordinates;
import com.weblab.web_lab4_pushable.models.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class PointService {

    private final PointRepository pointRepository;

    boolean result;

    @Autowired
    public PointService(PointRepository pointRepository) {
        this.pointRepository = pointRepository;
    }

    public boolean checkIfHits(double x, double y, double r) {
        if (x <= 0 && y >= 0) {
            return (Math.pow(x, 2) + Math.pow(y, 2)) <= Math.pow(r, 2);
        } else if (x <= 0 && y <= 0) {
            return (x > -r) && (y > -r) && (y >= (-x - r));
        } else if (x >= 0 && y <= 0) {
            return (x <= r) && (y >= -r);
        } else {
            return false;
        }
    }

    public Point checkPoint(Coordinates coordinates){

        Point point = new Point();

        double x = coordinates.getX();
        double y = coordinates.getY();
        double r = coordinates.getR();


        point.setX(x);
        point.setY(y);
        point.setR(r);


        result = checkIfHits(x, y, r);

        PointEntity pointEntity = new PointEntity();
        pointEntity.setX(x);
        pointEntity.setY(y);
        pointEntity.setR(r);
        pointEntity.setResult(result);
        pointEntity.setUsername(coordinates.getUsername());
        pointRepository.save(pointEntity);

        return convertToDTO(pointEntity);
    }

    private Point convertToDTO(PointEntity pointEntity){
        Point point = new Point();
        point.setX(pointEntity.getX());
        point.setY(pointEntity.getY());
        point.setR(pointEntity.getR());
        point.setResult(pointEntity.getResult());
        return point;
    }

    public List<PointEntity> getAllPoints(String username){
        return pointRepository.findByUsername(username);
    }

    @Transactional
    public void clearPoints(String username){
        pointRepository.deleteAllByUsername(username);
    }

    public void updateRValues(double currentRVal, String username){
        List<PointEntity> points = getAllPoints(username);
        for (PointEntity point : points){
            point.setR(currentRVal);
            point.setResult(checkIfHits(point.getX(), point.getY(), currentRVal));
            pointRepository.save(point);
        }

    }

}
