<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table
                dense
                :items-per-page="15"
                :headers="headers"
                fixed-header
                :items="ordenes"
                :search="search"
                :single-expand="singleExpand"
                :expanded.sync="expanded"
                @item-expanded="selectprotocolo"
                item-key="LabelID"
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
                <template v-slot:item.dateTimeIn="{ item }">
                    <span>{{ new Date(item.dateTimeIn).toLocaleString("en-GB") }}</span>
                </template>
                <template v-slot:item.color="{ item }">
                    <v-chip
                    :color="getColor(item.rgbHex)"
                    :text-color="getTextColor(item.rgbHex)"
                    >
                    {{ item.color }}
                    </v-chip>
                </template>

                <template v-slot:item.cO2="{ item }">
                    <v-chip
                    class="ma-2"
                    color="blue"
                    text-color="white"
                    x-small
                    :disabled=" !item.cO2"
                    >
                    <v-icon> air </v-icon>
                    </v-chip>
                </template>

                <template v-slot:item.fl="{ item }">
                    <v-chip
                    class="ma-2"
                    color="orange"
                    text-color="white"
                    x-small
                    :disabled="!item.fl"
                    >
                    <v-icon> local_fire_department </v-icon>
                    </v-chip>
                </template>

                <template v-slot:item.bc="{ item }">
                    <v-chip
                    class="ma-2"
                    color="purple"
                    text-color="white"
                    x-small
                    :disabled="!item.bc"
                    >
                    <v-icon> format_color_fill </v-icon>
                    </v-chip>
                </template>

                <template v-slot:item.primerLab="{ item }">
                    <span>{{ item.primerLab.replace('Primer ', '') }}</span>
                </template>

                <template v-slot:item.clearLab="{ item }">
                    <span>{{ item.clearLab.replace('Clear Coat ', '') }}</span>
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
                    <template v-slot:item.dateTimeIn="{ item }">
                        <span>{{ new Date(item.dateTimeIn).toLocaleString() }}</span>
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
                        <v-dialog
                            v-model="dialog"
                            max-width="1700px"
                        >
                            <template v-slot:activator>
                            <v-btn
                                color="primary"
                                dark
                                class="mx-2"
                                @click="listar"
                            >
                            <v-icon>refresh</v-icon>
                            Actualizar
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
                        { text: 'Fecha', value: 'dateTimeIn', dataType: "Date"},
                        { text: 'Skid', value: 'skid'},
                        //Qty skid??
                        //{ text: 'Order', value: 'orderName'},
                        { text: 'Referencia', value: 'referencia'},
                        //{ text: 'Product', value: 'productLab'},
                        { text: 'Modelo', value: 'modelo'},
                        { text: 'Primer', value: 'primerLab'},
                        { text: 'Color', value: 'color'},
                        { text: 'Clear', value: 'clearLab'},
                        { text: 'CO2', value: 'cO2'},
                        { text: 'FL', value: 'fl'},
                        { text: 'BC', value: 'bc'},
                        { text: 'Lado', value: 'lado'},
                        //{ text: 'V', value: 'v'},
                        { text: 'Pitch', value: 'pitchVar'},
                        { text: 'QTY1', value: 'qtY1'},
                        { text: 'QTY2', value: 'qtY2'},
                        //Pieces
                        //Total
                        //Status -- Order status
                        { text: 'Status', value: 'status'},
                        { text: 'Comentario', value: 'comentario'},
                        
                        { text: 'Ubicacion', value: 'ubicacion'},
                        //{ text: 'LabelID', value: 'labelID'},
                        //{ text: '', value: 'data-table-expand' },
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

                    protocolo:[],
                    expanded: [],
                    rexpanded: [],
                    lineas:[],
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
                    interval: null,
                    }
                },
        computed: {
            datevalidation() {
                return this.date1>this.date2;
            },
            headers() {
                return[
                        { text: 'Fecha', value: 'dateTimeIn', dataType: "Date"},
                        { text: 'Skid', value: 'skid'},
                        //Qty skid??
                        //{ text: 'Order', value: 'orderName'},
                        { text: 'Referencia', value: 'referencia'},
                        //{ text: 'Product', value: 'productLab'},
                        { text: 'Modelo', value: 'modelo'},
                        { text: 'Primer', value: 'primerLab'},
                        { text: 'Color', value: 'color'},
                        { text: 'Clear', value: 'clearLab'},
                        { text: 'CO2', value: 'cO2'},
                        { text: 'FL', value: 'fl'},
                        { text: 'BC', value: 'bc'},
                        { text: 'Lado', value: 'lado'},
                        //{ text: 'V', value: 'v'},
                        { text: 'Pitch', value: 'pitchVar'},
                        { text: 'QTY1', value: 'qtY1'},
                        { text: 'QTY2', value: 'qtY2'},
                        //Pieces
                        //Total
                        //Status -- Order status
                        { text: 'Status', value: 'status'},
                        { text: 'Comentario', value: 'comentario'},
                        
                        { text: 'Ubicacion', value: 'ubicacion'},
                        //{ text: 'LabelID', value: 'labelID'},
                    //{ text: '', value: 'data-table-expand' },
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
            this.interval = setInterval(this.refreshData, 30000)
            //this.selectl();
        },
        methods: {
            refreshData () {
                this.listar();
            },
            listar(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Order_Skid_Data/Listar',configuracion).then(function(response){
                    //console.log(response)
                    me.ordenes=response.data;
                    me.cargando=false;
                }).catch(function(error){
                    console.log(error);
                    errTraceguardarAxios("Orden Skid Data - Listar", error); 
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