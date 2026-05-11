package com.ec.cafe.controller;

import com.ec.cafe.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path = "/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping(path = "/details")
    public ResponseEntity<Map<String, Object>> getCount(){

        try {

            return dashboardService.getCount();

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return new ResponseEntity<>(new HashMap<>(), HttpStatus.OK);
    }
}
