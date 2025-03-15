function titleToUrl(title:string) {
    return title
        .toLowerCase()                
        .trim()                        
        .replace(/\s+/g, '-')         
        .replace(/[^\w-]/g, '');       
}
