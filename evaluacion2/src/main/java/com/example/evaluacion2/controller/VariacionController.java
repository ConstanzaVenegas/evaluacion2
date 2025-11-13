package com.example.evaluacion2.controller;

import com.example.evaluacion2.model.Variacion;
import com.example.evaluacion2.repository.VariacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/variaciones")
public class VariacionController {

    @Autowired
    private VariacionRepository variacionRepository;

    //  Listar todas las variaciones
    @GetMapping
    public List<Variacion> listarVariaciones() {
        return variacionRepository.findAll();
    }

    // Obtener una variación por ID
    @GetMapping("/{id}")
    public Optional<Variacion> obtenerVariacion(@PathVariable Long id) {
        return variacionRepository.findById(id);
    }

    // Crear una nueva variación
    @PostMapping
    public Variacion crearVariacion(@RequestBody Variacion variacion) {
        return variacionRepository.save(variacion);
    }

    // Actualizar una variación existente
    @PutMapping("/{id}")
    public Variacion actualizarVariacion(@PathVariable Long id, @RequestBody Variacion datos) {
        return variacionRepository.findById(id)
                .map(variacion -> {
                    variacion.setNombre(datos.getNombre());
                    variacion.setDescripcion(datos.getDescripcion());
                    variacion.setIncrementoPrecio(datos.getIncrementoPrecio());
                    return variacionRepository.save(variacion);
                })
                .orElseGet(() -> {
                    datos.setIdVariacion(id);
                    return variacionRepository.save(datos);
                });
    }

    // Eliminar una variación
    @DeleteMapping("/{id}")
    public void eliminarVariacion(@PathVariable Long id) {
        variacionRepository.deleteById(id);
    }
}
