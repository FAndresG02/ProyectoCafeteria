package com.ec.cafe.service;

import com.ec.cafe.repository.CategoryRepository;
import com.ec.cafe.repository.FacturaRepository;
import com.ec.cafe.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FacturaRepository facturaRepository;

    public ResponseEntity<Map<String, Object>> getCount(){


        try {

            Map<String, Object> map = new HashMap<>();
            map.put("categoria: ", categoryRepository.count());
            map.put("producto: ", productRepository.count());
            map.put("factura: ", facturaRepository.count());

            return new ResponseEntity<>(map, HttpStatus.OK);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return new ResponseEntity<>(new HashMap<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
