<?php
    if ($_GET['user'] == 'admin' && $_GET['password'] == 'admin'){//Validacion primitiva, se podria comprobar en BD o fichero
        $devuelve = '{"validacion":true,"user":"'.$_GET['user'].'"}';
    } else{
        $devuelve = '{"validacion":false}';
    }
    echo $devuelve;
?>