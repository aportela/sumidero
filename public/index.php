<?php

    declare(strict_types=1);

    ob_start();

    require __DIR__ . '/../vendor/autoload.php';

    session_name("SUMIDERO");
    session_start();

    $app = (new \Sumidero\App())->get();

    $app->run();

?>