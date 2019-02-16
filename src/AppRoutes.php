<?php
    declare(strict_types=1);

    use Slim\Http\Request;
    use Slim\Http\Response;

    $this->app->get('/', function (Request $request, Response $response, array $args) {
        $this->logger->info($request->getOriginalMethod() . " " . $request->getUri()->getPath());
        return $this->view->render($response, 'index.html.twig', array(
            'settings' => $this->settings["twigParams"],
            'initialState' => json_encode(
                \Sumidero\Utils::getInitialState($this)
            )
        ));
    });

    $this->app->group("/api", function() {

        $this->post('/poll', function (Request $request, Response $response, array $args) {
            $this->logger->info($request->getOriginalMethod() . " " . $request->getUri()->getPath());
            \Sumidero\UserSession::setNSFW((bool) $request->getParam("nsfw", false));
            return $response->withJson(
                [
                    'success' => true,
                    'initialState' => \Sumidero\Utils::getInitialState($this)
                ],
                200
            );
        });

        $this->post('/signin', function (Request $request, Response $response, array $args) {
            $user = new \Sumidero\User(
                "",
                $request->getParam("email", ""),
                "",
                $request->getParam("password", "")
            );
            if ($user->login(new \Sumidero\Database\DB($this))) {
                return $response->withJson(
                    [
                        'success' => true,
                        'initialState' => \Sumidero\Utils::getInitialState($this)
                    ],
                    200
                );
            } else {
                throw new \Sumidero\Exception\UnauthorizedException();
            }
        });

        $this->post('/signup', function (Request $request, Response $response, array $args) {
            if ($this->get('settings')['common']['allowSignUp']) {
                $dbh = new \Sumidero\Database\DB($this);
                $user = new \Sumidero\User(
                    "",
                    $request->getParam("email", ""),
                    $request->getParam("name", ""),
                    $request->getParam("password", "")
                );
                if (\Sumidero\User::existsEmail($dbh, $user->email)) {
                    throw new \Sumidero\Exception\AlreadyExistsException("email");
                } else if (\Sumidero\User::existsName($dbh, $user->name)) {
                    throw new \Sumidero\Exception\AlreadyExistsException("name");
                } else {
                    $user->id = (\Ramsey\Uuid\Uuid::uuid4())->toString();
                    $user->add($dbh);
                    return $response->withJson(
                        [
                            'success' => true,
                        ], 200
                    );
                }
            } else {
                throw new \Sumidero\Exception\AccessDeniedException("");
            }
        });

        $this->get('/signout', function (Request $request, Response $response, array $args) {
            \Sumidero\User::logout();
            return $response->withJson(
                [
                    'success' => true
                ], 200
            );
        });

        $this->group("/user", function() {

            $this->get('/{id}', function (Request $request, Response $response, array $args) {
                $route = $request->getAttribute('route');
                $user = new \Sumidero\User(
                    $route->getArgument("id")
                );
                $dbh = new \Sumidero\Database\DB($this);
                $user->get($dbh);
                if (! $user->deletionDate) {
                    unset($user->password);
                    unset($user->passwordHash);
                    unset($user->deletionDate);
                    return $response->withJson(
                        [
                            'success' => true,
                            "user" => $user
                        ], 200
                    );
                } else {
                    throw new \Sumidero\Exception\DeletedException();
                }
            });

            $this->put('/{id}', function (Request $request, Response $response, array $args) {
                $route = $request->getAttribute('route');
                $user = new \Sumidero\User(
                    $route->getArgument("id"),
                    $request->getParam("email", ""),
                    $request->getParam("name", ""),
                    $request->getParam("password", ""),
                    $request->getParam("avatar", "")
                );
                if ($user->id == \Sumidero\UserSession::getUserId()) {
                    $dbh = new \Sumidero\Database\DB($this);
                    if (\Sumidero\User::existsEmail($dbh, $user->email, $user->id)) {
                        throw new \Sumidero\Exception\AlreadyExistsException("email");
                    } else if (\Sumidero\User::existsName($dbh, $user->name, $user->id)) {
                        throw new \Sumidero\Exception\AlreadyExistsException("name");
                    } else {
                        $user->update($dbh);
                        \Sumidero\UserSession::set($user->id, $user->email, $user->name, $user->avatar);
                        return $response->withJson(
                            [
                                'success' => true,
                                'initialState' => \Sumidero\Utils::getInitialState($this)
                            ], 200
                        );
                    }
                } else {
                    throw new \Sumidero\Exception\AccessDeniedException();
                }
            });

            $this->post('/{id}/avatar', function (Request $request, Response $response, array $args) {
                $route = $request->getAttribute('route');
                $id = $route->getArgument("id");
                if ($id == \Sumidero\UserSession::getUserId()) {
                    $directory = "c:\\temp\\";
                    $uploadedFiles = $request->getUploadedFiles();
                    // handle single input with single file upload
                    $uploadedFile = $uploadedFiles['avatar'];
                    if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
                        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
                        $avatar = sprintf("%s.%s", $id, $extension);
                        $destinationDirectory = $this->settings["avatarsLocalPath"];
                        if (file_exists($destinationDirectory)) {
                            $uploadedFile->moveTo($destinationDirectory . $avatar);
                            $user = new \Sumidero\User($id);
                            $dbh = new \Sumidero\Database\DB($this);
                            $user->get($dbh);
                            $user->avatar = $avatar;
                            $user->update($dbh);
                            return $response->withJson(
                                [
                                    'success' => true,
                                    'avatar' => $avatar
                                ]
                            );
                        } else {
                            throw new \Sumidero\Exception\UploadException("local avatar path not found");
                        }
                    } else {
                        throw new \Sumidero\Exception\UploadException($uploadedFile->getError());
                    }
                } else {
                    throw new \Sumidero\Exception\AccessDeniedException();
                }
            });
        });

        $this->post('/scrap', function (Request $request, Response $response, array $args) {
            $scraper = new \Sumidero\Scraper();
            $url = $request->getParam("url", "");
            $data = $scraper->scrap($url);
            $embed = $scraper->embed($url);
            $tags = $scraper->getSuggestedTags($url);
            return $response->withJson([
                'title' => $embed->title, // isset($data["title"]) ? $data["title"]: null,
                'image' => $embed->image, // isset($data["image"]) ? $data["image"]: null,
                'body' => isset($data["article"]) && $data["article"]->textContent ? trim($data["article"]->textContent): null,
                'suggestedTags' => $tags
            ], 200);
        });

        /* post */

        $this->group("/post", function() {

            $this->post('/{id}', function (Request $request, Response $response, array $args) {
                $route = $request->getAttribute('route');
                $post = new \Sumidero\Post();
                $post->id = $route->getArgument("id");
                $post->title = $request->getParam("title", "");
                $post->body = $request->getParam("body", "");
                $post->sub = $request->getParam("sub", "");
                $post->tags = $request->getParam("tags", array());
                $post->externalUrl = $request->getParam("externalUrl", "");
                $post->thumbnail = $request->getParam("thumbnail", "");
                $post->nsfw = (bool) $request->getParam("nsfw", false);
                $post->add(new \Sumidero\Database\DB($this));
                return $response->withJson(['success' => true ], 200);
            });

            $this->put('/{id}', function (Request $request, Response $response, array $args) {
                $route = $request->getAttribute('route');
                $post = new \Sumidero\Post();
                $post->id = $route->getArgument("id");
                $post->title = $request->getParam("title", "");
                $post->body = $request->getParam("body", "");
                $post->sub = $request->getParam("sub", "");
                $post->tags = $request->getParam("tags", array());
                $post->externalUrl = $request->getParam("externalUrl", "");
                $post->thumbnail = $request->getParam("thumbnail", "");
                $post->nsfw = (bool) $request->getParam("nsfw", false);
                $post->update(new \Sumidero\Database\DB($this));
                return $response->withJson(['success' => true ], 200);
            });

            $this->get('/{id}', function (Request $request, Response $response, array $args) {
                $post = new \Sumidero\Post();
                $post->id = $args['id'];
                $post->get(new \Sumidero\Database\DB($this));
                return $response->withJson([ "post" => $post ], 200);
            });

            $this->delete('/{id}', function (Request $request, Response $response, array $args) {
                $post = new \Sumidero\Post();
                $post->id = $args['id'];
                $post->delete(new \Sumidero\Database\DB($this));
                return $response->withJson([], 200);
            });

        })->add(new \Sumidero\Middleware\CheckAuth($this->getContainer()));

        /* post */

        $this->post('/search', function (Request $request, Response $response, array $args) {
            $data = \Sumidero\Post::search(
                new \Sumidero\Database\DB($this),
                intval($request->getParam("currentPage", 1)),
                intval($request->getParam("count", 16)),
                array(
                    "sub" => $request->getParam("sub", ""),
                    "tag" => $request->getParam("tag", ""),
                    "title" => $request->getParam("title", ""),
                    "nsfw" => (bool) $request->getParam("nsfw", false)
                ),
                $request->getParam("sortBy", ""),
                $request->getParam("sortOrder", "")
            );
            return $response->withJson(['posts' => $data->results ], 200);
        });

        $this->get('/thumbnail', function (Request $request, Response $response, array $args) {
            $file = \Sumidero\Thumbnail::Get($request->getParam("url", ""));
            if (! empty($file) && file_exists($file)) {
                $filesize = filesize($file);
                $f = fopen($file, 'r');
                fseek($f, 0);
                $data = fread($f, $filesize);
                fclose($f);
                return $response->withStatus(200)
                ->withHeader('Content-Type', "image/jpeg")
                ->withHeader('Content-Length', $filesize)
                ->write($data);
            } else {
                return $response->withStatus(302)->withHeader('Location', $request->getParam("url", ""));
            }
        });

    })->add(new \Sumidero\Middleware\APIExceptionCatcher($this->app->getContainer()));

?>
