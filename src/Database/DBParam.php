<?php

      declare(strict_types=1);

      namespace Sumidero\Database;

      /**
       * Simple PDO Database Param Wrapper
       */
      class DBParam {

            public $name;
            public $value;
            public $type;

            /**
             * set param properties
             *
             * @param $name
             * @param $value
             * @param $type
             *
             * @return \Sumidero\Database\DBParam
             */
            public function set($name, $value, $type): \Sumidero\Database\DBParam {
                  $this->name = $name;
                  $this->value = $value;
                  $this->type = $type;
                  return($this);
            }

            /**
             * set NULL param
             *
             * @param $name
             *
             * @return \Sumidero\Database\DBParam
             */
            public function null(string $name): \Sumidero\Database\DBParam {
                  $this->name = $name;
                  $this->value = null;
                  $this->type = \PDO::PARAM_NULL;
                  return($this);
            }

            /**
             * set BOOL param
             *
             * @param $name string
             * @param $value boolean
             *
             * @return \Sumidero\Database\DBParam
             */
            public function bool(string $name, bool $value): \Sumidero\Database\DBParam {
                  $this->name = $name;
                  $this->value = $value;
                  $this->type = \PDO::PARAM_BOOL;
                  return($this);
            }

            /**
             * set INTEGER param
             *
             * @param $name string
             * @param $value int
             *
             * @return \Sumidero\Database\DBParam
             */
            public function int(string $name, int $value): \Sumidero\Database\DBParam {
                  $this->name = $name;
                  $this->value = $value;
                  $this->type = \PDO::PARAM_INT;
                  return($this);
            }

            /**
             * set FLOAT param
             *
             * @param $name string
             * @param $value int
             *
             * @return \Sumidero\Database\DBParam
             */
            public function float(string $name, float $value): \Sumidero\Database\DBParam {
                  $this->name = $name;
                  $this->value = $value;
                  $this->type = \PDO::PARAM_STR;
                  return($this);
            }

            /**
             * set STRING param
             *
             * @param $name string
             * @param $value int
             *
             * @return \Sumidero\Database\DBParam
             */
            public function str(string $name, $value): \Sumidero\Database\DBParam {
                  $this->name = $name;
                  $this->value = $value;
                  $this->type = \PDO::PARAM_STR;
                  return($this);
            }
      }

?>