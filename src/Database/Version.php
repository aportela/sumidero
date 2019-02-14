<?php

      declare(strict_types=1);

      namespace Sumidero\Database;

      class Version {

        private $dbh;
        private $databaseType;

        private $installQueries = array(
            "PDO_SQLITE" => array(
                '
                    CREATE TABLE [VERSION] (
                        [num]	NUMERIC NOT NULL UNIQUE,
                        [date]	INTEGER NOT NULL,
                        PRIMARY KEY([num])
                    );
                ',
                '
                    INSERT INTO VERSION VALUES ("1.00", current_timestamp);
                ',
                '
                    PRAGMA journal_mode=WAL;
                '
            )
        );

        private $upgradeQueries = array(
            "PDO_SQLITE" => array(
                "1.01" => array(
                    '
                        CREATE TABLE [USER] (
                            [id] VARCHAR(36) UNIQUE NOT NULL PRIMARY KEY,
                            [email] VARCHAR(255) UNIQUE NOT NULL,
                            [password_hash] VARCHAR(60) NOT NULL,
                            [nick] VARCHAR(255) UNIQUE NOT NULL,
                            [avatar_url] VARCHAR(2048)
                        );
                    '
                ),
                "1.02" => array(
                    '
                        CREATE TABLE [POST] (
                            [id] VARCHAR(36) UNIQUE NOT NULL PRIMARY KEY,
                            [op_user_id] [id] VARCHAR(36),
                            [creation_date] INTEGER NOT NULL,
                            [title] VARCHAR(128) NOT NULL,
                            [body] VARCHAR(384),
                            [permalink] VARCHAR(2048) UNIQUE NOT NULL,
                            [domain] VARCHAR(128),
                            [thumbnail] VARCHAR(2048),
                            [external_url] VARCHAR(2048),
                            [sub] VARCHAR(16),
                            [total_votes] INTEGER NOT NULL DEFAULT 0,
                            [total_comments] INTEGER NOT NULL DEFAULT 0
                        );
                    '
                ),
                "1.03" => array(
                    '
                        CREATE TABLE [POST_TAG] (
                            [post_id] VARCHAR(36) NOT NULL,
                            [tag_name] VARCHAR(16) NOT NULL,
                            PRIMARY KEY([post_id], [tag_name])
                        );
                    '
                ),
                "1.04" => array(
                    '
                        CREATE TABLE [POST_COMMENT] (
                            [id] VARCHAR(36) UNIQUE NOT NULL PRIMARY KEY,
                            [post_id] VARCHAR(36) NOT NULL,
                            [c_user_id] [id] VARCHAR(36),
                            [creation_date] INTEGER NOT NULL,
                            [body] VARCHAR(384)
                        );
                    '
                ),
                "1.05" => array(
                    '
                        DROP TABLE [USER]
                    ',
                    '
                        CREATE TABLE [USER] (
                            [id] VARCHAR(36) UNIQUE NOT NULL PRIMARY KEY,
                            [email] VARCHAR(255) UNIQUE NOT NULL,
                            [password_hash] VARCHAR(60) NOT NULL,
                            [creation_date] INTEGER NOT NULL,
                            [deletion_date] INTEGER
                        );
                    '
                ),
                "1.06" => array(
                    '
                        DROP TABLE [USER]
                    ',
                    '
                        CREATE TABLE [USER] (
                            [id] VARCHAR(36) UNIQUE NOT NULL PRIMARY KEY,
                            [email] VARCHAR(255) UNIQUE NOT NULL,
                            [name] VARCHAR(255) UNIQUE NOT NULL,
                            [password_hash] VARCHAR(60) NOT NULL,
                            [creation_date] INTEGER NOT NULL,
                            [deletion_date] INTEGER
                        );
                    '
                )
            )
        );

        public function __construct (\Sumidero\Database\DB $dbh, string $databaseType) {
            $this->dbh = $dbh;
            $this->databaseType = $databaseType;
        }

        public function __destruct() { }

        public function get() {
            $query = ' SELECT num FROM VERSION ORDER BY num DESC LIMIT 1; ';
            $results = $this->dbh->query($query, array());
            if ($results && count($results) == 1) {
                return($results[0]->num);
            } else {
                throw new \Sumidero\Exception\NotFoundException("invalid database version");
            }
        }

        private function set(float $number) {
            $params = array(
                (new \Sumidero\Database\DBParam())->str(":num", (string) $number)
            );
            $query = '
                INSERT INTO VERSION
                    (num, date)
                VALUES
                    (:num, current_timestamp);
            ';
            return($this->dbh->execute($query, $params));
        }

        public function install() {
            if (isset($this->installQueries[$this->databaseType])) {
                foreach($this->installQueries[$this->databaseType] as $query) {
                    $this->dbh->execute($query);
                }
            } else {
                throw new \Exception("Unsupported database type: " . $this->databaseType);
            }
        }

        public function upgrade() {
            if (isset($this->upgradeQueries[$this->databaseType])) {
                $result = array(
                    "successVersions" => array(),
                    "failedVersions" => array()
                );
                $actualVersion = $this->get();
                $errors = false;
                foreach($this->upgradeQueries[$this->databaseType] as $version => $queries) {
                    if (! $errors && $version > $actualVersion) {
                        try {
                            $this->dbh->beginTransaction();
                            foreach($queries as $query) {
                                $this->dbh->execute($query);
                            }
                            $this->set(floatval($version));
                            $this->dbh->commit();
                            $result["successVersions"][] = $version;
                        } catch (\PDOException $e) {
                            echo $e->getMessage();
                            $this->dbh->rollBack();
                            $errors = true;
                            $result["failedVersions"][] = $version;
                        }
                    } else if ($errors) {
                        $result["failedVersions"][] = $version;
                    }
                }
                return($result);
            } else {
                throw new \Exception("Unsupported database type: " . $this->databaseType);
            }
        }

        public function hasUpgradeAvailable() {
            $actualVersion = $this->get();
            $errors = false;
            foreach($this->upgradeQueries[$this->databaseType] as $version => $queries) {
                if ($version > $actualVersion) {
                    return(true);
                }
            }
            return(false);
        }

    }

?>