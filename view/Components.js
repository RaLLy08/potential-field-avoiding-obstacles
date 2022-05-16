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

export function InputDisplay({ value, degree }) {
    const style = {
        input: {
            maxWidth: '40px'
        }
    }
    if (degree) {
        value += '°'
    }

    return html`
        <input style=${style.input} value="${value}" readonly/>
    `
}

export function Title({ title, text }) {
    const style = {
        span: {
            cursor: 'default',
            marginRight: '0.2rem',
            marginLeft: '0.2rem',
        },
    }

    return html`
        <span style=${style.span} title="${title}">${text}</span>
    `
}

export function Details({ summary, children, open=true }) { 
    const style = {
        details: {
            marginLeft: "0.8em",
        },
        summary: {
            fontSize: '1.2em',
            cursor: "pointer",
        },
    }

    return html`
        <details style=${style.details} open=${open}>
            <summary style=${style.summary}>${summary}</summary>
            ${children}
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
            display: 'flex',
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
      this.state = {
        onScaleX: () => {},
        onScaleY: () => {},
      }
    }
    componentDidMount() {
      const canvas = document.getElementById(this.props.id);
      const cgr = new CanvasGraphicRenderer(canvas, this.props.fx, this.props.opts);
  
      this.state.onScaleX = cgr.scaleX;
      this.state.onScaleY = cgr.scaleY;
    }
  
    handleScale = (e) => {
        if (e.target.dataset.x) {
          this.state.onScaleX(!!e.target.dataset.add)
        }
  
        if (e.target.dataset.y) {
          this.state.onScaleY(!!e.target.dataset.add)
        }
    }
  
    render({ id, xTitle, yTitle, width, height }) {
      return html`
          <div>
              <style>
                #${id}wrapper {
                    position: relative;
                    margin-top: 18px;
                }
                #${id}wrapper:before { 
                  content: '${xTitle}';
                  position: absolute;
                  top: -22px;
                  font-size: 20px;
                }
                #${id}wrapper:after { 
                  content: '${yTitle}';
                  position: absolute;
                  right: 6px;
                  bottom: -19px;
                  font-size: 20px;
                }
                </style>
                <div id=${id}wrapper><canvas width=${width} height=${height} style="border: 1px solid;" id=${id}></canvas></div>
              <div>
                  <button style="width: 30px; height: 25px;" data-y data-add onclick=${this.handleScale} >+</button>
                      y
                  <button style="margin-right: 30px; width: 30px; height: 25px;" data-y onclick=${this.handleScale}>-</button>
                  <button style="width: 30px; height: 25px;" data-x data-add onclick=${this.handleScale}>+</button>
                      x
                  <button style="width: 30px; height: 25px;" data-x onclick=${this.handleScale}>-</button>
              </div>
          </div>
      `
    }
}
