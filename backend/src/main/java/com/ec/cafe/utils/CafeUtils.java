package com.ec.cafe.utils;

import com.google.common.base.Strings;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.itextpdf.text.BaseColor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

//Es una clase utilitaria (helper) para devolver respuestas HTTP personalizadas desde tus controladores.
@Slf4j
public class CafeUtils {

    private CafeUtils(){

    }

    /**
     * Metodo utilitario que construye y devuelve un objeto ResponseEntity.
     *
     * Permite generar una respuesta HTTP personalizada enviando un mensaje
     * en formato JSON junto con un código de estado HTTP.
     *
     * public  -> Puede ser accedido desde cualquier clase.
     * static  -> No requiere instanciar la clase para utilizarlo.
     * ResponseEntity<String> -> Indica que el cuerpo de la respuesta será
     *                            un String e incluirá estado HTTP.
     *
     * Parámetros:
     * @param responseMessage Mensaje que se enviará al cliente dentro del
     *                        cuerpo de la respuesta en formato JSON.
     * @param httpStatus Código de estado HTTP que se devolverá
     *                   (ejemplo: HttpStatus.OK, HttpStatus.BAD_REQUEST, etc).
     *
     * Funcionamiento:
     * El metodo construye manualmente un String con formato JSON:
     * {"message":"valor_del_mensaje"}
     *
     * Luego lo encapsula dentro de un objeto ResponseEntity junto con
     * el código de estado HTTP proporcionado.
     *
     * @return ResponseEntity<String> que contiene el mensaje en formato JSON
     *         y el código HTTP indicado.
     */
    public static ResponseEntity<String> getResponseEntity(String responseMessage, HttpStatus httpStatus){
        return new ResponseEntity<>(
                "{\"message\":\""+responseMessage+"\"}",
                httpStatus
        );
    }

    //Genera un identificador único basado en el tiempo actual.
    public static String getUUID(){
        //Crea un objeto con la fecha y hora actual.
        Date date = new Date();
        //Obtiene el tiempo en milisegundos desde 1970 (Unix epoch).
        long time = date.getTime();
        //Devuelve un String como: Factura: 1710639123456
        return "Factura_" + time;
    }

    // Metodo estático que recibe un String en formato JSON y devuelve un JSONArray, puede lanzar una excepción si el formato es inválido
    public static JSONArray getJsonArrayFromString(String data) throws JSONException{

        // Crea un JSONArray a partir del String recibido, parseando el texto a una estructura JSON
        JSONArray jsonArray = new JSONArray(data);

        // Retorna el JSONArray ya convertido para su uso en el sistema
        return jsonArray;
    }

    // Metodo estático que convierte un String en formato JSON a un Map<String, Object>, devolviendo un mapa vacío si el String es nulo o vacío
    public static Map<String, Object> getMapFromJson(String data){

        // Verifica que el String no sea nulo ni esté vacío antes de intentar convertirlo
        if (!Strings.isNullOrEmpty(data)){

            // Convierte el JSON (String) a un Map<String, Object> usando la librería Gson y TypeToken para manejar genéricos
            return new Gson().fromJson(data, new TypeToken<Map<String, Object>>(){}.getType());
        }

        // Retorna un HashMap vacío en caso de que el String sea nulo o vacío
        return new HashMap<>();
    }

    //Metodo para verificar si existe un archivo
    public static Boolean ifFileExist(String path){
        log.info("Inside isFileExist {}", path);
        try {

            //Crea un objeto File apuntando a esa ruta (pero no crea el archivo, solo la referencia).
            File file = new File(path);

            //Operador ternario
            //file!= null verifica que file no sea nullo o vacio
            //file.exists() verifica si existe el archivo
            //devuelve true si se cumple y false si no se cumple
            return (file!= null && file.exists()) ? Boolean.TRUE: Boolean.FALSE;

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return false;
    }
}
