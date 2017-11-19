<?php
    declare(strict_types=1);

    namespace Sumidero;

    class Post {
        public $id;
        public $originalPoster;
        public $permaLink;
        public $domain;
        public $externalUrl;
        public $sub;
        public $title;
        public $body;
        public $thumbnail;
        public $votes;
        public $comments;

        public function __construct (string $id, \Sumidero\User $originalPoster, string $permaLink, string $domain, string $externalUrl, string $sub, string $title, string $body, string $thumbnail) {
            $this->id = $id;
            $this->originalPoster = $originalPoster;
            $this->permaLink = $permaLink;
            $this->domain = $domain;
            $this->externalUrl = $externalUrl;
            $this->sub = $sub;
            $this->title = $title;
            $this->body = $body;
            $this->thumbnail = $thumbnail;
        }

        public function __destruct() {
        }

        public function add($dbh) {
            $params = array(
                (new \Sumidero\Database\DBParam())->str(":id", $this->id),
                (new \Sumidero\Database\DBParam())->str(":original_poster_id", $this->originalPoster->id),
                (new \Sumidero\Database\DBParam())->str(":permalink", $this->permaLink),
                (new \Sumidero\Database\DBParam())->str(":domain", $this->domain),
                (new \Sumidero\Database\DBParam())->str(":external_url", $this->externalUrl),
                (new \Sumidero\Database\DBParam())->str(":sub", $this->sub),
                (new \Sumidero\Database\DBParam())->int(":votes", (rand(1, 2000) * 2 - 2000)),
                (new \Sumidero\Database\DBParam())->int(":comments", rand(0, 16)),
                (new \Sumidero\Database\DBParam())->str(":title", $this->title),
                (new \Sumidero\Database\DBParam())->str(":body", $this->body),
                (new \Sumidero\Database\DBParam())->str(":thumbnail", $this->thumbnail),
            );
            $query = '
                INSERT INTO POST
                    (id, original_poster_id, creation_date, permalink, domain, external_url, sub, votes, comments, title, body, thumbnail)
                VALUES
                    (:id, :original_poster_id, strftime("%s", "now"), :permalink, :domain, :external_url, :sub, :votes, :comments, :title, :body, :thumbnail)
            ';
            return($dbh->execute($query, $params));
        }

        public static function search($dbh, int $page = 1, int $resultsPage = 16, array $filter = array(), string $order = "", bool $cache = true) {
            /*
            $redditCachedJsonFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . "data" . DIRECTORY_SEPARATOR . "reddit.json";
            if (file_exists($redditCachedJsonFile) && $cache) {
                $redditJson = file_get_contents($redditCachedJsonFile);
            } else {
                $redditJson = file_get_contents(sprintf("https://www.reddit.com%s.json", $subReddits[array_rand($subReddits)]));
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
                $id = \Sumidero\UUID::generate(true);
                $results[] = array(
                    "id" => $id,
                    "user" => $users[array_rand($users)], // author
                    "title" => $redditPost->{"data"}->{"title"},
                    "domain" => $redditPost->{"data"}->{"domain"},
                    "body" => null,
                    "url" => $redditPost->{"data"}->{"url"},
                    "permalink" => sprintf("/post/%s/%s", $id, \Sumidero\Utils::convertSafeURI($redditPost->{"data"}->{"title"})),
                    "thumbnail" => $redditPost->{"data"}->{"thumbnail"},
                    "created" => $redditPost->{"data"}->{"created"},
                    "sub" => str_replace("r/", "", $redditPost->{"data"}->{"subreddit_name_prefixed"}),
                    "tags" => getRandomTags(3),
                    "votes" => (rand(1, 2000) * 2 - 2000),
                    "comments" => rand(0, 4)
                );
                shuffle($users);
            }
            */
            $results = array();
            if ($dbh == null) {
                $dbh = new \Sumidero\Database\DB();
            }
            $params = array();
            $whereCondition = "";
            if (isset($filter)) {
            }
            $queryCount = '
                SELECT
                    COUNT (P.id) AS total
                FROM POST P
            ';
            $result = $dbh->query($queryCount, $params);
            $data = new \stdClass();
            $data->actualPage = $page;
            $data->resultsPage = $resultsPage;
            $data->totalResults = $result[0]->total;
            $data->totalPages = ceil($data->totalResults / $resultsPage);
            $sqlOrder = "";
            if (! empty($order) && $order == "random") {
                $sqlOrder = " ORDER BY RANDOM() ";
            } else {
                $sqlOrder = " ORDER BY P.creation_date DESC ";
            }
            $query = sprintf('
                SELECT
                    P.id,
                    P.title,
                    P.body,
                    P.thumbnail,
                    P.creation_date as created,
                    P.sub,
                    P.permalink,
                    P.domain,
                    P.external_url AS externalUrl,
                    P.votes,
                    P.comments,
                    P.original_poster_id AS userId,
                    U.name AS userName,
                    U.full_name AS userFullName,
                    U.avatar_url AS userAvatar
                FROM POST P
                LEFT JOIN USER U ON U.id = P.original_poster_id
                %s
                LIMIT %d OFFSET %d
                ',
                $sqlOrder,
                $resultsPage,
                $resultsPage * ($page - 1)
            );
            $data->results = $dbh->query($query, $params);
            return($data);
        }
    }

?>