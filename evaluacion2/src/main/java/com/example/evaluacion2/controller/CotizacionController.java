package com.example.evaluacion2.controller;

import com.example.evaluacion2.model.Cotizacion;
import com.example.evaluacion2.model.DetalleCotizacion;
import com.example.evaluacion2.repository.CotizacionRepository;
import com.example.evaluacion2.repository.MuebleRepository;
import com.example.evaluacion2.repository.VariacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cotizaciones")
public class CotizacionController {

    @Autowired
    private CotizacionRepository cotizacionRepository;

    @Autowired
    private MuebleRepository muebleRepository;

    @Autowired
    private VariacionRepository variacionRepository;

    // 🔹 Crear nueva cotización
    @PostMapping
    public Cotizacion crearCotizacion(@RequestBody Cotizacion cotizacion) {
        double total = 0.0;

        for (DetalleCotizacion detalle : cotizacion.getDetalles()) {
            detalle.setCotizacion(cotizacion);
            detalle.setMueble(muebleRepository.findById(detalle.getMueble().getIdMueble()).orElseThrow());
            detalle.setVariacion(variacionRepository.findById(detalle.getVariacion().getIdVariacion()).orElseThrow());

            detalle.calcularSubtotal();
            total += detalle.getSubtotal();
        }

        cotizacion.setTotal(total);
        return cotizacionRepository.save(cotizacion);
    }

    // 🔹 Listar todas las cotizaciones
    @GetMapping
    public List<Cotizacion> listarCotizaciones() {
        return cotizacionRepository.findAll();
    }

    // 🔹 Buscar cotización por ID
    @GetMapping("/{id}")
    public Cotizacion obtenerPorId(@PathVariable Long id) {
        return cotizacionRepository.findById(id).orElseThrow();
    }
}

