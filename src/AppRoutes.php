<?php
    declare(strict_types=1);

    use Slim\Http\Request;
    use Slim\Http\Response;

    $app->get('/', function (Request $request, Response $response, array $args) {
        $this->logger->info("Slim-Skeleton GET '/' route");
        return $this->view->render($response, 'index.html.twig', array(
            'settings' => $this->settings["twigParams"]
        ));
    });

    $app->get('/api/poll', function (Request $request, Response $response, array $args) {
        $this->logger->info("Slim-Skeleton GET '/api/poll' route");
        return $response->withJson(['success' => true], 200);
    })->add(new \Sumidero\Middleware\APIExceptionCatcher);


    $app->get('/api/posts', function (Request $request, Response $response, array $args) {
        $this->logger->info("Slim-Skeleton GET '/api/posts' route");
        $results = \Sumidero\Post::search(null, 1, 16, array(), "");
        return $response->withJson(['success' => true, 'posts' => $results ], 200);
    })->add(new \Sumidero\Middleware\APIExceptionCatcher);

?>