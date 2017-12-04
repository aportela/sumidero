<?php

    declare(strict_types=1);

    namespace Sumidero;

    class User {

        public $id;
        public $email;
        public $nick;
        public $password;
        public $passwordHash;
        public $avatarUrl;

        /**
         * user constructor
         *
         * @param string $id
         * @param string $email
         * @param string $password
         */
	    public function __construct (string $id = "", string $email = "", string $password = "", string $nick = "", string $avatarUrl) {
            $this->id = $id;
            $this->email = $email;
            $this->password = $password;
            $this->nick = $nick;
            $this->avatarUrl = $avatarUrl;
        }

        public function __destruct() { }

        /**
         * helper for hashing password (predefined algorithm)
         *
         * @param string $password string the password to hash
         */
        private function passwordHash(string $password = "") {
            return(password_hash($password, PASSWORD_BCRYPT, array('cost' => 12)));
        }

        /**
         * add new user
         *
         * @param \Sumidero\Database\DB $dbh database handler
         */
        public function add(\Sumidero\Database\DB $dbh) {
            if (! empty($this->id)) {
                if (! empty($this->email) && filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
                    if (! empty($this->nick)) {
                        if (! empty($this->password)) {
                            $params = array(
                                (new \Sumidero\Database\DBParam())->str(":id", $this->id),
                                (new \Sumidero\Database\DBParam())->str(":email", mb_strtolower($this->email)),
                                (new \Sumidero\Database\DBParam())->str(":nick", mb_strtolower($this->nick)),
                                (new \Sumidero\Database\DBParam())->str(":password_hash", $this->passwordHash($this->password)),
                            );
                            if (! empty($this->avatarUrl)) {
                                $params[] = (new \Sumidero\Database\DBParam())->str(":avatar_url", $this->avatarUrl);
                            } else {
                                $params[] = (new \Sumidero\Database\DBParam())->null(":avatar_url");
                            }
                            return($dbh->execute("INSERT INTO USER (id, email, nick, password_hash, avatar_url) VALUES(:id, :email, :nick, :password_hash, :avatar_url)", $params));
                        } else {
                            throw new \Sumidero\Exception\InvalidParamsException("password");
                        }
                    } else {
                        throw new \Sumidero\Exception\InvalidParamsException("nick");
                    }
                } else {
                    throw new \Sumidero\Exception\InvalidParamsException("email");
                }
            } else {
                throw new \Sumidero\Exception\InvalidParamsException("id");
            }
        }

        /**
         * update user (email, nick, avatar url & hashed password fields)
         *
         * @param \Sumidero\Database\DB $dbh database handler
         */
        public function update(\Sumidero\Database\DB $dbh) {
            if (! empty($this->id)) {
                if (! empty($this->email) && filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
                    if (! empty($this->nick)) {
                        if (! empty($this->password)) {
                            $params = array(
                                (new \Sumidero\Database\DBParam())->str(":id", $this->id),
                                (new \Sumidero\Database\DBParam())->str(":email", mb_strtolower($this->email)),
                                (new \Sumidero\Database\DBParam())->str(":nick", mb_strtolower($this->nick)),
                                (new \Sumidero\Database\DBParam())->str(":password_hash", $this->passwordHash($this->password))
                            );
                            if (! empty($this->avatarUrl)) {
                                $params[] = (new \Sumidero\Database\DBParam())->str(":avatar_url", $this->avatarUrl);
                            } else {
                                $params[] = (new \Sumidero\Database\DBParam())->null(":avatar_url");
                            }
                            return($dbh->execute(" UPDATE USER SET email = :email, nick = :nick, password_hash = :password_hash, avatar_url = :avatar_url WHERE id = :id ", $params));
                        } else {
                            throw new \Sumidero\Exception\InvalidParamsException("password");
                        }
                    } else {
                        throw new \Sumidero\Exception\InvalidParamsException("nick");
                    }
                } else {
                    throw new \Sumidero\Exception\InvalidParamsException("email");
                }
            } else {
                throw new \Sumidero\Exception\InvalidParamsException("id");
            }
        }

        /**
         * get user data (id, email, nick, avatar url & hashed password)
         * id || email must be set
         *
         * @param \Sumidero\Database\DB $dbh database handler
         */
        public function get(\Sumidero\Database\DB $dbh) {
            $results = null;
            if (! empty($this->id)) {
                $results = $dbh->query(" SELECT id, email, nick, password_hash AS passwordHash, avatar_url AS avatarUrl FROM USER WHERE id = :id ", array(
                    (new \Sumidero\Database\DBParam())->str(":id", $this->id)
                ));
            } else if (! empty($this->email) && filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
                $results = $dbh->query(" SELECT id, email, nick, password_hash AS passwordHash, avatar_url AS avatarUrl FROM USER WHERE email = :email ", array(
                    (new \Sumidero\Database\DBParam())->str(":email", mb_strtolower($this->email))
                ));
            } else {
                throw new \Sumidero\Exception\InvalidParamsException("id,email");
            }
            if (count($results) == 1) {
                $this->id = $results[0]->id;
                $this->email = $results[0]->email;
                $this->nick = $results[0]->nick;
                $this->passwordHash = $results[0]->passwordHash;
                $this->avatarUrl = $results[0]->avatarUrl;
            } else {
                throw new \Sumidero\Exception\NotFoundException("");
            }
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
                    \Sumidero\UserSession::set($this->id, $this->email, $this->nick, $this->avatarUrl);
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