export default function (document: Document) {
    const script_text = document.querySelector('.player-wrapper script')?.textContent || '';
    const fun = Function(`
        ${script_text}
        return now;`)
    return fun()  
}