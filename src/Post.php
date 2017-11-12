<?php
    declare(strict_types=1);

    namespace Sumidero;

    class Post {

        public function __construct () {
        }

        public function __destruct() {
        }

        public static function search($dbh, int $page = 1, int $resultsPage = 16, array $filter = array(), string $order = "") {
            $results = array();
            // default anonymous user
            $users = array(
                array(
                    "name" => "anonymous",
                    "fullname" => "anonymous",
                    "id" => "0000000",
                    "avatar" => "https://cdn.shopify.com/s/files/1/2353/2439/products/guy_fawkes_mask.jpg?v=1508552916"
                ),
            );
            // get random users from placeholder api
            $jsonResult = json_decode(file_get_contents("https://randomuser.me/api/?page=1&results=8&inc=name,picture"));
            foreach($jsonResult->{"results"} as $e) {
                $users[] = array(
                    "name" => str_replace(" ", "_", $e->name->first . $e->name->last),
                    "fullname" => $e->name->first . " " . $e->name->last,
                    "id" => uniqid(),
                    "avatar" => $e->picture->large
                );
            }

            $body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut leo est, sollicitudin sit amet faucibus a, auctor nec arcu. Donec pulvinar bibendum dictum. Praesent sit amet malesuada urna, in dapibus sem. Integer a neque pulvinar mauris aliquet pretium sit amet at augue. Suspendisse vitae quam egestas, aliquam justo at, vulputate lacus.";
            // get reddit post data

            $redditCachedJsonFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . "data" . DIRECTORY_SEPARATOR . "reddit.json";
            if (file_exists($redditCachedJsonFile)) {
                $redditJson = file_get_contents($redditCachedJsonFile);
            } else {
                $redditJson = file_get_contents("https://www.reddit.com/.json");
                file_put_contents($redditCachedJsonFile, $redditJson);
            }
            $redditData = json_decode($redditJson);
            //print_r($redditData->{"data"}->{"children"}[0]->{"data"}); exit;

            function getRandomTags(int $count) {
                $tags = array(
                    "videos", "news", "article", "php", "funny", "pics", "gaming", "hardware", "music", "javascript"
                );
                $result = array();
                for($i = 0; $i < $count; $i++) {
                    $t = $tags[array_rand($tags)];
                    $result[] = $t;
                    shuffle($tags);
                }
                $result = array_unique($result);
                return($result);
            }
            foreach($redditData->{"data"}->{"children"} as $redditPost) {
                $results[] = array(
                    "user" => $users[array_rand($users)], // author
                    "title" => $redditPost->{"data"}->{"title"},
                    "domain" => $redditPost->{"data"}->{"domain"},
                    "body" => $body,
                    "url" => $redditPost->{"data"}->{"url"},
                    "permalink" => $redditPost->{"data"}->{"permalink"},
                    "thumbnail" => $redditPost->{"data"}->{"thumbnail"},
                    "created" => $redditPost->{"data"}->{"created"},
                    "sub" => $redditPost->{"data"}->{"subreddit_name_prefixed"},
                    "tags" => getRandomTags(3),
                    "votes" => (rand(1, 2000) * 2 - 2000)
                );
                shuffle($users);
            }
            return($results);
        }
    }

?>