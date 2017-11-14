<?php

    declare(strict_types=1);

    require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . "src" . DIRECTORY_SEPARATOR . "configuration.php";

    \Sumidero\Utils::setAppDefaults();

    echo "Sumidero installer" . PHP_EOL;

    new \Sumidero\Installer();

?>