<?php

/*
 * This file is part of tohsakarat/tags-filter.
 *
 * Copyright (c) 2022 Blomstra Ltd
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),


    new Extend\Locales(__DIR__.'/locale'),



];
