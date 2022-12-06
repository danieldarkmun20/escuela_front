<template>
  <div class="container-general">
    <sidebar-menu :menu="menuSidebar" :collapsed="true" />
    <nav aria-label="breadcrumb" class="my-5">
      <ol class="breadcrumb">
        <li class="breadcrumb-item" style="color: #fff" aria-current="page">
          Home
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          Dar de alta a estudiante
        </li>
      </ol>
    </nav>
    <ui-card class="mt-3 py-2 px-4">
      <ui-card-content>
        <ui-grid>
          <ui-grid-cell columns="6">
            <ui-form-field>
              <label class="mx-2">Email</label>
              <ui-textfield
                required
                v-model="studentEmail"
                input-type="email"
              ></ui-textfield>
            </ui-form-field>
          </ui-grid-cell>
          <ui-grid-cell
            columns="6"
            v-if="userLocalStorage.user.teacher === null"
          >
            <ui-form-field>
              <ui-select
                id="full-func-js-select"
                v-model="teacher_id"
                :options="options"
              >
                Maestros
              </ui-select>
            </ui-form-field>
          </ui-grid-cell>
          <ui-grid-cell columns="8">
            <ui-button style="color: #95c972" @click.prevent="addStudent"
              >Dar de alta</ui-button
            >
          </ui-grid-cell>
        </ui-grid>
      </ui-card-content>
    </ui-card>
  </div>
</template>

<script>
import { onBeforeMount, ref, watch } from "vue";
import { SidebarMenu } from "vue-sidebar-menu";
import sidebarVarTeacher from "../utils/SidebarVarTeacher";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import sidebarvar from "../utils/SidebarVar";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, sameAs } from "@vuelidate/validators";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  components: {
    SidebarMenu,
  },
  setup() {
    const userLocalStorage = ref(
      JSON.parse(localStorage.getItem("user")) ?? null
    );
    const menuSidebar =
      userLocalStorage.value.user.teacher !== null
        ? sidebarVarTeacher
        : sidebarvar;
    const open = ref(false);
    const title = ref("");
    const teacher_id = ref(
      userLocalStorage.value.user.teacher !== null
        ? userLocalStorage.value.user.teacher.id
        : ""
    );
    const password = ref("");
    const studentEmail = ref("");
    const options = ref([]);
    const admintrator = ref({
      id: "",
      name: "",
      last_name1: "",
      teacher_id: "",
      last_name2: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
    onBeforeMount(async () => {
      const respTeacher = await axios.get("http://127.0.0.1:8000/api/teachers");
      const dataT = await respTeacher.data.data;
      options.value = dataT.map((t) => {
        return {
          label: `${t.user.name} ${t.user.last_name1} ${t.user.last_name2}`,
          value: t.id,
        };
      });
    });
    const add = () => {
      open.value = true;
      title.value = "Agregar Estudiante";
      console.log("Agregar...");
    };
    watch(admintrator.value, (newValue) => {
      password.value = newValue.password;
    });
    const rules = {
      name: { required }, // Matches state.firstName
      last_name1: { required }, // Matches state.lastName
      last_name2: { required }, // Matches state.lastName
      email: { required, email }, // Matches state.contact.email
      password: { required, minLength: minLength(4) }, // Matches state.contact.email
      password_confirmation: {
        required,
        sameAsPassword: sameAs(password),
      }, // Matches state.contact.email
    };
    const v$ = useVuelidate(rules, admintrator);
    const submit = async () => {
      const result = await v$.value.$validate();
      const data = Object.assign({}, admintrator.value);
      if (result) {
        console.log("mamo");
        console.log("post");
        const response = await axios.post(
          `http://127.0.0.1:8000/api/students`,
          data,
          {
            headers: {
              "Content-Type": `application/json`,
              Accept: `application/json`,
            },
          }
        );
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Se ha agregado correctamente un atleta",
            showConfirmButton: false,
            timer: 1500,
          });
          open.value = false;
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Algo salio mal!",
          });
        }
        admintrator.value = {
          id: "",
          name: "",
          last_name1: "",
          last_name2: "",
          teacher_id: "",
          email: "",
          password: "",
          password_confirmation: "",
        };
      }
    };
    const addStudent = async () => {
      const data = Object.assign(
        {},
        {
          email: studentEmail.value,
          teacher_id: teacher_id.value,
        }
      );
      console.log("mamo");
      console.log("post");
      const response = await axios.post(
        `http://127.0.0.1:8000/api/students/teacher`,
        data,
        {
          headers: {
            "Content-Type": `application/json`,
            Accept: `application/json`,
          },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Se ha agregado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Algo salio mal!",
        });
      }
      admintrator.value = {
        id: "",
        name: "",
        last_name1: "",
        last_name2: "",
        teacher_id: "",
        email: "",
        password: "",
        password_confirmation: "",
      };
    };

    return {
      addStudent,
      studentEmail,
      menuSidebar,
      teacher_id,
      options,
      add,
      v$,
      open,
      title,
      submit,
      admintrator,
      userLocalStorage,
    };
  },
};
</script>

<style scoped>
.container-general {
  margin: 0px 10px 0px 80px;
}
</style>
