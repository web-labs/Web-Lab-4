package com.weblab.web_lab4_pushable.database;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "points_lab4")
public class PointEntity {


    @Id
    @GeneratedValue
    private Long id;
    private Double x;

    private Double y;
    private Double r;

    private String username;
    private Boolean result;


}
