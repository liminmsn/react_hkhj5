export function setUrlVar(name: string, val: string) {
    document.body.style.setProperty(name, `url('${val}')`)
}