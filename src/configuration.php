<?php

    declare(strict_types = 1);

    namespace Sumidero;

    define("DEBUG", true);

    define("PDO_TYPE", "sqlite3");
    define("SQLITE_DATABASE_PATH", dirname(__DIR__) . DIRECTORY_SEPARATOR . "data" . DIRECTORY_SEPARATOR . "sumidero.sqlite3");
    define("PDO_USERNAME", "");
    define("PDO_PASSWORD", "");
    define("PDO_CONNECTION_STRING", sprintf("sqlite:%s", SQLITE_DATABASE_PATH));

?>