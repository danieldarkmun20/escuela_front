import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import TeacherView from "../views/TeacherView.vue";
import Login from "../views/LoginView.vue";
import StudentView from "../views/StudentView.vue";
import LeccionDetails from "../views/LeccionDetails.vue";
import LeccionView from "../views/LeccionView.vue";
import AddStudentByTeacherView from "../views/AddStudentByTeacherView.vue";
import SubirLeccion from "../views/SubirLeccion.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/maestros",
      name: "maestros",
      component: TeacherView,
    },
    {
      path: "/estudiantes",
      name: "estudiantes",
      component: StudentView,
    },
    {
      path: "/lecciones",
      name: "lecciones",
      component: LeccionView,
    },
    {
      path: "/lecciones/:id",
      name: "detalleLecciones",
      component: LeccionDetails,
    },
    {
      path: "/asignar-alumno-maestro",
      name: "asignaralumnomaestro",
      component: AddStudentByTeacherView,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/subir-leccion",
      name: "subirLeccion",
      component: SubirLeccion,
    },
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import("../views/AboutView.vue"),
    // },
  ],
});

router.beforeEach(async (to) => {
  const userResponse = JSON.parse(localStorage.getItem("user"));
  if (userResponse === null && to.path !== "/login") {
    return {
      path: "/login",
    };
  }
});

export default router;
