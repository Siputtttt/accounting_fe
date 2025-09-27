<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>
<template>
  <div>
    <Navbar />
    <div class="main-data">
      <section class="mb-5 main-spoiler pb-5 shadow">
        <div class="container" style="background: #fff !important">
          <div style="padding-top: 350px">
            <h1>Build and ship software with</h1>
            <h2>tools crafted for productivity</h2>
            <p>
              Sximo LV provides a complete ecosystem for building web application .
              <br />Our open source PHP framework, products, packages, and starter kits
              offer everything you need to build, deploy, and monitor web applications.
            </p>
          </div>
        </div>
      </section>

      <section class="mb-5">
        <div class="container">
          <div class="card">
            <div class="card-body">
              <h3>A PHP Crud Generator with a starter Kit Pack</h3>
              <p>
                Out of the box, Laravel has elegant solutions for the common features
                needed by all modern web applications. Our first-party packages offer
                opinionated solutions for specific problems so you don't need to reinvent
                the wheel.
              </p>
            </div>
            <div class="box-home">
              <div class="row">
                <div class="col-md-6 boxed">
                  <div class=""></div>
                </div>
                <div class="col-md-6 bxed">
                  <div class="boxed"></div>
                </div>
                <div class="col-md-6 boxed">
                  <div class=""></div>
                </div>
                <div class="col-md-6 boxed">
                  <div class="boxed"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
body {
  padding-top: 56px; /* Tinggi navbar */
}

.main-data {
  background: #eff3fa !important;
}
.main-spoiler {
  background: #fff;
}
.boxed {
  min-height: 150px;
  border-right: solid 1px #d4d4d4;
  border-bottom: solid 1px #d4d4d4;
  background: #f4f4f4;
}
.logo-icon {
  font-size: 60px;
  transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
  cursor: pointer;
}

.logo-icon:hover {
  transform: scale(1.2);
}

.fa-laravel:hover {
  color: #e22d2f;
}

.fa-vuejs:hover {
  color: #4fc08d;
}

.sqlIcon {
  fill: black;
}

.sqlIcon:hover {
  fill: #007bff;
}

.fa-bootstrap:hover {
  color: #7952b3;
}
</style>
