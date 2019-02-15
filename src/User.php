<?php

    declare(strict_types=1);

    namespace Sumidero;

    /**
     * User class
     */
    class User {

        public $id;
        public $email;
        public $name;
        public $password;
        public $passwordHash;
        public $creationDate;
        public $deletionDate;
        public $avatar;

        public function __construct (string $id = "", string $email = "", string $name = "", string $password = "", string $avatar = "") {
            $this->id = $id;
            $this->email = $email;
            $this->name = $name;
            $this->password = $password;
            $this->avatar = $avatar;
        }

        public function __destruct() {
        }

        /**
         * helper for hashing password (predefined algorithm)
         *
         * @param string $password string the password to hash
         *
         * @return string hashed password
         */
        private function passwordHash(string $password = ""): string {
            return(password_hash($password, PASSWORD_BCRYPT, array('cost' => 12)));
        }

        /**
         * add user
         *
         * @param \Sumidero\Database\DB $dbh database handler
         */
        public function add(\Sumidero\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                if (! empty($this->email) && mb_strlen($this->email) <= 255 && filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
                    if (! empty($this->name) && mb_strlen($this->name) <= 255) {
                        if (! empty($this->password)) {
                            $params = array(
                                (new \Sumidero\Database\DBParam())->str(":id", mb_strtolower($this->id)),
                                (new \Sumidero\Database\DBParam())->str(":email", mb_strtolower($this->email)),
                                (new \Sumidero\Database\DBParam())->str(":name", $this->name),
                                (new \Sumidero\Database\DBParam())->str(":password_hash", $this->passwordHash($this->password)),
                                (new \Sumidero\Database\DBParam())->str(":avatar", $this->avatar),
                            );
                            return($dbh->execute(" INSERT INTO USER (id, email, name, avatar, password_hash, creation_date) VALUES(:id, :email, :name, :avatar, :password_hash, strftime('%s', 'now')) ", $params));
                        } else {
                            throw new \Sumidero\Exception\InvalidParamsException("password");
                        }
                    } else {
                        throw new \Sumidero\Exception\InvalidParamsException("name");
                    }
                } else {
                    throw new \Sumidero\Exception\InvalidParamsException("email");
                }
            } else {
                throw new \Sumidero\Exception\InvalidParamsException("id");
            }
        }

        /**
         * update user (email, hashed password fields)
         *
         * @param \Sumidero\Database\DB $dbh database handler
         */
        public function update(\Sumidero\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                if (! empty($this->email) && filter_var($this->email, FILTER_VALIDATE_EMAIL) && mb_strlen($this->email) <= 255) {
                    if (! empty($this->name) && mb_strlen($this->name) <= 255) {
                        $fields = array(
                            "email = :email ",
                            "name = :name ",
                            "avatar = :avatar "
                        );
                        $params = array(
                            (new \Sumidero\Database\DBParam())->str(":id", mb_strtolower($this->id)),
                            (new \Sumidero\Database\DBParam())->str(":email", mb_strtolower($this->email)),
                            (new \Sumidero\Database\DBParam())->str(":name", $this->name),
                            (new \Sumidero\Database\DBParam())->str(":avatar", $this->avatar)
                        );
                        if (! empty($password)) {
                            $fields[] = "password_hash = :password_hash";
                            $params[] = (new \Sumidero\Database\DBParam())->str(":password_hash", $this->passwordHash($this->password));
                        }
                        if (mb_strtolower($this->id) == \Sumidero\UserSession::getUserId()) {
                            return($dbh->execute(sprintf(" UPDATE USER SET %s WHERE id = :id ", implode(", ", $fields)), $params));
                        } else {
                            throw new \Sumidero\Exception\AccessDeniedException("");
                        }
                    } else {
                        throw new \Sumidero\Exception\InvalidParamsException("name");
                    }
                } else {
                    throw new \Sumidero\Exception\InvalidParamsException("email");
                }
            } else {
                throw new \Sumidero\Exception\InvalidParamsException("id");
            }
        }

        /**
         * delete user (mark as deleted)
         *
         * @param \Sumidero\Database\DB $dbh database handler
         */
        public function delete(\Sumidero\Database\DB $dbh) {
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                return($dbh->execute(" UPDATE USER SET deletion_date = strftime('%s', 'now') WHERE id = :id ", array(
                    (new \Sumidero\Database\DBParam())->str(":id", mb_strtolower($this->id)))
                ));
            } else {
                throw new \Sumidero\Exception\InvalidParamsException("id");
            }
        }

        /**
         * get user data (id, email, hashed password)
         * id || email must be set
         *
         * @param \Sumidero\Database\DB $dbh database handler
         */
        public function get(\Sumidero\Database\DB $dbh) {
            $results = null;
            if (! empty($this->id) && mb_strlen($this->id) == 36) {
                $results = $dbh->query(
                    sprintf(
                        "
                            SELECT
                                USER.id, USER.email, USER.name, USER.avatar, USER.password_hash AS passwordHash, strftime('%s', datetime(USER.creation_date, 'unixepoch')) AS creationDate, USER.deletion_date AS deletionDate
                            FROM USER
                            WHERE USER.id = :id
                        ",
                        \Sumidero\Database\DB::SQLITE_STRFTIME_FORMAT
                    ),
                    array(
                        (new \Sumidero\Database\DBParam())->str(":id", mb_strtolower($this->id))
                    )
                );
            } else if (! empty($this->email) && filter_var($this->email, FILTER_VALIDATE_EMAIL) && mb_strlen($this->email) <= 255) {
                $results = $dbh->query(
                    sprintf(
                        "
                            SELECT
                                USER.id, USER.email, USER.name, USER.avatar, USER.password_hash AS passwordHash, strftime('%s', datetime(USER.creation_date, 'unixepoch')) AS creationDate, USER.deletion_date AS deletionDate
                            FROM USER
                            WHERE USER.email = :email
                        ",
                        \Sumidero\Database\DB::SQLITE_STRFTIME_FORMAT
                    ),
                    array(
                        (new \Sumidero\Database\DBParam())->str(":email", mb_strtolower($this->email))
                    )
                );
            } else {
                throw new \Sumidero\Exception\InvalidParamsException("id,email");
            }
            if (count($results) == 1) {
                $this->id = $results[0]->id;
                $this->email = $results[0]->email;
                $this->name = $results[0]->name;
                $this->avatar = $results[0]->avatar;
                $this->passwordHash = $results[0]->passwordHash;
                $this->creationDate = $results[0]->creationDate;
                if (! empty($results[0]->deletionDate)) {
                    throw new \Sumidero\Exception\DeletedException("");
                }
            } else {
                throw new \Sumidero\Exception\NotFoundException("");
            }
        }

        /**
         * check email existence
         *
         * @param \Sumidero\Database\DB $dbh database handler
         * @param string $email email to check existence
         */
        public static function existsEmail(\Sumidero\Database\DB $dbh, string $email = "", string $ignoreId = "") {
            $params = array(
                (new \Sumidero\Database\DBParam())->str(":email", mb_strtolower($email))
            );
            $whereCondition = null;
            if (! empty($ignoreId)) {
                $whereCondition = " AND USER.id <> :id ";
                $params[] = (new \Sumidero\Database\DBParam())->str(":id", mb_strtolower($ignoreId));
            }
            $results = $dbh->query(sprintf
                (
                    "
                        SELECT
                            COUNT(id) AS total
                        FROM USER
                        WHERE email = :email
                        AND deletion_date IS NULL
                        %s
                    ", $whereCondition
                ), $params
            );
            return($results[0]->total == 1);
        }

        /**
         * check name existence
         *
         * @param \Sumidero\Database\DB $dbh database handler
         * @param string $name name to check existence
         */
        public static function existsName(\Sumidero\Database\DB $dbh, string $name = "", string $ignoreId = "") {
            $params = array(
                (new \Sumidero\Database\DBParam())->str(":name", $name)
            );
            $whereCondition = null;
            if (! empty($ignoreId)) {
                $whereCondition = " AND USER.id <> :id ";
                $params[] = (new \Sumidero\Database\DBParam())->str(":id", mb_strtolower($ignoreId));
            }
            $results = $dbh->query(sprintf
                (
                    "
                        SELECT
                            COUNT(id) AS total
                        FROM USER
                        WHERE name = :name
                        AND deletion_date IS NULL
                        %s
                    ", $whereCondition
                ), $params
            );
            return($results[0]->total == 1);
        }

        /**
         * try sign in with specified credentials
         * id || email & password must be set
         *
         * @param \Sumidero\Database\DB $dbh database handler
         *
         * @return bool password match (true | false)
         */
        public function login(\Sumidero\Database\DB $dbh): bool {
            if (! empty($this->password)) {
                $this->get($dbh);
                if (password_verify($this->password, $this->passwordHash)) {
                    \Sumidero\UserSession::set($this->id, $this->email, $this->name, $this->avatar);
                    return(true);
                } else {
                    return(false);
                }
            } else {
                throw new \Sumidero\Exception\InvalidParamsException("password");
            }
        }

        /**
         * sign out (close session)
         */
        public static function logout(): bool {
            \Sumidero\UserSession::clear();
            return(true);
        }
    }

?>
