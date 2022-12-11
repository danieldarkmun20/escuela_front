<template>
  <div class="container-general">
    <sidebar-menu :menu="menuSidebar" :collapsed="true" />
    <BreadcrumComponent title="Lecciones" />
    <ui-card class="mt-3 py-2 px-4">
      <ui-card-actions>
        <ui-button style="background-color: #95c972" raised @click="add"
          ><ui-icon>add</ui-icon></ui-button
        >
      </ui-card-actions>
      <ui-card-content>
        <ui-table
          :data="lecciones"
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
            <ui-grid-cell columns="12">
              <ui-form-field :class="[itemClass, 'required']">
                <label>Nombre (s)</label>
                <ui-textfield v-model="leccion.name" required></ui-textfield>
              </ui-form-field>
            </ui-grid-cell>
            <ui-grid-cell columns="12">
              <ui-form-field :class="[itemClass, 'required']">
                <label>Subir Video</label>
                <input type="file" name="" id="" />
              </ui-form-field>
            </ui-grid-cell>
            <ui-grid-cell
              columns="12"
              v-for="(question, index) in leccion.questions"
              :key="index"
            >
              <ui-form-field :class="[itemClass, 'required']">
                <label>Pregunta</label>
                <ui-textfield
                  v-model="leccion.questions[index].text"
                  required
                ></ui-textfield>
                <div
                  v-for="(option, indexOption) in leccion.questions[index]
                    .options"
                  :key="indexOption"
                >
                  <ui-textfield
                    class="my-3"
                    placeholder="Opciones"
                    v-model="leccion.questions[index].options[indexOption].text"
                    required
                  ></ui-textfield>
                  <ui-button
                    v-if="indexOption === 0"
                    class="mx-3"
                    raised
                    @click="addOption(index)"
                    >Agregar opcion
                  </ui-button>
                  <ui-button
                    v-else
                    class="mx-3"
                    raised
                    @click="lessOption(index)"
                    >Eliminar opcion
                  </ui-button>
                </div>
              </ui-form-field>
              <ui-button
                v-if="index === 0"
                class="bg-red"
                raised
                @click="addQuestion"
                >Agregar pregunta</ui-button
              >
              <ui-button v-else class="bg-red" raised @click="lessQuestion"
                >Eliminar Pregunta</ui-button
              >
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
import { ref } from "vue";
import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import sidebarvar from "../utils/SidebarVar";
import BreadcrumComponent from "../components/BreadcrumComponent.vue";
import axios from "axios";
import Swal from "sweetalert2";
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
    const lecciones = ref([]);
    const leccion = ref({
      id: "",
      title: "",
      questions: [
        {
          text: "",
          options: [{ text: "" }],
        },
      ],
    });
    const addOption = (index) => {
      leccion.value.questions[index].options.push({ text: "" });
    };
    const lessOption = (index) => {
      leccion.value.questions[index].options.pop();
    };
    const addQuestion = () => {
      leccion.value.questions.push({
        text: "",
        options: [{ text: "" }],
      });
    };
    const lessQuestion = () => {
      leccion.value.questions.pop();
    };
    const add = () => {
      open.value = true;
      post.value = true;
      title.value = "Agregar Leccion";
      console.log("Agregar...");
    };
    const edit = async (id) => {
      open.value = true;
      post.value = false;
      title.value = "Editar Leccion";
      console.log("Editar...");
      const resp = await axios.get(
        `http://127.0.0.1:8000/api/teachers/${id}/edit`
      );
      console.log(resp.data.data);
      const data = resp.data.data;
      leccion.value.id = data.id;
      leccion.value.name = data.user.name;
      leccion.value.last_name1 = data.user.last_name1;
      leccion.value.last_name2 = data.user.last_name2;
      leccion.value.email = data.user.email;
    };
    const submit = async () => {
      const data = Object.assign({}, leccion.value);
      lecciones.value.push(data);
      open.value = false;
      leccion.value = {
        id: "",
        title: "",
        questions: [
          {
            text: "",
            options: [{ text: "" }],
          },
        ],
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
            `http://127.0.0.1:8000/api/teachers/${id}`,
            {
              headers: {
                "Content-Type": `application/json`,
                Accept: `application/json`,
              },
            }
          );

          console.log(response);
          if (response.status === 200) {
            lecciones.value = lecciones.value.filter(
              (leccion) => leccion.id !== id
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
      leccion.value = {
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
      addOption,
      lessOption,
      lessQuestion,
      addQuestion,
      hideModal,
      menuSidebar,
      post,
      lecciones,
      add,
      edit,
      destroy,
      open,
      title,
      submit,
      leccion,
      thead: [
        {
          value: "Nombre (s)",
          width: 100,
          fixed: "right",
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
            return data.name;
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
