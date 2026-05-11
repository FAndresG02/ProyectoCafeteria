export class GlobalConstants {

    //Messages
    public static genericErrorMessage: string = "Algo salió mal. Por favor, inténtalo de nuevo más tarde.";
    public static unauthorizedMessage: string = "No estás autorizado para realizar esta acción.";
    public static forbiddenMessage: string = "No tienes permiso para acceder a este recurso.";
    public static notFoundMessage: string = "El recurso solicitado no fue encontrado.";
    public static validationErrorMessage: string = "La validación falló. Por favor, revisa tus datos e inténtalo de nuevo.";
    public static productExistError: string = "El producto ya existe. Por favor, elige un nombre diferente.";
    public static productAdd: string = "Producto agregado exitosamente.";

    //Regex

    public static nameRegex: RegExp = /[a-zA-Z0-9 ]*/;
    public static phoneRegex: RegExp = /^\+?[1-9]\d{1,14}$/;
    public static passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    public static emailRegex: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-zA-Z]{2,}$/;
    public static contactNumberRegex: RegExp = /^[0-9]{10}$/;

    public static error: string = "Error";


}