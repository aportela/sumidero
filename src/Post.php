<?php
    declare(strict_types=1);

    namespace Sumidero;

    class Post {
        public $id;
        public $op;
        public $externalUrl;
        public $domain;
        public $sub;
        public $title;
        public $body;
        public $thumbnail;
        public $tags;
        public $nsfw;

        public function __construct () {
            $this->tags = array();
        }

        public function __destruct() { }

        private function validateFields() {
            if (empty($this->id)) {
                throw new \Sumidero\Exception\InvalidParamsException("id");
            }
            if (! empty($this->title)) {
                if (mb_strlen($this->title) > 128) {
                    throw new \Sumidero\Exception\InvalidParamsException("title");
                }
            }
            if (! empty($this->body)) {
                if (mb_strlen($this->body) > 16384) {
                    throw new \Sumidero\Exception\InvalidParamsException("body");
                }
            }
            if (! empty($this->externalUrl)) {
                if (filter_var($this->externalUrl, FILTER_VALIDATE_URL)) {
                    if (mb_strlen($this->externalUrl) > 2048) {
                        throw new \Sumidero\Exception\InvalidParamsException("externalUrl");
                    }
                    $this->domain = parse_url($this->externalUrl, PHP_URL_HOST);
                    if (! empty($this->domain)) {
                        if (mb_strlen($this->domain) > 255) {
                            throw new \Sumidero\Exception\InvalidParamsException("domain");
                        }
                    } else {
                        throw new \Sumidero\Exception\InvalidParamsException("domain");
                    }
                } else {
                    throw new \Sumidero\Exception\InvalidParamsException("externalUrl");
                }
            }
            if (! empty($this->thumbnail)) {
                if (mb_strlen($this->thumbnail) > 2048) {
                    throw new \Sumidero\Exception\InvalidParamsException("thumbnail");
                }
            }
            if (! empty($this->sub)) {
                if (mb_strlen($this->sub) > 32) {
                    throw new \Sumidero\Exception\InvalidParamsException("sub");
                }
            } else {
                throw new \Sumidero\Exception\InvalidParamsException("sub");
            }
            $totalTags = count($this->tags);
            if ($totalTags > 0) {
                for ($i = 0; $i < $totalTags; $i++) {
                    $this->tags[$i] = mb_strtolower(trim($this->tags[$i]));
                    if (empty($this->tags[$i]) || mb_strlen($this->tags[$i]) > 32) {
                        throw new \Sumidero\Exception\InvalidParamsException("tags");
                    }
                }
            }
        }

        public function existsExternalUrl(\Sumidero\Database\DB $dbh, string $ignoreId = "") {
            $params = array(
                (new \Sumidero\Database\DBParam())->str(":external_url", $this->externalUrl)
            );
            $whereCondition = null;
            if (! empty($ignoreId)) {
                $whereCondition = " AND id <> :id ";
                $params[] = (new \Sumidero\Database\DBParam())->str(":id", mb_strtolower($ignoreId));
            }
            $results = $dbh->query(sprintf
                (
                    "
                        SELECT id
                        FROM POST
                        WHERE external_url = :external_url
                        %s
                    ", $whereCondition
                ), $params
            );
            return(count($results) > 0);
        }

        public function add(\Sumidero\Database\DB $dbh) {
            $this->validateFields();
            $params = array(
                (new \Sumidero\Database\DBParam())->str(":id", $this->id),
                (new \Sumidero\Database\DBParam())->str(":op_user_id", \Sumidero\UserSession::getUserId()),
                (new \Sumidero\Database\DBParam())->str(":sub", $this->sub),
                (new \Sumidero\Database\DBParam())->str(":nsfw", $this->nsfw ? "Y": "N")
            );
            if (! empty($this->title)) {
                $params[] = (new \Sumidero\Database\DBParam())->str(":title", $this->title);
            } else {
                $params[] = (new \Sumidero\Database\DBParam())->null(":title");
            }
            if (! empty($this->body)) {
                $params[] = (new \Sumidero\Database\DBParam())->str(":body", $this->body);
            } else {
                $params[] = (new \Sumidero\Database\DBParam())->null(":body");
            }
            if (! empty($this->externalUrl)) {
                if (! $this->existsExternalUrl($dbh, "")) {
                    $params[] = (new \Sumidero\Database\DBParam())->str(":external_url", $this->externalUrl);
                    $params[] = (new \Sumidero\Database\DBParam())->str(":domain", parse_url($this->externalUrl, PHP_URL_HOST));
                } else {
                    throw new \Sumidero\Exception\AlreadyExistsException("externalUrl");
                }
            } else {
                $params[] = (new \Sumidero\Database\DBParam())->null(":external_url");
                $params[] = (new \Sumidero\Database\DBParam())->null(":domain");
            }
            if (! empty($this->thumbnail)) {
                $params[] = (new \Sumidero\Database\DBParam())->str(":thumbnail", $this->thumbnail);
            } else {
                $params[] = (new \Sumidero\Database\DBParam())->null(":thumbnail");
            }
            $query = '
                INSERT INTO POST
                    (id, op_user_id, creation_timestamp, domain, external_url, sub, title, body, thumbnail, total_comments, nsfw)
                VALUES
                    (:id, :op_user_id, strftime("%s", "now"), :domain, :external_url, :sub, :title, :body, :thumbnail, 0, :nsfw)
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

        /**
         * check for post write permissions (update/delete)
         */
        private function hasWritePermission(\Sumidero\Database\DB $dbh): bool
        {
            $hasPermission = false;
            $query = " SELECT COUNT(id) AS total FROM POST WHERE id = :id AND op_user_id = :op_user_id ";
            $params = array(
                (new \Sumidero\Database\DBParam())->str(":id", $this->id),
                (new \Sumidero\Database\DBParam())->str(":op_user_id", \Sumidero\UserSession::getUserId())
            );
            $data = $dbh->query($query, $params);
            if($data[0]) {
                $hasPermission = $data[0]->total == 1;
            }
            return($hasPermission);
        }


        public function update(\Sumidero\Database\DB $dbh) {
            if ($this->hasWritePermission($dbh)) {
                $this->validateFields();
                $params = array(
                    (new \Sumidero\Database\DBParam())->str(":id", $this->id),
                    (new \Sumidero\Database\DBParam())->str(":op_user_id", \Sumidero\UserSession::getUserId()),
                    (new \Sumidero\Database\DBParam())->str(":sub", $this->sub),
                    (new \Sumidero\Database\DBParam())->str(":nsfw", $this->nsfw ? "Y": "N")
                );
                if (! empty($this->title)) {
                    $params[] = (new \Sumidero\Database\DBParam())->str(":title", $this->title);
                } else {
                    $params[] = (new \Sumidero\Database\DBParam())->null(":title");
                }
                if (! empty($this->body)) {
                    $params[] = (new \Sumidero\Database\DBParam())->str(":body", $this->body);
                } else {
                    $params[] = (new \Sumidero\Database\DBParam())->null(":body");
                }
                if (! empty($this->externalUrl)) {
                    if (! $this->existsExternalUrl($dbh, $this->id)) {
                        $params[] = (new \Sumidero\Database\DBParam())->str(":external_url", $this->externalUrl);
                        $params[] = (new \Sumidero\Database\DBParam())->str(":domain", parse_url($this->externalUrl, PHP_URL_HOST));
                    } else {
                        throw new \Sumidero\Exception\AlreadyExistsException("externalUrl");
                    }
                } else {
                    $params[] = (new \Sumidero\Database\DBParam())->null(":external_url");
                    $params[] = (new \Sumidero\Database\DBParam())->null(":domain");
                }
                if (! empty($this->thumbnail)) {
                    $params[] = (new \Sumidero\Database\DBParam())->str(":thumbnail", $this->thumbnail);
                } else {
                    $params[] = (new \Sumidero\Database\DBParam())->null(":thumbnail");
                }
                $query = '
                    UPDATE POST
                        SET
                            domain = :domain,
                            external_url = :external_url,
                            sub = :sub,
                            title = :title,
                            body = :body,
                            thumbnail = :thumbnail,
                            nsfw = :nsfw
                    WHERE id = :id
                    AND op_user_id = :op_user_id
                ';
                if ($dbh->execute($query, $params)) {
                    if (count($this->tags) > 0) {
                        $query = " DELETE FROM POST_TAG WHERE post_id = :post_id; ";
                        $params = array(
                            (new \Sumidero\Database\DBParam())->str(":post_id", $this->id),
                        );
                        $dbh->execute($query, $params);
                        $query = " INSERT INTO POST_TAG (post_id, tag_name) VALUES (:post_id, :tag_name); ";
                        foreach($this->tags as $tag) {
                            $params[] = (new \Sumidero\Database\DBParam())->str(":tag_name", $tag);
                            $dbh->execute($query, $params);
                        }
                        return(true);
                    } else {
                        return(true);
                    }
                } else {
                    return(false);
                }
            } else {
                throw new \Sumidero\Exception\AccessDeniedException("");
            }
        }

        public function addComment(\Sumidero\Database\DB $dbh, string $body = "") {
            if (empty($this->id)) {
                throw new \Sumidero\Exception\InvalidParamsException("id");
            }
            if (empty($body || mb_strlen($body) > 2048)) {
                throw new \Sumidero\Exception\InvalidParamsException("body");
            }
            $params = array(
                (new \Sumidero\Database\DBParam())->str(":id", (\Ramsey\Uuid\Uuid::uuid4())->toString()),
                (new \Sumidero\Database\DBParam())->str(":post_id", $this->id),
                (new \Sumidero\Database\DBParam())->str(":c_user_id", \Sumidero\UserSession::getUserId()),
                (new \Sumidero\Database\DBParam())->str(":body", $this->body),
            );
            $query = '
                INSERT INTO POST_COMMENT
                    (id, post_id, c_user_id, creation_timestamp, body)
                VALUES
                    (:id, :post_id, :c_user_id, strftime("%s", "now"), :body)
            ';
            return($dbh->execute($query, $params));
        }

        public function get(\Sumidero\Database\DB $dbh) {
            $params = array();
            $whereConditions = null;
            if (! empty($this->id)) {
                $params[] = (new \Sumidero\Database\DBParam())->str(":id", $this->id);
                $whereConditions = " WHERE P.id = :id ";
            } else if (! empty($this->permaLink)) {
                $params[] = (new \Sumidero\Database\DBParam())->str(":permalink", $this->permaLink);
                $whereConditions = " WHERE P.permalink = :permalink ";
            } else  {
                throw new \Sumidero\Exception\InvalidParamsException("id,permaLink");
            }
            $query = sprintf('
                SELECT
                    P.id,
                    P.title,
                    P.body,
                    P.thumbnail,
                    P.creation_timestamp as created,
                    P.sub,
                    P.domain,
                    P.external_url AS externalUrl,
                    P.op_user_id AS userId,
                    U.name AS userName,
                    U.avatar AS userAvatar,
                    T.tags,
                    P.total_comments AS totalComments,
                    P.nsfw
                FROM POST P
                LEFT JOIN USER U ON U.id = P.op_user_id
                LEFT JOIN (
                    SELECT PT.post_id, group_concat(PT.tag_name) AS tags
                    FROM POST_TAG PT
                    GROUP BY PT.post_id
                ) T ON T.post_id = P.id
                %s
            ', $whereConditions);
            $data = $dbh->query($query, $params);

            if($data[0]) {
                $this->id = $data[0]->id;
                $this->title = $data[0]->title;
                $this->body = $data[0]->body;
                $this->thumbnail = $data[0]->thumbnail;
                $this->created = $data[0]->created;
                $this->sub = $data[0]->sub;
                $this->domain = $data[0]->domain;
                $this->externalUrl = $data[0]->externalUrl;
                $this->op = new \stdclass();
                $this->op->id = $data[0]->userId;
                $this->op->name = $data[0]->userName;
                $this->op->avatar = $data[0]->userAvatar;
                $this->tags = $data[0]->tags ? explode(",", $data[0]->tags): array();
                $this->totalComments = $data[0]->totalComments;
                $this->nsfw = $data[0]->nsfw == "Y";
            } else {
                throw new \Sumidero\Exception\NotFoundException("");
            }
        }

        public function delete(\Sumidero\Database\DB $dbh) {
            if (empty($this->id)) {
                throw new \Sumidero\Exception\InvalidParamsException("id");
            }
            if ($this->hasWritePermission($dbh)) {
                $params = array(
                    (new \Sumidero\Database\DBParam())->str(":id", $this->id)
                );
                $query = ' DELETE FROM POST_TAG WHERE post_id = :id ';
                if ($dbh->execute($query, $params)) {
                    $query = ' DELETE FROM POST_COMMENT WHERE post_id = :id ';
                    if ($dbh->execute($query, $params)) {
                        $query = ' DELETE FROM POST WHERE id = :id ';
                        return($dbh->execute($query, $params));
                    } else {
                        return(false);
                    }
                } else {
                    return(false);
                }
            } else {
                throw new \Sumidero\Exception\AccessDeniedException("");
            }
        }

        public static function search(\Sumidero\Database\DB $dbh, int $currentPage = 1, int $resultsPage = 16, array $filter = array(), string $sortBy = "creationTimestamp", string $sortOrder = "DESC") {
            $data = new \stdClass();
            $data->pagination = new \stdClass();
            $data->results = array();
            $params = array();
            $whereCondition = "";
            $queryConditions = array();
            if (isset($filter)) {
                if (isset($filter["userId"]) && ! empty($filter["userId"])) {
                    $queryConditions[] = " P.op_user_id = :op_user_id ";
                    $params[] = (new \Sumidero\Database\DBParam())->str(":op_user_id", $filter["userId"]);
                }
                if (isset($filter["domain"]) && ! empty($filter["domain"])) {
                    $queryConditions[] = " P.domain = :domain ";
                    $params[] = (new \Sumidero\Database\DBParam())->str(":domain", $filter["domain"]);
                }
                if (isset($filter["sub"]) && ! empty($filter["sub"])) {
                    $queryConditions[] = " P.sub LIKE :sub ";
                    $params[] = (new \Sumidero\Database\DBParam())->str(":sub", $filter["sub"]);
                }
                if (!( isset($filter["nsfw"]) && $filter["nsfw"] === true)) {
                    $queryConditions[] = " P.nsfw = 'N' ";
                }
                if (isset($filter["tag"]) && ! empty($filter["tag"])) {
                    $queryConditions[] = " EXISTS ( SELECT PT.tag_name FROM POST_TAG PT WHERE PT.post_id = P.id AND PT.tag_name = :tag ) ";
                    $params[] = (new \Sumidero\Database\DBParam())->str(":tag", $filter["tag"]);
                }
                if (isset($filter["domain"]) && ! empty($filter["domain"])) {
                    $queryConditions[] = " P.domain = :domain ";
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
            $data->pagination->currentPage = $currentPage;
            $data->pagination->resultsPage = $resultsPage;
            $data->pagination->totalResults = $result[0]->total;
            if ($data->pagination->resultsPage > 0) {
                $data->pagination->totalPages = ceil($data->pagination->totalResults / $resultsPage);
            } else {
                $data->pagination->totalPages = $data->pagination->totalResults > 0 ? 1: 0;
            }
            if ($data->pagination->totalResults > 0) {
                $sqlSortBy = "";
                switch($sortBy) {
                    default:
                        $sqlSortBy = "P.creation_timestamp";
                    break;
                }
                $query = sprintf('
                    SELECT
                        P.id,
                        P.title,
                        P.body,
                        P.thumbnail,
                        P.creation_timestamp as created,
                        P.sub,
                        P.domain,
                        P.external_url AS externalUrl,
                        P.op_user_id AS userId,
                        U.name AS userName,
                        U.avatar AS userAvatar,
                        T.tags,
                        P.total_comments AS totalComments
                    FROM POST P
                    LEFT JOIN USER U ON U.id = P.op_user_id
                    LEFT JOIN (
                        SELECT PT.post_id, group_concat(PT.tag_name) AS tags
                        FROM POST_TAG PT
                        GROUP BY PT.post_id
                    ) T ON T.post_id = P.id
                    %s
                    ORDER BY %s COLLATE NOCASE %s
                    %s
                    ',
                    $whereCondition,
                    $sqlSortBy,
                    $sortOrder == "DESC" ? "DESC": "ASC",
                    $data->pagination->resultsPage > 0 ? sprintf("LIMIT %d OFFSET %d", $data->pagination->resultsPage, $data->pagination->resultsPage * ($data->pagination->currentPage - 1)) : null
                );
                $data->results = $dbh->query($query, $params);
            }
            return($data);
        }

        public static function searchSubs(\Sumidero\Database\DB $dbh): array {
            if (\Sumidero\UserSession::getNSFW()) {
                $query = "
                    SELECT DISTINCT(sub)
                    FROM POST
                    ORDER BY sub
                ";
            } else {
                $query = "
                    SELECT DISTINCT(sub)
                    FROM POST
                    WHERE nsfw = 'N'
                    ORDER BY sub
                ";
            }
            $results = $dbh->query($query, array());
            $subs = array();
            foreach($results as $result) {
                $subs[] = $result->sub;
            }
            return($subs);
        }

        public static function searchTags(\Sumidero\Database\DB $dbh): array {
            if (\Sumidero\UserSession::getNSFW()) {
                $query = "
                    SELECT DISTINCT(tag_name) AS tag
                    FROM POST_TAG
                    ORDER BY tag_name
                ";
            } else {
                $query = "
                    SELECT DISTINCT tag_name AS tag
                    FROM POST_TAG
                    INNER JOIN POST ON POST.id = POST_TAG.post_id
                    WHERE POST.nsfw = 'N'
                ";
            }
            $results = $dbh->query($query, array());
            $tags = array();
            foreach($results as $result) {
                $tags[] = $result->tag;
            }
            return($tags);
        }

    }

?>