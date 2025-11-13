package com.example.evaluacion2.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "detalle_cotizacion")
public class DetalleCotizacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDetalle;

    @ManyToOne
    @JoinColumn(name = "id_cotizacion")
    @JsonBackReference
    private Cotizacion cotizacion;

    @ManyToOne
    @JoinColumn(name = "id_mueble")
    private Mueble mueble;

    @ManyToOne
    @JoinColumn(name = "id_variacion")
    private Variacion variacion;

    private Integer cantidad;

    @Column(name = "precio_unitario")
    private Double precioUnitario;

    private Double subtotal;

    // Método para calcular el subtotal correctamente
    public void calcularSubtotal() {
        double precioFinal = mueble.getPrecioBase();
        if (variacion != null) {
            precioFinal += variacion.getIncrementoPrecio();
        }
        precioUnitario = precioFinal; // guarda el precio del producto con su variación
        subtotal = precioFinal * cantidad;
    }

    // Getters y setters
    public Long getIdDetalle() { return idDetalle; }
    public void setIdDetalle(Long idDetalle) { this.idDetalle = idDetalle; }

    public Cotizacion getCotizacion() { return cotizacion; }
    public void setCotizacion(Cotizacion cotizacion) { this.cotizacion = cotizacion; }

    public Mueble getMueble() { return mueble; }
    public void setMueble(Mueble mueble) { this.mueble = mueble; }

    public Variacion getVariacion() { return variacion; }
    public void setVariacion(Variacion variacion) { this.variacion = variacion; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
}
