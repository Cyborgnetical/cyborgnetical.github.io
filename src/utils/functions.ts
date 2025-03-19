function titleToUrl(title:string):string {
    return title
        .toLowerCase()                
        .trim()                        
        .replace(/\s+/g, '-')         
        .replace(/[^\w-]/g, '');       
}

const URLtoTXTcases:Record<string,string> = {
    "ap":"AP"
}

// I cooked with this
function UrltoReadableText(url:string){
    let result:string[] = url.split("-");
    let words = result.map((word:string)=>{
        if(URLtoTXTcases[word]){
            word = URLtoTXTcases[word];
        }else{
            word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
    })

    return words.join(" ");
}

const shortenAPCases:Record<string,string> = {
    "AP World History": "APWH"
}
function shortenAP(text:string){
    if(shortenAPCases[text]){
        text = shortenAPCases[text];
    }
    return text
}

export { titleToUrl, UrltoReadableText, shortenAP }
