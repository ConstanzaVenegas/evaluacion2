package com.example.evaluacion2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.evaluacion2.model.Mueble;

public interface MuebleRepository extends JpaRepository<Mueble, Long> {
}
