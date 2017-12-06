<?php

    declare(strict_types=1);

    namespace Sumidero\Middleware;

    class APIExceptionCatcher {

        private $container;

        public function __construct($container) {
            $this->container = $container;
        }

        /**
         * Example middleware invokable class
         *
         * @param  \Psr\Http\Message\ServerRequestInterface $request  PSR7 request
         * @param  \Psr\Http\Message\ResponseInterface      $response PSR7 response
         * @param  callable                                 $next     Next middleware
         *
         * @return \Psr\Http\Message\ResponseInterface
         */
        public function __invoke($request, $response, $next)
        {
            try {
                $this->container["apiLogger"]->info($request->getOriginalMethod() . " " . $request->getUri()->getPath());
                $this->container["apiLogger"]->debug($request->getBody());
                $response = $next($request, $response);
                return $response;
            } catch (\Sumidero\Exception\InvalidParamsException $e) {
                $this->container["apiLogger"]->debug("Exception caught: " . $e->getMessage());
                $fields = array();
                if (mb_strpos(",", $e->getMessage) > 0) {
                    $fields = explode(",", $e->getMessage());
                } else {
                    $fields[] = $e->getMessage();
                }
                return $response->withJson(['invalidOrMissingParams' => $fields], 400);
            } catch (\Sumidero\Exception\NotFoundException $e) {
                $this->container["apiLogger"]->debug("Exception caught: " . $e->getMessage());
                if (! empty($e->getMessage())) {
                    return $response->withJson(['keyNotFound' => $e->getMessage()], 404);
                } else {
                    return $response->withJson([], 404);
                }
            } catch (\Sumidero\Exception\AccessDenied $e) {
                $this->container["apiLogger"]->debug("Exception caught: " . $e->getMessage());
                return $response->withJson([], 403);
            } catch (\Throwable $e) {
                $this->container["apiLogger"]->error("Exception caught: " . $e->getMessage());
                return $response->withJson(['exceptionDetails' => $e->getMessage()], 500);
            }
        }
    }

?>