package com.example.evaluacion2.controller;

import com.example.evaluacion2.model.Mueble;
import com.example.evaluacion2.repository.MuebleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/muebles")
public class MuebleController {

    @Autowired
    private MuebleRepository muebleRepository;

    // 1️⃣ Listar todos los muebles
    @GetMapping
    public List<Mueble> listarMuebles() {
        return muebleRepository.findAll();
    }

    // 2️⃣ Buscar un mueble por ID
    @GetMapping("/{id}")
    public Optional<Mueble> obtenerMueble(@PathVariable Long id) {
        return muebleRepository.findById(id);
    }

    // 3️⃣ Crear un nuevo mueble
    @PostMapping
    public Mueble crearMueble(@RequestBody Mueble mueble) {
        return muebleRepository.save(mueble);
    }

    // 4️⃣ Actualizar un mueble existente
    @PutMapping("/{id}")
    public Mueble actualizarMueble(@PathVariable Long id, @RequestBody Mueble datos) {
        return muebleRepository.findById(id)
                .map(mueble -> {
                    mueble.setNombre(datos.getNombre());
                    mueble.setTipo(datos.getTipo());
                    mueble.setPrecioBase(datos.getPrecioBase());
                    mueble.setStock(datos.getStock());
                    mueble.setEstado(datos.getEstado());
                    mueble.setTamano(datos.getTamano());
                    mueble.setMaterial(datos.getMaterial());
                    return muebleRepository.save(mueble);
                })
                .orElseGet(() -> {
                    datos.setIdMueble(id);
                    return muebleRepository.save(datos);
                });
    }

    // 5️⃣ Desactivar (cambiar estado a inactivo)
    @PutMapping("/desactivar/{id}")
    public Mueble desactivarMueble(@PathVariable Long id) {
        Mueble mueble = muebleRepository.findById(id).orElseThrow();
        mueble.setEstado(Mueble.Estado.inactivo);
        return muebleRepository.save(mueble);
    }

    // 6️⃣ Eliminar mueble definitivamente
    @DeleteMapping("/{id}")
    public void eliminarMueble(@PathVariable Long id) {
        muebleRepository.deleteById(id);
    }
}
