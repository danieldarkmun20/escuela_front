<template>
  <div class="container-general">
    <sidebar-menu :menu="menuSidebar" :collapsed="true" />
    <BreadcrumComponent title="Administrador" />
    <ui-card class="mt-3 py-2 px-4">
      <ui-card-actions>
        <ui-button style="background-color: #95c972" raised @click="add"
          ><ui-icon>add</ui-icon></ui-button
        >
      </ui-card-actions>
      <ui-card-content>
        <ui-table
          :data="administrators"
          :thead="thead"
          :tbody="tbody"
          :default-col-width="180"
        >
          <template #actions="{ data }">
            <ui-icon @click.prevent="edit(data.id)">edit</ui-icon>
            <ui-icon @click.prevent="destroy(data.id)">delete</ui-icon>
          </template>
        </ui-table>
      </ui-card-content>
    </ui-card>
  </div>
  <ui-dialog v-model="open" @confirm="onConfirm">
    <ui-dialog-title>{{ title }}</ui-dialog-title>
    <ui-dialog-content>
      <ui-form type="|" item-margin-bottom="16" action-align="center">
        <template #default="{ itemClass }">
          <ui-grid>
            <ui-grid-cell columns="6">
              <ui-form-field :class="[itemClass, 'required']">
                <label>Nombre (s)</label>
                <ui-textfield
                  v-model="admintrator.name"
                  required
                ></ui-textfield>
                <div
                  class="input-errors"
                  v-for="error of v$.name.$silentErrors"
                  :key="error.$uid"
                >
                  <div class="alert alert-danger my-1" role="alert">
                    {{ error.$message }}
                  </div>
                </div>
              </ui-form-field>
            </ui-grid-cell>
            <ui-grid-cell columns="6">
              <ui-form-field :class="[itemClass, 'required']">
                <label>Apellido Paterno</label>
                <ui-textfield
                  required
                  v-model="admintrator.last_name1"
                ></ui-textfield>
                <div
                  class="input-errors"
                  v-for="error of v$.last_name1.$silentErrors"
                  :key="error.$uid"
                >
                  <div class="alert alert-danger my-1" role="alert">
                    {{ error.$message }}
                  </div>
                </div>
              </ui-form-field>
            </ui-grid-cell>
            <ui-grid-cell columns="6">
              <ui-form-field :class="[itemClass, 'required']">
                <label>Apellido Materno</label>
                <ui-textfield
                  required
                  v-model="admintrator.last_name2"
                ></ui-textfield>
                <div
                  class="input-errors"
                  v-for="error of v$.last_name2.$silentErrors"
                  :key="error.$uid"
                >
                  <div class="alert alert-danger my-1" role="alert">
                    {{ error.$message }}
                  </div>
                </div>
              </ui-form-field>
            </ui-grid-cell>
            <ui-grid-cell columns="6">
              <ui-form-field :class="[itemClass, 'required']">
                <label>Email</label>
                <ui-textfield
                  required
                  v-model="admintrator.email"
                  input-type="email"
                ></ui-textfield>
                <div
                  class="input-errors"
                  v-for="error of v$.email.$silentErrors"
                  :key="error.$uid"
                >
                  <div class="alert alert-danger my-1" role="alert">
                    {{ error.$message }}
                  </div>
                </div>
              </ui-form-field>
            </ui-grid-cell>
            <ui-grid-cell columns="6" v-show="post">
              <ui-form-field :class="[itemClass, 'required']">
                <label>Contrase??a</label>
                <ui-textfield
                  required
                  v-model="admintrator.password"
                  input-type="password"
                ></ui-textfield>
                <div
                  class="input-errors"
                  v-for="error of v$.password.$silentErrors"
                  :key="error.$uid"
                >
                  <div class="alert alert-danger my-1" role="alert">
                    {{ error.$message }}
                  </div>
                </div>
              </ui-form-field>
            </ui-grid-cell>
            <ui-grid-cell columns="6" v-show="post">
              <ui-form-field :class="[itemClass, 'required']">
                <label>Confirmar Contrase??a</label>
                <ui-textfield
                  required
                  v-model="admintrator.password_confirmation"
                  input-type="password"
                ></ui-textfield>
                <div
                  class="input-errors"
                  v-for="error of v$.password_confirmation.$silentErrors"
                  :key="error.$uid"
                >
                  <div class="alert alert-danger my-1" role="alert">
                    {{ error.$message }}
                  </div>
                </div>
              </ui-form-field>
            </ui-grid-cell>
          </ui-grid>
        </template>
      </ui-form>
    </ui-dialog-content>
    <ui-dialog-actions>
      <ui-form-field>
        <ui-button outlined @click.prevent="hideModal">Cancelar</ui-button>
        <ui-button
          style="background-color: #95c972"
          class="mx-2"
          raised
          @click.prevent="submit"
          >Guardar</ui-button
        >
      </ui-form-field>
    </ui-dialog-actions>
  </ui-dialog>
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
import BreadcrumComponent from "../components/BreadcrumComponent.vue";
export default {
  components: {
    SidebarMenu,
    BreadcrumComponent,
  },
  setup() {
    const menuSidebar = ref(sidebarvar);
    const open = ref(false);
    const post = ref(true);
    const title = ref("");
    const password = ref("");
    const administrators = ref([]);
    const admintrator = ref({
      id: "",
      name: "",
      last_name1: "",
      last_name2: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
    onBeforeMount(async () => {
      const resp = await axios.get("http://127.0.0.1:8000/api/administrators");
      const data = await resp.data.data;
      console.log(data);
      administrators.value = data;
    });
    const add = () => {
      open.value = true;
      post.value = true;
      title.value = "Agregar Administrador";
      console.log("Agregar...");
    };
    const edit = async (id) => {
      open.value = true;
      post.value = false;
      title.value = "Editar Administrador";
      console.log("Editar...");
      const resp = await axios.get(
        `http://127.0.0.1:8000/api/administrators/${id}/edit`
      );
      console.log(resp.data.data);
      const data = resp.data.data;
      admintrator.value.id = data.id;
      admintrator.value.name = data.user.name;
      admintrator.value.last_name1 = data.user.last_name1;
      admintrator.value.last_name2 = data.user.last_name2;
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
        sameAsPassword: post.value ? sameAs(password) : null,
      }, // Matches state.contact.email
    };
    const rulesUpdate = {
      name: { required }, // Matches state.firstName
      last_name1: { required }, // Matches state.lastName
      last_name2: { required }, // Matches state.lastName
      email: { required, email },
    };
    const v$ = useVuelidate(rules, admintrator);
    const vUpdate$ = useVuelidate(rulesUpdate, admintrator);
    const submit = async () => {
      const result = await v$.value.$validate();
      const update = await vUpdate$.value.$validate();
      const data = Object.assign({}, admintrator.value);
      console.log("mamo");
      if (post.value) {
        if (result) {
          console.log("post");
          const response = await axios.post(
            `http://127.0.0.1:8000/api/administrators`,
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
            administrators.value.push(response.data.data);
            open.value = false;
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Algo salio mal!",
            });
          }
        }
      } else {
        if (update) {
          console.log("edit");
          const response = await axios.put(
            `http://127.0.0.1:8000/api/administrators/${admintrator.value.id}`,
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
              title: "Se ha editado correctamente",
              showConfirmButton: false,
              timer: 1500,
            });
            // administrators.value.push(response.data.data);
            open.value = false;
            v$.value.$reset();
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Algo salio mal!",
            });
          }
        }
      }
      admintrator.value = {
        id: "",
        name: "",
        last_name1: "",
        last_name2: "",
        email: "",
        password: "",
        password_confirmation: "",
      };
    };
    const destroy = async (id) => {
      Swal.fire({
        title: "Estas seguro?",
        text: "No se podra revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // const userLocalStorage = JSON.parse(localStorage.getItem("user"));
          const response = await axios.delete(
            `http://127.0.0.1:8000/api/administrators/${id}`,
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
            Swal.fire("Eliminado!", "Ha sido Eliminado.", "success");
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
    const hideModal = () => {
      open.value = false;
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
      v$.value.$reset();
    };
    return {
      hideModal,
      post,
      menuSidebar,
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
