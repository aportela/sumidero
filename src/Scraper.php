<?php
    declare(strict_types=1);

    namespace Sumidero;

    use \andreskrey\Readability\HTMLParser;

    class Scraper {
        private $readability;

        public function __construct () {
            $this->readability = new HTMLParser();
        }

        public function __destruct() {
        }

        public function scrap(string $url) {
            $html = file_get_contents($url);
            return($this->readability->parse($html));
        }
    }

?>