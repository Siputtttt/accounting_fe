<script setup>
const goBack = () => {
  window.history.back();
};
</script>

<template>
  <div
    class="position-relative min-vh-100 bg-white d-flex flex-column justify-content-center align-items-center overflow-hidden"
  >
    <!-- Top Wave -->
    <div class="position-absolute top-0 start-0 w-100" style="z-index: 0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#343a40"
          fill-opacity="1"
          d="M0,192L16,165.3C32,139,64,85,96,85.3C128,85,160,139,192,176C224,213,256,235,288,224C320,213,352,171,384,138.7C416,107,448,85,480,90.7C512,96,544,128,576,138.7C608,149,640,139,672,138.7C704,139,736,149,768,160C800,171,832,181,864,160C896,139,928,85,960,80C992,75,1024,117,1056,133.3C1088,149,1120,139,1152,144C1184,149,1216,171,1248,192C1280,213,1312,235,1344,218.7C1376,203,1408,149,1424,122.7L1440,96L1440,0L0,0Z"
        />
      </svg>
    </div>

    <h1 class="display-4 fw-bold text-dark mb-3">Oops!</h1>
    <h2 class="display-5 fw-bold text-dark mb-3">Page Not Found</h2>
    <p class="lead text-dark mb-4 text-center">
      The page you’re looking for doesn’t exist or has been moved.
    </p>

    <!-- <button class="btn btn-outline-dark shadow-sm" @click="goBack">← Go Back</button> -->

    <!-- Bottom Wave -->
    <div class="position-absolute bottom-0 start-0 w-100" style="z-index: 0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#343a40"
          fill-opacity="1"
          d="M0,192L16,165.3C32,139,64,85,96,85.3C128,85,160,139,192,176C224,213,256,235,288,224C320,213,352,171,384,138.7C416,107,448,85,480,90.7C512,96,544,128,576,138.7C608,149,640,139,672,138.7C704,139,736,149,768,160C800,171,832,181,864,160C896,139,928,85,960,80C992,75,1024,117,1056,133.3C1088,149,1120,139,1152,144C1184,149,1216,171,1248,192C1280,213,1312,235,1344,218.7C1376,203,1408,149,1424,122.7L1440,96L1440,320L0,320Z"
        />
      </svg>
    </div>
  </div>
</template>
