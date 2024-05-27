<template>
  <v-app id="inspire">
    <v-navigation-drawer v-if="logueado"
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      fixed
      app
      disable-resize-watcher
      
    >
    <v-list nav dense >
      <template v-for="(item , j) in nav_lists" >
      <div v-for="(access,k) in item.acceso" v-if="getRol==access">
      <v-list-group
        v-if="item.lists"
        dense
        :key="item.name + j"
        :value="item.name + j"
        v-model="item.active"
        :prepend-icon="item.icon"
        no-action
      >
        <template v-slot:activator >
            <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                
            </v-list-item-content>
        </template>
        <v-list-item-group class="pl-10">
          <template v-for="(child, i) in item.lists">
            <v-list-item v-if="!child.lists"
              :key="child.name + j "
              :value="child.name + j "
              router :to="child.router"
              @click="drawer = !drawer"
            >
                <v-list-item-content>
                    <v-list-item-title v-text="child.name"></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-group 
              v-else
              dense
              :key="child.name + j + i"
              :value="child.name + j + i"
              v-model="child.active"
              :prepend-icon="child.icon"
              no-action
              sub-group
              collapse-icon
            >
            <template v-slot:activator>
                <v-list-item-content>
                    <v-list-item-title v-text="child.name"></v-list-item-title>
                </v-list-item-content>
            </template>
            </v-list-group>
          </template>
        </v-list-item-group>
      </v-list-group>
      <v-list-item
        v-else
        no-action
        router :to= "item.router"
        @click="drawer = !drawer"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
    </template>
    </v-list>
      <!--  -->
    </v-navigation-drawer>
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="blue darken-3"
      dark
      app
      fixed
        :collapse="dashmode"
        :hide-on-scroll="dashmode"
        :absolute="dashmode"
        
      >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title v-if="!logueado">SCADA</v-toolbar-title>
      <v-toolbar-title v-else-if="logueado && $store.state.usuario.Rol==='Paint'">SCADA Pintura</v-toolbar-title>
      <v-toolbar-title v-else="!logueado">SCADA Ensambles</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="logueado">
      <v-row justify="end">
        <v-btn v-if="!dashmode"
          icon id="mode-switcher"
          @click="$vuetify.theme.dark = !$vuetify.theme.dark"
          >
          <v-icon  :color="($vuetify.theme.dark) ? 'primary' : 'primary lighten-4'" >
            {{ ($vuetify.theme.dark) ? 'dark_mode' : 'light_mode' }}
          </v-icon>

        </v-btn>
        <v-menu
          bottom
          min-width="200px"
          rounded
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn 
              icon
              x-large
              v-on="on"
            >
            <v-avatar 
              color="primary darken-1"
              size="48"
            >
              <span class="white--text text-h5">{{ (getusername.substring(0,2)).toUpperCase() }}</span>
            </v-avatar>
            </v-btn>
        </template>
          <v-card >
            <v-list-item-content class="justify-end" >
              <div class="mx-auto text-center">
                <v-avatar
                  color="primary darken-1"
                >
                  <span class="white--text text-h5">{{ (getusername.substring(0,2)).toUpperCase() }}</span>
                </v-avatar>
                <h3>{{ getusername }}</h3>
                <p class="text-caption mt-1">
                  {{$store.state.usuario.Rol}}
                </p>
                <v-divider class="my-3" ></v-divider>
                <v-row class="ma-2" justify="center">
                    <v-checkbox
                    dense
                    v-model="dashmode"
                    label="Modo Dashboard"
                    hide-details>
                    </v-checkbox>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-btn @click="dialog=true"
                  depressed
                  rounded
                  text
                >
                  Cambiar password
                </v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn @click="salir" v-if="logueado"
                  depressed
                  rounded
                  text
                >
                  <v-icon>logout</v-icon> Salir
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
      </v-row>
      </template>
      <v-btn :to="{name: 'Login'}" v-else color='primary darken-2'>
        <v-icon>login</v-icon> Login
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
      </v-container>
        <v-dialog v-model="dialog" max-width="350">
          <v-card>
            <v-card-title>
                <span class="text-h5">Nuevo Password</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    >
                    <v-form v-model="isFormPassword">
                      <v-text-field
                      :append-icon="show ? 'visibility' : 'visibility_off'"
                      :rules="[passrules.required, passrules.min]"
                      :type="show ? 'text' : 'password'"
                      name="input-10-2"
                      label="Password"
                      v-model="password"
                      hint="Debe ser mínimo de 8 caracteres"
                      class="input-group--focused"
                      @click:append="show = !show"
                      ></v-text-field>
                    </v-form>
                    </v-col>
                    <v-col
                    cols="12"
                    sm="12"
                    >
                    <v-form v-model="isFormPasswordc">
                      <v-text-field
                      :append-icon="show2 ? 'visibility' : 'visibility_off'"
                      :rules="passconfirmrules.concat(passwordConfirmationRule)"
                      :type="show2 ? 'text' : 'password'"
                      label='Confirmar Password'
                      v-model="passwordconfirmation"
                      hint="Repetir el password"
                      @click:append="show2 = !show2"
                      ></v-text-field>
                    </v-form>
                    </v-col>
                    <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    >
                    </v-col>
                  </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-btn
                color="blue darken-1"
                text
                @click="close"
                >
                Cancelar
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                color="blue darken-1"
                text
                :disabled="!isFormPassword || !isFormPasswordc"
                @click="cambiarpassword"
                >
                Cambiar
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-main>
    <v-footer v-if="!dashmode" color="primary darken-1" padless>
        <v-col
        class="primary darken-2 py-4 text-center white--text"
        cols="12"
        >
          &copy;2022 — <strong>iSay</strong>
          <!-- <div v-if="warningZone"> ¿Todavía estas con nosotros?</div> -->
        </v-col>        
    </v-footer>
    <v-snackbar
      v-for="(snackbar, index) in snackbars.filter(s => s.showing)"
      :key="snackbar.text + Math.random()"
      v-model="snackbar.showing"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      :style="`bottom: ${(index * 70) + 6}px`"
      >
      <v-icon class="pr-3" dark large>{{ snackbar.icon }}</v-icon>  
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          icon
          v-bind="attrs"
          @click="snackbar.showing = false"
        >
        <v-icon>close</v-icon>
        </v-btn>
      </template>

    </v-snackbar>
    
  </v-app>
</template>

<script>
  import { toHandlers } from '@vue/runtime-core';
  import axios from 'axios';
  import { mapState, mapActions } from 'vuex';
  import { logTraceguardar } from './Trace';
  export default {
      name: 'App',
      data () {
        return{
        drawer: null,
        rol: null,
        //expp: '',
        dialog: false,
        show: false,
        show2: false,
        dashmode:false,
        password:'',
        passwordconfirmation:'',
        passrules: {
          required: value => !!value || 'Requerido.',
          min: v => v.length >= 8 || 'Mínimo 8 caracteres'
          },
        passconfirmrules: [v => !!v || "Password is required"],
        isFormPassword: false,
        isFormPasswordc: false,
        nav_lists:[
          {
            name: 'Home',
            icon: 'home',
            router: { name: 'home'},
            acceso: ['Libre'],
          },
          {
            name: 'Colores',
            icon: 'color_lens',
            active: false,
            router: '',
            acceso: ['Admin', 'Engineering'],
            lists:[{
                name:'Código Color', router:{ name: 'Código Color'}
              },
              {
                name:'SQP',router: { name: 'SQP'}
              }
            ]
          },
          {
            name: 'Modelos',
            icon: 'list',
            router: '',
            active: false,
            acceso: ['Admin', 'Engineering'],
            lists:[{
              name :'Posición Modelo', router: { name: 'Posición Modelo'}
              },
              {
              name :'Fascia', router: { name: 'Fascia'}
              },
              {
              name :'Producto', router: { name: 'Producto'}
              }
            ]
          },
          {
            name: 'Estaciones',
            icon: 'grid_view',
            router: '',
            active: false,
            acceso: ['Admin'],
            lists:[{
              name :'Líneas', router: { name: 'Líneas'}
              },
              {
              name :'Variante', router: { name: 'Línea Variante'}
              },
              {
              name :'Estaciones', router: { name: 'Estaciones'}
              },
              {
              name :'Secuencias', router: { name: 'Secuencias'}
              }
            ]
          },
            {
            name: 'Accesos',
            icon: 'groups',
            router: '',
            active: false,
            acceso: ['Admin'],
            lists:[{
              name :'Usuarios', router: { name: 'Usuarios'}
              },
              {
              name :'Roles', router: { name: 'Roles'}
              }
            ]
          },
            {
            name: 'Registros',
            icon: 'history',
            router: '',
            active: false,
            acceso: ['Admin'],
            lists:[{
              name :'Cambios', router: { name: 'Cambios'}
              },
              {
              name :'Errores', router: { name: 'Errores'}
              }
            ]
          },
          {
            name: 'Producción',
            icon: 'conveyor_belt',
            router: '',
            active: false,
            acceso: ['Admin', 'Engineering', 'Logistic', 'Maintenance', 'Supervisor'],
            lists:[{
              name :'Ordenes', router: { name: 'Ordenes'}
              },
              {
              name :'Protocolos', router: { name: 'Protocolos'}
              }
            ]
          },
          {
          name: 'Kit',
            icon: 'pallet',
            router: '',
            active: false,
            acceso: ['Admin', 'Engineering', 'Logistic', 'Maintenance', 'Supervisor'],
            lists:[{
              name :'One Piece Flow', router: { name: 'One Piece Flow'}
              },
            ]
          },
          {
            name: 'OEE Pintura',
            icon: 'insights',
            router: '',
            active: false,
            acceso: ['Admin', 'Paint'],
            lists:[{
              name :'Scrap', router: { name: 'Scrap'}
              },
              {
              name :'App Types', router: { name: 'App Types'}
              },
              /*{
              name :'Gantt', router: { name: 'Gantt'}
              }*/
            ]
            },
          {
            name: 'Producción Pintura',
            icon: 'brush',
            router: '',
            active: false,
            acceso: ['Admin', 'Paint'],
            lists:[{
              name :'Ordenes', router: { name: 'OrdenesP'}
              },
              {
              name :'Protocolos', router: { name: 'SkidProtocol'}
              }
            ]
          },
        /*{
            name: 'Reportes',
            icon: 'insert_drive_file',
            router: '',
            acceso: 10,
          },*/
          ],

          events: ['click','mousemove','mousedown','scroll','keypress','load'],
          warningTimer: null,
          logoutTimer: null,
          warningZone: false,
          buttons: [
            {
              color: "success",
              title: "Success",
              type: "cambiodepassword"
            },
            {
              color: "warning",
              title: "Warning",
              type: "warningzone"
            }
          ],

          timeout: 5000,
          
          }
        },
    methods:{
      ...mapActions(['setDashmode']),
      menu_close(){
        this.nav_lists.forEach( nav_list => nav_list.active = false);
      },
      salir(){
        logTraceguardar("Usuario","Logout");
        this.dashmode=false;
        this.$store.dispatch("salir");
      },
      close () {
        this.dialog = false
        this.limpiar();
      },
      cambiarpassword(){
        let header={"Authorization" : "Bearer " + this.$store.state.token};
        let configuracion= {headers : header};
        let me=this;
        axios.put('api/Usuarios/CambiarPassword',{
                        'idUsuario': parseInt(this.$store.state.usuario.idUsuario),
                        'Password': me.password,
                        'actPassword':true
                    },configuracion).then(function(response){
                        //alert("Password cambiado");
                        logTraceguardar("Usuario","Cambio su password");
                        me.close();
                        me.limpiar();
                        me.$store.dispatch('setSnackbar', {color: 'success', text: '!Se cambió password correctamente!', icon: 'check_circle'});
                    }).catch(function(error){
                        console.log(error);
                    })
      },
      limpiar(){
        //this.id="";
        //this.nombre="";
        //this.idrol="";
        this.password="";
        this.passwordconfirmation="";
        //this.passwordAnt="";
        this.show=false;
        this.show2=false;
        this.dashmode=false;
        //this.snackbar=false;
        //this.snackbartext='';
        //this.actPassword=false;
        //this.editedIndex=-1;
      },
      //automatic log-out without exp time from jwt
      setTimers: function(){
        if (this.logueado && !this.dashmode) {
          this.warningTimer = setTimeout(this.warningMessage, 14 * 60 * 1000); // 14 minutes 14*60*1000
          this.logoutTimer = setTimeout(this.logoutUser, 15 * 60 *  1000); // 15 minutes 14*60*1000
          this.warningZone = false;
        }
        else{
          this.warningZone = false;
        }
      },
      warningMessage: function(){
        //alert('Warning');
        let me=this;
        me.$store.dispatch('setSnackbar', {color: 'warning', text: '¿Todavía estas con nosotros?', icon: 'warning'});
        //me.SnackbarShow("warningzone");
        this.warningZone = true;
      },
      logoutUser: function(){
        this.warningZone = false;
        this.salir();
      },
      resetTimer: function(){
        clearTimeout(this.warningTimer);
        clearTimeout(this.logoutTimer);
        this.setTimers();
      },
      //end
    },
    computed:{
      ...mapState(['snackbars']),
      logueado(){
        return this.$store.state.usuario;
      },
      esAdmin(){
        return this.$store.state.usuario && this.$store.state.usuario.Rol =='Admin'
      },
      esEngi(){
        return this.$store.state.usuario && this.$store.state.usuario.Rol =='Engineering';
      },
      esLogi(){
        return this.$store.state.usuario && this.$store.state.usuario.Rol =='Logistic';
      },
      esMain(){
        return this.$store.state.usuario && this.$store.state.usuario.Rol =='Maintenance';
      },
      esSupe(){
        return this.$store.state.usuario && this.$store.state.usuario.Rol =='Supervisor';
      },
      esPain(){
        return this.$store.state.usuario && this.$store.state.usuario.Rol =='Paint';
      },
      getRol(){
        if(this.$store.state.usuario)
          return this.$store.state.usuario.Rol
        else
          return null;
      },
      autologoffExp(){
        /*if (Date.now() >= this.$store.state.usuario.exp * 1000) {
          this.logoutTimer;
          return true;
        }else
          return false;*/
        return this.$store.dispatch("autologoff");
        
      },/*
      getrole(){
        if(this.$store.state.usuario){
          switch(this.$store.state.usuario.Rol){
            case 'Admin':
              return this.rol=1000;
            case 'Engineering':
              return this.rol=100;
            case 'Maintenance':
              return this.rol=50;
            case 'Logistic':
              return this.rol=10;
            case 'Supervisor':
              return this.rol=5;
            case 'Paint':
              return this.rol=1;
            default:
              return this.rol=0;
          }
        if(this.$store.state.usuario.Rol == 'Admin' ){ 
          return this.rol=1000;
          }else if (this.$store.state.usuario.Rol == 'Engineering' ) {
            return this.rol=100;
          } else if (this.$store.state.usuario.Rol =='Logistic') {
            return this.rol=10;
          } else {
            return this.rol=0;
          }
        }
      },*/
      getusername(){
        if(this.$store.state.usuario){
          //console.log(this.$store.state.usuario.Nombre);
          return this.$store.state.usuario.Nombre;
        }
      },
      /*exptime(){
            if (this.logueado) {
                let me = this;
                if (me.expp == ''){
                  me.expp=this.$store.state.usuario.exp*1000;
                  }
                 //console.log(new Date(Date.now()));
                console.log(new Date(this.expp));
            }
            if (Date.now() >= (this.expp)) {
                console.log("Experation time :" + Date(Date.now()));
                this.salir();
                this.expp = '';
                return true;
              }
              else{
                return false;
            }
      },*/
      passwordConfirmationRule() {
        return () =>
        this.password === this.passwordconfirmation || "Password debe coincidir";
      },
      getHomerouter(){
        if (this.$store.state.usuario && this.$store.state.usuario.Rol =='Paint')
          this.nav_lists[0].router.name = 'painthome';
        else
          this.nav_lists[0].router.name = 'home';
      }
    },
    watch: {
      
      dashmode: function(value){
        //console.log(value);
        this.setDashmode(value);
      }
      /*exptw(){
        if (Date.now() >= (this.expp)) {
          console.log("watch, automatic log off " + new Date(this.expp));
          this.salir();
        }
        else{
          console.log("watch aun no " + new Date(this.expp));
        }
      },*/
    },
    created(){
      this.$store.dispatch("autoLogin");
      this.$store.dispatch('setDashmode', this.dashmode);
    },
    mounted(){
      this.events.forEach(function (event){
      window.addEventListener(event, this.resetTimer);
      },this);
      this.setTimers();
    
      /*const thisInstance = this
      this.$root.$on('SnackbarShow(item)', function(){
        thisInstance.SnackbarShow(item)
      })*/
    },
    destroyed(){
      this.events.forEach(function (event){
        window.removeEventListener(event, this.resetTimer);
      },this);
      this.resetTimer();
    }
  }
</script>