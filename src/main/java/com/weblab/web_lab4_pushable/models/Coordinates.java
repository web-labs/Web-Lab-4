package com.weblab.web_lab4_pushable.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Coordinates {
    private Double x;
    private Double y;
    private Double r;
    private String username;

    public Coordinates() {}

//    public Coordinates(Double x, Double y, Double r, String username) {
//        this.x = x;
//        this.y = y;
//        this.r = r;
//        this.username = username;
//    }
}
