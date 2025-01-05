export function CleanText (content) {
  // <\/?([biuspmal]*?)>)*? = </b> || </i> || </u> || </sup> || </small> || <b> || <i> || <u> || <sup> || <small>
  // = (<\/?b>)|(<\/?i>)|(<\/?u>)|(<\/?sup>)|(<\/?small>)*?
  // <\/?([briuspmal]*?)>)*? = <br> || </b> || </i> || </u> || </sup> || </small> || <b> || <i> || <u> || <sup> || <small>
  let text = content
    .replace(/<\/?span(.*?)>/gi, '') //    verwijder alle <span ...> & </span> elementen
    .replace(/( style="(.*?);*"| class="(.*?)")>/gi, '>') // verwijder alle extra "style" & class elementen
    .replace(/(\r*\n)|(\r(?!\n))|(\v)/g, '<br>') // (Carriage Return[CR] en/of) Linefeed [LF] (alinea-eind) of [CR] of vertical tab [VT] (nieuwe regel), soms door plakken/drag-drop.
    .replace(/(?<!&nbsp;| |>)&nbsp;(?!&nbsp;| |<)/g, ' ') //                       losse spaties als ' ' plaatsen, tenzij na <..> of voor <..>
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
    .replace(/<div><\/div>/g, '') // lege div's

  if (text === '<div><br></div>' || text === '<div></div>') return ''
  return text
}

export function sanitizerHtml (content) {
  if (!content) return content
  // validHtml = 'div|br|p|b|i|u|sub|sup|small|ins|del|mark'
  let text = content
    .replace(/<\/?script(.*?)>/gi, '') //  verwijder alle <script ...> & </script> elementen
    .replace(/<\/?span(.*?)>/gi, '') //    verwijder alle <span ...> & </span> elementen
    .replace(/( style="(.*?);*"| class="(.*?)")>/gi, '>') // verwijder alle extra "style" & class elementen
    .replace(/<(?!\/?(div|br|p|b|i|u|sub|sup|small|ins|del|mark)>)/gi, '&#60;') // vervang alle "<"...> welke niet validHtml hebben
    .replace(/(?<!(<\/?(div|br|p|b|i|u|sub|sup|small|ins|del|mark)))>/gi, '&#62;') // vervang alle <...">" welke niet validHtml hebben
  return text
}

export function sanitizerHtmlPresentation (presentation) {
  if (!presentation) return presentation
  // clean for xxs attack in v-html
  switch (presentation.type) {
    case 'song':
      presentation.settings.title = sanitizerHtml(presentation.settings.title)
      presentation.settings.collection = sanitizerHtml(presentation.settings.collection)
      presentation.settings.number = sanitizerHtml(presentation.settings.number)
      presentation.settings.text = sanitizerHtml(presentation.settings.text).replace(/&nbsp;/g, ' ')
      presentation.settings.translation = sanitizerHtml(presentation.settings.translation).replace(/&nbsp;/g, ' ')
      break
    case 'caption':
      presentation.settings.title = sanitizerHtml(presentation.settings.title)
      presentation.settings.text = sanitizerHtml(presentation.settings.text)
      break
    case 'scripture':
      presentation.settings.title = sanitizerHtml(presentation.settings.title)
      presentation.settings.text = sanitizerHtml(presentation.settings.text)
      presentation.settings.bible = sanitizerHtml(presentation.settings.bible)
      presentation.settings.chapter = presentation.settings.chapter ? parseInt(presentation.settings.chapter) : presentation.settings.chapter
      presentation.settings.verseFrom = presentation.settings.verseFrom ? parseInt(presentation.settings.verseFrom) : presentation.settings.verseFrom
      presentation.settings.verseTo = presentation.settings.verseTo ? parseInt(presentation.settings.verseTo) : presentation.settings.verseTo
      break
    case 'image':
    case 'video':
        presentation.settings.title = sanitizerHtml(presentation.settings.title)
        break
    case 'countdown':
      break
    default:
  }

  return presentation
}


export function sanitizerHtmlService (service) {
  if (!service) return service
  // clean for xxs attack in v-html
  service.presentations.forEach(presentation => {
    // eslint-disable-next-line no-unused-vars
    presentation = sanitizerHtmlPresentation(presentation)
  })

  return service
}
