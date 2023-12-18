export function CleanText (content) {
  // <\/?([biuspmal]*?)>)*? = </b> || </i> || </u> || </sup> || </small> || <b> || <i> || <u> || <sup> || <small>
  let text = content
    .replace(/<\/?span(.*?)>/gi, '') //    verwijder alle <span ...> & </span> elementen
    .replace(/ style="(.*?);*">/gi, '>') // verwijder alle extra "style" elementen
    .replace(/\r*\n/g, '<br>') //         (Carriage Return[CR] en/of) Linefeed [LF] (alinea-eind), soms door plakken/drag-drop.
    .replace(/\v/g, '<br>') //            vertical tab [VT] (nieuwe regel)
    .replace(/(?<!&nbsp;| )&nbsp;(?!&nbsp;| )/g, ' ').replace(/(?<=>) (?=<)/g, '&nbsp;') //                       losse spaties als ' ' plaatsen, tenzij tussen <div> </div>
    .replace(/([^>])((<\/?([briuspmal]*?)>)*?)<br>((<\/([biuspmal]*?)>)*?)<\/div><div>/g, '$1$2$5</div><div>') // drag-drop to empy line, remove <br>
    .replace(/([^>])((<\/?([briuspmal]*?)>)*?)<br>((<\/([biuspmal]*?)>)*?)<div>/g, '$1$2$5<div>') //              drag-drop to empy line, remove <br>
  let textStep = ''
  while (textStep !== text) {
    textStep = text
    text = text.replace(/<([biuspmal]*?)><\/\1>/g, '').replace(/<\/([biuspmal]*?)><\1>/g, '') // opmaak aan & direct weer uit <i></i> of andersom </i><i> er uit halen. (genesteld mogelijk)
  }
  return text.replace(/(<div>){2,}/g, '<div>').replace(/(<\/div>){2,}/g, '</div>') // vervang dubbele (of meer) <div> door een enkele
  // uitzoeken losse <br> aanpassen naar <div> etc. volgens editor manier
}
