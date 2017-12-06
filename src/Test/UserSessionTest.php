<?php

    declare(strict_types=1);

    namespace Sumidero\Test;

    require_once dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    final class UserSessionTest extends \PHPUnit\Framework\TestCase
    {
        static private $app = null;
        static private $container = null;
        static private $dbh = null;

        /**
         * Called once just like normal constructor
         */
        public static function setUpBeforeClass () {
            self::$app = (new \Sumidero\App())->get();
            self::$container = self::$app->getContainer();
            self::$dbh = new \Sumidero\Database\DB(self::$container);
        }

        /**
         * Initialize the test case
         * Called for every defined test
         */
        public function setUp() {
            self::$dbh->beginTransaction();
        }

        /**
         * Clean up the test case, called for every defined test
         */
        public function tearDown() {
            self::$dbh->rollBack();
        }

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
            $u = new \Sumidero\User($id, $id . "@server.com", "secret", $id, "");
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
            $u = new \Sumidero\User($id, $id . "@server.com", "secret", $id, "");
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
            $u = new \Sumidero\User($id, $id . "@server.com", "secret", $id, "");
            $u->add(self::$dbh);
            $u->login(self::$dbh);
            $this->assertEquals($u->email, \Sumidero\UserSession::getEmail());
        }

        public function testGetNickWithoutSession(): void {
            \Sumidero\User::logout();
            $this->assertNull(\Sumidero\UserSession::getNick());

        }

        public function testGetNick(): void {
            \Sumidero\User::logout();
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret", $id, "");
            $u->add(self::$dbh);
            $u->login(self::$dbh);
            $this->assertEquals($u->nick, \Sumidero\UserSession::getNick());
        }

        public function testGetAvatarWithoutSession(): void {
            \Sumidero\User::logout();
            $this->assertNull(\Sumidero\UserSession::getAvatarUrl());

        }

        public function testGetAvatar(): void {
            \Sumidero\User::logout();
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret", $id, "http://avat.ar");
            $u->add(self::$dbh);
            $u->login(self::$dbh);
            $this->assertEquals($u->avatarUrl, \Sumidero\UserSession::getAvatarUrl());
        }

    }
?>