The Little Schemer
==================

This project contains a mix of Javascript and Scheme. Each chapter corresponds to a chapter in the excellent book "The Little Schemer" by Friedman and Felleisen.

Scheme
------

Can be run in DrRacket for debugging.

Javascript
----------

The language primitives are entirely defined in `primitives.js`.

The project can be loaded by running `require('./run.js')` in a
JavaScript interpreter (most likely node.js).

The goal of these exercises is to learn to think recursively, and become more
familiar with JavaScript syntax at the same time.

Currently there are no JavaScript interpreters that support tail-call optimisation
but this IS a part of EcmaScript 6. SCHEME relies heavily on (indeed it is pretty
much defined by) recursion and recursive functions. For this reason it is recommended
that this code be executed in an ES6-compatible interpreter if possible.
