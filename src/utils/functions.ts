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
    console.log(result)
    let words = result.map((word:string)=>{
        if(URLtoTXTcases[word]){
            word = URLtoTXTcases[word];
            console.log("yep")
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
        console.log("yep")
    }
    return text
}

export { titleToUrl, UrltoReadableText, shortenAP }
