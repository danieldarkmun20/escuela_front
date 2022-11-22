<template>
  <div class="container-general">
    <sidebar-menu :menu="menuSidebar" :collapsed="true" />
    <nav aria-label="breadcrumb" class="my-5">
      <ol class="breadcrumb">
        <li class="breadcrumb-item" aria-current="page">Home</li>
        <li class="breadcrumb-item active" aria-current="page">Estudiantes</li>
      </ol>
    </nav>
    <ui-card class="mt-3 py-2 px-4">
      <ui-card-actions>
        <ui-button raised @click="add"><ui-icon>add</ui-icon></ui-button>
      </ui-card-actions>
      <ui-card-content>
        <ui-grid>
          <ui-grid-cell columns="6">
            <ui-form-field :class="[itemClass, 'required']">
              <label>Email</label>
              <ui-textfield
                required
                v-model="admintrator.email"
                input-type="email"
              ></ui-textfield>
            </ui-form-field>
          </ui-grid-cell>
          <ui-grid-cell columns="6">
            <ui-form-field :class="[itemClass, 'required']">
              <ui-select
                id="full-func-js-select"
                v-model="admintrator.teacher_id"
                :options="options"
              >
                Maestros
              </ui-select>
              <!-- <div
                  class="input-errors"
                  v-for="error of v$.email.$silentErrors"
                  :key="error.$uid"
                >
                  <div class="alert alert-danger my-1" role="alert">
                    {{ error.$message }}
                  </div>
                </div> -->
            </ui-form-field>
          </ui-grid-cell>
        </ui-grid>
      </ui-card-content>
    </ui-card>
  </div>
</template>

<script>
import { onBeforeMount, ref, watch } from "vue";
import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import sidebarvar from "../utils/SidebarVar";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  sameAs,
  requiredIf,
} from "@vuelidate/validators";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  components: {
    SidebarMenu,
  },
  setup() {
    const menuSidebar = ref(sidebarvar);
    const open = ref(false);
    const post = ref(true);
    const title = ref("");
    const password = ref("");
    const administrators = ref([]);
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
      const resp = await axios.get("http://127.0.0.1:8000/api/students");
      const respTeacher = await axios.get("http://127.0.0.1:8000/api/teachers");
      const data = await resp.data.data;
      const dataT = await respTeacher.data.data;
      console.log(data);
      administrators.value = data;
      options.value = dataT.map((t) => {
        return {
          label: `${t.user.name} ${t.user.last_name1} ${t.user.last_name2}`,
          value: t.id,
        };
      });
    });
    const add = () => {
      open.value = true;
      post.value = true;
      title.value = "Agregar Estudiante";
      console.log("Agregar...");
    };
    const edit = async (id) => {
      open.value = true;
      post.value = false;
      title.value = "Editar Estudiante";
      console.log("Editar...");
      const resp = await axios.get(
        `http://127.0.0.1:8000/api/students/${id}/edit`
      );
      console.log(resp.data.data);
      const data = resp.data.data;
      admintrator.value.id = data.id;
      admintrator.value.name = data.user.name;
      admintrator.value.last_name1 = data.user.last_name1;
      admintrator.value.last_name2 = data.user.last_name2;
      admintrator.value.teacher_id = data.user.teacher_id;
      admintrator.value.email = data.user.email;
    };
    watch(admintrator.value, (newValue) => {
      console.log(newValue.password_confirmation);
      password.value = newValue.password;
    });
    const rules = {
      name: { required }, // Matches state.firstName
      last_name1: { required }, // Matches state.lastName
      last_name2: { required }, // Matches state.lastName
      email: { required, email }, // Matches state.contact.email
      password: { requiredIf: requiredIf(post), minLength: minLength(4) }, // Matches state.contact.email
      password_confirmation: {
        requiredIf: requiredIf(post),
        sameAsPassword: sameAs(password),
      }, // Matches state.contact.email
    };
    const v$ = useVuelidate(rules, admintrator);
    const submit = async () => {
      const result = await v$.value.$validate();
      const data = Object.assign({}, admintrator.value);
      if (result) {
        console.log("mamo");
        if (post.value) {
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
            administrators.value.push(response.data.data);
            open.value = false;
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Algo salio mal!",
            });
          }
        } else {
          console.log("post");
          const response = await axios.put(
            `http://127.0.0.1:8000/api/students/${admintrator.value.id}`,
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
            // administrators.value.push(response.data.data);
            open.value = false;
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Algo salio mal!",
            });
          }
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
    const destroy = async (id) => {
      Swal.fire({
        title: "Estas seguro?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // const userLocalStorage = JSON.parse(localStorage.getItem("user"));
          const response = await axios.delete(
            `http://127.0.0.1:8000/api/students/${id}`,
            {
              headers: {
                "Content-Type": `application/json`,
                Accept: `application/json`,
              },
            }
          );

          console.log(response);
          if (response.status === 200) {
            administrators.value = administrators.value.filter(
              (admintrator) => admintrator.id !== id
            );
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Algo salio mal!",
            });
          }
        }
      });
    };
    // const showModal = () => {
    //   open.value = true;
    //   post.value = true;
    //   title.value = "Agregar Administrador";
    // };
    return {
      menuSidebar,
      options,
      post,
      administrators,
      add,
      edit,
      destroy,
      v$,
      open,
      title,
      submit,
      admintrator,
      // showModal,
      onConfirm(result) {
        if (result) {
          console.log("ok");
        } else {
          console.log("cancel");
        }
      },
      thead: [
        {
          value: "Nombre (s)",
          width: 100,
          fixed: "right",
        },
        {
          value: "Apellido Paterno",
          width: 80,
        },
        {
          value: "Apellido Materno",
          width: 80,
        },
        {
          value: "Email",
          width: 80,
        },
        // "Nombre (s)",
        // "Apellido Paterno",
        // "Apellido Materno",
        // "Email",
        "Opciones",
      ],
      tbody: [
        {
          field: "name",
          fn: (data) => {
            return data.user.name;
          },
        },
        {
          field: "last_name1",
          fn: (data) => {
            return data.user.last_name1;
          },
        },
        {
          field: "last_name2",
          fn: (data) => {
            return data.user.last_name2;
          },
        },
        {
          field: "email",
          fn: (data) => {
            return data.user.email;
          },
        },
        {
          slot: "actions",
        },
      ],
    };
  },
};
</script>

<style scoped>
.container-general {
  margin: 0px 10px 0px 80px;
}
</style>
