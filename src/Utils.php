<?php
    declare(strict_types=1);

    namespace Sumidero;

    class Utils {

        public static function setAppDefaults() {
            session_start();
            if (DEBUG) {
                error_reporting(E_ALL);
                ini_set("display_errors", "1");
            }
        }

        /**
         * convert string to web safe uri
         * https://stackoverflow.com/a/4783820
         */
        public static function convertSafeURI($str, $replace=array(), $delimiter = "-") {
            if( !empty($replace) ) {
                $str = str_replace((array)$replace, ' ', $str);
            }
            $clean = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
            $clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
            $clean = strtolower(trim($clean, '-'));
            $clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);
            return $clean;
        }

        /**
         * show console progress bar (// http://snipplr.com/view/29548/)
         *
         * @params $done
         * @params $total
         * @params $size
         */
        public static function showProgressBar($done, $total, $size=30) {

            static $start_time;

            // if we go over our bound, just ignore it
            if($done > $total) return;

            if(empty($start_time)) $start_time=time();
            $now = time();

            $perc=(double)($done/$total);

            $bar=floor($perc*$size);

            $status_bar="\r[";
            $status_bar .= str_repeat("=", intval($bar));
            if($bar<$size){
                $status_bar.=">";
                $status_bar.=str_repeat(" ", intval($size-$bar));
            } else {
                $status_bar.="=";
            }

            $disp=number_format($perc*100, 0);

            $status_bar.="] $disp%  $done/$total";

            $rate = ($now-$start_time)/$done;
            $left = $total - $done;
            $eta = round($rate * $left, 2);

            $elapsed = $now - $start_time;

            $status_bar.= " remaining: ".number_format($eta)." sec.  elapsed: ".number_format($elapsed)." sec.";

            echo "$status_bar  ";

            flush();

            // when done, send a newline
            if($done == $total) {
                echo "\n";
            }

        }

        public static function getInitialState(\Slim\Container $container) {
            $dbh = new \Sumidero\Database\DB($container);
            $v = new \Sumidero\Database\Version($dbh, $container->get('settings')['database']['type']);
            return(
                array(
                    'upgradeAvailable' => $v->hasUpgradeAvailable(),
                    'allowSignUp' => $container->get('settings')['common']['allowSignUp'],
                    'isPublic' => $container->get('settings')['common']['isPublic'],
                    'session' => array(
                        'logged' => \Sumidero\UserSession::isLogged(),
                        'id' => \Sumidero\UserSession::getUserId(),
                        'email' => \Sumidero\UserSession::getEmail(),
                        'name' => \Sumidero\UserSession::getName(),
                        'timeout' => ini_get("session.gc_maxlifetime")
                    ),
                    'defaultResultsPage' => $container->get('settings')['common']['defaultResultsPage'],
                    'productionEnvironment' => $container->get('settings')['twigParams']['production'],
                )
            );
        }
    }
?>