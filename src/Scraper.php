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
                $curl = curl_init();
                curl_setopt($curl, CURLOPT_URL, $url);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36");
                curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
                $html = curl_exec($curl);
                curl_close($curl);
                return($this->readability->parse($html));
            } else {
                throw new \Sumidero\Exception\InvalidParamsException("url");
            }
        }

        public function embed($url = "") {
            if (! empty($url) && filter_var($url, FILTER_VALIDATE_URL)) {
                return(\Embed\Embed::create($url));
            } else {
                throw new \Sumidero\Exception\InvalidParamsException("url");
            }
        }

        public function getSuggestedTags($url) {
            $tags = array();
            if (! empty($url) && filter_var($url, FILTER_VALIDATE_URL)) {
                switch(parse_url($url, PHP_URL_HOST)) {
                    case "www.youtube.com":
                        $tags[] = "youtube";
                    break;
                }
            }
            return($tags);
        }
    }

?>