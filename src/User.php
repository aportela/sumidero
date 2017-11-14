<?php
    declare(strict_types=1);

    namespace Sumidero;

    class User {
        public $id;
        public $email;
        public $name;
        public $fullName;
        public $avatar;


        public function __construct ($id, $email, $name, $fullName, $avatar) {
            $this->id = $id;
            $this->email = $email;
            $this->name = $name;
            $this->fullName = $fullName;
            $this->avatar = $avatar;
        }

        public function __destruct() {
        }

        public static function getRandom() {
            $id = \Sumidero\UUID::generate(true);
            $users = array(
                new \Sumidero\User(
                    $id,
                    sprintf("%s@myserver.org", $id),
                    sprintf("anonymous-%s", $id),
                    "We are Anonymous, expect us",
                    "https://cdn.shopify.com/s/files/1/2353/2439/products/guy_fawkes_mask.jpg?v=1508552916"
                )
            );
            // get random users from placeholder api
            $jsonResult = json_decode(file_get_contents("https://randomuser.me/api/?page=1&results=8&inc=name,picture"));
            foreach($jsonResult->{"results"} as $e) {
                $id = \Sumidero\UUID::generate(true);
                $users[] =
                new \Sumidero\User(
                    $id,
                    sprintf("%s@myserver.org", $id),
                    sprintf("%s-%s", str_replace(" ", "_", $e->name->first . $e->name->last), $id),
                    $e->name->first . " " . $e->name->last,
                    $e->picture->large
                );
            }
            shuffle($users);
            $u = $users[array_rand($users)];
            return(new \Sumidero\User(
                $u->id,
                $u->email,
                $u->name,
                $u->fullName,
                $u->avatar
            ));
        }

        public function add($dbh) {
            $params = array(
                (new \Sumidero\DataBase\DBParam())->str(":id", $this->id),
                (new \Sumidero\DataBase\DBParam())->str(":email", $this->email),
                (new \Sumidero\DataBase\DBParam())->str(":password_hash", password_hash("secret", PASSWORD_DEFAULT)),
                (new \Sumidero\DataBase\DBParam())->str(":name", $this->name),
                (new \Sumidero\DataBase\DBParam())->str(":full_name", $this->fullName),
                (new \Sumidero\DataBase\DBParam())->str(":avatar_url", $this->avatar)
            );
            $query = '
                INSERT INTO USER
                    (id, email, password_hash, name, full_name, avatar_url)
                VALUES
                (:id, :email, :password_hash, :name, :full_name, :avatar_url)
            ';
            return($dbh->execute($query, $params));
        }
    }
?>