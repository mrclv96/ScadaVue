<template>
    <v-layout align-start>
       <v-flex>
        <v-data-table
            :headers="headers"
            :items="usuarios"
            :search="search"
            sort-by="nombre"
            class="elevation-1"
            :footer-props="{
                    showFirstLastPage: true,
                    firstIcon: 'first_page',
                    prevIcon: 'chevron_left',
                    nextIcon: 'chevron_right',
                    lastIcon: 'last_page'
                }"
            >
            <template v-slot:top>
                <v-toolbar
                flat
                >
            <v-toolbar-title>Usuarios</v-toolbar-title>
                    <v-divider
                        class="mx-4"
                        inset
                        vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog
                        v-model="dialog"
                        max-width="500px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            dark
                            class="mb-2"
                            v-bind="attrs"
                            v-on="on"
                        >
                            Nuevo
                        </v-btn>
                        </template>
                        <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                            <v-row>
                                <v-col
                                cols="6"
                                sm="6"
                                md="6"
                                >
                                <v-text-field
                                    v-model="nombre"
                                    label="Usuario"
                                ></v-text-field>
                                </v-col>
                                <v-col
                                cols="6"
                                sm="6"
                                md="6"
                                >
                                <v-select
                                    v-model="idrol"
                                    :items="roles"
                                    label="Rol"
                                ></v-select>
                                </v-col>
                                <v-col
                                cols="12"
                                sm="12"
                                >
                                <v-text-field
                                :disabled="cambiarpassword"
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
                                </v-col>
                                <v-col
                                cols="12"
                                sm="12"
                                >
                                <v-text-field
                                :disabled="cambiarpassword"
                                :append-icon="show2 ? 'visibility' : 'visibility_off'"
                                :rules="passconfirmrules.concat(passwordConfirmationRule)"
                                :type="show2 ? 'text' : 'password'"
                                label='Confirmar Password'
                                v-model="passwordconfirmation"
                                hint="Repetir el password"
                                @click:append="show2 = !show2"
                                ></v-text-field>
                                </v-col>
                                <v-col
                                cols="12"
                                sm="12"
                                md="12"
                                >
                                </v-col>
                                <v-col
                                cols="12"
                                sm="12"
                                md="12"
                                v-show="valida"
                                >
                                <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                                </v-col>
                            </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn
                            v-if="editedIndex !== -1"
                            color="blue darken-1"
                            text
                            @click="CambiarPassword"
                            >
                            Cambiar Password
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                            color="blue darken-1"
                            text
                            @click="close"
                            >
                            Cancelar
                            </v-btn>
                            <v-btn
                            color="blue darken-1"
                            text
                            @click="guardar"
                            >
                            Guardar
                            </v-btn>
                        </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="adModal" max-width="290">
                        <v-card>
                            <v-card-title class="headline" v-if="adAccion==1"> ¿Activar Item?</v-card-title>
                            <v-card-title class="headline" v-if="adAccion==2"> ¿Desactivar Item?</v-card-title>
                            <v-card-text>
                                Estás a punto de
                                <span v-if="adAccion==1"> Activar </span>
                                <span v-if="adAccion==2"> Desactivar </span>
                                el ítem {{ adNombre }}
                            </v-card-text>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="activarDesactivarCerrar">Cancelar</v-btn>
                                <v-btn v-if="adAccion==1" color="orange darken-4" text @click="activar">Activar</v-btn>
                                <v-btn v-if="adAccion==2" color="orange darken-4" text @click="desactivar">Desactivar</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                        </v-card>
                    </v-dialog>
                    </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                    <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                    >
                    mode_edit
                    </v-icon>
                    <template v-if="item.estatus">
                        <v-icon
                        small
                        @click="activarDesactivarMostrar(2,item)"
                        >
                        block
                        </v-icon>
                    </template>
                    <template v-else>
                        <v-icon
                        small
                        @click="activarDesactivarMostrar(1,item)"
                        >
                        check
                        </v-icon>
                    </template>
            </template>
            <template v-slot:no-data>
                    <v-btn
                    color="primary"
                    @click="listar"
                    >
                    Reset
                    </v-btn>
            </template>
            <template v-slot:item.estatus="{ item }">
                <div v-if="item.estatus">
                    <span class="blue--text">Activo</span>
                </div>
                <div v-else>
                    <span class="red--text">Inactivo</span>
                </div>
            </template> 
        </v-data-table>
        </v-flex> 
    </v-layout>
</template>

<script>
    import axios from 'axios'
    import { logTraceguardar, errTraceguardarAxios } from '@/Trace';
    export default {
        data() {
            return  {
                    usuarios:[],
                    dialog: false,
                    dialogDelete: false,
                    headers: [
                        { text: 'Opciones', value: 'actions', sortable: false },
                        //{ text: 'ID', value: 'idSQP', sortable: false },
                        { text: 'Usuario', value: 'nombre' },
                        { text: 'Rol', value: 'rol' },
                        { text: 'Estado', value: 'estatus'}
                    ],
                    search: '',

                    id: '',
                    idrol:'',
                    nombre:'',
                    rol:'',
                    roles:[],
                    password:'',
                    passwordconfirmation:'',
                    actPassword:false,
                    passwordAnt:'',
                    cambiarpassword:false,

                    editedIndex: -1,

                    menu: false,

                    adModal: 0,
                    adAccion: 0,
                    adNombre: '',
                    adId: '',

                    valida: 0,
                    validaMensaje:[],

                    show: false,
                    show2: false,
                    passrules: {
                        required: value => !!value || 'Requerido.',
                        min: v => v.length >= 8 || 'Mínimo 8 caracteres'
                    },
                    passconfirmrules: [v => !!v || "Password is required"]
                    
                }
        },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
            },
            passwordConfirmationRule() {
            return () =>
                this.password === this.passwordconfirmation || "Password debe coincidir";
            }
        },
        watch: {
            dialog (val) {
            val || this.close()
            },
            dialogDelete (val) {
            val || this.closeDelete()
            },
        },
        created () {
            this.listar();
            this.selectl();
        },
        methods: {
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Usuarios/Listar',configuracion).then(function(response){
                    //console.log(response)
                    me.usuarios=response.data;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Usuario - Listar", error); 
                });
            },
            selectl(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                var rolArray=[];
                axios.get('api/Roles/Select',configuracion).then(function(response){
                    rolArray=response.data;
                    rolArray.map(function(x){
                        me.roles.push({text: x.nombre, value: x.idRol})
                    });
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Rol - Select", error); 
                });
            },

            editItem (item) {
                this.id=item.idUsuario;
                this.nombre=item.nombre;
                this.idrol=item.idRol;
                this.password=item.passwordHash;
                this.passwordconfirmation=item.passwordHash;
                this.passwordAnt=item.passwordHash;
                this.cambiarpassword=true;
                this.show=false,
                this.show2=false,
                this.editedIndex=1;
                this.dialog = true
            },

            activarDesactivarMostrar(accion,item){
                this.adModal = 1;
                this.adNombre=item.nombre;
                this.adId=item.idUsuario;
                if(accion==1){
                    this.adAccion=1;
                }
                else if (accion == 2){
                    this.adAccion=2;
                }
                else{
                    this.AdModal=0;
                }
            },
            activarDesactivarCerrar(){
                this.adModal=0;
            },
            activar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Usuarios/Activar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("Usuario","Activó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Usuario - Activar", error); 
                })
            },
            desactivar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Usuarios/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("Usuario","Desactivó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Usuario - Desactivar", error); 
                })
            },
            CambiarPassword(){
                this.password='';
                this.passwordconfirmation='';
                this.cambiarpassword=false;
            },
            close () {
                this.dialog = false
                this.limpiar();
            },
            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                })
            },
            limpiar(){
                this.id="";
                this.nombre="";
                this.idrol="";
                this.password="";
                this.passwordconfirmation="";
                this.passwordAnt="";
                this.show=false,
                this.show2=false,
                this.actPassword=false;
                this.editedIndex=-1;
            },
            guardar () {
                if (this.validar()){
                    return;
                }
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                if (this.editedIndex > -1) {
                    //Código para editar
                    let me=this;
                    if(me.password!=me.passwordAnt){
                        me.actPassword=true;
                    }
                    axios.put('api/Usuarios/Actualizar',{
                        'idUsuario': me.id,
                        'Nombre': me.nombre,
                        'idRol': me.idrol,
                        'Password': me.password,
                        'actPassword':me.actPassword
                    },configuracion).then(function(response){
                        logTraceguardar("Usuario","Actualizó " + me.id + " "+ me.nombre);
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("Usuario - Actualizar", error); 
                    })
                } else {
                    //Código para guardar
                    let me=this;
                    axios.post('api/Usuarios/Crear',{
                        'Nombre': me.nombre,
                        'idRol': me.idrol,
                        'Password': me.password
                    },configuracion).then(function(response){
                        logTraceguardar("Usuario","Creó " + me.nombre);
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("Usuario - Crear", error); 
                    })
                }
            },
            validar (){
                this.valida=0;
                this.validaMensaje=[];
                if (this.nombre.length < 2  || this.nombre.length > 101  ){
                    this.validaMensaje.push("El nombre de usuario debe ser entre 3 a 100 caracteres.");
                }
                if(!this.idrol){
                    this.validaMensaje.push("Seleccione un rol.");
                }
                if(!this.password){
                    this.validaMensaje.push("Ingrese el password del usuario.");
                }
                if(!this.passwordconfirmation){
                    this.validaMensaje.push("Ingrese el password de confirmación.");
                }
                if(this.password != this.passwordconfirmation){
                    this.validaMensaje.push("Passwords no coinciden.");
                }
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
    },
}

</script>