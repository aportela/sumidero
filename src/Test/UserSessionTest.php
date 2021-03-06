<?php

    declare(strict_types=1);

    namespace Sumidero\Test;

    require_once dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    final class UserSessionTest extends \Sumidero\Test\BaseTest
    {
        /**
         * Clean up the whole test class
         */
        public static function tearDownAfterClass() {
            self::$dbh = null;
            self::$container = null;
            self::$app = null;
        }

        public function testIsLoggedWithoutSession(): void {
            \Sumidero\User::logout();
            $this->assertFalse(\Sumidero\UserSession::isLogged());

        }

        public function testIsLogged(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $u->login(self::$dbh);
            $this->assertTrue(\Sumidero\UserSession::isLogged());
        }

        public function testGetUserIdWithoutSession(): void {
            \Sumidero\User::logout();
            $this->assertNull(\Sumidero\UserSession::getUserId());

        }

        public function testGetUserId(): void {
            \Sumidero\User::logout();
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $u->login(self::$dbh);
            $this->assertEquals($u->id, \Sumidero\UserSession::getUserId());
        }

        public function testGetEmailWithoutSession(): void {
            \Sumidero\User::logout();
            $this->assertNull(\Sumidero\UserSession::getEmail());
        }

        public function testGetEmail(): void {
            \Sumidero\User::logout();
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $u->login(self::$dbh);
            $this->assertEquals($u->email, \Sumidero\UserSession::getEmail());
        }

    }
?>