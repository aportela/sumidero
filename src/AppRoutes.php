<?php
    declare(strict_types=1);

    use Slim\Http\Request;
    use Slim\Http\Response;

    $this->app->get('/', function (Request $request, Response $response, array $args) {
        $this->logger->info($request->getOriginalMethod() . " " . $request->getUri()->getPath());
        return $this->view->render($response, 'index.html.twig', array(
            'settings' => $this->settings["twigParams"]
        ));
    });

    $this->app->group("/api", function() {
        $this->get('/poll', function (Request $request, Response $response, array $args) {
            return $response->withJson(['success' => true], 200);
        });

        $this->get('/posts', function (Request $request, Response $response, array $args) {
            $data = \Sumidero\Post::search(null, 1, 16, array(), "random");
            return $response->withJson(['posts' => $data->results ], 200);
        });

        $this->post('/post/scrap', function (Request $request, Response $response, array $args) {
            $data = (new \Sumidero\Scraper())->scrap($request->getParam("url", ""));
            return $response->withJson(['title' => $data["title"], 'image' => $data["image"], 'body' => $data["article"]->textContent ? trim($data["article"]->textContent): null ], 200);
        });

        $this->post('/post/add', function (Request $request, Response $response, array $args) {
            $dbh = new \Sumidero\Database\DB();
            $user = \Sumidero\User::getRandom();
            $user->add($dbh);
            $externalUrl = $request->getParam("externalUrl", "");
            if (! empty($externalUrl)) {
                $subReddits = array("all", "todayilearned", "gaming", "movies", "mildlyinteresting", "science", "OldSchoolCool");
                shuffle($subReddits);
                $data = (new \Sumidero\Scraper())->scrap($externalUrl);
                $post = new \Sumidero\Post(
                    \Sumidero\UUID::generate(true),
                    $user,
                    $externalUrl . uniqid(),
                    parse_url($externalUrl, PHP_URL_HOST),
                    $externalUrl,
                    $subReddits[array_rand($subReddits)],
                    $data["title"],
                    $data["article"]->textContent ? substr(trim($data["article"]->textContent), 0, 384): "",
                    $data["image"] ? $data["image"]: ""
                );
                $post->add($dbh);
            }
            return $response->withJson(['id' => $post->id, 'title' => $post->title, 'image' => $post->thumbnail, 'body' => $post->body ], 200);
        });

    })->add(new \Sumidero\Middleware\APIExceptionCatcher($this->app->getContainer()));

?>