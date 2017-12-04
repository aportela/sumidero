<?php

    declare(strict_types=1);

    namespace Sumidero\Test;

    require_once dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    final class UserTest extends \PHPUnit\Framework\TestCase
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

        public function testAddWithoutId(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("id");
                (new \Sumidero\User("", "", "", "", ""))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutEmail(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("email");
                (new \Sumidero\User((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", "", "", ""))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutValidEmail(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("email");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Sumidero\User($id, $id, "", "", ""))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutNick(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("nick");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Sumidero\User($id, $id . "@server.com", "", "", ""))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutPassword(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("password");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Sumidero\User($id, $id . "@server.com", "", $id, ""))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }


        public function testAdd(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                $this->assertTrue((new \Sumidero\User($id, $id . "@server.com", "secret", $id, ""))->add(self::$dbh));
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testUpdateWithoutId(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            (new \Sumidero\User("", "", "", "", ""))->update(self::$dbh);
        }

        public function testUpdateWithoutEmail(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            (new \Sumidero\User((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", "", "", ""))->update(self::$dbh);
        }

        public function testUpdateWithoutValidEmail(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Sumidero\User($id, $id, "", "", ""))->update(self::$dbh);
        }

        public function testUpdateWithoutNick(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("nick");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Sumidero\User($id, $id . "@server.com", "", "", ""))->update(self::$dbh);
        }

        public function testUpdateWithoutPassword(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("password");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Sumidero\User($id, $id . "@server.com", "", $id, ""))->update(self::$dbh);
        }

        public function testUpdate(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret", $id, "");
            $this->assertTrue($u->add(self::$dbh) && $u->update(self::$dbh));
        }

        public function testGetWithoutIdOrEmail(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id,email");
            $u = new \Sumidero\User("", "", "", "", "");
            $u->get(self::$dbh);
        }

        public function testGetWithoutValidEmail(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id,email");
            $u = new \Sumidero\User("", (\Ramsey\Uuid\Uuid::uuid4())->toString(), "", "", "");
            $u->get(self::$dbh);
        }

        public function testGetWithNonExistentId(): void {
            $this->expectException(\Sumidero\Exception\NotFoundException::class);
            $u = new \Sumidero\User((\Ramsey\Uuid\Uuid::uuid4())->toString(), "", "", "", "");
            $u->get(self::$dbh);
        }

        public function testGetWithNonExistentEmail(): void {
            $this->expectException(\Sumidero\Exception\NotFoundException::class);
            $u = new \Sumidero\User("", (\Ramsey\Uuid\Uuid::uuid4())->toString() . "@server.com", "", "", "");
            $u->get(self::$dbh);
        }

        public function testGet(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret", $id, "");
            $u->add(self::$dbh);
            $u->get(self::$dbh);
            $this->assertTrue($id == $u->id);
        }


        public function testLoginWithoutIdOrEmail(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id,email");
            $this->assertTrue((new \Sumidero\User("", "", "secret", "", ""))->login(self::$dbh));
        }

        public function testLoginWithoutPassword(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("password");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertTrue((new \Sumidero\User($id, $id . "@server.com", "", "", ""))->login(self::$dbh));
        }

        public function testLoginWithoutExistentEmail(): void {
            $this->expectException(\Sumidero\Exception\NotFoundException::class);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertTrue((new \Sumidero\User($id, $id . "@server.com", "secret", "", ""))->login(self::$dbh));
        }

        public function testLoginWithoutValidEmail(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertTrue((new \Sumidero\User("", $id, "secret", "", ""))->login(self::$dbh));
        }

        public function testLoginWithInvalidPassword(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret", $id, "");
            $u->add(self::$dbh);
            $u->password = "other";
            $this->assertFalse($u->login(self::$dbh));
        }

        public function testLogin(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret", $id, "");
            $u->add(self::$dbh);
            $this->assertTrue($u->login(self::$dbh));
        }

        public function testLogout(): void {
            $this->assertTrue(\Sumidero\User::logout());
        }

    }
?>