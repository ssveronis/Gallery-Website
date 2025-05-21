export function getNav(url){
    if (url === '/admin' || url === '/admin/') return 'nav';
    return (url.includes('admin') ? 'navAdmin' : 'nav')
}

export function isEq(par1, par2) {
    console.log(par1, par2)
    return par1 === par2;
}