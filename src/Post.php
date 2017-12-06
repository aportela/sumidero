<?php
    declare(strict_types=1);

    namespace Sumidero;

    class Post {
        public $id;
        public $opUserId;
        public $permaLink;
        public $externalUrl;
        public $domain;
        public $sub;
        public $title;
        public $body;
        public $thumbnail;
        public $totalVotes;
        public $totalComments;
        public $tags;

        public function __construct () {
            $this->tags = array();
        }

        public function __destruct() { }

        private function validateFields() {
            if (empty($this->id)) {
                throw new \Sumidero\Exception\InvalidParamsException("id");
            }
            if (empty($this->permaLink)) {
                throw new \Sumidero\Exception\InvalidParamsException("permaLink");
            }
            if (empty($this->title)) {
                throw new \Sumidero\Exception\InvalidParamsException("title");
            }
            $totalTags = count($this->tags);
            if ($totalTags > 0) {
                for ($i = 0; $i < $totalTags; $i++) {
                    $this->tags[$i] = mb_strtolower(trim($this->tags[$i]));
                    if (empty($this->tags[$i])) {
                        throw new \Sumidero\Exception\InvalidParamsException("tags");
                    }
                }
            }
        }

        public function add(\Sumidero\Database\DB $dbh) {
            $this->validateFields();
            $params = array(
                (new \Sumidero\Database\DBParam())->str(":id", $this->id),
                (new \Sumidero\Database\DBParam())->str(":original_poster_id", \Sumidero\UserSession::getUserId()),
                (new \Sumidero\Database\DBParam())->str(":permalink", $this->permaLink),
                (new \Sumidero\Database\DBParam())->str(":title", $this->title),
            );
            if (! empty($this->externalUrl)) {
                if (filter_var($this->externalUrl, FILTER_VALIDATE_URL)) {
                    $params[] = (new \Sumidero\Database\DBParam())->str(":external_url", $this->externalUrl);
                    $params[] = (new \Sumidero\Database\DBParam())->str(":domain", parse_url($this->externalUrl, PHP_URL_HOST));
                } else {
                    throw new \Sumidero\Exception\InvalidParamsException("externalUrl");
                }
            } else {
                $params[] = (new \Sumidero\Database\DBParam())->null(":external_url");
                $params[] = (new \Sumidero\Database\DBParam())->null(":domain");
            }
            if (! empty($this->sub)) {
                $params[] = (new \Sumidero\Database\DBParam())->str(":sub", $this->sub);
            } else {
                $params[] = (new \Sumidero\Database\DBParam())->null(":sub");
            }
            if (! empty($this->body)) {
                $params[] = (new \Sumidero\Database\DBParam())->str(":body", $this->body);
            } else {
                $params[] = (new \Sumidero\Database\DBParam())->null(":body");
            }
            if (! empty($this->thumbnail)) {
                $params[] = (new \Sumidero\Database\DBParam())->str(":thumbnail", $this->thumbnail);
            } else {
                $params[] = (new \Sumidero\Database\DBParam())->null(":thumbnail");
            }
            $query = '
                INSERT INTO POST
                    (id, original_poster_id, creation_date, permalink, domain, external_url, sub, total_votes, total_comments, title, body, thumbnail)
                VALUES
                    (:id, :original_poster_id, strftime("%s", "now"), :permalink, :domain, :external_url, :sub, 0, 0, :title, :body, :thumbnail)
            ';
            if ($dbh->execute($query, $params)) {
                if (count($this->tags) > 0) {
                    $query = " INSERT INTO POST_TAG (post_id, tag_name) VALUES (:post_id, :tag_name); ";
                    foreach($this->tags as $tag) {
                        $params = array(
                            (new \Sumidero\Database\DBParam())->str(":post_id", $this->id),
                            (new \Sumidero\Database\DBParam())->str(":tag_name", $tag)
                        );
                        $dbh->execute($query, $params);
                    }
                    return(true);
                } else {
                    return(true);
                }
            } else {
                return(false);
            }
        }

        public static function search(\Sumidero\Database\DB $dbh, int $page = 1, int $resultsPage = 16, array $filter = array(), string $order = "") {
            $results = array();
            $params = array();
            $whereCondition = "";
            $queryConditions = array();
            if (isset($filter)) {
                if (isset($filter["sub"]) && ! empty($filter["sub"])) {
                    $queryConditions[] = " P.sub LIKE :sub ";
                    $params[] = (new \Sumidero\Database\DBParam())->str(":sub", $filter["sub"]);
                }
                if (isset($filter["tag"]) && ! empty($filter["tag"])) {
                    $queryConditions[] = " EXISTS ( SELECT PT.tag_name FROM POST_TAG PT WHERE PT.post_id = P.id AND PT.tag_name = :tag ) ";
                    $params[] = (new \Sumidero\Database\DBParam())->str(":tag", $filter["tag"]);
                }
                if (isset($filter["domain"]) && ! empty($filter["domain"])) {
                    $queryConditions[] = " P.domain LIKE :domain ";
                    $params[] = (new \Sumidero\Database\DBParam())->str(":domain", $filter["domain"]);
                }
                if (isset($filter["title"]) && ! empty($filter["title"])) {
                    $queryConditions[] = " P.title LIKE :title ";
                    $params[] = (new \Sumidero\Database\DBParam())->str(":title", "%" . $filter["title"] . "%");
                }
                if (isset($filter["body"]) && ! empty($filter["body"])) {
                    $queryConditions[] = " P.body LIKE :body ";
                    $params[] = (new \Sumidero\Database\DBParam())->str(":body", "%" . $filter["body"] . "%");
                }
                $whereCondition = count($queryConditions) > 0 ? " WHERE " .  implode(" AND ", $queryConditions) : "";
            }
            $queryCount = sprintf('
                SELECT
                    COUNT (P.id) AS total
                FROM POST P
                %s
            ', $whereCondition);
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
                    P.total_votes AS totalVotes,
                    P.total_comments AS totalComments,
                    P.original_poster_id AS userId,
                    U.nick AS userNick,
                    U.avatar_url AS userAvatarUrl
                FROM POST P
                LEFT JOIN USER U ON U.id = P.original_poster_id
                %s
                %s
                LIMIT %d OFFSET %d
                ',
                $whereCondition,
                $sqlOrder,
                $resultsPage,
                $resultsPage * ($page - 1)
            );
            $data->results = $dbh->query($query, $params);
            return($data);
        }
    }

?>