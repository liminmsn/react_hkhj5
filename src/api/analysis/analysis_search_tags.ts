export default function (document: Document) {
    return Array.from(document.querySelectorAll('.search-tag a') || []).map(a => {
        return {
            tag: a.textContent || '-',
            url: a.getAttribute('href') || '-'
        }
    })
}