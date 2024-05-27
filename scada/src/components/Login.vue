<template>
    <v-layout align-center justify center>
        <v-flex>
            <v-card class="mx-auto"
                    max-width="500"
                    outlined>
                <v-toolbar dark color='primary' >
                    <img width="50" height="50" src="~@/assets/logoPOwhite.svg">
                    <v-toolbar-title class="display-1 font-weight-bold">
                        Iniciar Sesión
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-row align="center"
                                justify="center">
                            <v-col
                            cols="12"
                            sm="12"
                            md="12"
                            >
                            <v-text-field
                                prepend-icon="account_circle"
                                v-model="nombre"
                                label="Usuario"
                                required
                            ></v-text-field>
                            </v-col>
                            <v-col
                            cols="12"
                            sm="12"
                            md="12"
                            >
                            <v-text-field
                            :append-icon="show ? 'visibility' : 'visibility_off'"
                            :type="show ? 'text' : 'password'"
                            required
                            name="input-10-2"
                            prepend-icon="lock"
                            label="Password"
                            v-model="password"
                            class="input-group--focused"
                            @click:append="show = !show"
                            ></v-text-field>
                            </v-col>
                            <v-col
                            cols="12"
                            sm="12"
                            md="12"
                            >
                            <v-flex class="red--text" v-if="error">
                                {{error}}
                            </v-flex>
                            </v-col>
                            <v-card-actions class='ma-3'>
                                <v-btn @click="ingresar" color='primary'>Ingresar</v-btn>
                            </v-card-actions>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-flex> 
    </v-layout>
</template>

<script>
import axios from 'axios'
import { logTraceguardar, errTraceguardarAxios } from '@/Trace';
export default{
    data(){
        return  {
            nombre:'',
            password:'',
            show:false,
            error:null,
        }
    },
    methods:{
        ingresar(){
            this.error=null;
            axios.post('api/Usuarios/Login', {nombre: this.nombre, password: this.password})
            .then(repuesta => {
                return repuesta.data
            })
            .then(data => {
                this.$store.dispatch("guardarToken", data.token)
                if (this.$store.state.usuario && this.$store.state.usuario.Rol =='Paint')
                    this.$router.push({name: 'painthome'}).catch(()=>{});
                else
                    this.$router.push({name: 'home'}).catch(()=>{});
                logTraceguardar("Usuario","Login");
                this.$store.dispatch('setSnackbar', {color: 'success', text: 'Bienvenido ' + this.nombre, icon: 'info'});
            })
            .catch(err =>{
                //console.log(err.response)
                if(err.response.status==400){
                    this.error="No es un usuario correcto";
                } else if (err.response.status==404){
                    this.error="No existe el usuario o sus datos son incorrectos";
                }else{
                    this.error="Ocurrio un error"
                }
                errTraceguardarAxios("Login", err);
                console.log(err)
            })

        }
    },

}

</script>