export function getNav(url){
    if (url === '/admin' || url === '/admin/') return 'nav';
    return (url.includes('admin') ? 'navAdmin' : 'nav')
}