const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'shop', component: () => import('../pages/ShopPage.vue') },
      { path: 'login', name: 'login', component: () => import('../pages/LoginPage.vue') },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('../pages/CartPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('../pages/AdminPage.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue'),
  },
]

export default routes
