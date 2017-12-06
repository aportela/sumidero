<?php

    declare(strict_types=1);

    namespace Sumidero\Test;

    require_once dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    final class PostTest extends \PHPUnit\Framework\TestCase
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

        private function createUserAndLogin(): string {
            $id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $u = new \Sumidero\User($id, $id . "@server.com", "secret", $id, "");
            $u->add(self::$dbh);
            $u->login(self::$dbh);
            return($id);
        }

        public function testAddWithoutId(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            $this->createUserAndLogin();
            $post = new \Sumidero\Post();
            $post->add(self::$dbh);
        }

        public function testAddWithoutPermalink(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("permaLink");
            $opUserId = $this->createUserAndLogin();
            $post = new \Sumidero\Post();
            $post->id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $post->opUserId = $opUserId;
            $post->add(self::$dbh);
        }

        public function testAddWithoutTitle(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("title");
            $opUserId = $this->createUserAndLogin();
            $post = new \Sumidero\Post();
            $post->id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $post->opUserId = $opUserId;
            $post->permaLink = "/s/test" . $opUserId;
            $post->add(self::$dbh);
        }

        public function testAddWithInvalidExternalUrl(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("externalUrl");
            $opUserId = $this->createUserAndLogin();
            $post = new \Sumidero\Post();
            $post->id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $post->opUserId = $opUserId;
            $post->permaLink = "/s/test" . $opUserId;
            $post->title = "post title from " . $opUserId;
            $post->externalUrl = "htp_s//not.a.valid-url";
            $post->add(self::$dbh);
        }

        public function testAddWithInvalidTags(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("tags");
            $opUserId = $this->createUserAndLogin();
            $post = new \Sumidero\Post();
            $post->id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $post->opUserId = $opUserId;
            $post->permaLink = "/s/test" . $opUserId;
            $post->title = "post title from " . $opUserId;
            $post->tags = array("one", "", "three");
            $post->add(self::$dbh);
        }

        public function testAdd(): void {
            $opUserId = $this->createUserAndLogin();
            $post = new \Sumidero\Post();
            $post->id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $post->opUserId = $opUserId;
            $post->permaLink = "/s/test" . $opUserId;
            $post->title = "post title from " . $opUserId;
            $this->assertTrue($post->add(self::$dbh));
        }

        public function testAddWithTags(): void {
            $opUserId = $this->createUserAndLogin();
            $post = new \Sumidero\Post();
            $post->id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $post->opUserId = $opUserId;
            $post->permaLink = "/s/test" . $opUserId;
            $post->title = "post title from " . $opUserId;
            $post->tags = array("one", "two", "three");
            $this->assertTrue($post->add(self::$dbh));
        }

        public function testAddCommentWithoutBody(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("body");
            $opUserId = $this->createUserAndLogin();
            $post = new \Sumidero\Post();
            $post->id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $post->opUserId = $opUserId;
            $post->permaLink = "/s/test" . $opUserId;
            $post->title = "post title from " . $opUserId;
            $post->add(self::$dbh);
            $post->addComment(self::$dbh, "");
        }

        public function testAddComment(): void {
            $opUserId = $this->createUserAndLogin();
            $post = new \Sumidero\Post();
            $post->id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $post->opUserId = $opUserId;
            $post->permaLink = "/s/test" . $opUserId;
            $post->title = "post title from " . $opUserId;
            $post->add(self::$dbh);
            $this->assertTrue($post->addComment(self::$dbh, "test"));
        }

        public function testDeleteWithoutId(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("id");
            $post = new \Sumidero\Post();
            $post->delete(self::$dbh);
        }

        public function testDelete(): void {
            $opUserId = $this->createUserAndLogin();
            $post = new \Sumidero\Post();
            $post->id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
            $post->opUserId = $opUserId;
            $post->permaLink = "/s/test" . $opUserId;
            $post->title = "post title from " . $opUserId;
            $post->add(self::$dbh);
            $this->assertTrue($post->delete(self::$dbh));
        }

        public function testSearchWithSubFilter(): void {
            $this->assertInstanceOf("stdclass", \Sumidero\Post::search(self::$dbh, 1, 16, array("sub" => "test"), ""));
        }

        public function testSearchWithTagFilter(): void {
            $this->assertInstanceOf("stdclass", \Sumidero\Post::search(self::$dbh, 1, 16, array("tag" => "test"), ""));
        }

        public function testSearchWithDomainFilter(): void {
            $this->assertInstanceOf("stdclass", \Sumidero\Post::search(self::$dbh, 1, 16, array("domain" => "www.server.com"), ""));
        }

        public function testSearchWithTitleFilter(): void {
            $this->assertInstanceOf("stdclass", \Sumidero\Post::search(self::$dbh, 1, 16, array("title" => "test"), ""));
        }

        public function testSearchWithBodyFilter(): void {
            $this->assertInstanceOf("stdclass", \Sumidero\Post::search(self::$dbh, 1, 16, array("body" => "test"), ""));
        }

        public function testSearchWithoutFilters(): void {
            $this->assertInstanceOf("stdclass", \Sumidero\Post::search(self::$dbh, 1, 16, array(), ""));
        }

        public function testSearchWithAllFilters(): void {
            $this->assertInstanceOf("stdclass", \Sumidero\Post::search(self::$dbh, 1, 16, array("sub" => "test", "tag" => "test", "domain" => "www.server.com", "title" => "test", "body" => "test"), ""));
        }

    }
?>