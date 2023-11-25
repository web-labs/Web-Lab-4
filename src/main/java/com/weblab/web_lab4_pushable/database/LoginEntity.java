package com.weblab.web_lab4_pushable.database;

import lombok.Getter;

@Getter
public class LoginEntity {

    private String login;
    private String password;

    public void setLogin(String login) {
        this.login = login;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
