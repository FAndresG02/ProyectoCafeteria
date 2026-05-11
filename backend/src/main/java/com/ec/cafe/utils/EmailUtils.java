package com.ec.cafe.utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // Indica que esta clase es un servicio gestionado por Spring
//Calse que se utiliza para gestionar
public class EmailUtils {

    @Autowired
    private JavaMailSender javaMailSender;
    // Objeto de Spring que permite enviar correos usando la configuración SMTP del application.properties

    public void sendSimpleMessage(String to, String subject, String text, List<String> list){
        // Método que envía un correo simple

        SimpleMailMessage message = new SimpleMailMessage();
        // Crea un objeto de correo simple (sin HTML)

        message.setFrom("frankandres002@gmail.com");
        // Dirección de correo desde donde se envía el mensaje

        message.setTo(to);
        // Destinatario principal del correo

        message.setSubject(subject);
        // Asunto del correo

        message.setText(text);
        // Contenido o cuerpo del correo

        // Verifica si existe una lista de correos para enviar copia (CC)
        if (list != null && list.size() >0){

            message.setCc(getCcArray(list));
            // Convierte la lista de correos en un arreglo para agregar CC

            javaMailSender.send(message);
            // Envía el correo usando el servidor SMTP configurado
        }
    }

    private String[] getCcArray(List<String> cclist){
        // Metodo que convierte una lista de correos en un arreglo de Strings

        String[] cc = new String[cclist.size()];
        // Crea un arreglo del mismo tamaño que la lista

        for (int i=0; i<cclist.size(); i++){
            cc[i] = cclist.get(i);
            // Copia cada correo de la lista al arreglo
        }

        return cc;
        // Devuelve el arreglo de correos para usarlo en setCc()
    }

    //Metodo de Olvidé mi correo electrónico
    //to = remitente, subject = recibe, password = contraseña
    //lanza un MessagingException que Construye una MessagingException sin ningún mensaje detallado.
    public void forgotEmail(String to, String subject, String password) throws MessagingException{

        //Crear un objeto MimeMessage usando javaMailSender para construir un correo electrónico.
        MimeMessage mimeMessage = javaMailSender.createMimeMessage(); // crear el correo

        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true); // helper para construir el email

        helper.setFrom("frankandres002@gmail.com"); // correo que envía el mensaje
        helper.setTo(to); // destinatario
        helper.setSubject(subject); // asunto del correo

        // mensaje HTML del correo
        String htmlMsg = "<p><b>Sus datos de acceso para el sistema de gestión de la cafetería</b><br>"
                + "<b>Email: </b>" + to
                + "<br><b>Password: </b>" + password
                + "<br><a href=\"http://localhost:4200/\">Click here to login</a></p>";

        // indicar que el contenido es HTML
        helper.setText(htmlMsg, true);

        // enviar correo
        javaMailSender.send(mimeMessage);
    }

}