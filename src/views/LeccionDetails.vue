<template>
  <div class="container-general">
    <sidebar-menu :menu="menuSidebar" :collapsed="true" />
    <nav aria-label="breadcrumb" class="my-5">
      <ol class="breadcrumb">
        <li class="breadcrumb-item" style="color: #fff" aria-current="page">
          Home
        </li>
        <li class="breadcrumb-item active" aria-current="page">Lecciones</li>
      </ol>
    </nav>
    <ui-card class="mt-3 py-2 px-4">
      <ui-card-content>
        <h1>{{ lesson.title }}</h1>
      </ui-card-content>
    </ui-card>
    <ui-card class="mt-3 py-2 px-4">
      <ui-card-content class="center_video d-flex align-items-center">
        <video width="620" height="540" controls v-if="lesson.nivel == 1">
          <source
            :src="`../../public/lessons/XIHMAI_LECCION_1.mp4`"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <video width="620" height="540" controls v-else-if="lesson.nivel == 2">
          <source
            :src="`../../public/lessons/XIHMAI_LECCION_2.mp4`"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <ui-form type="|" item-margin-bottom="16" action-align="center">
          <template #default="{ itemClass }">
            <ui-grid>
              <ui-grid-cell
                columns="6"
                v-for="(question, index) in lesson.questions"
                :key="question.id"
              >
                <ui-form-field :class="[itemClass, 'required']">
                  <label>{{ question.text }}</label>
                  <ui-form-field
                    v-for="option in question.options"
                    :key="option.id"
                  >
                    <ui-radio
                      v-model="answers[index].option_id"
                      :input-id="option.id"
                      :value="option.id"
                      required
                    ></ui-radio>
                    <label :for="option.id">{{ option.text }}</label>
                  </ui-form-field>
                  <!-- <div
                    class="input-errors"
                    v-for="error of v$.name.$silentErrors"
                    :key="error.$uid"
                  >
                    <div class="alert alert-danger my-1" role="alert">
                      {{ error.$message }}
                    </div>
                  </div> -->
                </ui-form-field>
              </ui-grid-cell>
              <ui-grid-cell columns="12">
                <ui-button
                  style="background-color: #95c972; color: #fff"
                  class="mx-2"
                  raised
                  @click.prevent="submit"
                  >Submit</ui-button
                >
              </ui-grid-cell>
            </ui-grid>
          </template>
        </ui-form>
      </ui-card-content>
    </ui-card>
  </div>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import sidebarVarStudent from "../utils/SidebarVarStudent";
import axios from "axios";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
export default {
  components: {
    SidebarMenu,
  },
  setup() {
    const router = useRouter();
    const userLocalStorage = ref(
      JSON.parse(localStorage.getItem("user")) ?? null
    );
    const menuSidebar = sidebarVarStudent;
    const open = ref(false);
    const post = ref(true);
    const title = ref("");
    const path = ref("");
    const lesson = ref({});
    const answers = ref([]);
    const options = ref([]);

    onBeforeMount(async () => {
      console.log(userLocalStorage.value);
      const { params } = router.currentRoute.value;
      const resp = await axios.get(
        `http://127.0.0.1:8000/api/lessons/${params.id}`,
        {
          headers: {
            "Content-Type": `application/json`,
            Accept: `application/json`,
          },
        }
      );
      const data = await resp.data.data;
      console.log(data);
      lesson.value = data;
      lesson.value.questions.forEach(() => {
        console.log("sda");
        answers.value.push({
          option_id: null,
          user_id: userLocalStorage.value.user.id,
        });
      });
      console.log(lesson.value);
      path.value = `http://127.0.0.1:8000/lessons/lesson_${lesson.value.nivel}/${lesson.value.path}`;
    });

    const showDetails = (id) => {
      console.log(id);
      router.push(`/lecciones/${id}`);
    };

    const submit = async () => {
      const { params } = router.currentRoute.value;
      let error = false;
      const data = Object.assign({}, answers.value);
      answers.value.forEach((answer) => {
        if (answer.option_id === null) error = true;
      });
      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Contesta todas las preguntas por favor!",
        });
      } else {
        try {
          const response = await axios.post(
            `http://127.0.0.1:8000/api/reply/${params.id}`,
            { data },
            {
              headers: {
                "Content-Type": `application/json`,
                Accept: `application/json`,
              },
            }
          );
          console.log(response);
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Felicidades! Pasaste el Nivel ",
              showConfirmButton: false,
              timer: 1500,
            });
            router.push("/lecciones");
            console.log(response.data.data);
            userLocalStorage.value.user.nivel = response.data.data.nivel - 1;
            localStorage.removeItem("user");
            localStorage.setItem(
              "user",
              JSON.stringify(userLocalStorage.value)
            );
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Tienes una o mas respuestas erroneas!",
          });
        }
      }
    };

    return {
      submit,
      userLocalStorage,
      menuSidebar,
      options,
      post,
      open,
      title,
      lesson,
      path,
      answers,
      showDetails,
    };
  },
};
</script>

<style scoped>
.container-general {
  margin: 0px 10px 0px 80px;
}
.center_video {
  margin: 0 auto;
}
</style>
