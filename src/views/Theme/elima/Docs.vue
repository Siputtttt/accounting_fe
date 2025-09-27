<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Navbar from "./components/Navbar.vue";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/style.css";
</script>
<template>
  <div class="sximo-main w-100 vh-100">
    <Navbar />
    <div class="container main-data">
      <BRow>
        <BCol cols="3">
          <PerfectScrollbar>
            <div class="sidebar-doc">
              <div class="sximo-search">
                <BFormInput placeholder="Enter your name" size="sm" />
              </div>
              <ul class="doc-nav">
                <li class="headmap">Getting Started</li>
                <li><a href="javascript:;">Introduction </a></li>
                <li><a href="javascript:;">Concept Overview </a></li>
                <li><a href="javascript:;">Building Your App </a></li>
                <li class="headmap">Features</li>
                <li><a href="javascript:;">API </a></li>
                <li><a href="javascript:;">Authentication </a></li>
                <li><a href="javascript:;">Password Update </a></li>
                <li><a href="javascript:;">Password Confirmation </a></li>
                <li><a href="javascript:;">Two Factor Authentication </a></li>
                <li><a href="javascript:;">Browser Sessions </a></li>
                <li><a href="javascript:;">Teams </a></li>

                <li class="headmap">Costumization</li>
                <li><a href="javascript:;">API </a></li>
                <li><a href="javascript:;">Authentication </a></li>
                <li><a href="javascript:;">Password Update </a></li>
                <li><a href="javascript:;">Password Confirmation </a></li>
                <li><a href="javascript:;">Two Factor Authentication </a></li>
                <li><a href="javascript:;">Browser Sessions </a></li>
                <li><a href="javascript:;">Teams </a></li>
              </ul>
            </div>
          </PerfectScrollbar>
        </BCol>
        <BCol cols="9">
          <div class="main-doc">
            <div class="row">
              <div class="col-md-10">
                <h1>Introduction</h1>
                ​
                <h3>Laravel Jetstream ​</h3>
                <p>
                  Laravel Jetstream is a beautifully designed application starter kit for
                  Laravel and provides the perfect starting point for your next Laravel
                  application. Jetstream provides the implementation for your
                  application's login, registration, email verification, two-factor
                  authentication, session management, API via Laravel Sanctum, and
                  optional team management features. Jetstream is designed using Tailwind
                  CSS and offers your choice of Livewire or Inertia scaffolding.
                </p>

                Concept Overview ​ Introduction ​ Laravel Jetstream's architecture is a
                little different from other Laravel application starter kits such as
                Laravel Breeze. In this documentation, we'll cover some of the high-level
                concepts that will help you understand how Laravel Jetstream is
                constructed. Laravel Fortify ​ Under the hood, the authentication portions
                of Jetstream are powered by Laravel Fortify, which is a frontend agnostic,
                "headless" authentication backend for Laravel. Fortify registers the
                routes and controllers needed to implement all of Laravel's authentication
                features, including login, registration, password reset, email
                verification, and more. After installing Fortify, you may run the
                route:list Artisan command to see the routes that Fortify has registered.
                Since Fortify does not provide its own user interface, it is meant to be
                paired with your own user interface which makes requests to the routes it
                registers. Laravel Jetstream is our first-party implementation of a user
                interface built on top of the Fortify authentication backend. Fortify
                Configuration ​ When Jetstream is installed, a config/fortify.php
                configuration file is installed into your application. Within this
                configuration file, you can customize various aspects of Fortify's
                behavior, such as the authentication guard that should be used, where
                users should be redirected after authentication, and more. Within the
                fortify configuration file, you can also disable entire features of
                Fortify, such as the ability to update profile information or passwords.
              </div>
              <div class="col-md-2"></div>
            </div>
          </div>
        </BCol>
      </BRow>
    </div>
  </div>
</template>

<style scoped>
body {
  padding-top: 56px; /* Tinggi navbar */
  background: #f8fafc !important;
}

.container {
  background: #eff3fa !important;
}
.main-data {
  padding-top: 56px;
}
.sximo-main {
  font-size: 0.955rem;
}
.sidebar-doc {
  padding-top: 30px;
}
.ps {
  height: calc(100vh - 56px);
}
ul.doc-nav {
  margin: 0;
  padding: 0;
  list-style: none;
}
ul.doc-nav li {
  padding-bottom: 2px;
  padding: 5px 5px 5px 30px;
}
ul.doc-nav li.headmap {
  margin-top: 30px;
  font-weight: 600;
  padding-left: 5px;
}
ul.doc-nav li a {
  text-decoration: none;
  color: #666;
}
</style>
