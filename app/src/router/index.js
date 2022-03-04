import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
const UploadFile = () => import('../views/UploadFile.vue');
const ManageMent = () => import('../views/UserManage.vue');
const DivideQuery = () => import('../views/DivideQuery.vue');
const routes = [
  { path: '/', name: 'home', redirect: '/query' },
  { path: '/manage', name: 'ManageMent', component: ManageMent },
  { path: '/upload', name: 'UploadFile', component: UploadFile },
  { path: '/query', name: 'DivideQuery', component: DivideQuery }
];
const router = new VueRouter({ base: process.env.BASE_URL, routes });
export default router;