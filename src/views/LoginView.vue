<template>
  <form class="login">
    <!-- Email input -->
    <div class="form-outline mb-4">
      <input
        type="email"
        v-model="admintrator.email"
        id="form2Example1"
        class="form-control"
      />
      <label class="form-label" for="form2Example1">Correo Electronico</label>
      <div
        class="input-errors"
        v-for="error of v$.email.$silentErrors"
        :key="error.$uid"
      >
        <div class="alert alert-danger my-1" role="alert">
          {{ error.$message }}
        </div>
      </div>
    </div>

    <!-- Password input -->
    <div class="form-outline mb-4">
      <input
        v-model="admintrator.password"
        type="password"
        id="form2Example2"
        class="form-control"
      />
      <label class="form-label" for="form2Example2">Password</label>
      <div
        class="input-errors"
        v-for="error of v$.password.$silentErrors"
        :key="error.$uid"
      >
        <div class="alert alert-danger my-1" role="alert">
          {{ error.$message }}
        </div>
      </div>
    </div>

    <!-- Submit button -->
    <button
      type="button"
      @click.prevent="submit"
      class="btn btn-primary btn-block mb-4"
    >
      Sign in
    </button>
  </form>
</template>

<script>
import { ref } from "vue";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const admintrator = ref({
      email: "",
      password: "",
    });
    const rules = {
      email: { required, email },
      password: { required },
    };
    const v$ = useVuelidate(rules, admintrator);
    const submit = async () => {
      const result = await v$.value.$validate();
      const data = Object.assign({}, admintrator.value);
      if (result) {
        console.log("mamo");
        console.log("post");
        const response = await axios.post(
          `http://127.0.0.1:8000/api/login`,
          data,
          {
            headers: {
              "Content-Type": `application/json`,
              Accept: `application/json`,
            },
          }
        );
        if (response.status === 200) {
          const data = response.data;
          localStorage.setItem("user", JSON.stringify(response.data));
          if (data.user.teacher !== null) {
            router.push("/estudiantes");
          } else if (data.user.student !== null) {
            router.push("/lecciones");
          } else {
            router.push("/");
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Algo salio mal!",
          });
        }
        admintrator.value = {
          email: "",
          password: "",
        };
      }
    };
    return {
      v$,
      submit,
      admintrator,
    };
  },
};
</script>

<style scoped>
.login {
  width: 300px;
  margin: 40px auto;
}
</style>
