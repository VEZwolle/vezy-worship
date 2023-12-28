export function CleanText (content) {
  // <\/?([biuspmal]*?)>)*? = </b> || </i> || </u> || </sup> || </small> || <b> || <i> || <u> || <sup> || <small>
  // = (<\/?b>)|(<\/?i>)|(<\/?u>)|(<\/?sup>)|(<\/?small>)*?
  // <\/?([briuspmal]*?)>)*? = <br> || </b> || </i> || </u> || </sup> || </small> || <b> || <i> || <u> || <sup> || <small>
  let text = content
    .replace(/<\/?span(.*?)>/gi, '') //    verwijder alle <span ...> & </span> elementen
    .replace(/ style="(.*?);*">/gi, '>') // verwijder alle extra "style" elementen
    .replace(/(\r*\n)|(\r(?!\n))|(\v)/g, '<br>') // (Carriage Return[CR] en/of) Linefeed [LF] (alinea-eind) of [CR] of vertical tab [VT] (nieuwe regel), soms door plakken/drag-drop.
    .replace(/(?<!&nbsp;| )&nbsp;(?!&nbsp;| )/g, ' ').replace(/(?<=>) (?=<)/g, '&nbsp;') //                       losse spaties als ' ' plaatsen, tenzij tussen <div> </div>
    .replace(/([^>])((<\/?([briuspmal]*?)>)*?)<br>((<\/([biuspmal]*?)>)*?)<\/div><div>/g, '$1$2$5</div><div>') // drag-drop to empy line, remove <br>
    .replace(/([^>])((<\/?([briuspmal]*?)>)*?)<br>((<\/([biuspmal]*?)>)*?)<div>/g, '$1$2$5<div>') //              drag-drop to empy line, remove <br>
  let textStep = ''
  while (textStep !== text) {
    textStep = text
    text = text.replace(/<([biuspmal]*?)><\/\1>/g, '').replace(/<\/([biuspmal]*?)><\1>/g, '') // opmaak aan & direct weer uit <i></i> of andersom </i><i> er uit halen. (genesteld mogelijk)
  }
  text = text
    .replace(/(?<=<\/div>(?!<\/*div>)|^(?!<\/*div>))(.+?)(?=(?<!<\/*div>)<div>|(?<!<\/*div>)$)/g, '<div>$1</div>') // tekst die geheel buiten div staat ook in een div blok zetten
    // remove <div> in <div> etc. </div></div> to <div>...</div><div>...</div>
    .replace(/(?<!(<\/div>)|(^))<div>/g, '</div><div>') // <div> zonder </div> ervoor, behalve 1e bij start
    .replace(/(<\/div>){2,}/g, '</div>') // vervang dubbele (of meer) </div> door een enkele
    .replace(/<div><\/div>/g, '') // lege div's verwijderen
  return text
}
