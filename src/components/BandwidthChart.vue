<template>
    <canvas ref="canvas" />
</template>
<script lang="ts">
import { Vue, Component, Watch, Emit } from 'vue-property-decorator'
import { Chart } from 'chart.js'

@Component
export default class BandwidthChart extends Vue {
    private samples = null as GasLimitSample[] | null
    private chart?: Chart
    private created() {
        this.reload()
    }
    @Emit('loaded')
    private emitLoaded(v: boolean) { }

    @Watch('samples')
    private renderSamples(newVal: GasLimitSample[], oldVal: GasLimitSample[]) {
        if (!newVal) {
            return
        }
        if (oldVal) {
            if (JSON.stringify(newVal) === JSON.stringify(oldVal)) {
                return
            }
        }

        const labels = newVal.map(s => {
            const date = new Date((s.ts) * 1000)
            return `${date.toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit' })}`
        })

        const high = newVal.reduce((v, s) => {
            return s.gl > v ? s.gl : v
        }, 0) * 1.05

        const low = newVal.reduce((v, s) => {
            return s.gl < v ? s.gl : v
        }, high) * 0.95

        const mid = (high + low) / 2

        const refLineStyle = {
            fill: false,
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 0,
            pointHitRadius: 0,
        }

        const data: Chart.ChartData = {
            labels,
            datasets: [{
                ...refLineStyle,
                label: 'Mid',
                data: newVal.map(() => mid / 10),
                borderDash: [3, 3],
            }, {
                ...refLineStyle,
                label: 'High',
                data: newVal.map(() => high / 10),
                borderDash: [6, 2],
            },
            {
                ...refLineStyle,
                label: 'Low',
                data: newVal.map(() => low / 10),
                borderDash: [6, 2],
            }, {
                label: 'Bandwidth',
                data: newVal.map(s => s.gl / 10),
                fill: false,
                pointRadius: 0,
                borderColor: '#007bff',
                pointHitRadius: 8,
                borderWidth: 2,
            }]
        }

        const options: Chart.ChartOptions = {
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        fontSize: 8,
                    },
                    scaleLabel: {
                        display: false,
                        fontSize: 8,
                    },
                }],
                yAxes: [{
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        fontSize: 8,
                        // Include a dollar sign in the ticks
                        callback: (value: number) => {
                            return prettyN(value) + 'gps'
                        },
                        max: high / 10,
                        min: low / 10,
                        stepSize: (high - low) / 2 / 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Bandwidth',
                        fontSize: 8,
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        return prettyN(tooltipItem.yLabel) + 'gps'
                    },
                    title: (tooltipItem: any) => {
                        return `${tooltipItem[0].xLabel}`
                    }
                }
            }
        }

        if (this.chart) {
            this.chart.data = data
            this.chart.options = options
            this.chart.update()
        } else {
            this.chart = new Chart(this.$refs.canvas as any, { type: 'line', data, options })
        }
    }

    @Watch('$store.state.chainStatus')
    private async reload() {
        try {
            this.samples = await this.getGasLimits()
            this.emitLoaded(true)
        } catch (err) {
            console.warn(err)
        }
    }

    private samplePoints() {
        const points = [] as number[]
        const gap = 720
        const head = this.$connex.thor.status.head

        const p = head.number - Math.floor((head.timestamp % 600) / 10) // every 10 min

        for (let i = 0; i < 12; i++) {
            points.unshift(p - i * gap)
        }
        return points.filter(n => n >= 0)
    }

    private async  getGasLimits() {
        let savedSamples: GasLimitSample[]
        try {
            savedSamples = JSON.parse(localStorage.getItem(this.$connex.thor.genesis.id + gasLimitSamplesKey) || '[]')
        } catch (err) {
            console.warn('load saved gas limit samples')
            savedSamples = []
        }

        const samples = await Promise.all(this.samplePoints().map(n => {
            const i = savedSamples.find(s => s.n === n)
            if (i) {
                return i
            } else {
                return this.$connex.thor.block(n).get().then(b => ({
                    n: b!.number,
                    ts: b!.timestamp,
                    gl: b!.gasLimit
                }))
            }
        }))
        localStorage.setItem(this.$connex.thor.genesis.id + gasLimitSamplesKey, JSON.stringify(samples))
        return samples
    }

}

function prettyN(n: number) {
    if (n >= 1000000) {
        return `${(n / 1000000).toFixed(2)}M`
    }
    if (n >= 1000) {
        return `${(n / 1000).toFixed(2)}K`
    }
    return `${n}`
}

const gasLimitSamplesKey = 'gasLimitSamples'

type GasLimitSample = {
    n: number
    ts: number
    gl: number
}

</script>