<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table
                :headers="headers"
                :items="colores"
                :search="search"
                sort-by="codigoColor"
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
                <v-btn @click="crearPDF(colores,'Lista de Colores')"><v-icon>file_download</v-icon></v-btn>
                <v-toolbar-title>Códigos de Color</v-toolbar-title>
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
                                class="mx-2"
                                v-bind="attrs"
                                v-on="on"
                            >
                            <v-icon>add</v-icon>
                                Nuevo
                            </v-btn>
                            <v-btn
                                color="primary"
                                dark
                                class="mx-2"
                                @click="copiartabla(colores)"
                            >
                            <v-icon>content_copy</v-icon>
                                Copiar
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
                                    cols="12"
                                    sm="12"
                                    md="12"
                                    >
                                    <v-text-field
                                        v-model="codigoColor"
                                        label="Código Color"
                                        :disabled="editedIndex !== -1"
                                    ></v-text-field>
                                    </v-col>
                                    <v-col
                                    cols="12"
                                    sm="12"
                                    md="12"
                                    >
                                    <v-text-field
                                        v-model="nombre"
                                        label="Nombre"
                                    ></v-text-field>
                                    </v-col>
                                    <v-col class="shrink" style="min-width: 220px;">
                                    <v-text-field v-model="rgbHex" label="RGB Color" 
                                        disabled
                                        hide-details class="ma-0 pa-0" >
                                        <template v-slot:append>
                                            <v-menu v-model="menu" top nudge-bottom="105" nudge-left="16" :close-on-content-click="false">
                                                <template v-slot:activator="{ on }">
                                                    <div :style="swatchStyle" v-on="on" />
                                                </template>
                                                <v-card>
                                                    <v-card-text class="pa-0">
                                                        <v-color-picker v-model="rgbHex" mode="hexa" flat />
                                                    </v-card-text>
                                                </v-card>
                                            </v-menu>
                                        </template>
                                    </v-text-field>
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
                        <v-dialog v-model="dialogDelete" max-width="400px">
                            <v-card>
                            <v-card-title class="text-h5">¿Estas seguro de borrar el color?</v-card-title>
                                <v-card-text>
                                    Estás a punto de Eliminar {{ elNombre }}
                                </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                <v-spacer></v-spacer>
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
                        <v-icon v-if="$store.state.usuario.Rol =='Admin'"
                        small
                        @click="deleteItem(item)"
                        >
                        delete
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
                <template v-slot:item.rgbHex="{ item }">
                        <v-chip
                        :color="getColor(item.rgbHex)"
                        :text-color="getTextColor(item.rgbHex)"
                        >
                        {{ item.rgbHex }}
                        </v-chip>
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
    import axios from 'axios';
    import jsPDF from "jspdf";
    import autoTable from 'jspdf-autotable';
    import { logTraceguardar, errTraceguardarAxios } from '@/Trace';
    export default {
        data() {
            return  {
                    colores:[],
                    hash:"#",
                    dialog: false,
                    dialogDelete: false,
                    headers: [
                        { text: 'Opciones', value: 'actions', sortable: false },
                        { text: 'Código Color', value: 'codigoColor' },
                        { text: 'Nombre', value: 'nombre' },
                        { text: 'Código RGB [Hex]', value: 'rgbHex', sortable: false },
                        { text: 'Estado', value: 'estatus', sortable: false },
                    ],
                    search: '',
                    editedIndex: -1,
                    codigoColor:'',
                    nombre:'',
                    rgbHex:'#1976D2',

                    mask: '!#XXXXXX',
                    menu: false,

                    valida: 0,
                    validaMensaje:[],

                    adModal: 0,
                    adAccion: 0,
                    adNombre: '',
                    adId: '',

                    elNombre:'',

                    }
                },
        computed: {
                    formTitle () {
                    return this.editedIndex === -1 ? 'Nuevo Color' : 'Editar Color'
                    },
                    swatchStyle() {
                    const { rgbHex, menu } = this
                        return {
                            backgroundColor: rgbHex,
                            cursor: 'pointer',
                            height: '30px',
                            width: '30px',
                            borderRadius: menu ? '50%' : '4px',
                            transition: 'border-radius 200ms ease-in-out'
                        }
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
            this.listar()
        },
        
        methods: {
            crearPDF(array,title){
                let head=[];
                let rows=[];
                //get headers from object
                for (const [key] of Object.entries(array[0])) {
                    //text += `${key}` + "\t";
                    head.push(`${key}`);
                }
                //get data
                for (let index = 0; index < array.length; index++) {
                        //console.log(Object.values(array[index]));
                        rows.push(Object.values(array[index]));
                }
                //console.log(JSON.stringify(head));
                //console.log(rows);
                // Only pt supported (not mm or in)
                var doc = new jsPDF('p', 'pt');
                autoTable(doc, {
                    head: [head],
                    body: rows,
                    margin: {top: 60},
                    didDrawPage : function(data) {
                        doc.text(title, 40, 30);
                    }
                    });
                doc.save('colores.pdf');
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Colors/Listar',configuracion).then(function(response){
                    //console.log(response)
                    me.colores=response.data;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Color - Listar", error); 
                });
            },
            copiartabla(array){
                let text = "";
                let head=[];
                //const f = Object.entries(this.colores[0]);
                //get headers from object
                for (const [key] of Object.entries(array[0])) {
                    text += `${key}` + "\t";
                    head.push(`${key}`);
                }/*
                this.headers.forEach(element => {
                    if(element.text !== "Opciones" )
                    {
                        text += [element.text]
                        text += ("\t")
                    }
                    
                });*/
                //get values from the data table
                text += ("\n")
                array.forEach(element => {
                    //console.log(element[head[0]]);
                    for (let index = 0; index < head.length; index++) {
                        
                        text += element[head[index]];
                        text += ("\t");
                        
                    }
                    //text += [element.codigoColor,element.nombre,element.rgbHex, element.estatus].join("\t");
                    text += ("\n")
                });
                //console.log(text);
                navigator.clipboard.writeText(text);
            },
            getColor (rgbHex) {
                return '#'+rgbHex
            },
            getTextColor (rgbHex) {
                if ( parseInt(rgbHex, 16) > 14000000) return 'black'
                return 'white'
            },
            editItem (item) {
                this.codigoColor=item.codigoColor;
                this.nombre=item.nombre;
                this.rgbHex='#'+item.rgbHex ;
                this.editedIndex=1;
                this.dialog = true
            },
            deleteItem (item) {
                this.editedIndex = item.codigoColor;
                this.elNombre=item.nombre;
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },
            deleteItemConfirm () {
                this.colores.splice(this.editedIndex, 1)
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Colors/Eliminar/'+this.editedIndex,configuracion,{}).then(function(response){
                    logTraceguardar("Color","Eliminó " + me.editedIndex + " "+ me.elNombre);
                    me.elNombre='';
                    me.listar();
                    me.close();
                    me.limpiar();    
                }).catch(function(error){
                    errTraceguardarAxios("Color - Eliminar", error); 
                    console.log(error);
                })
                this.closeDelete()
            },
            activarDesactivarMostrar(accion,item){
                this.adModal = 1;
                this.adNombre=item.nombre;
                this.adId=item.codigoColor;
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
                axios.put('api/Colors/Activar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("Color","Activó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    errTraceguardarAxios("Color - Activar", error); 
                    console.log(error);
                })
            },
            desactivar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Colors/Desactivar/'+this.adId,{},configuracion).then(function(response){
                    logTraceguardar("Color","Desactivó " + me.adId + " "+ me.adNombre);
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre='';
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    errTraceguardarAxios("Color - Desactivar", error); 
                    console.log(error);
                })
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
                this.codigoColor="";
                this.nombre="";
                this.rgbHex="#0055A1";
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
                    axios.put('api/Colors/Actualizar',{
                        'CodigoColor': me.codigoColor,
                        'Nombre': me.nombre.toUpperCase(),
                        'RGBHex': me.rgbHex.substring(1,7)
                    },configuracion).then(function(response){
                        logTraceguardar("Color","Actualizó " + me.codigoColor + " "+ me.nombre.toUpperCase());
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        errTraceguardarAxios("Color - Actualizar", error); 
                        console.log(error);
                    })
                } else {
                    //Código para guardar
                    let me=this;
                    axios.post('api/Colors/Crear',{
                        'CodigoColor': me.codigoColor,
                        'Nombre': me.nombre.toUpperCase(),
                        'RGBHex': me.rgbHex.substring(1,7)
                    },configuracion).then(function(response){
                        logTraceguardar("Color","Creó " + me.codigoColor + " "+ me.nombre.toUpperCase());
                        me.listar();
                        me.close();
                        me.limpiar();    
                    }).catch(function(error){
                        errTraceguardarAxios("Colores - Crear", error); 
                        console.log(error);
                    })
                }
            },
            validar (){
                this.valida=0;
                let codigoColortemp='';
                this.validaMensaje=[];
                if (this.codigoColor.length < 2 || this.codigoColor.length > 4 ){
                    this.validaMensaje.push("El Código de Color debe tener 3 caracteres.");
                }
                if (this.nombre.length <= 1 || this.nombre.length > 51 ){
                    this.validaMensaje.push("El Nombre de Color debe tener mínimo 1 caracter y máximo 50.");
                }
                if (this.editedIndex == -1) {
                    for (let i = 0; i < this.colores.length; i++) {
                    codigoColortemp = this.colores[i].codigoColor;
                    //console.log(codigoColortemp);
                    if(this.codigoColor == codigoColortemp){
                        this.validaMensaje.push("El Código de Color ya existe.");
                        }
                    }
                }
                //if (this.nombre = )
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
    },
}

</script>