-- =========================================================
-- Script de creación de base de datos y tablas
-- Proyecto: Sistema de Gestión de Clientes
-- Base de datos: clientes_db
-- =========================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS clientes_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

-- Usar la base de datos
USE clientes_db;

-- =========================================================
-- Tabla: clientes
-- Descripción: Almacena la información de clientes
-- =========================================================
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `razon_social` varchar(100) NOT NULL,
  `tipo_persona` enum('FISICA','MORAL') NOT NULL,
  `rfc` varchar(13) NOT NULL,
  `representante_legal` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `documento` text,
  `fecha_alta` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rfc` (`rfc`),
  UNIQUE KEY `idx_rfc_unique` (`rfc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================================================
-- Tabla: usuarios
-- Descripción: Almacena usuarios del sistema
-- =========================================================
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

