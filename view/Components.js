import { CanvasGraphicRenderer } from "../Canvas.js";
import html, { Component } from "../preact/index.js"

export function Checkbox({
    id,
    text,
    title,
    checked,
    color,
    onChange,
}) {
    const style = {
        wrapper: {
            display: 'flex',
            alignItems: 'center',
        },
        label: {
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
        },
        colorBox: {
            width: '1em',
            height: '1em',
            marginRight: '0.4rem',
            backgroundColor: color,
        }
    }

    const handleChange = (e) => {
        onChange(+e.target.checked);
    }

    return html`
        <div style=${style.wrapper}>
            <input checked=${checked} onchange=${handleChange} id=${id} type="checkbox"></input>
            <label style=${style.label} for=${id} title=${title}>
                ${color && html`<div style=${style.colorBox}>
                </div>`}
                ${text}
            </label>
        </div>
    `
}

export function InputDisplay({ value, degree, maxWidth }) {
    const style = {
        input: {
            maxWidth: maxWidth ? maxWidth : '40px',
            height: '12px',
            fontSize: '14px',
        }
    }
    if (degree) {
        value += '°'
    }

    return html`
        <input style=${style.input} value="${value}" readonly/>
    `
}

export function Title({ title, text, fontSize, bold }) {
    const style = {
        span: {
            cursor: 'default',
            marginRight: '0.2rem',
            marginLeft: '0.2rem',
            fontWeight: bold && 'bold',
            fontSize
        },
    }

    return html`
        <span style=${style.span} title="${title}">${text}</span>
    `
}

export function Details({ summary, children, open=true }) { 
    const style = {
        summary: {
            fontSize: '1.2em',
            cursor: "pointer",
        },
        content: {
            marginLeft: '16px'
        }
    }

    return html`
        <details style=${style.details} open=${open}>
            <summary style=${style.summary}>${summary}</summary>
            <div style=${style.content}>
                ${children}
            </div>
        </details>`
}

export function Table({
    tableBody,
}) {
    const style = {
        table: {
            marginTop: '0.4em',
            marginBottom: '0.4em',
        }
    }

    return html`
        <table style=${style.table}>
            <tbody>
                ${tableBody.map(rows => {
                    return html`<tr>
                        ${rows.map(cell => {
                            return html`<td>${cell}</td>`
                        })}
                    </tr>`
                })}
            </tbody>
        </table>`
}

export function CanvasComponent({
    id,
    onPauseResume=()=>{},
    onResetVehicle=()=>{},
    isPaused,
}) {
    const pauseResume = isPaused ? 'Resume' : 'Pause';

    const style = {
        canvasWrapper: {
            display: 'flex',
            flexDirection: 'column'
        },
        canvas: { 
            border: 'dashed 1px',
        },
        actions: {
            alignItems: 'center',
            alignSelf: 'end',
            width: '180px',
            margin: '16px', 
            display: 'flex',
            justifyContent: 'space-between',
        },
        resetVehicle: {
            height: '40px',
            display: 'flex',
            alignItems: 'center',
        },
        pauseResume: {
            height: '40px',
        }
    }

    return html`
        <div class="canvasWrapper" style=${style.canvasWrapper}>
            <canvas id=${id} style=${style.canvas}></canvas>
            <div style=${style.actions}>
                <button onclick=${onResetVehicle} style=${style.resetVehicle}>Reset vehicle</button>
                <button onclick=${onPauseResume} style=${style.pauseResume}>${pauseResume}</button>
            </div>
        </div>
    `
}

export function Select({
    options=[],
    onChange,
    defaultValue
}) {
    const handleChange = (e) => onChange(e.target.value);
    return html`
        <select value=${defaultValue} onchange=${handleChange}>
            ${options.map((el, i) => {
                return html`<option value=${i}>${el}</option>`
            })}
        </select>  
    `
}

export class CanvasGraphic extends Component {
    constructor(props) {
      super(props);
      this.actions = {
        onScaleX: () => {},
        onScaleY: () => {},
      }

    }

    init(props) {
        const canvas = document.getElementById(props.id);
        const cgr = new CanvasGraphicRenderer(canvas, props.fx, props.opts);
        this.actions.onScaleX = cgr.scaleX;
        this.actions.onScaleY = cgr.scaleY;
    }

    componentDidMount() {
        this.init(this.props);
    }

    shouldComponentUpdate(p) {
        return p.id !== this.props.id
    }
    
    componentDidUpdate() {
        this.init(this.props);
    }


    handleScale = (e) => {
        if (e.target.dataset.x) {
          this.actions.onScaleX(!!e.target.dataset.add)
        }
  
        if (e.target.dataset.y) {
          this.actions.onScaleY(!!e.target.dataset.add)
        }
    }
  
    render({ id, xTitle, yTitle, width, height }) {
      return html`
          <div>
              <style>
                .btn {
                    margin: 6px
                } 
                #${id}wrapper {
                    position: relative;
                    margin-top: 18px;
                }
                #${id}wrapper:before { 
                  content: '${yTitle}';
                  position: absolute;
                  top: -22px;
                  font-size: 16px;
                }
                #${id}wrapper:after { 
                  content: '${xTitle}';
                  position: absolute;
                  right: 6px;
                  bottom: -19px;
                  font-size: 16px;
                }
                </style>
                <div id=${id}wrapper><canvas width=${width} height=${height} style="border: 1px solid;" id=${id}></canvas></div>
              <div>
                  <button class="btn" style="width: 25px; height: 25px;" data-y data-add onclick=${this.handleScale} >+</button>
                      y
                  <button class="btn" style="margin-right: 10px; width: 25px; height: 25px;" data-y onclick=${this.handleScale}>-</button>
                    zoom
                  <button class="btn" style="margin-left: 10px; width: 25px; height: 25px;" data-x data-add onclick=${this.handleScale}>+</button>
                      x
                  <button class="btn" style="width: 25px; height: 25px;" data-x onclick=${this.handleScale}>-</button>
              </div>
          </div>
      `
    }
}
