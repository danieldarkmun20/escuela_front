<template>
  <div class="d-flex justify-content-between align-items-center">
    <nav aria-label="breadcrumb" class="my-5">
      <ol class="breadcrumb">
        <li class="breadcrumb-item" aria-current="page" style="color: #FFF;">Home</li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ title }}
        </li>
      </ol>
    </nav>
    <button class="btn btn-danger" @click.prevent="logOut">
      Cerrar sesion
    </button>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
export default {
  props: {
    title: String,
  },
  setup() {
    const router = useRouter();
    const logOut = async () => {
      const resp = await axios.post(`http://127.0.0.1:8000/api/logout`);

      if (resp.status == 200) {
        localStorage.removeItem("user");
        router.push("/login");
      }
    };
    return {
      logOut,
    };
  },
};
</script>

<style></style>
