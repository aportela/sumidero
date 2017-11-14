<?php
    declare(strict_types=1);

    namespace Sumidero;

    class Installer {

        private $installQueries = array(
            'CREATE TABLE [USER] (
                [id] VARCHAR(36) UNIQUE NOT NULL PRIMARY KEY,
                [email] VARCHAR(255) UNIQUE NOT NULL,
                [password_hash] VARCHAR(60) NOT NULL,
                [name] VARCHAR(64) UNIQUE NOT NULL,
                [full_name] VARCHAR(64) NOT NULL,
                [avatar_url] VARCHAR(2048)
            )',
            ' INSERT INTO USER VALUES ("87716d66-71ca-41eb-9e02-138e7e6cde6b", "foo@bar", "nothashed", "jdoe", "John doe", "https://www.bathroomreader.com/wp-content/uploads/2014/02/John-Doe_text.jpg"); ',
            'CREATE TABLE [POST] (
                [id] VARCHAR(36) UNIQUE NOT NULL PRIMARY KEY,
                [original_poster_id] [id] VARCHAR(36) NOT NULL,
                [creation_date] INTEGER NOT NULL,
                [title] VARCHAR(128) NOT NULL,
                [body] VARCHAR(384) NOT NULL,
                [permalink] VARCHAR(2048) UNIQUE NOT NULL,
                [domain] VARCHAR(64),
                [thumbnail] VARCHAR(2048),
                [external_url] VARCHAR(2048),
                [sub] VARCHAR(16),
                [votes] INTEGER NOT NULL DEFAULT 0,
                [comments] INTEGER NOT NULL DEFAULT 0
            )',
            'PRAGMA journal_mode=WAL'
        );

	    public function __construct () {
            $cmdLine = new \Sumidero\CmdLine("", array("install", "update", "email:", "password:"));
            $paramsFound = false;
            if ($cmdLine->hasParam("email") && $cmdLine->hasParam("password")) {
                $paramsFound = true;
                $this->setCredentials($cmdLine->getParamValue("email"), $cmdLine->getParamValue("password"));
            }
            if ($cmdLine->hasParam("install")) {
                $paramsFound = true;
                $this->install();
            } else if ($cmdLine->hasParam("update")) {
                $paramsFound = true;
                $this->update();
            }
            if (! $paramsFound) {
                echo "Invalid params, use --install or --update", PHP_EOL;
            }
        }

        public function __destruct() { }

        private function checkRequirements(): bool {
            $success = false;
            echo "Checking requirements...";
            if (! extension_loaded('pdo_sqlite')) {
                echo PHP_EOL . "Error: pdo_sqlite php extension not found " . PHP_EOL;
            } else if (! extension_loaded('mbstring')) {
                echo PHP_EOL . "Error: mbstring php extension not found " . PHP_EOL;
            } else if (! extension_loaded('curl')) {
                echo PHP_EOL . "Error: curl php extension not found " . PHP_EOL;
            } else if (! is_writable(dirname(SQLITE_DATABASE_PATH))) {
                echo PHP_EOL . "Error: no write permissions on database directory (" . dirname(SQLITE_DATABASE_PATH) . ")" . PHP_EOL;
            } else {
                echo "ok!" . PHP_EOL;
                $success = true;
            }
            return($success);
        }

        private function install() {
            echo "Starting install..." . PHP_EOL;
            if ($this->checkRequirements()) {
                if (! file_exists(SQLITE_DATABASE_PATH)) {
                    $this->createDatabase();
                } else {
                    echo "Already installed" . PHP_EOL;
                }
            }
        }

        private function createDatabase() {
            echo "Creating database...";
            $dbh = new \Sumidero\Database\DB();
            foreach($this->installQueries as $query) {
                $dbh->execute($query);
            }
            echo "ok!" . PHP_EOL;
        }

        private function update() {
            echo "TODO" . PHP_EOL;
            /*
            echo "Starting update..." . PHP_EOL;
            if ($this->checkRequirements()) {
                if (! file_exists(SQLITE_DATABASE_PATH)) {
                }
            }
            echo "ok!" . PHP_EOL;
            */
        }

        private function setCredentials(string $email, string $password) {
            echo "Setting account credentials...";
            (new \Sumidero\User($email))->setCredentials(new \Sumidero\Database\DB(), $password);
            echo "ok!" . PHP_EOL;
        }

    }

?>