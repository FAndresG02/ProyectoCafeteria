package com.ec.cafe.config;

/**
 * Clase de configuración que contiene constantes globales
 * utilizadas en la aplicación.
 *
 * Esta clase centraliza mensajes o valores fijos para evitar
 * repetir texto en diferentes partes del sistema.
 *
 * Uso recomendado:
 * En lugar de escribir el mensaje directamente en el código,
 * se debe referenciar la constante.
 *
 * Ejemplo:
 * cafeConfig.SOMETHING_WENT_WRONG
 *
 * Beneficios:
 * - Evita duplicación de texto.
 * - Facilita mantenimiento.
 * - Permite modificar el mensaje en un solo lugar.
 */
public class CafeConstants {

    /**
     * Mensaje genérico utilizado cuando ocurre un error inesperado
     * en la aplicación.
     */
    public static final String SOMETHING_WENT_WRONG = "Something Went Wrong.";

    public static final String DATA_INVALIDA = "Data Invalida.";

    public static final String UNAUTHORIZED_ACCESS = "Aceso no Authorizado";

    //Ruta en donde se guardan los pdf
    public static final String STORE_LOCATION = "/home/franklin/CarpetaPersonal/cafe-files";
}
