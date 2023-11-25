package com.weblab.web_lab4_pushable.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Point extends Coordinates{
    private boolean result;

    public Point() {
        super();
    }

//    public Point(Double x, Double y, Double r, String username, boolean result) {
//        super(x, y, r, username);
//        this.result = result;
//    }

}
