# QuestVault 🛡️

> **Companion App offline-first para jugadores de D&D 5e (SRD 5.2)**
> *Construido con arquitectura moderna, tipado estricto y UX de videojuego.*

![Project Status](https://img.shields.io/badge/Status-MVP%20Complete-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Vite%20%7C%20Zustand-orange)

## 🚀 Características (MVP)

### 🧙‍♂️ Creador de Personajes (Wizard)
- **Flujo Guiado:** Especie -> Trasfondo -> Clase -> Atributos.
- **Reglas SRD 5.2:** Implementación estricta de reglas (Bonos de Atributo por Trasfondo, no por Raza).
- **Sistema Point Buy:** Validador matemático de compra de puntos (27 puntos, tope 15).
- **Cálculo Automático:** HP, AC y Modificadores calculados en tiempo real.

### 📜 Hoja de Personaje Interactiva
- **Persistencia Local:** Base de datos `IndexedDB` (vía Dexie.js) para guardar múltiples héroes.
- **Gestión de Salud:** Barra de HP animada con controles rápidos de daño/cura.
- **Dice Roller 3D (Simulado):** Motor de tiradas con animaciones, detección de Críticos/Pifias y desglose matemático.
- **Dashboard:** Panel de control para gestionar tu roster de personajes.

## 🛠️ Stack Tecnológico

* **Core:** React 18 + Vite
* **Lenguaje:** TypeScript (Strict Mode)
* **Estilos:** Tailwind CSS (Mobile First)
* **Estado:** Zustand (con Persistencia en LocalStorage para borradores)
* **Base de Datos:** Dexie.js (IndexedDB Wrapper)
* **Iconos:** Lucide React
* **Build Mobile:** Capacitor (Listo para configuración nativa)

## 📦 Instalación y Uso

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/Joselito-informatico/quest-vault.git](https://github.com/Joselito-informatico/quest-vault.git)
    cd quest-vault
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```

## 🗺️ Roadmap

- [x] Motor de Reglas Core (Stats, Razas, Clases)
- [x] Base de Datos Local
- [x] Lanzador de Dados
- [ ] **Fase 2:** Inventario y Gestión de Peso
- [ ] **Fase 3:** Grimorio de Hechizos (Filtros por Nivel/Clase)
- [ ] **Fase 4:** Exportar a PDF / JSON
- [ ] **Fase 5:** PWA Install & Deploy

## ⚖️ Legal

This work includes material from the System Reference Document 5.2.1 ("SRD 5.2.1") by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License.

---
*Desarrollado con pasión y código limpio.*