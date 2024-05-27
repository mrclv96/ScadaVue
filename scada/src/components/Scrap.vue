<template>

<div id="app" class="v-main__wrap">
    <v-app>
        <nav>
            <v-toolbar
            flat
            >
            <v-row >
                <v-toolbar-title class="text-h6 text-md-h5 text-lg-h4">Scrap</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu
                v-model="menu3"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field 
                        v-model="dates"
                        label="Fecha"
                        prepend-inner-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        append-icon="search"
                        @click:append="buscar"
                        :disabled=cargando
                        ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="dates"
                        range
                        :min=min_date
                        :max=tomorrow
                    ></v-date-picker>
                </v-menu>
                <v-spacer></v-spacer>
                <v-btn
                color="primary"
                dark
                class="mx-2"
                @click="copiarresultado('app')"
                >
                <v-icon>content_paste_go</v-icon>
                    A portapapeles
                </v-btn>
            </v-row>
            <template v-slot:extension>
            <v-tabs
                v-model="tabs"
                centered
            >
            <v-tab>Dashboard</v-tab>
            <v-tab>Tiempo</v-tab>
            <v-tab>Costo</v-tab>
            <v-tab>Manual</v-tab>
            </v-tabs>
            </template>
            </v-toolbar>
            <v-tabs-items v-model="tabs">
                <v-tab-item>
                    <v-flex>
                        <div id="dashboard">
                            <v-row no-gutters>
                                <v-col
                                v-for="(card, index) in cards"
                                :key="card.title"
                                >
                                    <v-card
                                    :color="card.color"
                                    class="mx-auto" min-width="316" min-heigth="138" variant="outlined"
                                    >
                                    <div v-if="card.chart">
                                        <v-card-text size="80">
                                            <div class="text-overline mb-1" >
                                                {{card.title}}
                                            </div>
                                            <canvas :id="card.data"
                                                class="mx-auto"
                                                height="70"
                                                > </canvas>
                                            </v-card-text>
                                    </div>
                                    <div v-else-if="!card.chart && (index === 4 && oneday) || index !=4">
                                        <v-list-item three-line>
                                                <v-icon
                                                    size="88"
                                                >
                                                    {{card.icon}}
                                                </v-icon>
                                                <v-list-item-content>
                                                <div class="text-overline mb-1">
                                                    {{card.title}}
                                                </div>
                                                    <div v-if="!incurrentshiftday && index === 4 && oneday">
                                                        <v-list-item-title class="text-h6 mb-1">
                                                            {{card.data}} <br/> {{card.subtitle1}} <br/> {{card.subtitle2}}
                                                        </v-list-item-title>
                                                    </div>
                                                    <div v-else>
                                                        <v-list-item-title class="text-h4 mb-1">
                                                            {{card.data}}
                                                        </v-list-item-title>
                                                        <v-list-item-subtitle class="text-wrap"> 
                                                            {{card.subtitle1}} <br/> {{card.subtitle2}}
                                                        </v-list-item-subtitle>
                                                    </div>
                                                </v-list-item-content>             
                                        </v-list-item>
                                    </div>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <v-spacer></v-spacer>
                            <v-progress-linear
                            :active="cargando"
                            :indeterminate="cargando"
                            absolute
                            top
                            ></v-progress-linear>
                            <v-row no-gutters>
                                <v-col v-for="n in 6" :key="n" cols="12" sm="4" class="chartCard">
                                    <div class="chartBox">
                                        <canvas v-if="n==1"
                                        :id="`Chart1${n}`"
                                        height="400" width="400" class="mx-auto"
                                        >
                                        </canvas>
                                        <canvas v-else
                                        :id="`Chart1${n}`"
                                        height="400" width="550" class="mx-auto"
                                        >
                                        </canvas>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </v-flex>
                </v-tab-item>
                <v-tab-item>
                    <v-flex>
                        <div id="result">
                            <v-row no-gutters>
                                <v-col
                                :key="cards[3].title"
                                :cols="cards[3].flex * 2"
                                >
                                    <v-card
                                    :color="cards[3].color"
                                    class="mx-auto" min-width="316" max-width="350" min-heigth="138" variant="outlined"
                                    >
                                    <v-list-item three-line>
                                        <v-icon
                                            size="88"
                                        >
                                            {{cards[3].icon}}
                                        </v-icon>
                                        <v-list-item-content>
                                        <div class="text-overline mb-1">
                                            {{cards[3].title}}
                                        </div>
                                        <v-list-item-title class="text-h4 mb-1">
                                            {{cards[3].data}}
                                        </v-list-item-title>
                                        <v-list-item-subtitle class="text-wrap"> 
                                            {{cards[3].subtitle1}} <br/> {{cards[3].subtitle2}}
                                        </v-list-item-subtitle>
                                        </v-list-item-content>              
                                    </v-list-item>
                                    </v-card>
                                </v-col>
                                <v-col
                                :key="card1.title"
                                :cols="card1.flex * 2"
                                >
                                    <v-card
                                    :color="card1.color"
                                    class="mx-auto" min-width="316" max-width="350" min-heigth="138" variant="outlined"
                                    >
                                    <v-list-item three-line>
                                        <v-icon
                                            size="88"
                                        >
                                            {{card1.icon}}
                                        </v-icon>
                                        <v-list-item-content>
                                        <div class="text-overline mb-1">
                                            {{card1.title}}
                                        </div>
                                        <v-list-item-title class="text-h4 mb-1">
                                            {{card1.data}}
                                        </v-list-item-title>
                                        </v-list-item-content>              
                                    </v-list-item>
                                    </v-card>
                                </v-col>
                            </v-row>
                        <v-row>
                            <v-col
                            cols="6"
                            sm="6"
                            md="6"
                            >
                            <template >
                                <v-data-table
                                :headers="headers"
                                :items="scrapc"
                                :loading="cargando"
                                :items-per-page=-1
                                loading-text="Cargando... Favor esperar"
                                sort-by="sumOfPartQty"
                                sort-desc
                                class="elevation-1"
                                :footer-props="{
                                    showFirstLastPage: true,
                                    firstIcon: 'first_page',
                                    prevIcon: 'chevron_left',
                                    nextIcon: 'chevron_right',
                                    lastIcon: 'last_page'
                                }"
                                >
                                <template v-slot:items="props">
                                    <td>{{ props.item.part }}</td>
                                    <td class="text-xs-right">{{ props.item.sumOfPartQty }}</td>
                                    <td class="text-xs-right">{{ props.item.timeSumOfPartQty }}</td>
                                </template>
                                <template v-slot:body.append v-if="scrapc.length>0">
                                    <tr class="sticky-table-footer">
                                        <td class="font-weight-bold">Total</td>
                                        <td class="font-weight-bold">{{ totals(scrapc).sumOfPartQty }}</td>
                                        <td class="text-xs-right font-weight-bold">{{ totals(scrapc).timeSumOfPartQty }}</td>
                                    </tr>
                                </template>
                                    <template v-slot:top>
                                        <v-toolbar
                                        flat
                                        >
                                        <v-toolbar-title>Scrap C - Repintado</v-toolbar-title>
                                            <v-divider
                                                class="mx-4"
                                                inset
                                                vertical
                                            ></v-divider>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                color="primary"
                                                dark
                                                class="mx-2"
                                                :disabled="scrapc.length==0"
                                                @click="copiartabla(scrapc)"
                                            >
                                            <v-icon>content_copy</v-icon>
                                                Copiar
                                            </v-btn>
                                        </v-toolbar>
                                    </template>
                                </v-data-table>
                            </template>
                            </v-col>
                            <v-col
                            cols="6"
                            sm="6"
                            md="6"
                            >
                            <template >
                                <v-data-table
                                :headers="headers"
                                :items= "scrapr"
                                :loading="cargando"
                                :items-per-page=-1
                                loading-text="Cargando... Favor esperar"
                                sort-by="sumOfPartQty"
                                sort-desc
                                class="elevation-1"
                                :footer-props="{
                                    showFirstLastPage: true,
                                    firstIcon: 'first_page',
                                    prevIcon: 'chevron_left',
                                    nextIcon: 'chevron_right',
                                    lastIcon: 'last_page'
                                }"
                                >
                                <template v-slot:items="props">
                                    <td>{{ props.item.part }}</td>
                                    <td class="text-xs-right">{{ props.item.sumOfPartQty }}</td>
                                    <td class="text-xs-right">{{ props.item.timeSumOfPartQty }}</td>
                                </template>
                                <template v-slot:body.append v-if="scrapr.length>0">
                                    <tr class="sticky-table-footer">
                                        <td class="font-weight-bold">Total</td>
                                        <td class="font-weight-bold">{{ totals(scrapr).sumOfPartQty }}</td>
                                        <td class="text-xs-right font-weight-bold">{{ totals(scrapr).timeSumOfPartQty }}</td>
                                    </tr>
                                </template>
                                    <template v-slot:top>
                                        <v-toolbar
                                        flat
                                        >
                                        <v-toolbar-title>Scrap R - Rechazo</v-toolbar-title>
                                            <v-divider
                                                class="mx-4"
                                                inset
                                                vertical
                                            ></v-divider>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                color="primary"
                                                dark
                                                class="mx-2"
                                                :disabled="scrapc.length==0"
                                                @click="copiartabla(scrapr)"
                                            >
                                            <v-icon>content_copy</v-icon>
                                                Copiar
                                            </v-btn>
                                        </v-toolbar>
                                    </template>
                                </v-data-table>
                            </template>
                            </v-col>
                        </v-row>
                        </div>
                    </v-flex>
                </v-tab-item>
                <v-tab-item>
                    <v-flex>
                        <div id="result2">
                            <v-row no-gutters>
                                <v-col
                                :key="cards[2].title"
                                :cols="cards[2].flex * 2"
                                >
                                    <v-card
                                    :color="cards[2].color"
                                    class="mx-auto" min-width="316" max-width="350" min-heigth="138" variant="outlined"
                                    >
                                    <v-list-item three-line>
                                        <v-icon
                                            size="88"
                                        >
                                            {{cards[2].icon}}
                                        </v-icon>
                                        <v-list-item-content>
                                        <div class="text-overline mb-1">
                                            {{cards[2].title}}
                                        </div>
                                        <v-list-item-title class="text-h4 mb-1">
                                            {{cards[2].data}}
                                        </v-list-item-title>
                                        <v-list-item-subtitle class="text-wrap"> 
                                            {{cards[2].subtitle1}} <br/> {{cards[2].subtitle2}}
                                        </v-list-item-subtitle>
                                        </v-list-item-content>              
                                    </v-list-item>
                                    </v-card>
                                </v-col>
                                <v-col
                                :key="card2.title"
                                :cols="card2.flex * 2"
                                >
                                    <v-card
                                    :color="card2.color"
                                    class="mx-auto" min-width="316" max-width="350" min-heigth="138" variant="outlined"
                                    >
                                    <v-list-item three-line>
                                        <v-icon
                                            size="88"
                                        >
                                            {{card2.icon}}
                                        </v-icon>
                                        <v-list-item-content>
                                        <div class="text-overline mb-1">
                                            {{card2.title}}
                                        </div>
                                        <v-list-item-title class="text-h4 mb-1">
                                            {{card2.data}}
                                        </v-list-item-title>
                                        </v-list-item-content>              
                                    </v-list-item>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col
                                cols="6"
                                sm="6"
                                md="6"
                                >
                                <template >
                                    <v-data-table
                                    :headers="headers2"
                                    :items="scrapcc"
                                    :loading="cargando"
                                    :items-per-page=-1
                                    loading-text="Cargando... Favor esperar"
                                    sort-by="sumOfPartQty"
                                    sort-desc
                                    class="elevation-1"
                                    :footer-props="{
                                        showFirstLastPage: true,
                                        firstIcon: 'first_page',
                                        prevIcon: 'chevron_left',
                                        nextIcon: 'chevron_right',
                                        lastIcon: 'last_page'
                                    }"
                                    >
                                    <template v-slot:items="props">
                                        <td>{{ props.item.product }}</td>
                                        <td class="text-xs-right">{{ props.item.sumOfProductQty }}</td>
                                        <td class="text-xs-right">{{ props.item.sumOfProductCost }}</td>
                                    </template>
                                    <template v-slot:body.append v-if="scrapcc.length>0">
                                        <tr class="sticky-table-footer">
                                            <td class="font-weight-bold">Total</td>
                                            <td class="font-weight-bold">{{ totals2(scrapcc).sumOfProductQty }}</td>
                                            <td class="text-xs-right font-weight-bold">{{ totals2(scrapcc).sumOfProductCost.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                                        </tr>
                                    </template>
                                        <template v-slot:top>
                                            <v-toolbar
                                            flat
                                            >
                                            <v-toolbar-title>Scrap C - Repintado</v-toolbar-title>
                                                <v-divider
                                                    class="mx-4"
                                                    inset
                                                    vertical
                                                ></v-divider>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    color="primary"
                                                    dark
                                                    class="mx-2"
                                                    :disabled="scrapcc.length==0"
                                                    @click="copiartabla(scrapcc)"
                                                >
                                                <v-icon>content_copy</v-icon>
                                                    Copiar
                                                </v-btn>
                                            </v-toolbar>
                                        </template>
                                    </v-data-table>
                                </template>
                                </v-col>
                                <v-col
                                cols="6"
                                sm="6"
                                md="6"
                                >
                                <template >
                                    <v-data-table
                                    :headers="headers2"
                                    :items= "scrapcr"
                                    :loading="cargando"
                                    :items-per-page=-1
                                    loading-text="Cargando... Favor esperar"
                                    sort-by="sumOfPartQty"
                                    sort-desc
                                    class="elevation-1"
                                    :footer-props="{
                                        showFirstLastPage: true,
                                        firstIcon: 'first_page',
                                        prevIcon: 'chevron_left',
                                        nextIcon: 'chevron_right',
                                        lastIcon: 'last_page'
                                    }"
                                    >
                                    <template v-slot:items="props">
                                        <td>{{ props.item.product }}</td>
                                        <td class="text-xs-right">{{ props.item.sumOfProductQty }}</td>
                                        <td class="text-xs-right">{{ props.item.sumOfProductCost }}</td>
                                    </template>
                                    <template v-slot:body.append v-if="scrapcr.length>0">
                                        <tr class="sticky-table-footer">
                                            <td class="font-weight-bold">Total</td>
                                            <td class="font-weight-bold">{{ totals2(scrapcr).sumOfProductQty }}</td>
                                            <td class="text-xs-right font-weight-bold">{{ (totals2(scrapcr).sumOfProductCost).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                                        </tr>
                                    </template>
                                        <template v-slot:top>
                                            <v-toolbar
                                            flat
                                            >
                                            <v-toolbar-title>Scrap R - Rechazo</v-toolbar-title>
                                                <v-divider
                                                    class="mx-4"
                                                    inset
                                                    vertical
                                                ></v-divider>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    color="primary"
                                                    dark
                                                    class="mx-2"
                                                    :disabled="scrapcr.length==0"
                                                    @click="copiartabla(scrapcr)"
                                                >
                                                <v-icon>content_copy</v-icon>
                                                    Copiar
                                                </v-btn>
                                            </v-toolbar>
                                        </template>
                                    </v-data-table>
                                </template>
                                </v-col>
                            </v-row>
                        </div>
                    </v-flex>
                </v-tab-item>
                <v-tab-item>
                    <v-flex>
                        <v-row no-gutters>
                                <v-col
                                :key="card4.title"
                                :cols="card4.flex * 2"
                                >
                                <v-card
                                    :color="card4.color"
                                    class="mx-auto" min-width="316" max-width="350" min-heigth="138" variant="outlined"
                                    >
                                    <v-list-item three-line>
                                        <v-icon
                                            size="88"
                                        >
                                            {{card4.icon}}
                                        </v-icon>
                                        <v-list-item-content>
                                        <div class="text-overline mb-1">
                                            {{card4.title}}
                                        </div>
                                        <v-list-item-title class="text-h4 mb-1">
                                            {{card4.data}}
                                        </v-list-item-title>
                                        </v-list-item-content>              
                                    </v-list-item>
                                    </v-card>
                                </v-col>
                                <v-col
                                :key="card3.title"
                                :cols="card3.flex * 2"
                                >
                                    <v-card
                                    :color="card3.color"
                                    class="mx-auto" min-width="316" max-width="350" min-heigth="138" variant="outlined"
                                    >
                                    <v-list-item three-line>
                                        <v-icon
                                            size="88"
                                        >
                                            {{card3.icon}}
                                        </v-icon>
                                        <v-list-item-content>
                                        <div class="text-overline mb-1">
                                            {{card3.title}}
                                        </div>
                                        <v-list-item-title class="text-h4 mb-1">
                                            {{card3.data}}
                                        </v-list-item-title>
                                        </v-list-item-content>              
                                    </v-list-item>
                                    </v-card>
                                </v-col>
                            </v-row>
                        <v-row>
                        <v-col
                        cols="12"
                        sm="12"
                        md="12"
                        >
                        <v-data-table
                            :headers="headers3"
                            :items= "scrapmanual"
                            :loading="cargando"
                            loading-text="Cargando... Favor esperar"
                            sort-by="sumOfPartQty"
                            sort-desc
                            class="elevation-1"
                            :items-per-page="15"
                            fixed-header
                            :footer-props="{
                                showFirstLastPage: true,
                                firstIcon: 'first_page',
                                prevIcon: 'chevron_left',
                                nextIcon: 'chevron_right',
                                lastIcon: 'last_page'
                            }"
                            >
                            <template v-slot:item.pstng_DateTime="{ item }">
                                <span>{{ new Date(item.pstng_DateTime).toLocaleString("en-GB") }}</span>
                            </template>

                            <template v-slot:top>
                                <v-toolbar
                                flat
                                >
                                <v-toolbar-title>Declaración Manual</v-toolbar-title>
                                    <v-divider
                                        class="mx-4"
                                        inset
                                        vertical
                                    ></v-divider>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="primary"
                                        dark
                                        class="mx-2"
                                        :disabled="scrapcr.length==0"
                                        @click="copiartabla(scrapmanual)"
                                    >
                                    <v-icon>content_copy</v-icon>
                                        Copiar
                                    </v-btn>
                            </v-toolbar>
                            </template>
                        </v-data-table>
                        </v-col>
                        </v-row>
                    </v-flex> 
                </v-tab-item>
            </v-tabs-items>
        </nav>
    </v-app>
</div>

</template>

<script>
    import axios from 'axios';
    import Chart from 'chart.js/auto';
    import ChartDataLabels from 'chartjs-plugin-datalabels';
    import { logTraceguardar, errTraceguardarAxios } from '@/Trace';
    //import { SnackbarShow } from '../App.vue'
    import html2canvas from 'html2canvas';
    import {mapGetters, mapActions} from 'vuex';
    export default {
        name: 'Scrap',
        data() {
            return  {
                    scrapc:[],
                    scrapr:[],
                    scrapDS:[],
                    scrapTPCTb:[],
                    scrapTPCTr:[],
                    scrapSDC:[],
                    scrapDCST:[],

                    totalb:0,
                    totalr:0,
                    headers: [
                        { text: 'Parte', align: 'left', sortable: false, value: 'part' },
                        { text: 'Total partes', value: 'sumOfPartQty' },
                        { text: 'Total de partes en minutos', value: 'timeSumOfPartQty' },
                    ],
                    scrapcc:[],
                    scrapcr:[],

                    scrapccs:[{},{},{}],
                    scrapcrs:[{},{},{}],

                    headers2: [
                        { text: 'Producto', align: 'left', sortable: false, value: 'product' },
                        { text: 'Total partes', value: 'sumOfProductQty' },
                        { text: 'Total Costo de Producto', value: 'sumOfProductCost' },
                    ],
                    headers3:[
                        { text: 'Fecha de Posteo', align: 'left', value: 'pstng_DateTime' },
                        { text: 'Material', value: 'material' },
                        { text: 'Descripción de Material', value: 'material_Description' },
                        { text: 'Movimiento', value: 'mvT' },
                        //{ text: 'Item', value: 'item' },
                        { text: 'Documento', value: 'mat_Doc' },
                        //{ text: 'Ubicación de almacen', value: 'sLoc' },
                        { text: 'Motivo', value: 'reas' },
                        { text: 'Referencia', value: 'reference' },
                        { text: 'Encabezado de Documento', value: 'document_Header_Text' },
                        //{ text: 'Planta', value: 'plnt' },
                        { text: 'Usuario', value: 'user_name' },
                        { text: 'Cantidad', value: 'quantity_in_UnE' },
                        { text: 'Unidad', value: 'eUn' },
                        { text: 'Motivo', value: 'reas' },
                        { text: 'Monto', value: 'amount_in_LC' },
                        { text: 'Moneda', value: 'crcy' },
                    ],
                    scrapmanual:[],
                    headersDS: [
                        { text: 'Área', align: 'left', sortable: false, value: 'area' },
                        { text: 'Cantidad', value: 'qty' }
                    ],
                    cargando:true,
                    
                    menu: false,
                    menu2: false,
                    menu3: false,
                    nowDate: new Date().toISOString().slice(0,10),
                    //yesterday: (nowDate - 1).toISOString().substr(0, 10),
                    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
                    dates: [],
                    time1: null,
                    time2: null,
                    tomorrow: null,
                    yestarday: null,

                    maxdate: '',
                    mindate: '',

                    protocol:[],
                    model:[],
                    part:[],
                    turno:[],
                    username:[],

                    nombreDS:[],
                    valoresDS:[],
                    costoDS:[],

                    totalPCPM:[],
                    
                    nombreTPCTb:[],
                    valoresTPCTb:[],
                    nombreTPCTr:[],
                    valoresTPCTr:[],
                    valorescTPCTb:[],
                    valorescTPCTr:[],
                    nombreSDC:[],
                    valoresSDC1:[],
                    valoresSDC2:[],

                    totalPP:[{ sumQty: 0, timeSumQty: 0, sumCost: 0 }],

                    totalPPs:[  { sumQty: 0, timeSumQty: 0, sumCost: 0 },
                                { sumQty: 0, timeSumQty: 0, sumCost: 0 },
                                { sumQty: 0, timeSumQty: 0, sumCost: 0 }],

                    Chart11:null,
                    Chart12:null,
                    Chart13:null,
                    Chart14:null,
                    Chart15:null,
                    Chart16:null,

                    initmyChart11:false,
                    initmyChart12:false,
                    initmyChart13:false,
                    initmyChart14:false,
                    initmyChart15:false,
                    initmyChart16:false,
                    tabs:null,
                    //colors: ['#4dc9f6','#f67019','#f53794','#acc236','#166a8f','#00a950','#58595b','#8549ba','#537bc4'],
                    //colors: ['#003f5c','#2f4b7c','#665191','#a05195','#d45087','#f95d6a','#ff7c43','#ffa600'], //sunset
                    //colors: ['#0055a1','#006ab5','#007fc8','#0095d7','#00aae4','#00c0ee','#00d5f6','#00eafb','#00ffff'], //poblue
                    //colors:["#ea5545", "#f46a9b", "#ef9b20", "#edbf33", "#ede15b", "#bdcf32", "#87bc45", "#27aeef", "#b33dc6"], //metro
                    //colors:["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"], //Dutch Field
                    //colors:["#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7"], //Spring pastels
                    colors:['#de425b','#ec6e55','#f39659','#f5bc6b','#c1ae4a','#89a036','#488f31'], //divergent

                    cards:[
                        { title: 'Piezas Producidas', icon: 'precision_manufacturing', color: 'success', data: '', subtitle1: '', subtitle2: '', flex:3, chart:false },
                        { title: 'Porcentaje de Scrap', icon: 'percent', color: 'error', data: '', subtitle1: '', subtitle2: '', flex:3, chart:false},
                        { title: 'Scrap por Costo [USD]', icon: 'delete_outline', color: '#FF8B00', data: '', subtitle1: '', subtitle1: '', flex:3, chart:false },
                        { title: 'Scrap por Tiempo [min]', icon: 'auto_delete', color: 'warning', data: '', subtitle1: '', subtitle1: '', flex:3, chart:false },
                        { title: 'Scrap de turno', icon: 'punch_clock', color: '#e66777', data: '', subtitle1: '', subtitle1: '', flex:3, chart:false },
                        //{ title: 'Scrap por Turno', icon: '', color: '#e32636', data: '', subtitle1: '', subtitle1: '', flex:3, chart:true },
                    ],
                    card1:{ title: 'Porcentaje de Scrap en Tiempo', icon: 'percent', color: 'error', data: '', subtitle1: '', subtitle2: '', flex:3 },
                    card2:{ title: 'Porcentaje de Scrap en Costo', icon: 'percent', color: 'error', data: '', subtitle1: '', subtitle2: '', flex:3 },
                    card3:{ title: 'Porcentaje de Scrap', icon: 'percent', color: 'error', data: '', subtitle1: '', subtitle2: '', flex:3 },
                    card4:{ title: 'Scrap por Costo [USD]', icon: 'delete_outline', color: '#FF8B00', data: '', subtitle1: '', subtitle1: '', flex:3 },

                    darkmode:false,

                    interval: null,

                    initmyChartCard01: false,

                    ChartCard01: null,
                    
                }
        },
        created () {
            this.darkmode = this.$vuetify.theme.dark;
            this.crear();
            this.interval = setInterval(this.refreshData, 144000)
        },
        methods: {
            ...mapActions(['setSnackbar']),
            refreshData () {
                let me =  this;
                let today = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString();
                let todays = today.substr(0, 10);
                let currentshift = me.currentshift(today);
                me.gettomorrow();
                //console.log(me.tomorrow(today));
                //console.log(me.getdatetime(me.dates[1]+ " " + me.turno[0]));
                
                if(me.getDashmode && me.$store.state.usuario!=null && me.cargando == false){
                    //this.setSnackbar({color: 'success', text: 'Modo Dashmode active', icon: 'info'});
                    if
                    ((today >= me.getdatetime(me.dates[1]+ " " + me.turno[0])) && (me.dates[1] == todays ))
                    //((today >= me.getdatetime(me.dates[0]+ " " + "10:53:00")) && (me.dates[0] == todays ))
                    {
                        me.dates[0] = todays;
                        me.dates[1] = me.tomorrow;
                        /*me.dates[0] = "2023-08-03";
                        me.dates[1] = "2023-08-04";*/

                        me.buscar(); 
                    }
                }
                
                //console.log(this.dates[0] +" = " +(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10));
                //console.log("logon: "+ (this.$store.state.usuario!=null) + ". loading: "+ this.cargando);
                if(me.incurrentshiftday && me.$store.state.usuario!=null && me.cargando == false){
                    me.buscar();                    
                }
                else if(me.$store.state.usuario==null){
                    //console.log("Kill timer");
                    me.interval = null;
                    return;
                }
                else{
                    //console.log("NO refresh Data");
                    return;
                }
            },
            async crear(){
                let me =  this;
                me.gettomorrow();
                me.dates[0] = me.date;
                me.dates[1] = me.tomorrow;
                
                me.selectt();
                
                me.listarp()
                    .then((result) => {
                    me.protocol=result;
                    me.getModel();
                    me.getPart();
                    me.turno = me.getProcotolValues("Turno");
                    me.username = me.getProcotolValues("User_name");
                    me.buscar();
                    }).catch(function(error){
                        console.log(error);
                        errTraceguardarAxios("Protocol - Listar", error); 
                        });
                                        
            },
            async buscar(){
                let me =  this;
                
                if(me.dates === '') return; 

                me.gettimes(me.dates);
                //console.log(`search for ${me.dates}`);
                //disable the button
                me.cargando = true;
                await me.limpiar();

                if(this.oneday)
                {
                    me.limpiar()
                        .then(() => me.datos()
                        .then(() => me.datoss())
                        .then(() => me.datacards()
                        .then(() => me.dashboard()
                        
                        .then(() => me.ChartsDarkMode(me.darkmode), me.cargando = false))));
                }
                else
                {
                    me.limpiar()
                        .then(() => me.datos()
                        .then(() => me.datacards()
                        .then(() => me.dashboard()
                        
                        .then(() => me.ChartsDarkMode(me.darkmode), me.cargando = false))));
                }

            },
            async datos(){
            let me=this;
            let header={"Authorization" : "Bearer " +this.$store.state.token};
            let configuracion= {headers : header};
            let time1 = me.time1;
            let time2 = me.time2;
            
            //console.log("Times:" + me.time1 + " " + time2);

            //alistarTPP
            const a = me.listarTPP(time1, time2, configuracion);
            a.then(function(result){
                me.totalPP=result;
                //console.log(me.totalPP);
            });
            //alistarTPCT
            const b = me.listarTPCT(time1, time2,'b', configuracion);
            b.then(function(result){
                me.scrapTPCTb=result;
                me.scrapTPCTb.map(function(x){me.totalb = me.totalb + x.sumQty});
            });
            const c = me.listarTPCT(time1, time2,'r', configuracion);
            c.then(function(result){
                me.scrapTPCTr=result;
                me.scrapTPCTr.map(function(x){me.totalr = me.totalr + x.sumQty});
            });
            //alistarDS
            const d = me.listarDS(time1, time2, configuracion);
            d.then(function(result){
                me.scrapDS=result;
            });
            const e = me.listarSDC(time1, time2, configuracion);
            e.then(function(result){
                me.scrapSDC=result;
            });
            const f = me.listarDCST(time1, time2, configuracion);
            f.then(function(result){
                me.scrapDCST=result;
            });
            //listarC
            const g = me.listarSM(time1, time2, 'R', configuracion);
            g.then(function(result){
                me.scrapr=result;
            });
            const h = me.listarSM(time1, time2, 'C', configuracion);
            h.then(function(result){
                me.scrapc=result;
            });
            //listarCC
            const i = me.listarSPC(time1, time2, 'R', configuracion);
            i.then(function(result){
                me.scrapcr=result;
            });
            const j = me.listarSPC(time1, time2, 'C', configuracion);
            j.then(function(result){
                me.scrapcc=result;
            });
            const k = me.listarSMF(time1, time2, configuracion);
            k.then(function(result){
                me.scrapmanual=result;
                let newArray = me.scrapmanual.filter(k => me.username.includes(k.user_name));
                me.scrapmanual=newArray;
            });
            const l = me.listarTPCPM(time1, time2, configuracion);
            l.then(function(result){
                me.totalPCPM=result;
                //console.log(me.totalPCPM)
            });
            
            const datos = await Promise.all([a,b,c,d,e,f,h,i,j,k,l])

            return datos;


            },
            async datoss(){
                let me=this;
                
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                let times1 = me.getdatetime(me.dates[0] + " " + me.turno[0]);
                let times2 = me.getdatetime(me.dates[0] + " " + me.turno[1]);
                let times3 = me.getdatetime(me.dates[0] + " " + me.turno[2]);
                let times4;
                if(me.dates[1] == undefined )
                    times4 = me.getdatetime(me.tomorrow + " " + me.turno[0]);
                else
                    times4 = me.getdatetime(me.dates[1] + " " + me.turno[0]);

                //agregar algun label o algo para distinguir quien es quien
                const a = me.listarTPP(times3, times4, configuracion);
                a.then(function(result){
                    me.totalPPs[2]=result;
                    //console.log(me.totalPP);
                });
                const b = me.listarTPP(times2, times3, configuracion);
                b.then(function(result){
                    me.totalPPs[1]=result;
                    //console.log(me.totalPP);
                });
                const c = me.listarTPP(times1, times2, configuracion);
                c.then(function(result){
                    me.totalPPs[0]=result;
                    //console.log(me.totalPP);
                });

                const d = me.listarSPC(times3, times4, 'R', configuracion);
                d.then(function(result){
                    me.scrapcrs[2]=result;
                });
                const e = me.listarSPC(times3, times4, 'C', configuracion);
                e.then(function(result){
                    me.scrapccs[2]=result;
                });
                const f = me.listarSPC(times2, times3, 'R', configuracion);
                f.then(function(result){
                    me.scrapcrs[1]=result;
                });
                const g = me.listarSPC(times2, times3, 'C', configuracion);
                g.then(function(result){
                    me.scrapccs[1]=result;
                });
                const h = me.listarSPC(times1, times2, 'R', configuracion);
                h.then(function(result){
                    me.scrapcrs[0]=result;
                });
                const i = me.listarSPC(times1, times2, 'C', configuracion);
                i.then(function(result){
                    me.scrapccs[0]=result;
                });

                const datoss = await Promise.all([a,b,c,d,e,f,h,i])

                return datoss;

            },
            dashboard: async function(){
                let me= this;
                //console.log("running dashboard");
                
                const a = me.CreateCharts();
                //const b = me.datacards();
                //const dashboard = await Promise.all([a,b]);
                const dashboard = await Promise.all([a]);

                return dashboard;
            },
            async datacards(){
                let me = this;
                let today = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString();
                let currentshift = me.currentshift(today);
                const sum = me.scrapmanual.reduce((accumulator, object) => {
                    return accumulator + object.amount_in_LC;
                }, 0);
                //console.log("datacards: "+me.totalPP[0]);
                me.cards[0].data = (me.totalPP[0].sumQty).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                me.cards[0].subtitle1 = "Costo: " + (me.totalPP[0].sumCost + 
                            (parseFloat(me.totals2(me.scrapcc).sumOfProductCost) + parseFloat(me.totals2(me.scrapcr).sumOfProductCost))).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " [USD]";
                me.cards[0].subtitle2 = "Tiempo: " + me.totalPP[0].timeSumQty.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " [min]";

                me.cards[1].data = ((parseFloat(me.totals2(me.scrapcc).sumOfProductCost) + parseFloat(me.totals2(me.scrapcr).sumOfProductCost) )
                            /(me.totalPP[0].sumCost + (parseFloat(me.totals2(me.scrapcc).sumOfProductCost) + parseFloat(me.totals2(me.scrapcr).sumOfProductCost)) )*100)
                            .toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " % ";
                me.cards[1].subtitle1 = "Tiempo: "+ ((parseFloat(me.totals(me.scrapc).timeSumOfPartQty) + parseFloat(me.totals(me.scrapr).timeSumOfPartQty))/(me.totalPP[0].timeSumQty +
                            ((parseFloat(me.totals(me.scrapc).timeSumOfPartQty) + parseFloat(me.totals(me.scrapr).timeSumOfPartQty))))*100)
                            .toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " % ";
                me.cards[1].subtitle2 = "Piezas: " + (((me.totals(me.scrapc).sumOfPartQty + me.totals(me.scrapr).sumOfPartQty) / (me.totalPP[0].sumQty +
                            (me.totals(me.scrapc).sumOfPartQty + me.totals(me.scrapr).sumOfPartQty))) *100)
                            .toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " %";

                me.cards[2].data = (parseFloat(me.totals2(me.scrapcc).sumOfProductCost) + parseFloat(me.totals2(me.scrapcr).sumOfProductCost) )
                                    .toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                me.cards[2].subtitle1 = "Repintado: " + (parseFloat(me.totals2(me.scrapcc).sumOfProductCost)).toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " [USD]";
                me.cards[2].subtitle2 = "Scrap: " + (parseFloat(me.totals2(me.scrapcr).sumOfProductCost)).toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " [USD]";

                me.cards[3].data = (parseFloat(me.totals(me.scrapc).timeSumOfPartQty) + parseFloat(me.totals(me.scrapr).timeSumOfPartQty)).toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                me.cards[3].subtitle1 = "Repintado: " + (parseFloat(me.totals(me.scrapc).timeSumOfPartQty)).toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " [min]";
                me.cards[3].subtitle2 = "Scrap: "+ (parseFloat(me.totals(me.scrapr).timeSumOfPartQty)).toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " [min]";

                if(me.oneday)
                {
                    let scrapps = new Array;

                    scrapps[0] = "1er: " + ((parseFloat(me.totals2(me.scrapccs[0]).sumOfProductCost) + parseFloat(me.totals2(me.scrapcrs[0]).sumOfProductCost) )
                            /(me.totalPPs[0][0].sumCost + (parseFloat(me.totals2(me.scrapccs[0]).sumOfProductCost) + parseFloat(me.totals2(me.scrapcrs[0]).sumOfProductCost)) )*100)
                            .toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " % ";
                    scrapps[1] = "2do: " + ((parseFloat(me.totals2(me.scrapccs[1]).sumOfProductCost) + parseFloat(me.totals2(me.scrapcrs[1]).sumOfProductCost) )
                            /(me.totalPPs[1][0].sumCost + (parseFloat(me.totals2(me.scrapccs[1]).sumOfProductCost) + parseFloat(me.totals2(me.scrapcrs[1]).sumOfProductCost)) )*100)
                            .toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " % ";
                    scrapps[2] = "3er: " + ((parseFloat(me.totals2(me.scrapccs[2]).sumOfProductCost) + parseFloat(me.totals2(me.scrapcrs[2]).sumOfProductCost) )
                            /(me.totalPPs[2][0].sumCost + (parseFloat(me.totals2(me.scrapccs[2]).sumOfProductCost) + parseFloat(me.totals2(me.scrapcrs[2]).sumOfProductCost)) )*100)
                            .toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " % ";

                    if(!me.incurrentshiftday){
                        me.cards[4].data = scrapps[0];
                        me.cards[4].subtitle1 = scrapps[1];
                        me.cards[4].subtitle2 = scrapps[2];
                    }
                    else{
                        switch(currentshift){
                            case 1:
                                me.cards[4].data = scrapps[0];
                                me.cards[4].subtitle1 = "_";
                                me.cards[4].subtitle2 = "_";
                                break;
                            case 2:
                                me.cards[4].data = scrapps[1];
                                me.cards[4].subtitle1 = scrapps[0];
                                me.cards[4].subtitle2 = "_";
                                break;
                            case 3:
                                me.cards[4].data = scrapps[2];
                                me.cards[4].subtitle1 = scrapps[1];
                                me.cards[4].subtitle2 = scrapps[0];
                                break;
                        }
                    }
                    
                }
                //me.cards[4].data = "ChartCard01";

                me.card1.data= ((parseFloat(me.totals(me.scrapc).timeSumOfPartQty) + parseFloat(me.totals(me.scrapr).timeSumOfPartQty))/(me.totalPP[0].timeSumQty)*100)
                                .toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " %";

                me.card2.data=((parseFloat(me.totals2(me.scrapcc).sumOfProductCost) + parseFloat(me.totals2(me.scrapcr).sumOfProductCost))/(me.totalPP[0].sumCost)*100)
                                .toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " %";
                
                me.card3.data=((parseFloat( Math.abs(sum)))/(me.totalPP[0].sumCost)*100)
                                .toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " %";            
                me.card4.data=(parseFloat( Math.abs(sum)))
                                .toFixed(2).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " [USD]";
            },
            listarSMF: function(fechai, fechaf, configuracion){
                const url = 'api/SAPScrapVs/ListarFiltroFecha/'
                // create a promise for the axios request
                const promise = axios.post(url,{
                    'StartTime': fechai,
                    'EndTime': fechaf
                }, configuracion);
                // using .then, create a new promise which extracts the data
                const dataPromise = promise.then((response) => response.data)
                // return it
                return dataPromise
            },
            listarTPP: function(fechai, fechaf, configuracion){
                const url = 'api/App_Types/TotalPiezasProducidas';
                // create a promise for the axios request
                const promise = axios.post(url,{
                    'fechai': fechai,
                    'fechaf': fechaf
                }, configuracion);
                // using .then, create a new promise which extracts the data
                const dataPromise = promise.then((response) => response.data)
                // return it
                return dataPromise
            },
            listarTPCPM: function(fechai, fechaf, configuracion){  //TotalPiezasCostporModelo
                const url = 'api/App_Types/TotalPiezasCostporModelo';
                // create a promise for the axios request
                const promise = axios.post(url,{
                    'fechai': fechai,
                    'fechaf': fechaf
                }, configuracion);
                // using .then, create a new promise which extracts the data
                const dataPromise = promise.then((response) => response.data)
                // return it
                return dataPromise
            },
            listarSM: function(fechai, fechaf, tipo, configuracion) {
                const url = 'api/App_Types/ScrapPorModelo';
                // create a promise for the axios request
                const promise = axios.post(url,{
                    'fechai': fechai,
                    'fechaf': fechaf,
                    'status': tipo
                }, configuracion);
                // using .then, create a new promise which extracts the data
                const dataPromise = promise.then((response) => response.data)
                // return it
                return dataPromise
            },
            listarSPC: function(fechai, fechaf, tipo, configuracion) {
                const url = 'api/App_Types/ScrapPorProductoCosto';
                // create a promise for the axios request
                const promise = axios.post(url,{
                    'fechai': fechai,
                    'fechaf': fechaf,
                    'status': tipo
                }, configuracion);
                // using .then, create a new promise which extracts the data
                const dataPromise = promise.then((response) => response.data)
                // return it
                return dataPromise
            },
            listarDS: function(fechai, fechaf, configuracion){
                const url = 'api/App_Types/DistribucionScrap';
                // create a promise for the axios request
                const promise = axios.post(url,{
                    'fechai': fechai,
                    'fechaf': fechaf
                }, configuracion);
                // using .then, create a new promise which extracts the data
                const dataPromise = promise.then((response) => response.data)
                // return it
                return dataPromise
            },
            listarTPCT: function(fechai, fechaf, tipo, configuracion){
                const url = 'api/App_Types/TotalPiezasTiempoCostporTipo';
                // create a promise for the axios request
                const promise = axios.post(url,{
                    'fechai': fechai,
                    'fechaf': fechaf,
                    'status': tipo
                }, configuracion);
                // using .then, create a new promise which extracts the data
                const dataPromise = promise.then((response) => response.data)
                // return it
                return dataPromise
            },
            listarSDC: function(fechai, fechaf, configuracion){
                const url = 'api/App_Types/ScrapPorDefectoCosto';
                // create a promise for the axios request
                const promise = axios.post(url,{
                    'fechai': fechai,
                    'fechaf': fechaf,
                }, configuracion);
                // using .then, create a new promise which extracts the data
                const dataPromise = promise.then((response) => response.data)
                // return it
                return dataPromise
            },
            listarDCST: function(fechai, fechaf, configuracion){
                const url = 'api/App_Types/DistribucionCostoScrapPorTipos';
                // create a promise for the axios request
                const promise = axios.post(url,{
                    'fechai': fechai,
                    'fechaf': fechaf
                    //'status': tipo
                }, configuracion);
                // using .then, create a new promise which extracts the data
                const dataPromise = promise.then((response) => response.data)
                // return it
                return dataPromise
            },
            selectt(){
                let me=this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                //var lineasArray=[];
                axios.get('api/App_Types/ScrapMinMaxDate',configuracion).then(function(response){
                    //console.log(response.data[0]);
                    me.mindate = response.data[0].min;
                    me.maxdate = response.data[0].max;
                    //console.log(me.mindate + " " + me.maxdate);
                }).catch(function(error){
                    errTraceguardarAxios("Linea - Select", error);
                    console.log(error)
                });
            },
            listarp(){
                let me= this;
                let header={"Authorization" : "Bearer " +this.$store.state.token};
                let configuracion= {headers : header};
                const promise = axios.get('api/Protocols/Listar',configuracion);
                // using .then, create a new promise which extracts the data
                const dataPromise = promise.then((response) => response.data)
                // return it
                return dataPromise
            

            },
            getProcotolValues: function(x){   //to check
                let me=this;
                let temparray = [];
                let temp = me.protocol.filter(function(e) {
                    if(e.nombre == x)
                        return e.valor});
                    temparray = temp.map(function(e) {
                        return e.valor});
                return temparray;
            },
            getModel(){
                let me=this;
                let modelO = me.protocol.filter(function(e) {
                    if(e.nombre == 'Model')
                        return e.valor});
                me.model = modelO.map(function(e) {
                        return e.valor});
            },
            getPart(){
                let me=this;
                let partO = me.protocol.filter(function(e) {
                    if(e.nombre == 'Part')
                        return e.valor});
                me.part = partO.map(function(e) {
                        return e.valor});
            },
            getdatetime(val){
                //console.log(val);
                const [dateValues, timeValues] = val.split(' ');
                const [year, month, day] = dateValues.split('-');
                const [hours, minutes, seconds] = timeValues.split(':');
                let [basura,miliseconds] = timeValues.split('.');
                //console.log(basura + " " +miliseconds);
                if(miliseconds == undefined)
                    miliseconds = 0;
                
                const UTCDate = new Date(Date.UTC(+year, +month - 1, +day, +hours, +minutes,+seconds,+miliseconds));
                //console.log(UTCDate.toJSON());
                return UTCDate.toJSON();
            },
            gettimes(val){
                let me = this;
                if (val[1] == undefined ){
                    me.time1 = me.getdatetime(val[0] + " 00:00:00");
                    me.time2 = me.getdatetime(val[0] + " 23:59:59.999");
                }                        
                else{
                    me.time1 = me.getdatetime(val[0] + " 06:00:00");
                    me.time2 = me.getdatetime(val[1] + " 06:00:00");
                }
            },
            getyesterday(val){
                let me = this;
                let date = val;
                //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)
                date.setDate(date.getDate() - 1);
                //console.log("yesterday: " + date);
                me.yesterday = date;
            },
            gettomorrow(){
                let me =  this;
                let date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000));
                //(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
                date.setDate(date.getDate() + 1 );
                date.toISOString().split('T')[0];

                //console.log("tomorrow: " + date);
                me.tomorrow = date.toJSON().slice(0, 10);
            },
            currentshift: function(value){
                let today = value;
                let todays = today.substr(0, 10);
                let shift = 0;
                this.gettomorrow();
                switch(true){
                    case ((today >= this.getdatetime(todays+ " " + this.turno[0])) && (today <= this.getdatetime(todays+ " " + this.turno[1]))):
                        shift = 1;
                        break;
                    case ((today >= this.getdatetime(todays+ " " + this.turno[1])) && (today <= this.getdatetime(todays+ " " + this.turno[2]))):
                        shift = 2;
                        break;
                    case ((today >= this.getdatetime(todays+ " " + this.turno[2])) && (today <= this.getdatetime(this.tomorrow + " " + this.turno[0]))):
                        shift = 3;
                        break;
                }
                //console.log('Turno :' +shift);
                return shift;
            },
            totals(x) {
                let totals;
                if (x === undefined)
                    totals = 0;
                else{
                    var array = JSON.parse(JSON.stringify(x))
                    //console.log(array);
                    totals = array.reduce((acc, d) => {
                        acc.sumOfPartQty += d.sumOfPartQty
                        acc.timeSumOfPartQty += d.timeSumOfPartQty
                        return acc
                    }, {
                        sumOfPartQty: 0,
                        timeSumOfPartQty: 0,
                        })
                    totals.timeSumOfPartQty = totals.timeSumOfPartQty.toFixed(2)
                }
                //console.log(totals);
                return totals;
            },
            totals2(x) {
                let totals2;
                //console.log(x.length);
                if (x === undefined ) //x.length === 0
                    totals2 = 0;
                else{
                    var array = JSON.parse(JSON.stringify(x))
                    //console.log(array);
                    totals2 = array.reduce((acc, d) => {
                        acc.sumOfProductQty += d.sumOfProductQty
                        acc.sumOfProductCost += d.sumOfProductCost
                        return acc
                    }, {
                        sumOfProductQty: 0,
                        sumOfProductCost: 0,
                        })
                    totals2.sumOfProductCost = totals2.sumOfProductCost.toFixed(2)
                    //console.log(totals);
                }
                
                return totals2;
            },
            async limpiar(){
                this.scrapr=[];
                this.scrapc=[];
                this.scrapcr=[];
                this.scrapcc=[];
                this.scrapDS=[];
                this.scrapTPCTb=[];
                this.scrapTPCTr=[];
                this.scrapSDC=[];
                this.scrapDCST=[];
                this.nombreDS=[];
                this.valoresDS=[];
                this.costoDS=[];
                this.nombreTPCTb=[];
                this.nombreTPCTr=[];
                this.valoresTPCTb=[];
                this.valoresTPCTr=[];
                this.valorescTPCTb=[];
                this.valorescTPCTr=[];
                this.totalb=0;
                this.totalr=0;
                this.nombreSDC=[];
                this.valoresSDC1=[];
                this.valoresSDC2=[];
                this.totalPP=[];
                this.totalPPs=[];
                this.scrapccs=[];
                this.scrapcrs=[];
                this.totalPCPM=[];
                this.scrapmanual=[];
                for (let i; i<this.cards.length; i++)
                {
                    this.cards[i].data='';
                    this.cards[i].subtitle='';
                }
                this.card1.data='';
                this.card2.data='';
                
                //console.log("initmyChart11: " + this.initmyChart11);

                if(this.initmyChart11)
                    this.Chart11.destroy();
                if(this.initmyChart12)
                    this.Chart12.destroy();
                if(this.initmyChart13)
                    this.Chart13.destroy();
                if(this.initmyChart14)
                    this.Chart14.destroy();
                if(this.initmyChart15)
                    this.Chart15.destroy();
                if(this.initmyChart16)
                    this.Chart16.destroy();
                if(this.initmyChartCard01)
                    this.ChartCard01.destroy();

            },
            copiartabla(array){
                let text = "";
                let head=[];
                for (const [key] of Object.entries(array[0])) {
                    text += `${key}` + "\t";
                    head.push(`${key}`);
                }
                text += ("\n")
                array.forEach(element => {
                    for (let index = 0; index < head.length; index++) {
                        
                        text += element[head[index]];
                        text += ("\t");
                        
                    }
                    text += ("\n")
                });
                navigator.clipboard.writeText(text);
                this.setSnackbar({color: 'success', text: 'La tabla se copió', icon: 'info'});
            },
            copiarresultado(id){
                //console.log(id)
                let doc = document.getElementById(id);
                html2canvas(doc).then(function(canvas) {
                    canvas.toBlob(function(blob) {
                        navigator.clipboard
                            .write([
                            new ClipboardItem(
                                Object.defineProperty({}, blob.type, {
                                    value: blob,
                                    enumerable: true
                                })
                            )
                        ])
                            .then(function() {
                            console.log("Imagen se copió a portapales ");
                            console.log(id.toString());
                        });
                    });
                });
                this.setSnackbar({color: 'success', text: 'Imagen copió a portapales', icon: 'info'});
            },
            CreateCharts(){
                let me=this;
                me.myChart11();
                me.myChart12();
                me.myChart13();
                me.myChart14();
                me.myChart15();
                me.myChart16();
                //me.myChartCard01();
            },
            myChart11(){
                let me = this;
                let newdata=[];
                
                me.scrapDS.map(function(x){
                    me.nombreDS.push([x.area]);
                    me.valoresDS.push([x.qty]);
                    me.costoDS.push([x.sumCost]);
                });               
                
                //console.log("chart11 :" + me.scrapDS);

                let totalPPss = (me.totalPP[0].sumCost + (parseFloat(me.totals2(me.scrapcc).sumOfProductCost) + parseFloat(me.totals2(me.scrapcr).sumOfProductCost)) );
                
                for (let i = 0; i < me.costoDS.length; i++){
                    if(typeof me.costoDS[i] == 'undefined')
                        newdata[i]=0;
                    else if (me.totalb == 0)
                        newdata[i]=1;
                    else
                        newdata[i]=parseFloat( ((me.costoDS[i])) / totalPPss * 100).toFixed(1);
                }
                
                /*
                for (let i = 0; i < me.valoresDS.length; i++){
                    if(typeof me.valoresDS[i] == 'undefined')
                        newdata[i]=0;
                    else if (me.totalb == 0)
                        newdata[i]=1;
                    else
                        newdata[i]=parseFloat( ((me.valoresDS[i])) / me.totalPP[0].sumQty *100).toFixed(1) 
                }*/
                
                const data = {
                    labels: me.nombreDS,
                        datasets: [{
                            label: 'Distribución de Scrap',
                            data: newdata,
                            backgroundColor: me.colors,
                            borderWidth: 1,
                            datalabels: {
                                anchor: 'center',
                                backgroundColor: null,
                                borderWidth: 0
                            }
                        }]
                };

                const config = {
                    type: 'pie',
                    data,
                    plugins: [ChartDataLabels],
                    options: {
                        
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom'
                            },
                            title: {
                                display: true,
                                text: 'Distribución de Scrap'
                            },                          
                            datalabels: {
                                backgroundColor: function(context) {
                                    return context.dataset.backgroundColor;
                                },
                                borderColor: 'white',
                                borderRadius: 25,
                                borderWidth: 2,
                                color: 'white',
                                display: function(context) {
                                    let dataset = context.dataset;
                                    //var count = dataset.data.length;
                                    let value = dataset.data[context.dataIndex];
                                    let total = dataset.data.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
                                    //console.log(context);
                                    return value / total * 360 > 25;
                                    },
                                font: {
                                weight: 'bold'
                                },
                                padding: 6,
                                formatter: function(value) {
                                    return value + '%';
                                }
                                //formatter: Math.round
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return context.label + ": " + context.parsed + "%"; 
                                    }
                                }
                            }
                        }
                    }
                    
                };
                    //console.log("estatus initmyChart11: " + me.initmyChart11);
                    
                    /*if(me.Chart11) me.Chart11.destroy();
                    me.Chart11 = new Chart(ctx,config);*/
                    
                    let ctx = document.getElementById('Chart11').getContext("2d");
                    
                    if(me.initmyChart11){
                        me.Chart11.destroy();
                        me.Chart11 = new Chart(ctx,config);
                        //me.myChart.update();
                    }
                    else
                    {
                        me.Chart11 = new Chart(ctx,config);
                        me.initmyChart11 = true;
                    }
                //}
            },
            myChart12(){
                let me = this;
                
                me.scrapTPCTb.map(function(x){
                    me.nombreTPCTb.push([x.part]);
                    me.valoresTPCTb.push([x.sumQty]);
                });

                me.scrapTPCTr.map(function(x){
                    me.nombreTPCTr.push([x.part]);
                    me.valoresTPCTr.push([x.sumQty]);
                });

                let scrapTPCT=[];

                for (let i = 0; i < me.valoresTPCTb.length; i++){
                    if(typeof me.valoresTPCTr[i] == 'undefined')
                        scrapTPCT[i]=0;
                    else if (me.valoresTPCTb[i] == 0)
                    scrapTPCT[i]=parseFloat(me.valoresTPCTr[i] / 1 * 100).toFixed(2)
                    else
                        scrapTPCT[i]=parseFloat(me.valoresTPCTr[i] / me.valoresTPCTb[i]* 100).toFixed(2) 
                }

                //console.log("Chart 2a :" + me.valoresTPCTb);
                //console.log("Chart 2b :" + me.valoresTPCTr);

                /*if(me.valoresDS.length!=0)
                {*/
                    const data = {
                        labels: me.nombreTPCTb,
                            datasets: [{
                                type: 'line',
                                label: 'Porcentaje de Scrap',
                                data: scrapTPCT,
                                backgroundColor: "rgba(255, 193, 7, 0.9)",
                                borderColor: "rgba(255, 193, 7, 0.9)",
                                tension: 0.2,
                                yAxisID: 'y1',
                                datalabels: {
                                    align: 'top',
                                    anchor: 'top'
                                }
                                },
                                {
                                //type: 'bar',
                                label: 'Piezas Producidas',
                                data: me.valoresTPCTb,
                                backgroundColor: "dodgerblue",
                                //borderColor: "blue",
                                borderWidth: 1,
                                yAxisID: 'y',
                                datalabels: {
                                    align: 'center',
                                    anchor: 'center'
                                }
                                },
                                {
                                //type: 'bar',
                                label: 'Piezas Scrap',
                                data: me.valoresTPCTr,
                                backgroundColor: "rgba(255, 82, 82)",
                                //borderColor: "red",
                                borderWidth: 1,
                                yAxisID: 'y',
                                datalabels: {
                                    align: 'center',
                                    anchor: 'center'
                                }
                                }
                            ]
                    };

                    const config = {
                        responsive: true,
                        type: 'bar',
                        data,
                        plugins: [ChartDataLabels],
                        options: {
                            //aspectRatio: 1,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'bottom'
                                },
                                title: {
                                    display: true,
                                    text: 'Scrap en Piezas'
                                },
                                datalabels: {
                                    color: 'white',
                                    font: {
                                            weight: 'bold'
                                    },
                                    display: function(context){
                                        if(context.datasetIndex == 0)
                                            return context.dataset.data[context.dataIndex];
                                        else
                                            return context.dataset.data[context.dataIndex] > (context.chart.scales.y.end * 0.1);
                                    },
                                    formatter: function(value, context){
                                        if(context.datasetIndex == 0)
                                            return value + '%';
                                        else
                                            return value.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    },
                                    backgroundColor: function(context){
                                        if(context.datasetIndex == 0)
                                            return context.dataset.backgroundColor;
                                    },
                                    borderRadius: function(context){
                                        if(context.datasetIndex == 0)
                                            return 4;
                                    },
                                    padding: function(context){
                                        if(context.datasetIndex == 0)
                                            return  6;
                                        
                                    },
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            if (context.datasetIndex == 0)
                                                return context.dataset.label + ": " + context.parsed.y + '%';
                                            else
                                                return context.dataset.label + ": " + context.parsed.y.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        }
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    type: 'linear',
                                    display: true,
                                    position: 'left',
                                },
                                y1: {
                                    type: 'linear',
                                    display: true,
                                    position: 'right',
                                    
                                    ticks: {
                                        min: 0.0,
                                        max: 100.0,
                                        callback: function(value) {
                                            return parseFloat(value).toFixed(1) + "%"
                                            }
                                        },
                                    }
                            }
                        },
                    };
                    
                    let ctx = document.getElementById('Chart12').getContext("2d");
                    
                    if(me.initmyChart12){
                        me.Chart12.destroy();
                        me.Chart12 = new Chart(ctx,config);
                        //me.myChart.update();
                    }
                    else
                    {
                        me.Chart12 = new Chart(ctx,config);
                        me.initmyChart12 = true;
                    }
                //}
            },
            myChart13(){
                let me = this;
                
                me.scrapTPCTr.map(function(x){
                    me.valorescTPCTr.push([x.sumCost]);
                });

                me.scrapTPCTb.map(function(x){
                    me.valorescTPCTb.push([x.sumCost]);
                });

                let scrapcTPCTP=[];

                for (let i = 0; i < me.valorescTPCTb.length; i++){
                    if(typeof me.valorescTPCTr[i] == 'undefined')
                        scrapcTPCTP[i]=0;
                    else if (me.valoresTPCTb[i] == 0)
                        scrapcTPCTP[i]=parseFloat(me.valorescTPCTr[i] / 1 * 100).toFixed(2) 
                    else
                        scrapcTPCTP[i]=parseFloat(me.valorescTPCTr[i] / me.valorescTPCTb[i]* 100).toFixed(2) 
                }
                //console.log("Chart 3:" + me.valorescTPCTr);
                /*if(me.valoresDS.length!=0)
                {*/
                    const data = {
                        labels: me.nombreTPCTb,
                            datasets: [{
                                type: 'line',
                                label: 'Porcentaje de Scrap',
                                data: scrapcTPCTP,
                                backgroundColor: "rgba(255, 193, 7, 0.9)",
                                borderColor: "rgba(255, 193, 7, 0.9)",
                                tension: 0.2,
                                yAxisID: 'y1',
                                datalabels: {
                                    align: 'top',
                                    anchor: 'top'
                                }
                                },
                                {
                                //type: 'bar',
                                label: 'Costos Scrap',
                                data: me.valorescTPCTr,
                                backgroundColor: "rgba(255, 82, 82)",
                                //borderColor: "red",
                                borderWidth: 1,
                                yAxisID: 'y',
                                datalabels: {
                                    align: 'center',
                                    anchor: 'center'
                                }
                                }
                            ]
                    };

                    const config = {
                        responsive: true,
                        type: 'bar',
                        data,
                        plugins: [ChartDataLabels],
                        options: {
                            //aspectRatio: 1,
                            interaction: {
                            intersect: false,
                            mode: 'index',
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'bottom'
                                },
                                title: {
                                    display: true,
                                    text: 'Costo y porcentaje de Scrap en Fascias'
                                },
                                datalabels: {
                                    color: 'white',
                                    font: {
                                            weight: 'bold'
                                    },
                                    display: function(context){
                                        if(context.datasetIndex == 0)
                                            return context.dataset.data[context.dataIndex];
                                        else
                                            return context.dataset.data[context.dataIndex] > (context.chart.scales.y.end * 0.1);
                                    },
                                    formatter: function(value, context){
                                        if(context.datasetIndex == 0)
                                            return value + '%';
                                        else
                                            return '$' + value.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    },
                                    backgroundColor: function(context){
                                        if(context.datasetIndex == 0)
                                            return context.dataset.backgroundColor;
                                    },
                                    borderRadius: function(context){
                                        if(context.datasetIndex == 0)
                                            return 4;
                                    },
                                    padding: function(context){
                                        if(context.datasetIndex == 0)
                                            return  6;
                                        
                                    },
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            if (context.datasetIndex == 1)
                                                return context.dataset.label + ": " + context.parsed.y.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                            else
                                                return context.dataset.label + ": " + context.parsed.y.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '%';
                                        }
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    type: 'linear',
                                    display: true,
                                    position: 'left',
                                },
                                y1: {
                                    type: 'linear',
                                    display: true,
                                    position: 'right',
                                    
                                    ticks: {
                                        min: 0.0,
                                        max: 100.0,
                                        callback: function(value) {
                                            return parseFloat(value).toFixed(1) + "%"
                                            }
                                        },
                                    }
                            }
                        },
                    };
                    
                    let ctx = document.getElementById('Chart13').getContext("2d");
                    
                    if(me.initmyChart13){
                        me.Chart13.destroy();
                        me.Chart13 = new Chart(ctx,config);
                        //me.myChart.update();
                    }
                    else
                    {
                        me.Chart13 = new Chart(ctx,config);
                        me.initmyChart13 = true;
                    }
                //}
            },
            myChart14(){
                let me = this;
                
                let nombres=[];
                let valores=[];
                

                // TOP 5 de defectos por modelo ->
                //INICIALIZAR ARRAY VACIO
                for(let i = 0; i < 5; i++){
                    valores[i] = new Array(5);
                    nombres[i] = new Array(5);
                    valores[i].fill(0);
                }


                for(let j = 0; j < me.part.length; j++){
                    let i = 0;
                    for(let k = 0; k < me.scrapDCST.length; k++)
                    {
                        if(me.part[j] == me.scrapDCST[k].part && i < 5)
                        {
                            valores[i][j] = me.scrapDCST[k].sumCost;
                            nombres[i][j] = me.scrapDCST[k].nomDefautUS;
                            i = i + 1;
                        } 
                    }
                }
                // TOP 5 de defectos por modelo <-
                
                //console.log(nombres);
                //console.log(valores);
                //console.log(valores.length);
                //console.log(me.part.length);
                let datasetObject=[];

                for (let i =0; i < nombres.length; i++)
                {
                    datasetObject.push({
                        defecto: nombres[i],
                        data: valores[i],
                        backgroundColor: me.colors[i],
                        borderWidth: 1,
                        datalabels: {
                            align: 'center',
                            anchor: 'center'
                        }
                    });
                }

                /*if(me.valoresDS.length!=0)
                {*/
                    const data = {
                        labels: me.part,
                            datasets: datasetObject
                    };

                    const config = {
                        responsive: true,
                        type: 'bar',
                        data,
                        plugins: [ChartDataLabels],
                        options: {
                            //aspectRatio: 1,
                            plugins: {
                                legend: {
                                    display: false,
                                    //position: 'bottom'
                                },
                                title: {
                                    display: true,
                                    text: 'Top 5 por fascia Costo'
                                },
                                datalabels: {
                                    color: 'white',
                                    align: 'end',
                                    anchor: 'start',
                                    rotation: -90,
                                    display: function(context,val){
                                        return context.dataset.data[context.dataIndex] > (context.chart.scales.y.end * 0.3);
                                    },
                                    formatter: (val, x) => (x.dataset.defecto[x.dataIndex]).substring(0,23),
                                    
                                    /*formatter: function(value){
                                        return '$' + value ;
                                    },*/
                                    borderRadius: 4,
                                    padding: 6,
                                },
                                tooltip: {
                                    callbacks: {
                                        footer: function(context){
                                            return context[0].dataset.defecto[context[0].dataIndex];
                                        },
                                        label: function(context) {
                                            return context.parsed.y.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        }
                                    }
                                }
                            },
                        },
                    };
                    
                    let ctx = document.getElementById('Chart14').getContext("2d");
                    
                    if(me.initmyChart14){
                        me.Chart14.destroy();
                        me.Chart14 = new Chart(ctx,config);
                        //me.myChart.update();
                    }
                    else
                    {
                        me.Chart14 = new Chart(ctx,config);
                        me.initmyChart14 = true;
                    }
                //}
            },
            myChart15(){
                let me = this;
                let myChart22_jb=0; 
                let myChart22_tb=0;
                let myChart22_js=0;
                let myChart22_ts=0;
                let myChart22_jp=0;
                let myChart22_tp=0;

                let chardata = new Array();

                //console.log(me.model[0].substring(6, 0) + " " + me.model[1].substring(6, 0));

                //SOLO VA TOMAR LOS DOS PRIMEROS MODELOS SI EXISTEN MAS NO VA SERVIR!!! USAR DOS LOOPS ANIDADOS PARA CREAR UN ARRAY

                me.totalPCPM.map(function(e) {

                    if(e.model.substring(6, 0) == me.model[0].substring(6, 0).toUpperCase())
                        myChart22_tb = myChart22_tb + e.sumCost
                    else if(e.model.substring(6, 0) == me.model[1].substring(6, 0).toUpperCase())
                        myChart22_jb = myChart22_jb + e.sumCost
                });

                me.scrapTPCTr.map(function(e) {
                if(e.part.substring(6, 0) == me.model[0].substring(6, 0))
                    myChart22_ts = myChart22_ts + e.sumCost
                else if(e.part.substring(6, 0) == me.model[1].substring(6, 0))
                    myChart22_js = myChart22_js + e.sumCost
                });

                /*
                me.scrapTPCTb.map(function(e) {

                    if(e.part.substring(6, 0) == me.model[0].substring(6, 0))
                        myChart22_tb = myChart22_tb + e.sumCost
                    else if(e.part.substring(6, 0) == me.model[1].substring(6, 0))
                        myChart22_jb = myChart22_jb + e.sumCost
                    });
                
                me.scrapTPCTr.map(function(e) {
                    if(e.part.substring(6, 0) == me.model[0].substring(6, 0))
                        myChart22_ts = myChart22_ts + e.sumCost
                    else if(e.part.substring(6, 0) == me.model[1].substring(6, 0))
                        myChart22_js = myChart22_js + e.sumCost
                    });
                */
                myChart22_jb = parseFloat([myChart22_jb]).toFixed(2);
                myChart22_tb = parseFloat([myChart22_tb]).toFixed(2);

                myChart22_js = parseFloat([myChart22_js]).toFixed(2);
                myChart22_ts = parseFloat([myChart22_ts]).toFixed(2);

                myChart22_jp = parseFloat(myChart22_js/myChart22_jb *100).toFixed(2);
                myChart22_tp = parseFloat(myChart22_ts/myChart22_tb *100).toFixed(2);

                //console.log(me.model[0] + ": " + [myChart22_tb, myChart22_ts] + ". " + me.model[1] +": "+ [myChart22_jb, myChart22_js]);

                    const data = {
                        labels: me.model,
                            datasets: [{
                                type: 'line',
                                label: 'Porcentaje de Scrap',
                                data: [myChart22_tp, myChart22_jp],
                                backgroundColor: "rgba(255, 193, 7, 0.9)",
                                borderColor: "rgba(255, 193, 7, 0.9)",
                                tension: 0.2,
                                yAxisID: 'y1',
                                datalabels: {
                                    align: 'top',
                                    anchor: 'top'
                                }
                                },
                                {
                                //type: 'bar',
                                label: 'Costos de Producción',
                                data: [myChart22_tb, myChart22_jb],
                                backgroundColor: "dodgerblue",
                                //borderColor: "red",
                                borderWidth: 1,
                                yAxisID: 'y',
                                datalabels: {
                                    align: 'center',
                                    anchor: 'center'
                                }
                                },
                                {
                                //type: 'bar',
                                label: 'Costos de Scrap',
                                data: [myChart22_ts, myChart22_js],
                                backgroundColor: "rgba(255, 82, 82)",
                                //borderColor: "red",
                                borderWidth: 1,
                                yAxisID: 'y',
                                datalabels: {
                                    align: 'center',
                                    anchor: 'center'
                                }
                                }
                            ]
                    };

                    const config = {
                        responsive: true,
                        type: 'bar',
                        data,
                        plugins: [ChartDataLabels],
                        options: {
                            //aspectRatio: 1,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'bottom'
                                },
                                title: {
                                    display: true,
                                    text: 'Costo de producción/scrap y porcentaje de Scrap por modelo'
                                },
                                datalabels: {
                                    color: 'white',
                                    font: {
                                            weight: 'bold'
                                    },
                                    display: function(context){
                                        if(context.datasetIndex == 0)
                                            return context.dataset.data[context.dataIndex];
                                        else
                                            return context.dataset.data[context.dataIndex] > (context.chart.scales.y.end * 0.1);
                                    },
                                    formatter: function(value, context){
                                        if(context.datasetIndex == 0)
                                            return value + '%';
                                        else
                                            return '$' + value.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
                                    },
                                    backgroundColor: function(context){
                                        if(context.datasetIndex == 0)
                                            return context.dataset.backgroundColor;
                                    },
                                    borderRadius: function(context){
                                        if(context.datasetIndex == 0)
                                            return 4;
                                    },
                                    padding: function(context){
                                        if(context.datasetIndex == 0)
                                            return  6;
                                        
                                    },
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            if (context.datasetIndex == 0)
                                                return context.dataset.label + ": " + context.parsed.y + '%';
                                            else
                                                return context.dataset.label + ": " + context.parsed.y.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        }
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    type: 'linear',
                                    display: true,
                                    position: 'left',
                                },
                                y1: {
                                    type: 'linear',
                                    display: true,
                                    position: 'right',
                                    
                                    ticks: {
                                        min: 0.0,
                                        max: 100.0,
                                        callback: function(value) {
                                            return parseFloat(value).toFixed(1) + "%"
                                            }
                                        },
                                    }
                            }
                        },
                    };
                    
                    let ctx = document.getElementById('Chart15').getContext("2d");
                    
                    if(me.initmyChart15){
                        me.Chart15.destroy();
                        me.Chart15 = new Chart(ctx,config);
                        //me.myChart.update();
                    }
                    else
                    {
                        me.Chart15 = new Chart(ctx,config);
                        me.initmyChart15 = true;
                    }
            },
            myChart16(){
                let me = this;
                
                me.scrapSDC.map(function(x){
                    me.nombreSDC.push([x.nomDefautUS]);
                    me.valoresSDC1.push([x.sumOfProductQty]);
                    me.valoresSDC2.push(parseFloat([x.sumOfProductCost]).toFixed(2));
                });

                //console.log("Chart 4 :" + me.valoresSDC1 +"/"+ me.valoresSDC2); //+ me.valoresSDC1 + ","+
                /*if(me.valoresDS.length!=0)
                {*/
                    const data = {
                        labels: me.nombreSDC,
                            datasets: [{
                                type: 'line',
                                label: 'Costos de Scrap',
                                data: me.valoresSDC2,
                                backgroundColor: "rgba(255, 193, 7, 0.9)",
                                borderColor: "rgba(255, 193, 7, 0.9)",
                                tension: 0.2,
                                yAxisID: 'y1',
                                datalabels: {
                                    align: 'center',
                                    anchor: 'center'
                                }
                                },
                                {
                                //type: 'bar',
                                label: 'Piezas de Scrap',
                                data: me.valoresSDC1,
                                backgroundColor: "rgba(255, 82, 82)",
                                //borderColor: "red",
                                borderWidth: 1,
                                yAxisID: 'y',
                                datalabels: {
                                    align: 'center',
                                    anchor: 'bottom'
                                }
                                },
                                
                            ]
                    };

                    const config = {
                        responsive: true,
                        type: 'bar',
                        data,
                        plugins: [ChartDataLabels],
                        options: {
                            //aspectRatio: 1,
                            interaction: {
                            intersect: false,
                            mode: 'index',
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'bottom'
                                },
                                title: {
                                    display: true,
                                    text: 'Distribución de Scrap por Costo'
                                },
                                datalabels: {
                                    color: 'white',
                                    align: 'end',
                                    anchor: 'start',
                                    rotation: -90,
                                    font: {
                                            weight: 'bold'
                                    },
                                    display: function(context){
                                        if(context.datasetIndex == 0)
                                            return context.dataset.data[context.dataIndex];
                                        else
                                            return context.dataset.data[context.dataIndex] > (context.chart.scales.y.end * 0.1);
                                    },
                                    formatter: function(value, context){
                                        if(context.datasetIndex == 0)
                                            return '$' + value.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        else
                                            return value;
                                    },
                                    backgroundColor: function(context){
                                        if(context.datasetIndex == 0)
                                            return context.dataset.backgroundColor;
                                    },
                                    borderRadius: function(context){
                                        if(context.datasetIndex == 0)
                                            return 4;
                                    },
                                    padding: function(context){
                                        if(context.datasetIndex == 0)
                                            return  6;
                                        
                                    },
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            if (context.datasetIndex == 1)
                                                return context.dataset.label + ": " + context.parsed.y.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                            else
                                                return context.dataset.label + ": $" + context.parsed.y.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ;
                                        }
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    type: 'linear',
                                    display: true,
                                    position: 'left',
                                    
                                },
                                y1: {
                                    type: 'linear',
                                    display: true,
                                    position: 'right',
                                    ticks: {
                                        callback: function(value) {
                                            return "$" + parseFloat(value).toFixed(2)
                                            }
                                        },
                                    }
                            }
                        },
                    };
                    
                    let ctx = document.getElementById('Chart16').getContext("2d");
                    

                    if(me.initmyChart16){
                        me.Chart16.destroy();
                        me.Chart16 = new Chart(ctx,config);
                        //me.myChart.update();
                    }
                    else
                    {
                        me.Chart16 = new Chart(ctx,config);
                        me.initmyChart16 = true;
                    }
                //}
            },
            myChartCard01(){
                let me = this;
                

                    const data = {
                        labels: ["1er", "2do", "3ero"],
                        datasets: [{
                            data: [5, 4.5, 6.3],
                            backgroundColor: '#725732',  //['#de425b','#ec6e55','#f39659','#f5bc6b','#c1ae4a','#89a036','#488f31'], 
                            datalabels: {
                                    align: 'end',
                                    anchor: 'end'
                                }
                        }]
                    };

                    const config = {
                        responsive: true,
                        type: 'bar',
                        data,
                        plugins: [ChartDataLabels],
                        options: {
                            indexAxis: 'y',
                            elements: {

                            },
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                            x: {
                                display: false
                            },
                            y: {
                                grid: {
                                    display: false,
                                }
                            }
                        }
                        }
                        
                    };
                    
                    let ctx = document.getElementById('ChartCard01').getContext("2d");
                    

                    if(me.initmyChartCard01){
                        me.ChartCard01.destroy();
                        me.ChartCard01 = new Chart(ctx,config);
                        //me.myChart.update();
                    }
                    else
                    {
                        me.ChartCard01 = new Chart(ctx,config);
                        me.initmyChartCard01 = true;
                    }
                //}
            },
            ChartsDarkMode: function(val){
                let me = this;
                let scales = [];
                //console.log(val);
                //console.log(me.Chart12);
                //console.log(Chart.defaults);
                if (me.Chart12){
                        scales.push(me.Chart12.config.options.scales.x);
                        scales.push(me.Chart12.config.options.scales.y);
                        scales.push(me.Chart12.config.options.scales.y1);
                        
                        scales.push(me.Chart13.config.options.scales.x); 
                        scales.push(me.Chart13.config.options.scales.y);
                        scales.push(me.Chart13.config.options.scales.y1);
                        scales.push(me.Chart14.config.options.scales.x); 
                        scales.push(me.Chart14.config.options.scales.y);
                        scales.push(me.Chart15.config.options.scales.x); 
                        scales.push(me.Chart15.config.options.scales.y);
                        scales.push(me.Chart15.config.options.scales.y1);
                        scales.push(me.Chart16.config.options.scales.x); 
                        scales.push(me.Chart16.config.options.scales.y);
                        scales.push(me.Chart16.config.options.scales.y1);
                        //console.log(scales);

                    if (val == true){
                        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(150,150,150,0.8)';
                        scales.forEach(e => {
                            e.grid.borderColor = 'rgba(255,255,255,0.5)';
                            e.grid.color = 'rgba(255,255,255,0.5)';
                        });
                        //me.Chart12.scales.y.ticks.color = 'rgba(255,255,255,0.5)';
                        Chart.defaults.color = 'white';                      
                    }
                    if(val == false){
                        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0,0,0,0.8)';
                        scales.forEach(e => {
                            e.grid.borderColor = 'rgba(0,0,0,0.1)';
                            e.grid.color = 'rgba(0,0,0,0.1)';
                        });
                        //me.Chart12.scales.y.ticks.color = '#666';
                        Chart.defaults.color = '#666';                        
                    }
                    //console.log(Chart.defaults);
                    //console.log(me.Chart12.config.options);

                    me.Chart11.update();
                    me.Chart12.update();
                    me.Chart13.update();
                    me.Chart14.update();
                    me.Chart15.update();
                    me.Chart16.update();
                }
            }
        
        },
        computed: {
            ...mapGetters(['getDashmode']),
            /*yesterday(){
                let date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000));
                //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)
                date.setDate(date.getDate() - 1);
                //console.log("yesterday: " + date);
                return date;
            },
            tomorrow(){
                
                let date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000));
                //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)
                date.setDate(date.getDate() + 1 );
                date.toISOString().split('T')[0];

                //console.log("tomorrow: " + date);
                return date.toJSON().slice(0, 10);
            },
            today(){
                //let today = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString();
                return (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString();
            },*/
            min_date(){
                let me =this;
                let rdate;
                if(me.dates[1] != null )
                    rdate = me.mindate;
                else
                    rdate = me.dates[0];
                return rdate;
            },
/*
            time1:{
                get: function(){
                    let me = this;
                    if (me.dates[1] == undefined )
                        return me.getdatetime(me.dates[0] + " 00:00:00");
                    else
                        return me.getdatetime(me.dates[0] + " 06:00:00");
                },
                set: function(newVal){
                    let temp = new Date(newVal).toJSON()
                    console.log("Setting new name: " + temp);
                    this.dates[0] = temp.substr(0,10);
                }
            },
            time2:
            {
                get: function(){
                let me = this;
                if (me.dates[1] == undefined )
                    return me.getdatetime(me.dates[0] + " 23:59:59.999");
                else
                    return me.getdatetime(me.dates[1] + " 06:00:00");
                },
                set: function(newVal){
                    let temp = new Date(newVal).toJSON()
                    console.log("Setting new name: " + temp);
                    this.dates[1] = temp.substr(0,10);
                }
            },
*/
            incurrentshiftday(){
                let today = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString();
                if(this.time1 <= today
                    && this.time2 >= today)
                    return true;
                else
                    return false;
            },
            oneday(){
                const diffTime = Math.abs(new Date(this.time1) - new Date(this.time2));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                if(diffDays <= 1 )
                    return true;
                else
                    return false;
            },
            /*totalsc() {
                //https://codepen.io/fontzter/pen/BEdKXK
                let me = this;
                var array = JSON.parse(JSON.stringify(me.scrapc))
                console.log(array);
                const totalsc = array.reduce((acc, d) => {
                    acc.sumOfPartQty += d.sumOfPartQty
                    acc.timeSumOfPartQty += d.timeSumOfPartQty
                    return acc
                }, {
                    sumOfPartQty: 0,
                    timeSumOfPartQty: 0,
                    })
                totalsc.timeSumOfPartQty = totalsc.timeSumOfPartQty.toFixed(2)
                console.log(totalsc);
                return totalsc;
                },*/
            /*totalsr() {
            //https://codepen.io/fontzter/pen/BEdKXK
            let me = this;
            var array = JSON.parse(JSON.stringify(me.scrapr))
            console.log(array);
            const totalsr = array.reduce((acc, d) => {
                acc.sumOfPartQty += d.sumOfPartQty
                acc.timeSumOfPartQty += d.timeSumOfPartQty
                return acc
            }, {
                sumOfPartQty: 0,
                timeSumOfPartQty: 0,
                })
            totalsr.timeSumOfPartQty = totalsr.timeSumOfPartQty.toFixed(2)
            console.log(totalsr);
            return totalsr;
            },*/
        },
        watch: {
            '$vuetify.theme.dark'(){
                this.darkmode = this.$vuetify.theme.dark;
                //console.log(this.darkmode);
                this.ChartsDarkMode(this.darkmode);
            },

            dates: function() {
                let me = this;
                me.gettimes(me.dates);


                console.log(me.time1 + " " + me.time2);
                //this.time1 = '2023-08-02T06:00:00.000Z'
                //this.time2 = '2023-08-03T06:00:00.000Z'
            },
        },
}
//22/19/10
/*
cambiar filtro horario 00:00:00 -> 06:00:00     DONE
copy canvas, implementar?                       checar video
chart de https://apexcharts.com/ para dashboard

publicar con cambios
*/
</script>
<style>
.chartCard{

    width: 100%;

	background: rgba(185, 187, 190, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
}
.chartBox{
    min-width: 400px;
    max-width: 550px;
    height: 400px;



}
</style>