<?php
    declare(strict_types=1);

    use Slim\Http\Request;
    use Slim\Http\Response;

    $this->app->get('/', function (Request $request, Response $response, array $args) {
        $this->logger->info($request->getOriginalMethod() . " " . $request->getUri()->getPath());
        $dbh = new \Sumidero\Database\DB($this);
        $v = new \Sumidero\Database\Version($dbh, $this->get('settings')['database']['type']);
        return $this->view->render($response, 'index.html.twig', array(
            'settings' => $this->settings["twigParams"],
            'initialState' => json_encode(
                array(
                    "logged" => \Sumidero\UserSession::isLogged(),
                    "session" => array(
                        "userId" => \Sumidero\UserSession::getUserId(),
                        "email" => \Sumidero\UserSession::getEmail(),
                        "nick" => \Sumidero\UserSession::getNick(),
                        "avatarUrl" => \Sumidero\UserSession::getAvatarUrl(),
                    ),
                    "subs" => \Sumidero\Post::searchSubs($dbh),
                    'upgradeAvailable' => $v->hasUpgradeAvailable(),
                    "defaultResultsPage" => $this->get('settings')['common']['defaultResultsPage'],
                    "allowSignUp" => $this->get('settings')['common']['allowSignUp']
                )
            )
        ));
    });

    $this->app->group("/api", function() {
        /* user */

        $this->group("/user", function() {

            $this->get('/poll', function (Request $request, Response $response, array $args) {
                return $response->withJson(['sessionId' => session_id() ], 200);
            });

            $this->post('/signin', function (Request $request, Response $response, array $args) {
                $u = new \Sumidero\User("", $request->getParam("email", ""), $request->getParam("password", ""), $request->getParam("nick", ""), "");
                $dbh = new \Sumidero\Database\DB($this);
                if ($u->login($dbh)) {
                    $v = new \Sumidero\Database\Version($dbh, $this->get('settings')['database']['type']);
                    return $response->withJson(
                        array(
                            'initialState' => array(
                                "logged" => \Sumidero\UserSession::isLogged(),
                                "session" => array(
                                    "userId" => \Sumidero\UserSession::getUserId(),
                                    "email" => \Sumidero\UserSession::getEmail(),
                                    "nick" => \Sumidero\UserSession::getNick(),
                                    "avatarUrl" => \Sumidero\UserSession::getAvatarUrl(),
                                ),
                                "subs" => \Sumidero\Post::searchSubs($dbh),
                                'upgradeAvailable' => $v->hasUpgradeAvailable(),
                                "defaultResultsPage" => $this->get('settings')['common']['defaultResultsPage'],
                                "allowSignUp" => $this->get('settings')['common']['allowSignUp']
                            )
                        )
                    , 200);
                } else {
                    return $response->withJson([], 401);
                }
            });

            $this->post('/signup', function (Request $request, Response $response, array $args) {
                if ($this->get('settings')['common']['allowSignUp']) {
                    $dbh = new \Sumidero\Database\DB($this);
                    $exists = false;
                    if (\Sumidero\User::findByEmail($dbh, $request->getParam("email", "")) != null) {
                        return $response->withJson(array("invalidOrMissingParams" => array("email")), 409);
                    } else if (\Sumidero\User::findByNick($dbh, $request->getParam("nick", "")) != null) {
                        return $response->withJson(array("invalidOrMissingParams" => array("nick")), 409);
                    } else {
                        $u = new \Sumidero\User(
                            (\Ramsey\Uuid\Uuid::uuid4())->toString(),
                            $request->getParam("email", ""),
                            $request->getParam("password", ""),
                            $request->getParam("nick", ""),
                            ""
                        );
                        $u->add($dbh);
                        return $response->withJson([], 200);
                    }
                } else {
                    throw new \Sumidero\Exception\AccessDeniedException("");
                }
            });

            $this->get('/signout', function (Request $request, Response $response, array $args) {
                \Sumidero\User::logout();
                $v = new \Sumidero\Database\Version(new \Sumidero\Database\DB($this), $this->get('settings')['database']['type']);
                return $response->withJson(
                    array(
                        'initialState' => array(
                            "logged" => \Sumidero\UserSession::isLogged(),
                            "session" => array(
                                "userId" => \Sumidero\UserSession::getUserId(),
                                "email" => \Sumidero\UserSession::getEmail(),
                                "nick" => \Sumidero\UserSession::getNick(),
                                "avatarUrl" => \Sumidero\UserSession::getAvatarUrl(),
                            ),
                            'upgradeAvailable' => $v->hasUpgradeAvailable(),
                            "defaultResultsPage" => $this->get('settings')['common']['defaultResultsPage'],
                            "allowSignUp" => $this->get('settings')['common']['allowSignUp']
                        )
                    )
                , 200);
            });
        });

        /* user */

        /* post */

        $this->group("/post", function() {

            $this->post('/scrap', function (Request $request, Response $response, array $args) {
                $data = (new \Sumidero\Scraper())->scrap($request->getParam("url", ""));
                return $response->withJson([
                    'title' => isset($data["title"]) ? $data["title"]: null,
                    'image' => isset($data["image"]) ? $data["image"]: null,
                    'body' => isset($data["article"]) && $data["article"]->textContent ? trim($data["article"]->textContent): null
                ], 200);
            });

            $this->post('/add', function (Request $request, Response $response, array $args) {
                $post = new \Sumidero\Post();
                $post->id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                $post->opUserId = \Sumidero\UserSession::getUserId();
                $externalUrl = $request->getParam("externalUrl", "");
                $post->sub = $request->getParam("sub", "");
                $post->tags = $request->getParam("tags", array());
                $post->permaLink = uniqid();
                if (! empty($externalUrl) && filter_var($externalUrl, FILTER_VALIDATE_URL)) {
                    $data = (new \Sumidero\Scraper())->scrap($externalUrl);
                    $post->permaLink = $externalUrl . uniqid();
                    $post->externalUrl = $externalUrl;
                    $post->domain = parse_url($externalUrl, PHP_URL_HOST);

                    $post->title  = $data["title"];
                    $post->body = $data["article"]->textContent ? substr(trim($data["article"]->textContent), 0, 384): "";
                    $post->thumbnail = $data["image"] ? $data["image"]: "";
                    $post->totalVotes = 0;
                    $post->totalComments = 0;
                } else {
                    $post->title = $request->getParam("title", "");
                    $post->body = $request->getParam("body", "");
                }
                $post->add(new \Sumidero\Database\DB($this));
                return $response->withJson(['id' => $post->id, 'title' => $post->title, 'image' => $post->thumbnail, 'body' => $post->body ], 200);
            });

        })->add(new \Sumidero\Middleware\CheckAuth($this->getContainer()));

        /* post */

        $this->get('/posts', function (Request $request, Response $response, array $args) {
            $data = \Sumidero\Post::search(
                new \Sumidero\Database\DB($this),
                1,
                16,
                array(
                    "sub" => $request->getParam("sub", ""),
                    "tag" => $request->getParam("tag", "")
                ),
                ""
            );
            return $response->withJson(['posts' => $data->results ], 200);
        });

    })->add(new \Sumidero\Middleware\APIExceptionCatcher($this->app->getContainer()));

    /*
    $this->app->group("/api", function() {

        $this->post('/post/scrap', function (Request $request, Response $response, array $args) {
            $data = (new \Sumidero\Scraper())->scrap($request->getParam("url", ""));
            return $response->withJson(['title' => $data["title"], 'image' => $data["image"], 'body' => $data["article"]->textContent ? trim($data["article"]->textContent): null ], 200);
        });

    })->add(new \Sumidero\Middleware\APIExceptionCatcher($this->app->getContainer()));
    */
?>
