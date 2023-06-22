<template>
  <v-container fluid>
    <v-row class="mb-5">
      <v-col cols="12">
        <h3 class="text-center">Node {{ nodeId }}</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-tabs
        v-model="tab"
        background-color="transparent"
        grow
        @change="handleTabChange"
      >
        <v-tab v-for="item in items" :key="item.key">
          {{ item.title }}
        </v-tab>
      </v-tabs>

      <v-tabs-items
        v-model="tab"
        class="text-center pa-5"
        style="width: 100%; height: max-content"
      >
        <v-tab-item v-for="item in items" :key="item.key">
          <v-select
            v-show="tab"
            v-model="measurementSelect"
            :items="measurements"
            style="width: fit-content"
            label="Measurement ID"
            required
            class="text-center mx-auto"
            @change="handleMeasurementChange"
          />
          <v-card flat>
            <v-row>
              <v-col cols="12" align-self="center">
                <LineChart
                  v-if="!error.length || chartData.datasets.length"
                  :chart-options="chartOptions"
                  :chart-data="chartData"
                  chart-id="lineChart"
                />
                <div v-else class="text-center grey--text">
                  {{ error.length ? error : 'There are currently no data!' }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-tab-item>
        <v-overlay :value="loading">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
      </v-tabs-items>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async asyncData({ params }) {
    const nodeId = await params.nodeId
    const tab = null
    const items = [
      {
        title: 'Root Mean Square',
        key: 'RMS',
        xAxis: 'Measurement Id',
        yAxis: 'Value'
      },
      {
        title: 'Power Spectral Density',
        key: 'PSD',
        xAxis: 'Frequency(Hz)',
        yAxis: 'Value'
      },
      {
        title: 'Vibration Time Series',
        key: 'VDT',
        xAxis: 'Time',
        yAxis: 'Value'
      }
    ]
    const dataAPIStructure = {
      VDT: {
        label: 'time',
        datasets: ['x', 'y', 'z']
      },
      PSD: {
        label: 'frequency',
        datasets: ['psd_value']
      },
      RMS: {
        label: 'measurement',
        datasets: ['x', 'y', 'z']
      }
    }
    const measurements = []
    const measurementSelect = null
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      pointStyle: 'circle',
      barThickness: 3,
      hoverOffset: 4,
      plugins: {
        title: {
          display: true,
          text: '',
          fontSize: 40,
          fontColor: '#6b7280',
          align: 'center'
        },
        legend: {
          display: true,
          position: 'bottom',
          align: 'center'
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: '',
            align: 'center'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: '',
            align: 'center'
          }
        }
      }
    }
    const chartData = { labels: [], datasets: [] }
    const loading = false
    const activeData = {}
    const error = ''
    return {
      nodeId,
      dataAPIStructure,
      tab,
      items,
      measurements,
      measurementSelect,
      chartOptions,
      chartData,
      loading,
      activeData,
      error
    }
  },
  methods: {
    handleTabChange() {
      this.loading = true
      this.error = ''
      this.measurementSelect = null
      this.chartOptions.plugins.title.text = this.items[this.tab].title
      this.chartOptions.scales.x.title.text = this.items[this.tab].xAxis
      this.chartOptions.scales.y.title.text = this.items[this.tab].yAxis
      this.chartData = { labels: [], datasets: [] }
      this.chartOptions.elements = {}
      if (this.tab === 0) {
        this.handleRMS()
      } else if (this.tab === 1) {
        this.handlePSD()
      } else if (this.tab === 2) {
        this.handleVDT()
      }
    },
    handleRMS() {
      this.$axios
        .$get('/analytics/rms')
        .then((result) => {
          this.chartData.labels = Object.keys(result[this.nodeId])
          this.chartData.datasets = []
          const colors = ['red', 'blue', 'green']
          this.dataAPIStructure.RMS.datasets.forEach((name, i) => {
            this.chartData.datasets.push({
              label: name,
              backgroundColor: colors[i],
              borderColor: colors[i],
              borderWidth: '0',
              borderJoinStyle: 'round',
              data: Object.values(result[this.nodeId]).map((val) => val[name])
            })
          })
        })
        .catch((error) => {
          this.error = error.toString()
        })
        .finally(() => {
          this.loading = false
        })
    },
    handlePSD() {
      this.$axios
        .$get('/analytics/psd')
        .then((result) => {
          this.measurements = Object.keys(result[this.nodeId])
          this.activeData.frequency = {}
          this.activeData.psd_value = {}
          this.activeData.index = {}
          for (const [mId, m] of Object.entries(result[this.nodeId])) {
            this.activeData.frequency[mId] = []
            this.activeData.psd_value[mId] = []
            this.activeData.index[mId] = {}
            m.sort((a, b) => a.frequency > b.frequency)
            Object.values(m).forEach((mdata, index) => {
              this.activeData.frequency[mId].push(mdata.frequency)
              this.activeData.psd_value[mId].push(mdata.psd_value)
              this.activeData.index[mId][index] = mdata.frequency
            })
          }
          this.$axios.$get('/analytics/peaks').then((peakResult) => {
            this.activeData.peaks = {}
            for (const [mId, m] of Object.entries(peakResult[this.nodeId])) {
              this.activeData.peaks[mId] = {}
              m.forEach((mdata) => {
                this.activeData.peaks[mId][mdata.frequency] = true
              })
            }
          })
        })
        .catch((error) => {
          this.error = error.toString()
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleVDT() {
      this.$axios
        .$get(`/data/nodeData/${this.nodeId}`)
        .then((result) => {
          this.measurements = Object.keys(result[this.nodeId])
          this.activeData.time = {}
          this.activeData.x = {}
          this.activeData.y = {}
          this.activeData.z = {}
          for (const [mId, m] of Object.entries(result[this.nodeId])) {
            this.activeData.time[mId] = []
            this.activeData.x[mId] = []
            this.activeData.y[mId] = []
            this.activeData.z[mId] = []
            m.sort((a, b) => a.time > b.time)
            Object.values(m).forEach((mdata) => {
              this.activeData.time[mId].push(
                new Date(mdata.time * 1000).toLocaleString()
              )
              this.activeData.x[mId].push(mdata.x)
              this.activeData.y[mId].push(mdata.y)
              this.activeData.z[mId].push(mdata.z)
            })
          }
        })
        .catch((error) => {
          this.error = error.toString()
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleMeasurementChange() {
      const chartDataStructure = this.dataAPIStructure[this.items[this.tab].key]
      this.chartData.labels =
        this.activeData[chartDataStructure.label][this.measurementSelect]
      this.chartData.datasets = []
      const colors = ['red', 'blue', 'green']
      chartDataStructure.datasets.forEach((name, i) => {
        this.chartData.datasets.push({
          label: name,
          backgroundColor: colors[i],
          borderColor: colors[i],
          borderWidth: '0',
          borderJoinStyle: 'round',
          data: this.activeData[name][this.measurementSelect]
        })
      })
      if (this.items[this.tab].key === 'PSD') {
        this.chartOptions.elements = {
          point: {
            radius: (context) => {
              const index = context.dataIndex
              return this.activeData.peaks[this.measurementSelect][
                this.activeData.index[this.measurementSelect][index]
              ]
                ? 6
                : 2
            },
            display: true
          }
        }
      }
    }
  }
}
</script>
