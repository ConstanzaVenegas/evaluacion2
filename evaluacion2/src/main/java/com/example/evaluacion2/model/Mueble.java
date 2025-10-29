package com.example.evaluacion2.model;

import jakarta.persistence.*;

@Entity
@Table(name = "mueble")
public class Mueble {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMueble;

    private String nombre;
    private String tipo;

    @Column(name = "precio_base")
    private Double precioBase;

    private Integer stock;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    @Enumerated(EnumType.STRING)
    private Tamano tamano;

    private String material;

    
    public enum Estado { activo, inactivo }
    public enum Tamano { Grande, Mediano, Pequeño }

    public Long getIdMueble() { return idMueble; }
    public void setIdMueble(Long idMueble) { this.idMueble = idMueble; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Double getPrecioBase() { return precioBase; }
    public void setPrecioBase(Double precioBase) { this.precioBase = precioBase; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }

    public Tamano getTamano() { return tamano; }
    public void setTamano(Tamano tamano) { this.tamano = tamano; }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
}
