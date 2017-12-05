<?php

    declare(strict_types=1);

    namespace Sumidero\Test;

    require_once dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . "vendor" . DIRECTORY_SEPARATOR . "autoload.php";

    final class ScraperTest extends \PHPUnit\Framework\TestCase
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

        public function testScrapWithEmptyUrl(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("url");
            $scraper = new \Sumidero\Scraper();
            $data = $scraper->scrap("");
        }

        public function testScrapWithInvalidUrl(): void {
            $this->expectException(\Sumidero\Exception\InvalidParamsException::class);
            $this->expectExceptionMessage("url");
            $scraper = new \Sumidero\Scraper();
            $data = $scraper->scrap("htp_s//not.a.valid-url");
        }

        public function testScrap(): void {
            $scraper = new \Sumidero\Scraper();
            $data = $scraper->scrap("https://en.wikipedia.org/wiki/Data_scraping");
            $this->assertNotEmpty($data["title"]);
            $this->assertNotEmpty($data["article"]->textContent);
        }
    }
?>