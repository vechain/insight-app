import { Line } from 'vue-chartjs'
import { Vue, Component, Watch, Emit } from 'vue-property-decorator'

@Component({
    extends: Line
} as any)
export default class BandwidthChart extends Vue<Line> {
    private samples = null as GasLimitSample[] | null
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
            const date = new Date(s.ts * 1000)
            return `${date.getHours()}`
        })

        const high = newVal.reduce((v, s) => {
            return s.gl > v ? s.gl : v
        }, 0)
        const low = newVal.reduce((v, s) => {
            return s.gl < v ? s.gl : v
        }, high)

        const mid = (high + low) / 2

        const refLineStyle = {
            fill: false,
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 0,
            pointHitRadius: 0,
        }

        this.renderChart({
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
        }, {
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
                            display: true,
                            labelString: 'Hours',
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
                            stepSize: mid / 10
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
                            return `${tooltipItem[0].xLabel}:00`
                        }
                    }
                }
            })
    }

    @Watch('$store.state.chainStatus')
    private async reload() {
        try {
            this.samples = await getGasLimits()
            this.emitLoaded(true)
        } catch (err) {
            console.warn(err)
        }
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

function samplePoints() {
    const points = [] as number[]
    const gap = 360
    const headNumber = connex.thor.status.head.number
    const p = headNumber - headNumber % gap
    for (let i = 0; i < 24; i++) {
        points.unshift(p - i * gap)
    }
    return points
}

async function getGasLimits() {
    let savedSamples: GasLimitSample[]
    try {
        savedSamples = JSON.parse(localStorage.getItem(gasLimitSamplesKey) || '[]')
    } catch (err) {
        console.warn('load saved gas limit samples')
        savedSamples = []
    }

    const samples = await Promise.all(samplePoints().map(n => {
        const i = savedSamples.find(s => s.n === n)
        if (i) {
            return i
        } else {
            return connex.thor.block(n).get().then(b => ({
                n: b!.number,
                ts: b!.timestamp,
                gl: b!.gasLimit
            }))
        }
    }))
    localStorage.setItem(gasLimitSamplesKey, JSON.stringify(samples))
    return samples
}

const gasLimitSamplesKey = 'gasLimitSamples'

type GasLimitSample = {
    n: number
    ts: number
    gl: number
}
