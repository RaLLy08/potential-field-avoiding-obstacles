import html from "../preact/index.js"

export function CheckboxWithColor({
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
                <div style=${style.colorBox}>
                </div>
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

export function Details({ summary, children }) { 
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
        <details style=${style.details} open>
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
    const pauseResume = isPaused ? 'Pause' : 'Resume';

    const style = {
        canvasWrapper: {
            transform: 'translate(-50%, -50%)', 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            display: 'flex',
        },
        canvas: { 
            border: 'dashed 1px',
        },
        resetVehicle: {
            cursor: 'pointer',
            position: 'absolute',
            bottom: '-40px',
            right: 0,
        },
        pauseResume: {
            cursor: 'pointer',
            position: 'absolute',
            bottom: '-40px',
            right: '110px',
        }
    }

    return html`
        <div class="canvasWrapper" style=${style.canvasWrapper}>
            <canvas id=${id} style=${style.canvas}></canvas>
            <button onclick=${onResetVehicle} style=${style.resetVehicle}>Reset vehicle</button>
            <button onclick=${onPauseResume} style=${style.pauseResume}>${pauseResume}</button>
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