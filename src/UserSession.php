<?php

    declare(strict_types=1);

    namespace Sumidero;

    class UserSession {

        public static function set($userId = "", string $email = "", string $nick = "", $avatarUrl = "") {
            $_SESSION["userId"] = $userId;
            $_SESSION["email"] = $email;
            $_SESSION["nick"] = $nick;
            $_SESSION["avatarUrl"] = $avatarUrl;
        }

        public static function clear() {
            $_SESSION = array();
            if (ini_get("session.use_cookies")) {
                if (PHP_SAPI != 'cli') {
                    $params = session_get_cookie_params();
                    setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
                }
            }
            if (session_status() != PHP_SESSION_NONE) {
                session_destroy();
            }
        }

        /**
         * check if user is logged
         */
        public static function isLogged() {
            return(isset($_SESSION["userId"]));
        }

        /**
         * return logged user id
         *
         * @return string userId || null
         */
        public static function getUserId() {
            return(isset($_SESSION["userId"]) ? $_SESSION["userId"]: null);
        }

        /**
         * return logged user email
         *
         * @return string email || null
         */
        public static function getEmail() {
            return(isset($_SESSION["email"]) ? $_SESSION["email"]: null);
        }

        /**
         * return logged user nick
         *
         * @return string nick || null
         */
        public static function getNick() {
            return(isset($_SESSION["nick"]) ? $_SESSION["nick"]: null);
        }

    }

?>