<?php

    declare(strict_types=1);

    namespace Sumidero\Test;

    require_once dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    final class UserTest extends \Sumidero\Test\BaseTest {

        public function testAddWithoutId(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("id");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Sumidero\User("", $id . "@localhost.localnet", "secret"))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutEmail(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("email");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Sumidero\User($id, "", "secret"))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutValidEmailLength(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("email");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Sumidero\User($id, str_repeat($id, 10) . "@localhost.localnet", "secret"))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutValidEmail(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("email");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Sumidero\User($id, $id, "secret"))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddWithoutPassword(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
                $this->expectExceptionMessage("password");
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                (new \Sumidero\User($id, $id . "@localhost.localnet", ""))->add(self::$dbh);
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testAddUserAccount(): void {
            if (self::$container->get('settings')['common']['allowSignUp']) {
                $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                $this->assertTrue((new \Sumidero\User($id, $id . "@localhost.localnet", "secret"))->add(self::$dbh));
            } else {
                $this->markTestSkipped("This test can not be run (allowSignUp disabled in settings)");
            }
        }

        public function testUpdateWithoutId(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Sumidero\User("", $id . "@localhost.localnet", "secret"))->update(self::$dbh);
        }

        public function testUpdateWithoutEmail(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Sumidero\User($id, "", "name of " . $id, "secret"))->update(self::$dbh);
        }

        public function testUpdateWithoutValidEmailLength(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Sumidero\User($id, str_repeat($id, 10) . "@localhost.localnet", "secret"))->update(self::$dbh);
        }

        public function testUpdateWithoutValidEmail(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();

            (new \Sumidero\User($id, $id, "secret"))->update(self::$dbh);
        }

        public function testUpdateMyProfile(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $u->login(self::$dbh);
            $this->assertTrue($u->update(self::$dbh));
        }

        public function testUpdateAdministratorAccountAccount(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $u->login(self::$dbh);
            $this->assertTrue($u->update(self::$dbh));
        }

        public function testGetWithoutIdOrEmail(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id,email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Sumidero\User("", "", "secret"))->get(self::$dbh);
        }

        public function testGetWithoutValidEmailLength(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id,email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Sumidero\User("", str_repeat($id, 10) . "@server.com", "secret"))->get(self::$dbh);
        }

        public function testGetWithoutValidEmail(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id,email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Sumidero\User("", $id, "secret"))->get(self::$dbh);
        }

        public function testGetWithNonExistentId(): void {
            $this->expectException(\Sumidero\Exception\NotFoundException::class);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Sumidero\User($id, $id, "secret"))->get(self::$dbh);
        }

        public function testGetWithNonExistentEmail(): void {
            $this->expectException(\Sumidero\Exception\NotFoundException::class);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Sumidero\User($id, $id . "@server.com", "secret"))->get(self::$dbh);
        }

        public function testGetDeleted(): void {
            $this->expectException(\Sumidero\Exception\DeletedException::class);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $u->delete(self::$dbh);
            $u->get(self::$dbh);
        }

        public function testGet(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $u->get(self::$dbh);
            $this->assertTrue($id == $u->id);
        }

        public function testExistsEmailWithNonExistentEmail(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $this->assertFalse(\Sumidero\User::existsEmail(self::$dbh, $id . "@server.com"));
        }

        public function testExistsEmailWithExistentEmail(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $this->assertTrue(\Sumidero\User::existsEmail(self::$dbh, $u->email));
        }

        public function testExistsEmailWithExistentEmailIgnoringId(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $this->assertFalse(\Sumidero\User::existsEmail(self::$dbh, $u->email, $u->id));
        }

        public function testLoginWithoutIdOrEmail(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id,email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Sumidero\User("", "", "secret"))->login(self::$dbh);
        }

        public function testLoginWithoutPassword(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("password");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Sumidero\User($id, $id . "@server.com", ""))->login(self::$dbh);
        }

        public function testLoginWithoutExistentEmail(): void {
            $this->expectException(\Sumidero\Exception\NotFoundException::class);
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            (new \Sumidero\User($id, $id . "@server.com", "secret"))->login(self::$dbh);
        }

        public function testLoginWithoutValidEmailLength(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id, "secret");
            $u->add(self::$dbh);
            $u->email = str_repeat($id, 10) . "@server.com";
            $u->login(self::$dbh);
        }

        public function testLoginWithoutValidEmail(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("email");
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id, "secret");
            $u->add(self::$dbh);
            $u->email = $id;
            $u->login(self::$dbh);
        }

        public function testLoginWithInvalidPassword(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $u->password = "other";
            $this->assertFalse($u->login(self::$dbh));
        }

        public function testLogin(): void {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret");
            $u->add(self::$dbh);
            $this->assertTrue($u->login(self::$dbh));
        }

        public function testLogout(): void {
            $this->assertTrue(\Sumidero\User::logout());
        }

    }

?>