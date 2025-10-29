package com.example.evaluacion2.model;

import jakarta.persistence.*;

@Entity
@Table(name = "variacion")
public class Variacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVariacion;

    private String nombre;
    private String descripcion;
    private Double incrementoPrecio;

    public Long getIdVariacion() { return idVariacion; }
    public void setIdVariacion(Long idVariacion) { this.idVariacion = idVariacion; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Double getIncrementoPrecio() { return incrementoPrecio; }
    public void setIncrementoPrecio(Double incrementoPrecio) { this.incrementoPrecio = incrementoPrecio; }
}

