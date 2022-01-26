/**
 * Crea el objeto XMLHttpRequest para hacer la petición de login a php
 * @returns 
 */
function crearAjax() {
    var xobject = null;
    if (window.XMLHttpRequest)
        xobject = new XMLHttpRequest();
    else if (window.ActiveXObject) {
        xobject = new ActiveXObject("Microsoft.XMLHTTP");
        if (!xobject)
            xobject = new ActiveXObject("Msxml12.XMLHTTP");
    }
    return xobject;
}
/**
 * Funcion que recibe los datos de la petición Ajax
 * @param {*} data 
 * @returns 
 */
function recogerDatos(data) {
    let object = JSON.parse(data); //Datos de verificacion formato {"validacion":true|false}';
    if (object["validacion"]) {
        localStorage.setItem("userData", object);
        setValidated();
        storageData = localStorage.getItem("currentDeck");//En un futuro con mas de un usuario se recogeria de usuario/deck en lugar de directamente deck
        currentDeck = new Deck();
        currentDeck.deserialize(storageData);
        try {
            loadHome();
        } catch (error) {
            
        }
        try {
            loadDetail();
        } catch (error) {
            
        }
    } else {
        document.getElementById("loginerror").classList.remove("d-none");
    }
    return object;
}
/**
 * Funcion que realiza la petición Ajax al php por GET
 */
function loginAjax() {
    let xobject = crearAjax();
    xobject.onreadystatechange = function () {
        if ((xobject.readyState == 4) && (xobject.status == 200)) {
            recogerDatos(this.responseText)
        }
    };
    let username = document.getElementById("in_username").value;//Recogemos usuario y contraseña
    let password = document.getElementById("in_password").value;
    let url = "assets/php/login.php";//Url destino
    let params = "user=" + username + "&password=" + password;//Generamos parámetros para peticion GET
    xobject.open("GET", url + "?" + params, true);//Hacemos peticion con url y parametros
    xobject.send(null);
    /*var formData = new FormData();
    formData.append("usuario", username);
    formData.append("contraseña", password);
    xobject.open("POST", "ajax.php");
    xobject.send(formData);*/
}
/**
 * Funcion que cierra la sesión y elimina los datos
 */
function logout() {
    currentDeck = new Deck();
    localStorage.removeItem("userData");
    try {
        loadDeck();
    } catch (error) {
        
    }
    try {
        loadDetail();
    } catch (error) {
        
    }
    document.getElementById("logindropdown").classList.remove("d-none");
    document.getElementById("logoutdropdown").classList.add("d-none");
}
/**
 * Función que comprueba al recargar/entrar página si el usuario ya ha iniciado sesión
 */
function checkCookieLogin(){
    let userData = localStorage.getItem("userData")
    if (userData != null){
        setValidated();
        try {
            loadHome();
        } catch (error) {
            
        }
        try {
            loadDetail();
        } catch (error) {
            
        }
    }
}
/**
 * Funcion que intercambia los botones login/logout
 */
function setValidated() {
    document.getElementById("logindropdown").classList.add("d-none");
    document.getElementById("logoutdropdown").classList.remove("d-none");
}