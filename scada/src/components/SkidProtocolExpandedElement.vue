<template>
    <v-flex>
      <v-row>
        <v-col cols="6" class="d-flex flex-column">
          <v-card class="mt-6 mb-1 ml-2 mr-1 fill-height">
            <v-card-title class="text-h5 mt-2 ml-2">CO2 y Flama</v-card-title>
            <v-divider class="mx-5 my-1"></v-divider>
            <v-card-text>
              <v-row justify="center">
                <v-chip
                  class="ma-2 rounded-pill white--text"
                  :color="setBypassChipColor(3, 'bypassOnChgCO2FL')"
                  label
                >
                  <v-icon start class="mx-2">flag</v-icon>
                  Bypass
                </v-chip>
              </v-row>
              <v-row :cols="12" justify="center"><p class="text-h7 pa-0 ma-0" >Flameo</p></v-row>
              <v-row justify="center">
                <v-chip
                  class="ma-2 rounded-pill white--text"
                  :color="setFlagChipColor(3, 'flagR1')"
                  label
                >
                  <v-icon start class="mx-2">flag</v-icon>
                  Flaming Robot 1
                </v-chip>
                <v-chip
                  class="ma-2 rounded-pill white--text"
                  :color="setFlagChipColor(3, 'flagR2')"
                  label
                >
                  <v-icon start class="mx-2">flag</v-icon>
                  Flaming Robot 2
                </v-chip>
              </v-row>
              <v-row :cols="12" justify="center"><p class="text-h7 pa-0 ma-0" >CO2</p></v-row>
              <v-row justify="center">
                <v-chip
                  class="ma-2 rounded-pill white--text"
                  :color="setFlagChipColor(2, 'flagR1')"
                  label
                >
                  <v-icon start class="mx-2">flag</v-icon>
                  CO2 Robot 1
                </v-chip>
                <v-chip
                  class="ma-2 rounded-pill white--text"
                  color="info"
                  label
                >
                  <v-icon start class="mx-2">co2</v-icon>
                  {{ getValueFromItem(2, 'cO2_R1') }} cc
                </v-chip>
              </v-row>
              <v-row justify="center">
                <v-chip
                  class="ma-2 rounded-pill white--text"
                  :color="setFlagChipColor(2, 'flagR2')"
                  label
                >
                  <v-icon start class="mx-2">flag</v-icon>
                  CO2 Robot 2
                </v-chip>
                <v-chip
                  class="ma-2 rounded-pill white--text"
                  color="info"
                  label
                >
                  <v-icon start class="mx-2">co2</v-icon>
                  {{ getValueFromItem(2, 'cO2_R2') }} cc
                </v-chip>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" class="d-flex flex-column">
          <v-card class="mt-6 mb-1 ml-1 mr-2 d-flex flex-column fill-height">
            <v-card-title class="text-h5 mt-2 ml-2">Primer</v-card-title>
            <v-divider class="mx-5 my-1"></v-divider>
            <v-card-text>
              <v-row justify="center">
                <v-col>
                  <v-chip class="ma-2 rounded-pill white--text" :color="setBypassChipColor(4, 'bypassOnlChgPR')">
                    <v-icon start class="mx-2">flag</v-icon>
                    Bypass
                  </v-chip>
                  <v-chip class="ma-2 rounded-pill white--text " color="info">
                    <v-icon start class="mx-2">device_thermostat</v-icon>
                    Temperatura de cabina: {{ getValueFromItem(4, 'tempBooth') }}°
                  </v-chip>
                  <v-chip class="ma-2 rounded-pill white--text" color="info">
                    <v-icon start class="mx-2">water_drop</v-icon>
                    Humedad de cabina: {{ getValueFromItem(4, 'humBoothCC') }}%
                  </v-chip>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-data-table
                    :headers="PrimerClearDetailsHeaders"                
                    :loading="loading"
                    hide-default-footer
                  >
                    <template v-slot:body="{items}">
                      <tbody>
                        <tr v-for="index in 2" :key="index">
                          <td>
                            <v-chip class="ma-2 rounded-pill white--text" :color="setFlagChipColor(4,'flagR'+index)">
                              <v-icon start class="mx-2">flag</v-icon>
                              Robot {{ index }}
                            </v-chip>
                          </td>
                          <td>{{getValueFromItem(4, 'resinR'+index)}}</td>
                          <td>{{getValueFromItem(4, 'hardenerR'+index)}}</td>
                          <td>{{getValueFromItem(4, 'cleaning_R'+index)}}</td>
                          <td>{{getValueFromItem(4, 'colorChg_R'+index)}}</td>
                        </tr>
                        </tbody>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="d-flex flex-column">
          <v-card class="mt-1 mb-6 ml-2 mr-1 fill-height">
            <v-card-title class="text-h5 mt-2 ml-2">Basecoat</v-card-title>
            <v-divider class="mx-5 my-1"></v-divider>
            <v-card-text>
              <v-row justify="center">
                <v-col>
                  <v-chip class="ma-2 rounded-pill white--text" :color="setBypassChipColor(5, 'bypassOnChgBC')">
                    <v-icon start class="mx-2">flag</v-icon>
                    Bypass
                  </v-chip>
                  <v-chip class="ma-2 rounded-pill white--text " color="info">
                    <v-icon start class="mx-2">device_thermostat</v-icon>
                    Temperatura de cabina: {{ getValueFromItem(5, 'tempBooth') }}°
                  </v-chip>
                  <v-chip class="ma-2 rounded-pill white--text" color="info">
                    <v-icon start class="mx-2">water_drop</v-icon>
                    Humedad de cabina:  {{ getValueFromItem(5, 'humBoothCC') }}%
                  </v-chip>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-data-table
                    :headers="BaseDetailsHeaders"                
                    :loading="loading"
                    hide-default-footer
                    dense
                  >
                    <template v-slot:body="{items}">
                      <tbody>
                        <tr v-for="index in 6" :key="index">
                          <td>
                            <v-chip class="ma-2 rounded-pill white--text" :color="setFlagChipColor(5, 'flagR'+index)">
                              <v-icon start class="mx-2">flag</v-icon>
                              Robot {{ index }}
                            </v-chip>
                          </td>
                          <td>{{getValueFromItem(5, 'resinR'+index)}}</td>
                          <td>{{getValueFromItem(5, 'cleaning_R'+index)}}</td>
                          <td>{{getValueFromItem(5, 'colorChg_R'+index)}}</td>
                        </tr>
                        </tbody>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" class="d-flex flex-column">
          <v-card class="mt-1 mb-6 ml-1 mr-2 d-flex flex-column fill-height">
            <v-card-title class="text-h5 mt-2 ml-2">Clearcoat</v-card-title>
            <v-divider class="mx-5 my-1"></v-divider>
            <v-card-text>
              <v-row justify="center">
                <v-col>
                  <v-chip class="ma-2 rounded-pill white--text" :color="setBypassChipColor(6, 'bypassOnChgCC')">
                    <v-icon start class="mx-2">flag</v-icon>
                    Bypass
                  </v-chip>
                  <v-chip class="ma-2 rounded-pill white--text " color="info">
                    <v-icon start class="mx-2">device_thermostat</v-icon>
                    Temperatura en cabina: {{ getValueFromItem(6, 'tempBooth') }}°
                  </v-chip>
                  <v-chip class="ma-2 rounded-pill white--text" color="info">
                    <v-icon start class="mx-2">water_drop</v-icon>
                    Humedad en cabina:  {{ getValueFromItem(6, 'humBoothCC') }}%
                  </v-chip>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-data-table
                    :headers="PrimerClearDetailsHeaders"                
                    :loading="loading"
                    hide-default-footer
                    dense
                  >
                    <template v-slot:body="{items}">
                      <tbody>
                        <tr v-for="index in 4" :key="index">
                          <td>
                            <v-chip class="ma-2 rounded-pill white--text" :color="setFlagChipColor(6, 'flagR'+index)">
                              <v-icon start class="mx-2">flag</v-icon>
                              Robot {{ index }}
                            </v-chip>
                          </td>
                          <td>{{getValueFromItem(6, 'resinR'+index)}}</td>
                          <td>{{getValueFromItem(6, 'hardenerR'+index)}}</td>
                          <td>{{getValueFromItem(6, 'cleaning_R'+index)}}</td>
                          <td>{{getValueFromItem(6, 'colorChg_R'+index)}}</td>
                        </tr>
                        </tbody>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>
  </template>
  <script>
  import axios from 'axios'
  
  export default {
    props: ['itemExpanded'],
    data() {
      return {
        BaseDetailsHeaders: [
          {text: '', sortable: false},
          {text: 'Resina (cc)', sortable: false},
          {text: 'Cleaning (cc)', sortable: false},
          {text: 'Color Change (cc)', sortable: false},
        ],
        PrimerClearDetailsHeaders: [
          {text: '', sortable: false},
          {text: 'Resina (cc)', sortable: false},
          {text: 'Hardener (cc)', sortable: false},
          {text: 'Cleaning (cc)', sortable: false},
          {text: 'Color Change (cc)', sortable: false},
        ],
        loading: false,
        SkidDetails: [],
        labelID:''
      }
    },
    methods: {
      loadSkidDetails(item) {
        this.loading = true;
        const url = `api/SkidProtocols/GetSkidDetails/${item.labelID}`; // Construir la URL con el labelID
        axios.get(url)
          .then(response => {
            this.SkidDetails = response.data;
          })
          .catch(error => {
            console.error(error);
          })
          .finally(() => {
            this.loading = false;
          }
          );
      },
      getValueFromItem(position, variable) {
        const element = this.SkidDetails.find(item => item.position === position);
        if (element) {
          switch(element[variable]){
              case true: return true;
              case false: return false;
              case null: return '-';
              case 0: return '0';
              default: return element[variable];
          }
        }
        else{
          return '-';
        }
      },
      setFlagChipColor(position, variable){
        var flagValue = this.getValueFromItem(position, variable);
        switch (flagValue) {
          case true: return 'ready';
          case false:
            switch (position){
              case 2:
                if(this.itemExpanded.cO2) return 'fault'
                else return 'norequired'
              case 3:
                if(this.itemExpanded.flaming) return 'fault'
                else return 'norequired'
              case 5:
                if(this.itemExpanded.basecoat) return 'fault'
                else return 'norequired'
              default: return 'fault'
            }
          default: return 'noinfo';
        }
      },
      setBypassChipColor(position, variable){
        var flagValue = this.getValueFromItem(position, variable);
        switch (flagValue) {
          case true: return 'bypass';
          case false: return 'nobypass';
          default: return 'noinfo';
        }
      },
    },
    watch:{
      itemExpanded: function(newItemExpanded){this.loadSkidDetails(newItemExpanded);}
    },
    mounted() {
      this.loadSkidDetails(this.itemExpanded);
    }
  }
  </script>