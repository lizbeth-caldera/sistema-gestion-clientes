-- ============================================================
-- Stored Procedures - Sistema de Gestión de Clientes
-- Base de datos objetivo: clientes_db
-- Lizbeth Rivas Caldera
-- ============================================================



-- ============================================================
-- alta_cliente
-- Inserta un cliente nuevo verificando  RFC
-- ============================================================
DROP PROCEDURE IF EXISTS alta_cliente
CREATE PROCEDURE alta_cliente(
    IN p_razon_social   VARCHAR(100),
    IN p_tipo_persona   VARCHAR(10),
    IN p_rfc            VARCHAR(13),
    IN p_representante  VARCHAR(100),
    IN p_email          VARCHAR(100),
    IN p_telefono       VARCHAR(20),
    IN p_documento      TEXT
)
BEGIN
  -- Normaliza RFC para evitar duplicados por mayúsculas/minúsculas
  SET p_rfc = UPPER(TRIM(p_rfc));

  -- Verificacion de RFC
  IF EXISTS (SELECT 1 FROM clientes WHERE rfc = p_rfc) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'RFC duplicado';
  END IF;

  INSERT INTO clientes (
      razon_social, tipo_persona, rfc,
      representante_legal, email, telefono, documento
  )
  VALUES (
      p_razon_social, p_tipo_persona, p_rfc,
      p_representante, p_email, p_telefono, p_documento
  );
END
 
-- ============================================================
-- editar_cliente
-- Actualiza datos, valida duplicado de RFC contra otros IDs
-- ============================================================
DROP PROCEDURE IF EXISTS editar_cliente
CREATE PROCEDURE editar_cliente(
    IN p_id             INT,
    IN p_razon_social   VARCHAR(100),
    IN p_tipo_persona   VARCHAR(10),
    IN p_rfc            VARCHAR(13),
    IN p_representante  VARCHAR(100),
    IN p_email          VARCHAR(100),
    IN p_telefono       VARCHAR(20),
    IN p_documento      TEXT
)
BEGIN
  SET p_rfc = UPPER(TRIM(p_rfc));

  IF EXISTS (SELECT 1 FROM clientes WHERE rfc = p_rfc AND id <> p_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'RFC duplicado';
  END IF;

  UPDATE clientes
     SET razon_social        = p_razon_social,
         tipo_persona        = p_tipo_persona,
         rfc                 = p_rfc,
         representante_legal = p_representante,
         email               = p_email,
         telefono            = p_telefono,
         documento           = p_documento
   WHERE id = p_id;
END

-- ============================================================
-- eliminar_cliente
-- Elimina por ID 
-- ============================================================
DROP PROCEDURE IF EXISTS eliminar_cliente
CREATE PROCEDURE eliminar_cliente(IN p_id INT)
BEGIN
  DELETE FROM clientes WHERE id = p_id;
END

-- ============================================================
-- listar_clientes
-- Devuelve todos los clientes
-- ============================================================
DROP PROCEDURE IF EXISTS listar_clientes
CREATE PROCEDURE listar_clientes()
BEGIN
  SELECT * FROM clientes;
END

-- ============================================================
-- obtener_cliente
-- Devuelve un cliente por ID
-- ============================================================
DROP PROCEDURE IF EXISTS obtener_cliente
CREATE PROCEDURE obtener_cliente(IN p_id INT)
BEGIN
  SELECT * FROM clientes WHERE id = p_id;
END


