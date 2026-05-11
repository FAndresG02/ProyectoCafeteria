package com.ec.cafe.service;

import com.ec.cafe.config.CafeConstants;
import com.ec.cafe.entity.FacturaEntity;
import com.ec.cafe.repository.FacturaRepository;
import com.ec.cafe.security.JwtAuthenticationFilter;
import com.ec.cafe.utils.CafeUtils;
import com.itextpdf.text.*;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.io.IOUtils;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

@Slf4j
@Service
public class FacturaService {

    @Autowired
    FacturaRepository facturaRepository;

    @Autowired
    JwtAuthenticationFilter jwtAuthenticationFilter;

    // Método que genera un reporte PDF de la factura a partir de los datos recibidos en el requestMap
    public ResponseEntity<String> generateReport(Map<String, Object> requestMap){

        // Log para indicar que inicia el proceso de generación del reporte
        log.info("Generando el reporte....");

        System.out.println("REQUEST MAP: " + requestMap);

        try {

            // Variable para almacenar el nombre del archivo PDF
            String fileName;

            // Valida que el requestMap contenga todos los datos necesarios para generar la factura
            if (validateRequestMap(requestMap)){

                // Verifica si se solicita reutilizar un PDF existente en lugar de generar uno nuevo
                if (requestMap.containsKey("isGenerate") && !(Boolean) requestMap.get("isGenerate")){
                    // Usa el UUID existente como nombre del archivo
                    fileName = (String) requestMap.get("uuid");

                }else {
                    // Genera un nuevo UUID para el archivo PDF
                    fileName = CafeUtils.getUUID();
                    // Guarda el UUID en el requestMap
                    requestMap.put("uuid", fileName);
                    // Inserta la factura en la base de datos
                    insertFactura(requestMap);
                }

                // Construye el texto con los datos del cliente que se mostrarán en el PDF
                String data = "Nombre: " + requestMap.get("name") + "\n" + "Número de contacto: " + requestMap.get("contactNumber") +
                        "\n" + "Email: " + requestMap.get("email") + "\n" + "Método de pago: " + requestMap.get("paymentMethod");

                // Crea un nuevo documento PDF
                Document document = new Document();

                // Crea el objeto File para la ruta donde se guardarán los PDFs
                File dir = new File(CafeConstants.STORE_LOCATION);
                // Verifica si la carpeta existe
                if (!dir.exists()) {
                    // Crea la carpeta si no existe
                    dir.mkdirs();
                }

                // Inicializa el escritor del PDF indicando la ruta y nombre del archivo
                PdfWriter.getInstance(document, new FileOutputStream(CafeConstants.STORE_LOCATION+"/"+fileName+".pdf"));

                // Abre el documento para empezar a escribir contenido
                document.open();

                // Dibuja un rectángulo borde en el documento PDF
                setRectangleInPdf(document);

                // Crea el título del documento con estilo de encabezado
                Paragraph chunk = new Paragraph("Sistema Café", getFontHeader("Header"));
                // Centra el título en el documento
                chunk.setAlignment(Element.ALIGN_CENTER);
                // Agrega el título al documento
                document.add(chunk);

                // Crea un párrafo con los datos del cliente
                Paragraph paragraph = new Paragraph(data + "\n \n", getFontHeader("Data"));
                // Agrega el párrafo al documento
                document.add(paragraph);

                // Crea una tabla con 5 columnas para los productos
                PdfPTable table = new PdfPTable(5);
                // Establece el ancho de la tabla al 100% del documento
                table.setWidthPercentage(100);

                // Agrega los encabezados de la tabla
                addTableHeader(table);

                // Convierte el JSON de productos (String) a JSONArray
                JSONArray jsonArray = CafeUtils.getJsonArrayFromString((String) requestMap.get("productDetails"));

                // Recorre cada producto del arreglo JSON
                for (int i =0; i<jsonArray.length(); i++){
                    // Convierte cada elemento a Map y lo agrega como fila en la tabla
                    addRows(table, CafeUtils.getMapFromJson(jsonArray.getString(i)));
                }

                // Agrega la tabla al documento PDF
                document.add(table);

                // Crea el pie de página con el total y mensaje final
                Paragraph footer = new Paragraph("Total: " + requestMap.get("totalAmount") + "\n" +
                        "Gracias por su visita", getFontHeader("Data"));
                // Agrega el pie de página al documento
                document.add(footer);

                // Cierra el documento para finalizar la escritura del PDF
                document.close();

                // Imprime en consola la ruta donde se guardó el archivo
                System.out.println("RUTA: " + CafeConstants.STORE_LOCATION);
                // Imprime en consola si la carpeta existe
                System.out.println("EXISTE: " + dir.exists());

                // Retorna el UUID del archivo generado en formato JSON con estado HTTP 200
                return new ResponseEntity<>("{\"uuid\":\"" + fileName + "\"}", HttpStatus.OK);

            }else {
                // Retorna error 400 si los datos del request son inválidos
                return CafeUtils.getResponseEntity("Información invalida", HttpStatus.BAD_REQUEST);
            }

        }catch (Exception e){
            // Imprime el mensaje de error en consola
            System.out.println(e.getMessage());
            // Imprime el stacktrace completo del error
            e.printStackTrace();
        }

        // Retorna error 500 si ocurre una excepción inesperada
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Método que agrega una fila de datos de producto a la tabla del PDF
    private void addRows(PdfPTable table, Map<String, Object> data) {

        // Log para indicar que se está agregando una fila a la tabla
        log.info("Inside addRows");

        // Agrega el nombre del producto como celda en la tabla
        table.addCell((String) data.get("name"));

        // Agrega la categoría del producto como celda en la tabla
        table.addCell((String) data.get("category"));

        // Agrega la cantidad del producto como celda en la tabla
        table.addCell((String) data.get("quantity"));

        // Agrega el precio del producto convertido a String como celda en la tabla
        table.addCell(data.get("price").toString());

        // Agrega el total del producto convertido a String como celda en la tabla
        table.addCell(data.get("total").toString());
    }

    // Método que agrega los encabezados de la tabla de productos en el PDF
    private void addTableHeader(PdfPTable table) {

        // Log para indicar que se están creando los encabezados de la tabla
        log.info("Inside addTableHeader");

        // Recorre cada título de columna para crear las celdas del encabezado
        Stream.of("Name", "Category", "Quantity", "Price", "Sub Total")
                .forEach(columnTitle -> {

                    // Crea una nueva celda para el encabezado
                    PdfPCell header = new PdfPCell();

                    // Establece un color de fondo inicial para la celda
                    header.setBackgroundColor(BaseColor.LIGHT_GRAY);

                    // Define el grosor del borde de la celda
                    header.setBorderWidth(2);

                    // Asigna el texto del encabezado a la celda
                    header.setPhrase(new Phrase(columnTitle));

                    // Sobrescribe el color de fondo de la celda a amarillo
                    header.setBackgroundColor(BaseColor.YELLOW);

                    // Alinea el texto horizontalmente al centro
                    header.setHorizontalAlignment(Element.ALIGN_CENTER);

                    // Alinea el texto verticalmente al centro
                    header.setVerticalAlignment(Element.ALIGN_CENTER);

                    // Agrega la celda del encabezado a la tabla
                    table.addCell(header);
                });
    }

    // Método que devuelve diferentes estilos de fuente dependiendo del tipo solicitado
    private Font getFontHeader(String type) {

        // Log para indicar que se está seleccionando un tipo de fuente
        log.info("Inside getFontHeader");

        // Evalúa el tipo de fuente solicitado
        switch (type){

            // Caso para encabezados principales
            case "Header":

                // Crea una fuente Helvetica en negrita y cursiva con tamaño 18
                Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLDOBLIQUE, 18, BaseColor.BLACK);

                // Aplica estilo negrita adicional a la fuente
                headerFont.setStyle(Font.BOLD);

                // Retorna la fuente de encabezado
                return headerFont;

            // Caso para datos o contenido normal
            case "Data":

                // Crea una fuente Times New Roman con tamaño 11
                Font dataFont = FontFactory.getFont(FontFactory.TIMES_ROMAN, 11, BaseColor.BLACK);

                // Aplica estilo negrita a la fuente
                dataFont.setStyle(Font.BOLD);

                // Retorna la fuente de datos
                return dataFont;

            // Caso por defecto si no coincide ningún tipo
            default:

                // Retorna una fuente por defecto sin configuración especial
                return new Font();
        }
    }

    // Método que valida que el requestMap contenga todas las claves necesarias para generar la factura
    private boolean validateRequestMap(Map<String, Object> requestMap) {

        // Retorna true si existen todas las claves requeridas, false si falta alguna
        return requestMap.containsKey("name") &&
                requestMap.containsKey("contactNumber") &&
                requestMap.containsKey("email") &&
                requestMap.containsKey("paymentMethod") &&
                requestMap.containsKey("productDetails") &&
                requestMap.containsKey("totalAmount");
    }

    // Método que crea y guarda una factura en la base de datos a partir de los datos del requestMap
    private void insertFactura(Map<String, Object> requestMap) {

        try {

            // Crea una nueva instancia de la entidad Factura
            FacturaEntity facturaEntity = new FacturaEntity();

            // Asigna el UUID de la factura
            facturaEntity.setUuid((String) requestMap.get("uuid"));

            // Asigna el nombre del cliente
            facturaEntity.setName((String) requestMap.get("name"));

            // Asigna el email del cliente
            facturaEntity.setEmail((String) requestMap.get("email"));

            // Asigna el número de contacto del cliente
            facturaEntity.setContactNumber((String) requestMap.get("contactNumber"));

            // Asigna el método de pago
            facturaEntity.setPaymentMethod((String) requestMap.get("paymentMethod"));

            // Convierte y asigna el total de la factura como entero
            facturaEntity.setTotal(Integer.parseInt(requestMap.get("totalAmount").toString()));

            // Asigna los detalles de productos en formato JSON como String
            facturaEntity.setProductDetail((String) requestMap.get("productDetails"));

            // Asigna el usuario que creó la factura desde el JWT
            facturaEntity.setCreateBy(jwtAuthenticationFilter.getCurrentUser());

            // Guarda la factura en la base de datos
            facturaRepository.save(facturaEntity);

        }catch (Exception e){

            // Imprime el mensaje de error en consola
            System.out.println(e.getMessage());

            // Imprime el stacktrace completo del error
            e.printStackTrace();
        }
    }

    // Método que dibuja un rectángulo como borde dentro del documento PDF
    private void setRectangleInPdf(Document document) throws DocumentException {

        // Log para indicar que se está agregando el rectángulo al PDF
        log.info("Inside setRectangleInPdf");

        // Crea un rectángulo con coordenadas específicas dentro del documento
        Rectangle rectangle = new Rectangle(577, 825, 18, 15);

        // Habilita el borde superior del rectángulo
        rectangle.enableBorderSide(1);

        // Habilita el borde inferior del rectángulo
        rectangle.enableBorderSide(2);

        // Habilita el borde izquierdo del rectángulo
        rectangle.enableBorderSide(4);

        // Habilita el borde derecho del rectángulo
        rectangle.enableBorderSide(8);

        // Establece el color del borde del rectángulo
        rectangle.setBorderColor(BaseColor.BLACK);

        // Define el grosor del borde del rectángulo
        rectangle.setBorderWidth(1);

        // Agrega el rectángulo al documento PDF
        document.add(rectangle);
    }

    //----------------------------------------------------------------------------------------------------------------

    //Metodo para obtener facturas
    public ResponseEntity<List<FacturaEntity>> getFacturas(){

        try {

            //Creamos una lista vacia para almacenar las facturas
            List<FacturaEntity> list = new ArrayList<>();

            if (jwtAuthenticationFilter.isAdmin()){
                // si somos admin obtnenmos todas la facturas que han sido creadas por usuarios con correo admin
                list = facturaRepository.getAllFacturas();
            }else {
                // si somos usuarios obtenemos solo las facturas creadas por usuarios con correos user
                list = facturaRepository.getAllFacturasUser(jwtAuthenticationFilter.getCurrentUser());
            }

            //devuelve la respuesta ya sea de usuario o admin
            return new ResponseEntity<>(list, HttpStatus.OK);

        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //--------------------------------------------------------------------------------------------------------------
    //Metodo para obtener el pdf
    //Método para obtener un PDF de una factura
    public ResponseEntity<byte[]> getPdf(Map<String, Object> requestMap){

        // Log de entrada para ver los datos recibidos
        log.info("Inside getPdf: requestMap {}", requestMap);

        try {

            // Verifica si el usuario autenticado es administrador
            if (jwtAuthenticationFilter.isAdmin() || jwtAuthenticationFilter.isUser()){

                // Arreglo de bytes donde se almacenará el contenido del PDF
                byte[] byteArray = new byte[0];

                // Validación:
                // “Si no hay uuid → esto no es getPdf”
                if (!requestMap.containsKey("uuid") && validateRequestMap(requestMap)){
                    return new ResponseEntity<>(byteArray, HttpStatus.BAD_REQUEST);
                }

                // Construcción de la ruta del archivo PDF
                // Ejemplo: /ruta/almacenamiento/12345.pdf
                String filePath = CafeConstants.STORE_LOCATION + "/" + (String) requestMap.get("uuid") + ".pdf";

                // Caso 1: El archivo PDF YA EXISTE en disco
                if (CafeUtils.ifFileExist(filePath)){

                    // Se lee el archivo desde disco y se convierte a bytes
                    byteArray = getByteArray(filePath);

                    // Se retorna el PDF existente
                    return new ResponseEntity<>(byteArray, HttpStatus.OK);

                } else {

                    // Caso 2: El archivo PDF NO EXISTE
                    // Se agrega una bandera al request indicando que se debe generar solo el pdf no se inserta
                    //en la bd solo lo recupera
                    requestMap.put("isGenerate", false);

                    // Se genera el PDF usando el metodo generateReport
                    generateReport(requestMap);

                    // Una vez generado, se vuelve a leer desde disco
                    byteArray = getByteArray(filePath);

                    // Se retorna el PDF recién generado
                    return new ResponseEntity<>(byteArray, HttpStatus.OK);
                }

            } else {
                // Usuario no autorizado
                return new ResponseEntity<>(new byte[0], HttpStatus.UNAUTHORIZED);
            }

        } catch (Exception e){
            // Manejo de errores
            e.printStackTrace();
        }

        // Error interno del servidor
        return new ResponseEntity<>(new byte[0], HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Ese método sirve para leer un archivo desde el disco y convertirlo en un arreglo de bytes (byte[]).
    //Es justo lo que se necesita, por ejemplo, para devolver un PDF en un endpoint.
    private byte[] getByteArray(String filePath) throws Exception{
        //Toma un archivo (por su ruta) y lo transforma en bytes para poder usarlo en memoria.
        //Crea una referencia al archivo en esa ruta.
        File initialFile = new File(filePath);
        //Abre el archivo como flujo de entrada (para leerlo).
        InputStream targetStream = new FileInputStream(initialFile);
        //Lee TODO el archivo y lo convierte en un byte[].
        //IOUtils (de Apache Commons IO) hace el trabajo pesado automáticamente.
        byte[] byteArray = IOUtils.toByteArray(targetStream);
        //Cierra el stream (muy importante para no consumir recursos).
        targetStream.close();
        //Devuelve el archivo en forma de bytes.
        return byteArray;
    }

    public ResponseEntity<String> deleteFactura(Integer id){

        try {

            if (jwtAuthenticationFilter.isAdmin()){

                Optional<FacturaEntity> facturaEntity = facturaRepository.findById(id);

                if (facturaEntity.isPresent()){

                    facturaRepository.deleteById(id);

                    return CafeUtils.getResponseEntity("Factura Eliminada", HttpStatus.OK);

                }else  {
                    return CafeUtils.getResponseEntity("Factura no encontrada", HttpStatus.NOT_FOUND);
                }
            }else  {
                return CafeUtils.getResponseEntity("No tienes Autorización", HttpStatus.UNAUTHORIZED);
            }


        }catch (Exception e){
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return new ResponseEntity<>(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
