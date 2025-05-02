export function getNav(url){
    if (url === '/wp-admin' || url === '/wp-admin/') return 'nav';
    return (url.includes('wp-admin') ? 'navAdmin' : 'nav')
}