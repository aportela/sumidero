<?php
    declare(strict_types=1);

    return [
        'settings' => [
            'displayErrorDetails' => true, // set to false in production
            'addContentLengthHeader' => false, // Allow the web server to send the content-length header
            'twigParams' => [
                'siteUrl' => "http://localhost",
                'production' => false,
                'localVendorAssets' => true, // use local vendor assets (vs remote cdn)
                'foolsJokeDate' => ((new \Datetime())->format('m-d') == "12-28" || (new \Datetime())->format('m-d') == "04-01") // heh heh
            ],
            'phpRequiredExtensions' => array('pdo_sqlite', 'mbstring', 'curl'),
            'common' => [
                'defaultResultsPage' => 32,
                'allowSignUp' => true
            ],
            // database settings
            'database' => [
                'type' => "PDO_SQLITE", // supported types: PDO_SQLITE | PDO_MARIADB
                'name' => "sumidero",
                'username' => '',
                'password' => '',
                'host' => 'localhost',
                'port' => 3306,
            ],
            // Renderer settings
            'renderer' => [
                'template_path' => __DIR__ . '/../templates',
            ],
            // Monolog settings
            'logger' => [
                'name' => 'sumidero-app',
                'path' => isset($_ENV['docker']) ? 'php://stdout' : __DIR__ . '/../logs/default.log',
                'level' => \Monolog\Logger::DEBUG
            ],
            'databaseLogger' => [
                'name' => 'sumidero-db',
                'path' => isset($_ENV['docker']) ? 'php://stdout' : __DIR__ . '/../logs/database.log',
                'level' => \Monolog\Logger::DEBUG
            ],
            'apiLogger' => [
                'name' => 'sumidero-api',
                'path' => isset($_ENV['docker']) ? 'php://stdout' : __DIR__ . '/../logs/api.log',
                'level' => \Monolog\Logger::DEBUG
            ]
        ],
    ];
?>