<?php

    declare(strict_types=1);

    require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    echo "Sumidero installer" . PHP_EOL;

    $settings = require dirname(__DIR__) . DIRECTORY_SEPARATOR . "src" . DIRECTORY_SEPARATOR . "AppSettings.php";

    $app = (new \Sumidero\App($settings))->get();

    $actualVersion = 0;
    $v = new \Sumidero\Database\Version(new \Sumidero\Database\DB());
    try {
        $actualVersion = $v->get();
    } catch (\Sumidero\Exception\NotFoundException $e) {
    } catch (\PDOException $e) {
    }
    if ($actualVersion == 0) {
        echo "Creating database...";
        $v->install();
        echo "ok!" , PHP_EOL;
        $actualVersion = 1.00;
    }
    echo sprintf("Upgrading database from version %.2f%s", $actualVersion, PHP_EOL);
    $result = $v->upgrade();
    if (count($result["successVersions"]) > 0 || count($result["failedVersions"]) > 0) {
        foreach($result["successVersions"] as $v) {
            echo sprintf(" upgrading version to: %.2f: ok!%s", $v, PHP_EOL);
        }
        foreach($result["failedVersions"] as $v) {
            echo sprintf(" upgrading version to: %.2f: error!%s", $v, PHP_EOL);
        }
    } else {
        echo "No database upgrade required" . PHP_EOL;
    }

?>