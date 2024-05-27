<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table
                :headers="headers"
                :items="ordenes"
                :search="search"
                :single-expand="singleExpand"
                :expanded.sync="expanded"
                :items-per-page="15"
                @item-expanded="selectprotocolo"
                item-key="idOrden"
                sort-by="Fecha"
                show-expand
                class="elevation-1"
                :loading="cargando"
                loading-text="Cargando... Favor esperar"
                :footer-props="{
                    showFirstLastPage: true,
                    firstIcon: 'first_page',
                    prevIcon: 'chevron_left',
                    nextIcon: 'chevron_right',
                    lastIcon: 'last_page'
                }"
                >
                <template v-slot:item.fechaYHoraCreacion="{ item }">
                    <span>{{ new Date(item.fechaYHoraCreacion).toLocaleString() }}</span>
                </template>
                <template v-slot:item.color="{ item }">
                    <v-chip
                    :color="getColor(item.rgbHex)"
                    :text-color="getTextColor(item.rgbHex)"
                    >
                    {{ item.color }}
                    </v-chip>
                </template>
                <template v-slot:item.codigoColor="{ item }">
                        <v-chip
                        :color="getColor(item.rgbHex)"
                        :text-color="getTextColor(item.rgbHex)"
                        >
                        {{ item.codigoColor }}
                        </v-chip>
                </template>
                <template v-slot:item.estatus="{ item }">
                    <span :class="getEstatusColor(item.estatus)">{{ getEstatusText(item.estatus) }}</span>
                </template>
                <template #item.data-table-expand="{ item, expand, isExpanded }">
                    <td v-if="item.estatus > 2" class="text-start">
                    <v-btn icon 
                            @click="expand(!isExpanded)" 
                            class="v-data-table__expand-icon"
                            :class="{'v-data-table__expand-icon--active' : isExpanded}">
                        <v-icon>expand_more</v-icon>
                    </v-btn>
                    </td>
                </template>
                <template v-slot:expanded-item="{ headers, item}">
                    <td :colspan="headers.length">
                    <!--More info about {{ item.pkn }} -->
                    <v-data-table
                        :headers="hprotocolo"
                        :items="protocolo"
                        hide-default-footer
                        class="elevation-1"
                    >
                    <template v-slot:item.dateAndTimeIn="{ item }">
                        <span>{{ new Date(item.dateAndTimeIn).toLocaleString() }}</span>
                    </template>
                    <template v-slot:item.dateAndTimeFbk="{ item }">
                        <span>{{ new Date(item.dateAndTimeFbk).toLocaleString() }}</span>
                    </template>
                    <template v-slot:item.estatusMaquina="{ item }">
                        <span :class="getEstatusMaquinaColor(item.estatusMaquina)">{{ getEstatusMaquinaText(item.estatusMaquina) }}</span>
                    </template>
                    <template v-slot:item.estatusCalidad="{ item }">
                        <span :class="getEstatusCalidadColor(item.estatusCalidad)">{{ getEstatusCalidadText(item.estatusCalidad) }}</span>
                    </template>
                    </v-data-table>
                    </td>
                </template>
                <template v-slot:top>
                    <v-toolbar
                    flat
                    >
                <v-toolbar-title>Ordenes de producción</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                        <v-spacer></v-spacer>
                        <v-select
                            class="text-xs-center"
                            :items="lineas"
                            v-model="lineasFilterValue"
                            label="Líneas"
                            single-line hide-details
                        ></v-select>
                        <v-spacer></v-spacer>
                        <v-dialog
                            v-model="dialog"
                            max-width="1700px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="primary"
                                dark
                                class="mx-2"
                                v-bind="attrs"
                                v-on="on"
                            >
                            <v-icon>query_stats</v-icon>
                            Buscar
                            </v-btn>
                            <v-btn
                            color="primary"
                            dark
                            class="mx-2"
                            @click="copiartabla(ordenes)"
                            >
                            <v-icon>content_copy</v-icon>
                            Copiar
                            </v-btn>
                            </template>
                            <v-card>
                            <v-card-title>
                                <span class="text-h5">Buscar en ordenes</span>
                            </v-card-title>
                            <v-bottom-navigation
                                    color="primary"
                                    v-model="vbn"
                                    shift
                                    >
                                    <v-btn @click="solo1=1">
                                        <span>Por palabra</span>
                                        <v-icon>manage_search</v-icon>
                                    </v-btn>
                                    <v-btn @click="solo1=2">
                                        <span>Por Fecha</span>
                                        <v-icon>event</v-icon>
                                    </v-btn>
                                    <v-btn @click="solo1=3">
                                        <span>PKN & JitSec</span>
                                        <v-icon>barcode_reader</v-icon>
                                    </v-btn>
                            </v-bottom-navigation>
                            <v-card-text >
                                <v-container fluid>
                                    <v-row justify="space-between">
                                        <v-col v-if="solo1==1"
                                        cols="6"
                                        sm="6"
                                        md="6"
                                        >
                                        <v-text-field
                                            v-model="palabraClave"
                                            label="Palabra clave"
                                            hint="Debe ser mayor a 2 caracteres"
                                        ></v-text-field>
                                        </v-col>
                                        <v-col v-if="solo1==2"
                                        cols="2"
                                        sm="2"
                                        md="2"
                                        >
                                        <v-menu
                                            ref="menud1"
                                            v-model="menud1"
                                            :close-on-content-click="false"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="auto"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="date1"
                                                label="De Fecha"
                                                prepend-icon="event"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                            ></v-text-field>
                                            </template>
                                            <v-date-picker
                                            v-model="date1"
                                            :active-picker.sync="activePicker1"
                                            :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                                            min="2020-02-26"
                                            @change="$refs.menud1.save(date1)"
                                            ></v-date-picker>
                                        </v-menu>
                                        </v-col>
                                        <template v-if="solo1==3">
                                            <v-col
                                            cols="4"
                                            sm="4"
                                            md="4"
                                            >
                                            <v-text-field
                                                v-model="bPKN"
                                                label="PKN"
                                                hint="Debe ser igual a 10 caracteres"
                                                type="number"
                                            ></v-text-field>
                                            </v-col>
                                            <v-col
                                            cols="4"
                                            sm="4"
                                            md="4"
                                            >
                                            <v-text-field
                                                v-model="bJitSec"
                                                label="JitSec"
                                                hint="Máximo 4 caracteres"
                                                type="number"
                                            ></v-text-field>
                                            </v-col>
                                        </template>
                                        <v-col v-if="solo1==2"
                                        cols="2"
                                        sm="2"
                                        md="2"
                                        >
                                        <v-menu
                                            ref="menut1"
                                            v-model="menut1"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            :return-value.sync="time1"
                                            transition="scale-transition"
                                            offset-y
                                            max-width="290px"
                                            min-width="290px"
                                            >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                v-model="time1"
                                                label="De Hora"
                                                prepend-icon="schedule"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                v-if="menut1"
                                                v-model="time1"
                                                full-width
                                                @click:minute="$refs.menut1.save(time1)"
                                            ></v-time-picker>
                                        </v-menu>
                                        </v-col>
                                        <v-col v-if="solo1==2"
                                        cols="2"
                                        sm="2"
                                        md="2"
                                        >
                                        <v-menu
                                            ref="menud2"
                                            v-model="menud2"
                                            :close-on-content-click="false"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="auto"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="date2"
                                                label="A Fecha"
                                                prepend-icon="event"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                            ></v-text-field>
                                            </template>
                                            <v-date-picker
                                            v-model="date2"
                                            :active-picker.sync="activePicker2"
                                            :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                                            min="2020-02-26"
                                            @change="$refs.menud2.save(date2)"
                                            ></v-date-picker>
                                        </v-menu>
                                        </v-col>
                                        <v-col v-if="solo1==2"
                                        cols="2"
                                        sm="2"
                                        md="2"
                                        >
                                        <v-menu
                                            ref="menut2"
                                            v-model="menut2"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            :return-value.sync="time2"
                                            transition="scale-transition"
                                            offset-y
                                            max-width="290px"
                                            min-width="290px"
                                            >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                v-model="time2"
                                                label="A Hora"
                                                prepend-icon="schedule"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                v-if="menut2"
                                                v-model="time2"
                                                full-width
                                                @click:minute="$refs.menut2.save(time2)"
                                            ></v-time-picker>
                                        </v-menu>
                                        </v-col>
                                        <v-col
                                        cols="3"
                                        sm="3"
                                        md="3"
                                        >
                                        <v-btn v-if="solo1==1"
                                        color="blue darken-1"
                                        text
                                        @click="selectbuscar"
                                        :disabled="palabraClave.length < 3 "
                                        >
                                        <v-icon>search</v-icon>
                                        Buscar
                                        </v-btn>
                                        <v-btn v-if="solo1==2"
                                        color="blue darken-1"
                                        text
                                        @click="selectbuscarfecha"
                                        :disabled="(datevalidation || date1==null || date2==null || time1==null || time2==null )"
                                        >
                                        <v-icon>search</v-icon>
                                        Buscar
                                        </v-btn>
                                        <v-btn v-if="solo1==3"
                                        color="blue darken-1"
                                        text
                                        @click="selectbuscarPKNJitSec"
                                        :disabled="( bPKN.length !== 10 || bJitSec.length < 0 || bPKN =='' || bJitSec == '' )"
                                        >
                                        <v-icon>search</v-icon>
                                        Buscar
                                        </v-btn>
                                        </v-col>
                                    </v-row>
                                        <v-row>
                                        <v-col
                                        cols="12"
                                        sm="12"
                                        md="12"
                                        >
                                        <v-data-table
                                        :headers="headers2"
                                        :items="resultBusqueda"
                                        :single-expand="rsingleExpand"
                                        :expanded.sync="rexpanded"
                                        @item-expanded="selectprotocolo"
                                        item-key="idOrden"
                                        show-expand
                                        sort-by="Fecha"
                                        class="elevation-1"
                                        >
                                        <template v-slot:item.fechaYHoraCreacion="{ item }">
                                            <span>{{ new Date(item.fechaYHoraCreacion).toLocaleString() }}</span>
                                        </template>
                                        <template v-slot:item.color="{ item }">
                                            <v-chip
                                            :color="getColor(item.rgbHex)"
                                            :text-color="getTextColor(item.rgbHex)"
                                            >
                                            {{ item.color }}
                                            </v-chip>
                                        </template>
                                        <template v-slot:item.codigoColor="{ item }">
                                                <v-chip
                                                :color="getColor(item.rgbHex)"
                                                :text-color="getTextColor(item.rgbHex)"
                                                >
                                                {{ item.codigoColor }}
                                                </v-chip>
                                        </template>
                                        <template v-slot:item.estatus="{ item }">
                                            <span :class="getEstatusColor(item.estatus)">{{ getEstatusText(item.estatus) }}</span>
                                        </template>
                                        <template #item.data-table-expand="{ item, expand, isExpanded }">
                                            <td v-if="item.estatus > 2" class="text-start">
                                            <v-btn icon 
                                                    @click="expand(!isExpanded)" 
                                                    class="v-data-table__expand-icon"
                                                    :class="{'v-data-table__expand-icon--active' : isExpanded}">
                                                <v-icon>expand_more</v-icon>
                                            </v-btn>
                                            </td>
                                        </template>
                                        <template v-slot:expanded-item="{ headers, item }">
                                            <td :colspan="headers.length">
                                            <!--More info about {{ item.pkn }} -->
                                            <v-data-table
                                                :headers="hprotocolo"
                                                :items="protocolo"
                                                hide-default-footer
                                                class="elevation-1"
                                            >
                                            <template v-slot:item.dateAndTimeIn="{ item }">
                                                <span>{{ new Date(item.dateAndTimeIn).toLocaleString() }}</span>
                                            </template>
                                            <template v-slot:item.dateAndTimeFbk="{ item }">
                                                <span>{{ new Date(item.dateAndTimeFbk).toLocaleString() }}</span>
                                            </template>
                                            <template v-slot:item.estatusMaquina="{ item }">
                                                <span :class="getEstatusMaquinaColor(item.estatusMaquina)">{{ getEstatusMaquinaText(item.estatusMaquina) }}</span>
                                            </template>
                                            <template v-slot:item.estatusCalidad="{ item }">
                                                <span :class="getEstatusCalidadColor(item.estatusCalidad)">{{ getEstatusCalidadText(item.estatusCalidad) }}</span>
                                            </template>
                                            </v-data-table>
                                            </td>
                                        </template>
                                        </v-data-table>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                                <v-card-actions>
                                    <v-btn
                                    color="blue darken-1"
                                    text
                                    :disabled="resultBusqueda.length==0"
                                    @click="copiartabla(resultBusqueda)"
                                    >
                                    <v-icon>content_copy</v-icon>
                                    Copiar
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="close"
                                    >
                                    Cerrar
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        </v-toolbar>
                </template>
                <template v-slot:no-data>
                        <v-btn
                        color="primary"
                        @click="listar"
                        >
                        Reset
                        </v-btn>
                </template>
            </v-data-table>
        </v-flex> 
    </v-layout>
</template>

<script>
    import axios from 'axios'
    import { errTraceguardarAxios } from '@/Trace';
    export default {
        data() {
            return  {
                    ordenes:[],
                    dialog: false,
                    singleExpand: true,
                    rsingleExpand: true,

                    search: '',

                    palabraClave:'',
                    resultBusqueda:[],
                    headers2: [
                        { text: 'PKN', value: 'pkn'},
                        { text: 'JitSec', value: 'jitSec'},
                        { text: 'Modelo', value: 'modelo'},
                        { text: 'Versión', value: 'version'},
                        { text: 'Código Color', value: 'codigoColor'},
                        { text: 'Nombre', value: 'nombreVersion'},
                        { text: 'Variante', value: 'variante'},
                        { text: 'Color', value: 'color'},
                        { text: 'Línea', value: 'linea'},
                        { text: 'Secuencia', value: 'secuencia'},
                        { text: 'Fecha', value: 'fechaYHoraCreacion', dataType: "Date" },
                        { text: 'Estatus', value: 'estatus' },
                        { text: 'Comentario', value: 'comentario' },
                        { text: '', value: 'data-table-expand' },
                    ],
                    
                    estatus:[
                        { text: 'Creada', value: 2, color: 'yellow'},
                        { text: 'Corriendo', value: 3, color: 'orange'},
                        { text: 'Finalizada', value: 4, color: 'green'},
                        { text: 'Cancelada', value: 5, color: 'red'},
                    ],

                    hprotocolo:[
                        //{ text: 'Código Estación', value: 'idEstacion'},
                        { text: 'Estación', value: 'estacion'},
                        { text: 'Fecha Inicio', value: 'dateAndTimeIn', dataType: "Date"},
                        { text: 'Fecha Termino', value: 'dateAndTimeFbk', dataType: "Date"},
                        { text: 'Flujo Actual', value: 'flujoActual'},
                        { text: 'Tiempo Ciclo', value: 'tiempoCiclo'},
                        { text: 'Estatus de Máquina', value: 'estatusMaquina'},
                        { text: 'Estatus de Calidad', value: 'estatusCalidad' },
                        { text: 'Comentario', value: 'comentario' },
                    ],

                    estatusmaquina:[
                        { text: 'Producción', value: 1, color: 'green'},
                        { text: 'Falla', value: 2, color: 'red'},
                        { text: 'Configuración', value: 3, color: 'blue'}
                    ],
                    estatuscalidad:[
                        { text: 'OK', value: 16, color: 'green'},
                        { text: 'En Proceso', value: 8, color: 'teal'},
                        { text: 'En Espera', value: 4, color: 'yellow'},
                        { text: 'Scrap', value: 2, color: 'red'},
                        { text: 'Retrabajo', value: 1, color: 'orange'},
                    ],
                    protocolo:[],
                    expanded: [],
                    rexpanded: [],
                    lineas:[],
                    lineasFilterValue:null,
                    solo1:1,
                    vbn:0,

                    activePicker1: null,
                    date1: null,
                    menud1: false,

                    time1: null,
                    menut1: false,

                    activePicker2: null,
                    date2: null,
                    menud2: false,

                    time2: null,
                    menut2: false,

                    datetime1: null,
                    datetime2: null,

                    rgbHex:'#1976D2',
                    bPKN:'',
                    bJitSec:'',
                    adId: '',
                    cargando:true,
                    }
                },
        computed: {
            datevalidation() {
                return this.date1>this.date2;
            },
            headers() {
                return[
                    //{ text: 'ID', value: 'idOrden'},
                    { text: 'PKN', value: 'pkn'},
                    { text: 'JitSec', value: 'jitSec'},
                    { text: 'Modelo', value: 'modelo'},
                    { text: 'Versión', value: 'version'},
                    { text: 'Código Color', value: 'codigoColor'},
                    { text: 'Nombre', value: 'nombreVersion'},
                    { text: 'Variante', value: 'variante'},
                    { text: 'Color', value: 'color'},
                    { text: 'Línea', value: 'linea', filter: this.lineasFilter },
                    { text: 'Secuencia', value: 'secuencia'},
                    { text: 'Fecha', value: 'fechaYHoraCreacion', dataType: "Date" },
                    { text: 'Estatus', value: 'estatus' },
                    { text: 'Comentario', value: 'comentario' },
                    { text: '', value: 'data-table-expand' },
                ]
            }
        },
        watch: {
            dialog (val) {
                val || this.close()
            },
            menud1 (val) {
                val && setTimeout(() => (this.activePicker1 = 'YEAR'))
            },
            menud2 (val) {
                val && setTimeout(() => (this.activePicker2 = 'YEAR'))
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
                axios.get('api/Ordenes/Listar',configuracion).then(function(response){
                    //console.log(response)
                    me.ordenes=response.data;
                    me.cargando=false;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Orden - Listar", error); 
                });        
            },
            selectl(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                var lineasArray=[];
                me.lineas.push({text: 'Todas las líneas', value: null})
                axios.get('api/Lineas/Select',configuracion).then(function(response){
                    lineasArray=response.data;
                    lineasArray.map(function(x){
                        me.lineas.push({text: x.nombre, value: x.nombre})
                    });
                }).catch(function(error){
                    errTraceguardarAxios("Linea - Select", error);
                    console.log(error)
                });
            },
            selectbuscar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                me.resultBusqueda=[];
                axios.get('api/Ordenes/ListarFiltro/'+this.palabraClave,configuracion).then(function(response){
                        me.resultBusqueda=response.data;
                    }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Orden - ListarFiltro", error); 
                });
            },
            selectbuscarfecha(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                me.resultBusqueda=[];
                //console.log(this.getdatetime(me.date1 + " " + me.time1));
                axios.post('api/Ordenes/ListarFiltroFecha',{
                        'StartTime': this.getdatetime(me.date1 + " " + me.time1),
                        'EndTime': this.getdatetime(me.date2 + " " + me.time2)
                    },configuracion).then(function(response){
                        me.resultBusqueda=response.data;
                    }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Orden - ListarFiltroFecha", error); 
                });
            },
            selectbuscarPKNJitSec(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                me.resultBusqueda=[];
                //console.log(this.getdatetime(me.date1 + " " + me.time1));
                axios.post('api/Ordenes/ListarFiltroPKNJitSec',{
                        'PKN': me.bPKN,
                        'JitSec': parseInt(me.bJitSec),
                    },configuracion).then(function(response){
                        me.resultBusqueda=response.data;
                    }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Orden - ListarFiltroPKNJitSec", error); 
                });
            },
            selectprotocolo({item}){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                this.adId=item.idOrden;
                axios.get('api/Protocolos/Select/'+this.adId,configuracion).then(function(response){
                    me.protocolo=response.data;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Protocolo - Select", error); 
                });        
            },
            copiartabla(array){
                let text = "";
                let head=[];
                //get headers from object
                for (const [key] of Object.entries(array[0])) {
                    text += `${key}` + "\t";
                    head.push(`${key}`);
                }
                //get values from the data table
                text += ("\n")
                array.forEach(element => {
                    for (let index = 0; index < head.length; index++) {
                        
                        text += element[head[index]];
                        text += ("\t");
                        
                    }
                    text += ("\n")
                });
                //console.log(text);
                navigator.clipboard.writeText(text);
            },
            getdatetime(val){
                //console.log(val);
                const [dateValues, timeValues] = val.split(' ');
                const [year, month, day] = dateValues.split('-');
                const [hours, minutes] = timeValues.split(':');
                return new Date(Date.UTC(+year, +month - 1, +day, +hours, +minutes,0,0));
            },
            getColor (rgbHex) {
                return '#'+rgbHex
            },
            getTextColor (rgbHex) {
                if ( parseInt(rgbHex, 16) > 14000000) return 'black'
                return 'white'
            },
            getEstatusText (code){
                let me=this;
                return me.estatus[me.estatus.map(function(e) {return e.value;}).indexOf(code)].text;
            },
            getEstatusColor (code){
                let me=this;
                return me.estatus[me.estatus.map(function(e) {return e.value;}).indexOf(code)].color + "--text";
            },
            getEstatusMaquinaText (code){
                let me=this;
                return me.estatusmaquina[me.estatusmaquina.map(function(e) {return e.value;}).indexOf(code)].text;
            },
            getEstatusMaquinaColor (code){
                let me=this;
                return me.estatusmaquina[me.estatusmaquina.map(function(e) {return e.value;}).indexOf(code)].color + "--text";
            },
            getEstatusCalidadText (code){
                let me=this;
                return me.estatuscalidad[me.estatuscalidad.map(function(e) {return e.value;}).indexOf(code)].text;
            },
            getEstatusCalidadColor (code){
                let me=this;
                return me.estatuscalidad[me.estatuscalidad.map(function(e) {return e.value;}).indexOf(code)].color + "--text";
            },
            lineasFilter(value) {
                if (!this.lineasFilterValue) {
                return true;
                }
                return value === this.lineasFilterValue;
            },
            close () {
                this.dialog = false
                this.limpiar();
            },
            limpiar(){
                this.palabraClave='';
                this.resultBusqueda=[];
                this.solo1=1;
                this.vbn=0;
                this.date1=null;
                this.date2=null;
                this.time1=null;
                this.time2=null;
            },
    },
}

</script>