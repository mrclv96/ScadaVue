import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '@/views/HomeView.vue'
import painthome from '@/components/HomePaint'
import colores from '@/components/Colores'
import sqp from '@/components/SQP'
import posicionmodelo from '@/components/PosicionModelo'
import linea from '@/components/Linea'
import lineavariante from '@/components/LineaVariante'
import secuencia from '@/components/Secuencia'
import estaciones from '@/components/Estacion'
import fascia from '@/components/Fascia'
import producto from '@/components/Producto'
import rol from '@/components/Rol'
import orden from '@/components/Orden'
import protocolo from '@/components/Protocolo'
import opf from '@/components/opf'
import apptypes from '@/components/AppTypes'
import scrap from '@/components/Scrap'
import ordenp from '@/components/OrdenP'
import protocolop from '@/components/ProtocoloP'
import logtrace from '@/components/LogTrace'
import errtrace from '@/components/ErrTrace'
import usuario from '@/components/Usuario'
import login from '@/components/Login'
import SkidProtocol from '@/components/SkidProtocol'
import store from '@/store/index'
import gantt from '@/components/Gantt'

Vue.use(VueRouter)


const routes = [
  {
    path: '/scada/',
    name: 'home',
    component: home,
    meta: {
      Admin: true,
      Engineering: true,
      Logistic: true,
      Maintenance: true,
      Supervisor: true,
      Paint: true
    }
  },
  {
    path: '/scada/',
    name: 'painthome',
    component: painthome,
    meta: {
      Admin: true,
      Engineering: true,
      Logistic: true,
      Maintenance: true,
      Supervisor: true,
      Paint: true
    }
  },
  {
    path: '/scada/colores',
    name: 'Código Color',
    component: colores,
    meta: {
      Admin: true,
      Engineering: true,
    }
  },
  {
    path: '/scada/sqp',
    name: 'SQP',
    component: sqp,
    meta: {
      Admin: true,
      Engineering: true,
    }
    },
  {
    path: '/scada/posicionmodel',
    name: 'Posición Modelo',
    component: posicionmodelo,
    meta: {
      Admin: true,
      Engineering: true,
    }
  },
  {
    path: '/scada/linea',
    name: 'Líneas',
    component: linea,
    meta: {
      Admin: true,
    }
  },
  {
    path: '/scada/lineavariante',
    name: 'Línea Variante',
    component: lineavariante,
    meta: {
      Admin: true,
    }
  },
  {
    path: '/scada/secuencia',
    name: 'Secuencias',
    component: secuencia,
    meta: {
      Admin: true,
    }
  },
  {
    path: '/scada/estaciones',
    name: 'Estaciones',
    component: estaciones,
      meta: {
      Admin: true,
    }
  },
  {
    path: '/scada/fascia',
    name: 'Fascia',
    component: fascia,
    meta: {
      Admin: true,
      Engineering: true,
    }
  },
  {
    path: '/scada/producto',
    name: 'Producto',
    component: producto,
    meta: {
      Admin: true,
      Engineering: true,
    }
  },
  {
    path: '/scada/rol',
    name: 'Roles',
    component: rol,
    meta: {
      Admin: true,
    }
  },
  {
    path: '/scada/usuario',
    name: 'Usuarios',
    component: usuario,
    meta: {
      Admin: true,
    }
  },
  {
    path: '/scada/login',
    name: 'Login',
    component: login,
    meta: {
      libre: true,
    }
  },
  {
    path: '/scada/logtrace',
    name: 'Cambios',
    component: logtrace,
    meta: {
      Admin: true,
    }
  },
  {
    path: '/scada/errtrace',
    name: 'Errores',
    component: errtrace,
    meta: {
      Admin: true,
    }
  },
  {
    path: '/scada/orden',
    name: 'Ordenes',
    component: orden,
    meta: {
      Admin: true,
      Engineering: true,
      Logistic: true,
      Maintenance: true,
      Supervisor: true
    }
  },
  {
    path: '/scada/protocolo',
    name: 'Protocolos',
    component: protocolo,
    meta: {
      Admin: true,
      Engineering: true,
      Logistic: true,
      Maintenance: true,
      Supervisor: true
    }
  },

  {
    path: '/scada/opf',
    name: 'One Piece Flow',
    component: opf,
    meta: {
      Admin: true,
      Paint: false,
      Engineering: true,
      Logistic: true,
      Maintenance: true,
      Supervisor: true
    }
  },

  {
    path: '/scada/apptypes',
    name: 'App Types',
    component: apptypes,
    meta: {
      Admin: true,
      Paint: true,
      Engineering: false,
      Logistic: false,
      Maintenance: false,
      Supervisor: false
    }
    },
    {
  path: '/scada/scrap',
  name: 'Scrap',
  component: scrap,
  meta: {
    Admin: true,
    Paint: true,
    Engineering: false,
    Logistic: false,
    Maintenance: false,
    Supervisor: false
  }
},
{
  path: '/scada/gantt',
  name: 'Gantt',
  component: gantt,
  meta: {
    Admin: true,
  }
},
{
  path: '/scada/ordenp',
  name: 'OrdenesP',
  component: ordenp,
  meta: {
    Admin: true,
    Paint: true,
    Engineering: false,
    Logistic: false,
    Maintenance: false,
    Supervisor: false
  }
},
{
  path: '/scada/protocolp',
  name: 'ProtocoloP',
  component: protocolop,
  meta: {
    Admin: true,
    Paint: true,
  }
},
{
  path: '/scada/skidprotocol',
  name: 'SkidProtocol',
  component: SkidProtocol,
  meta: {
    Admin: true,
    Paint: true,
  }
},

]

var router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.libre)){
    next()
  } else if(store.state.usuario && store.state.usuario.Rol=='Admin'){
    if(to.matched.some(record => record.meta.Admin)){
      next()
    }
  } else if(store.state.usuario && store.state.usuario.Rol=='Engineering'){
    if(to.matched.some(record => record.meta.Engineering)){
      next()
    }
  } else if(store.state.usuario && store.state.usuario.Rol=='Logistic'){
    if(to.matched.some(record => record.meta.Logistic)){
      next()
    }
  } else if(store.state.usuario && store.state.usuario.Rol=='Maintenance'){
      if(to.matched.some(record => record.meta.Maintenance)){
        next()
      }
  } else if(store.state.usuario && store.state.usuario.Rol=='Supervisor'){
      if(to.matched.some(record => record.meta.Supervisor)){
        next()
      }
  } else if(store.state.usuario && store.state.usuario.Rol=='Paint'){
      if(to.matched.some(record => record.meta.Paint)){
        next()
      }
  } else {
      next({
        name: 'Login',
      })
    }

})

export default router

