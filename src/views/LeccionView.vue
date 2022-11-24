<template>
  <div class="container-general">
    <sidebar-menu :menu="menuSidebar" :collapsed="true" />
    <nav aria-label="breadcrumb" class="my-5">
      <ol class="breadcrumb">
        <li class="breadcrumb-item" aria-current="page">Home</li>
        <li class="breadcrumb-item active" aria-current="page">Lecciones</li>
      </ol>
    </nav>
    <ui-card class="mt-3 py-2 px-4">
      <ui-card-content>
        <h1>Lecciones</h1>
      </ui-card-content>
    </ui-card>
    <ui-grid>
      <ui-grid-cell v-for="lesson in lessons" :key="lesson.id"
        ><ui-card
          class="demo-card demo-card--photo"
          v-if="lesson.nivel <= userLocalStorage.nivel"
        >
          <ui-card-content class="demo-card__primary-action">
            <ui-card-media
              square
              :style="{
                backgroundImage:
                  'url(http://127.0.0.1:8000/lessons/lesson_' +
                  lesson.nivel +
                  '/' +
                  lesson.preview_path +
                  ')',
              }"
            >
              <ui-card-media-content
                class="demo-card__media-content--with-title"
              >
                <div :class="[$tt('subtitle2'), 'demo-card__media-title']">
                  {{ `${lesson.title} ${lesson.nivel}` }}
                </div>
              </ui-card-media-content>
            </ui-card-media>
          </ui-card-content>
          <ui-card-actions>
            <ui-card-icons>
              <ui-icon-button
                @click.prevent="showDetails(lesson.id)"
                icon="arrow_right_alt"
              ></ui-icon-button>
            </ui-card-icons>
          </ui-card-actions> </ui-card
      ></ui-grid-cell>
    </ui-grid>
  </div>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import sidebarVarStudent from "../utils/SidebarVarStudent";
import axios from "axios";
import { useRouter } from "vue-router";
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
    const lessons = ref([]);
    const options = ref([]);

    onBeforeMount(async () => {
      console.log(userLocalStorage.value);
      const resp = await axios.get(`http://127.0.0.1:8000/api/lessons`, {
        headers: {
          "Content-Type": `application/json`,
          Accept: `application/json`,
        },
      });
      const data = await resp.data.data;
      console.log(data);
      lessons.value = data;
    });

    const showDetails = (id) => {
      console.log(id);
      router.push(`/lecciones/${id}`);
    };

    return {
      userLocalStorage,
      menuSidebar,
      options,
      post,
      open,
      title,
      lessons,
      showDetails,
    };
  },
};
</script>

<style scoped>
.container-general {
  margin: 0px 10px 0px 80px;
}
.demo-card--photo {
  width: 200px;
}

.demo-card__media {
  background-image: url("http://127.0.0.1:8000/lessons/lesson_1/lesson_1_img.jpeg");
}

.demo-card__media-content--with-title {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.demo-card__media-title {
  padding: 8px 16px;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  color: white;
}
</style>
