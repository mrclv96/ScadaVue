<template>
  <v-layout>
    <v-flex>
      <v-toolbar flat>
        <v-toolbar-title class="text-h5">Protocolos de pintura</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-select
          v-model="searchby"
          :items="searchOptions"
          label="Buscar por"
          class="mt-6"
          style="max-width:200px"
          @change="search=''"
        ></v-select>
        <v-spacer></v-spacer>
        <template v-if="searchby === 'Date'">
          <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="search"
                label="Fecha"
                class="mt-6"
                width="100px"
                readonly
                v-on="on"
                append-icon="event"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="search"
              @change="menu = false"
              :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
              :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000 * 24 * 120)).toISOString().substr(0, 10)"
              locale="es"
            ></v-date-picker>
          </v-menu>
        </template>
        <template v-if="searchby === 'LabelID'">
          <v-text-field
            v-model="search"
            class="mt-6"
            width="100px"
            append-icon="pin"
            label="LabelID"
            type="number"
            :maxlength="8"
            single-line
            clearable
            hide-spin-buttons
          ></v-text-field>
        </template>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="getFilteredSkids"><v-icon start class="ma-2">search</v-icon>Buscar</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="copyToClipboard(SkidProtocol)"><v-icon start class="ma-2">content_copy</v-icon>Copiar todo</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="isFiltered"
          color="primary"
          @click="getLastSkids" 
          fab
        ><v-icon start class="ma-2">close</v-icon></v-btn>
      </v-toolbar>
      <v-data-table
        :headers="SkidsHeaders"
        :items="SkidList"
        item-key="labelID"
        :loading="loading"
        :items-per-page=15
        :expanded.sync="expanded"
        show-expand
        single-expand
        sort-by="dateAndTimeIN"
        sort-desc
        class="elevation-1"
        loading-text="Cargando... Favor esperar"
        :footer-props="{
          'items-per-page-all-text': 'Todos',
          'items-per-page-text':'Elementos por pagina:',
          'show-first-last-page': true
        }"
        :body-props="{'td': {style: 'vertical-align: top;'}}"
      >
        <template v-slot:item="{ item, expand , isExpanded}">
          <tr>
            <td><v-icon @click="expand(!isExpanded)">{{ isExpanded ? 'expand_less' : 'expand_more' }}</v-icon></td>
            <td>{{ formatDatetime(item.dateAndTimeIN) }}</td>
            <td>{{ item.labelID }}</td>
            <td>{{ item.typeLab }}</td>
            <td>{{ item.colorLab }}</td>
            <td>{{ item.primerLab.slice(7) }}</td>
            <td>{{ item.clearLab.slice(11) }}</td>
            <td>{{ item.qtY1 }}</td>
            <td>{{ item.qtY2 }}</td>
            <td>
              <v-chip
                class="ma-0 rounded-pill white--text"
                :color="setIndicatorColor('co2',item.cO2)"
                label
              ><v-icon start class="px-2 ma-0">air</v-icon>
              </v-chip>
            </td>
            <td>
              <v-chip
                class="ma-0 rounded-pill white--text"
                :color="setIndicatorColor('flaming',item.flaming)"
                label
              ><v-icon start class="px-2 ma-0">local_fire_department</v-icon>
              </v-chip>
            </td>
            <td>
              <v-chip
                class="ma-0 rounded-pill white--text"
                :color="setIndicatorColor('base',item.basecoat)"
                label
              ><v-icon start class="px-2 ma-0">format_color_fill</v-icon>
              </v-chip>
            </td>
            <td>{{ setStatus(item.position) }}</td>
            <td>
              <v-icon
                start
                @click="copyDetails(item.labelID)"
              >content_copy</v-icon>
            </td>
          </tr>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@15"></v-skeleton-loader>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <expanded-element :itemExpanded = item></expanded-element>
          </td>
        </template>
      </v-data-table>
      <v-snackbar v-model="alertFlag" :color="alertColor" bottom max-width="500px" class="pa-4">
        {{ alertMessage }}
      </v-snackbar>
    </v-flex>
  </v-layout>
</template>
  <script>
  import axios from 'axios'
  import SkidProtocolExpandedElement from './SkidProtocolExpandedElement.vue';
  
  export default {
    data() {
      return {
        SkidsHeaders: [
          { text: 'Fecha', value: 'dateAndTimeIN' },
          { text: 'LabelID', value: 'labelID' },
          { text: 'Tipo', value: 'typeLab' },
          { text: 'Color', value: 'colorLab', sortable: false },
          { text: 'Primer', value: 'primerLab', sortable: false },
          { text: 'Clear', value: 'clearLab', sortable: false },
          { text: 'QTY1', value: 'qtY1', sortable: false },
          { text: 'QTY2', value: 'qtY2', sortable: false },
          { text: 'CO2', value: 'cO2', sortable: false },
          { text: 'Flaming', value: 'flaming', sortable: false },
          { text: 'Basecoat', value: 'basecoat', sortable: false },
          { text: 'Estatus', value: 'position', sortable: false },
          { text: 'Acciones', value: 'actions', sortable: false }
        ],
        SkidList: [],
        SkidProtocol: [],
        SkidDetails: [],
        searchOptions: [
          { text: 'Fecha', value: 'Date' },
          { text: 'LabelID', value: 'LabelID' },
        ],
        searchby: 'Date',
        search: '',
        isFiltered: false,
        menu: false,
        loading: false,
        alertFlag: false,
        alertMessage:'',
        alertColor:'',
        expanded: [],
      }
    },
    methods: {
      //get 1000 last process
      getLastSkids() {
        this.loading = true;
        this.isFiltered = false;
        this.search = '';
        axios.get('api/SkidProtocols/GetLastSkids')
          .then(response => {
            this.SkidList = response.data.skidList;
            this.SkidProtocol = response.data.skidProtocol;
          })
          .catch(error => {
            console.error(error);
            this.alertMessage = error.response.data;
            this.alertColor = 'warning';
            this.showAlert();
          })
          .finally(() => {
            this.loading = false;
          });
      },
      //get filtered process when put a search
      getFilteredSkids(){
        if (this.search != ''){
          this.loading = true;
          let urlComplement;
          switch(this.searchby){
            case 'Date' : urlComplement = 'GetSkidsFromDate/'; break;
            case 'LabelID' : urlComplement = 'GetSkidByLabelID/'; break;
          }
          const url = 'api/SkidProtocols/' + urlComplement + this.search;
          axios.get(url)
            .then(response => {
              this.SkidList = response.data.skidList;
              this.SkidProtocol = response.data.skidProtocol;
              this.isFiltered = true;
            })
            .catch(error => {
              console.error(error);
              this.alertMessage = error.response.data;
              this.alertColor = 'warning';
              this.showAlert();
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
      //format datetime on "Datetime of last process" column on v-data-table
      formatDatetime(datetime) {
        const date = new Date(datetime);
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        return `${formattedDate}, ${formattedTime}`;
      },
      //set status data from "Status" column on v-data-table
      setStatus(position){
        switch(position){
          case 1: return 'Loading Area LS080';
          case 2: return 'CO2/Flame LS170';
          case 3: return 'CO2/Flame LS170';
          case 4: return 'Primer LS220';
          case 5: return 'Basecoat LS380';
          case 6: return 'Clearcoat LS520';
          case 7: return 'Unloading Area LS720';
          case 8: return 'IDK';
          case 9: return '760L5140 Touchpanel';
        }
      },
      //set color to chips on "CO2", "Flaming" and "Basecoat" columns
      setIndicatorColor(type,flag){
        switch(type){
          case 'co2':
            switch(flag){
              case true: return 'rgba(73,148,236,1)';
              case false: return 'rgba(73,148,236,.5)';
              case null: return 'noinfo';
            }
          case 'flaming':
            switch(flag){
              case true: return 'rgba(241,156,56,1)';
              case false: return 'rgba(241,156,56,.5)';
              case null: return 'noinfo';
            }
          case 'base':
            switch(flag){
              case true: return 'rgba(153,59,160,1)';
              case false: return 'rgba(153,59,160,.5)';
              case null: return 'noinfo';
            }
        } 
      },
      //
      searchComprobation(){
        let search = this.search;
        switch(this.searchby){
          case 'LabelID':
            if(search.length = 8 && /^\d+$/.test(search)) return true
            else return false
        }
      },
      //copy skidprotocol to clipboard
      copyToClipboard(itemsArray) {
        let plainText = '';
        console.log(itemsArray);
        const headers = Object.keys(itemsArray[0]);
        const headersRow = headers.join('\t') + '\n';
        plainText += headersRow;
  
        itemsArray.forEach(skid => {
          const keys = Object.keys(skid);
          const textRow = keys.map(key => skid[key]).join('\t');
          plainText += textRow + '\n';
        });
    
        navigator.clipboard.writeText(plainText)
          .then(() => {
            this.alertMessage = 'Copiado al portapapeles';
            this.alertColor = 'success';
            this.showAlert();
          })
          .catch(error => {
            console.error(error);
            this.alertMessage = 'Error al copiar al portapapeles';
            this.alertColor = 'warning';
            this.showAlert();
          })
        ;
      },
      copyDetails(labelID) {
        const url = `api/SkidProtocols/GetSkidDetails/${labelID}`; // Construir la URL con el labelID
        axios.get(url)
          .then(response => {
            this.SkidDetails = response.data;
            this.copyToClipboard(this.SkidDetails); 
          })
          .catch(error => {
            console.error(error);
            this.alertMessage = 'Error al copiar al portapapeles';
            this.alertColor = 'warning';
            this.showAlert();
          })
        ;
      },
      showAlert(){
        this.alertFlag = true;
        setTimeout(() => {
          this.alertFlag = false;
        }, 5000);
      },
    },
    components:{
      'expanded-element': SkidProtocolExpandedElement,
    },
    created() {
      this.getLastSkids();
    }
  }
  </script>