package com.weblab.web_lab4_pushable.database;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PointRepository extends JpaRepository<PointEntity, Long> {

    List<PointEntity> findByUsername(String username);

    void deleteAllByUsername(String username);

}
