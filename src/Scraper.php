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

        public function scrap(string $url = "") {
            if (! empty($url) && filter_var($url, FILTER_VALIDATE_URL)) {
                $html = file_get_contents($url);
                return($this->readability->parse($html));
            } else {
                throw new \Sumidero\Exception\InvalidParamsException("url");
            }
        }
    }

?>