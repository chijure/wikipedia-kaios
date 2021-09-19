import { cachedFetch, buildPcsUrl, canonicalizeTitle, getDirection } from '../utils/index'

interface LastModifierDTO {
  anon: boolean;
  user: string;
  gender: string;
}

interface ProtectionDTO {
  edit: string[];
  move: string[];
}

interface Urls {
  320: string;
  640: string;
  800: string;
  1024: string;
}

interface ImageDTO {
  file: string;
  urls: Urls;
}

interface SectionDTO {
  id: number;
  text: string;
  toclevel?: number;
  anchor: string;
  line: string;
}

interface LeadDTO {
  ns: number;
  id: number;
  revision: string;
  lastmodified: Date;
  lastmodifier: LastModifierDTO;
  displaytitle: string;
  normalizedtitle: string;
  // eslint-disable-next-line camelcase
  wikibase_item: string;
  description: string;
  // eslint-disable-next-line camelcase
  description_source: string;
  protection: ProtectionDTO;
  editable: boolean;
  languagecount: number;
  image: ImageDTO;
  sections: SectionDTO[];
}

interface SectionRemainingDTO {
  id: number;
  text: string;
  toclevel: number;
  line: string;
  anchor: string;
  isReferenceSection?: boolean;
}

export interface RemainingDTO {
  sections: SectionRemainingDTO[];
}

interface ArticleDTO {
  lead: LeadDTO;
  remaining: RemainingDTO;
}

export interface SectionModel {
  title: string;
  anchor: string;
  content: string;
  description?: string;
  imageUrl?: string;
  preview?: string;
}

export interface TopModel {
  level: number;
  line: string;
  anchor: string;
  sectionIndex: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getArticle = (lang: string, title: string, moreInformationText: string) => {
  const url = buildPcsUrl(lang, title, 'mobile-sections')
  const dir = getDirection(lang)

  return cachedFetch(url, (data: ArticleDTO) => {
    const parser = new DOMParser()
    const imageUrl = data.lead.image && data.lead.image.urls['320']
    const toc: TopModel[] = []
    const references = {}
    const languageCount = data.lead.languagecount

    // parse info box
    const doc: Document = parser.parseFromString(fixImageUrl(data.lead.sections[0].text, lang), 'text/html')
    const infobox = extractInfobox(doc)
    const preview = extractPreview(doc)

    // parse lead as the first section
    const sections: SectionModel[] = []
    sections.push({
      imageUrl,
      title: data.lead.displaytitle,
      anchor: canonicalizeTitle(data.lead.normalizedtitle),
      description: data.lead.description,
      content: modifyHtmlText(data.lead.sections[0].text, moreInformationText, lang),
      preview
    })
    toc.push({
      level: 1,
      line: data.lead.normalizedtitle,
      anchor: canonicalizeTitle(data.lead.normalizedtitle),
      sectionIndex: 0
    })

    // parse remaining sections
    data.remaining.sections.forEach((s) => {
      const modifiedTextContent = modifyHtmlText(s.text, moreInformationText, lang)
      // new section when toclevel 1
      if (s.toclevel === 1) {
        sections.push({
          title: s.line,
          anchor: s.anchor,
          content: modifiedTextContent
        })
      } else {
        // group into previous section when toclevel > 1
        const previousSection = sections[sections.length - 1]
        const header = 'h' + (s.toclevel + 1)
        const headerLine = `<${header} data-anchor=${s.anchor}>${s.line}</${header}>`
        previousSection.content += headerLine + modifiedTextContent
      }

      // build toc structure (level 1 to 3)
      s.toclevel <= 3 && toc.push({
        level: s.toclevel,
        line: convertPlainText(s.line),
        anchor: s.anchor,
        sectionIndex: sections.length - 1
      })

      // build references list
      if (s.isReferenceSection) {
        const sectionDoc = parser.parseFromString(s.text, 'text/html')
        const refNodes = sectionDoc.querySelectorAll('li[id^="cite_"]')
        for (const refNode of refNodes) {
          const [id, ref] = extractReference(refNode)
          references[id] = ref
        }
      }
    })

    return {
      contentLang: lang,
      namespace: data.lead.ns,
      id: data.lead.id,
      sections,
      infobox,
      toc,
      references,
      languageCount,
      dir
    }
  })
}

const fixImageUrl = (htmlString: string, lang: string): string => {
  // The app is served from the app:// protocol so protocol-relative
  // image sources don't work.
  return htmlString
    .replace(/src="\/\//gi, 'src="https://')
    .replace(/src="\/w\/extensions\//gi, `src="https://${lang}.wikipedia.org/w/extensions/`)
}

const fixTableCaption = (htmlString: string, moreInformationText: string): string => {
  const hiddenClassName = 'hidden-in-table'
  const parser = new DOMParser()
  const node = parser.parseFromString(htmlString, 'text/html')
  const tableNodes = node.querySelectorAll('table')
  for (const tableNode of tableNodes) {
    const thContent = Array.from(tableNode.querySelectorAll('th')).map(th => th.textContent).join(', ')
    const normalizedThContent = thContent.replace(/\[\d+]/g, '')
    if (tableNode.caption && tableNode.caption.textContent) {
      tableNode.caption.innerHTML = `<b class='${hiddenClassName}'>${moreInformationText}:</b><p class='${hiddenClassName}'>${normalizedThContent}</p><span>${tableNode.caption.textContent}</span>`
    } else {
      const caption = tableNode.createCaption()
      caption.className = hiddenClassName
      caption.innerHTML = `<b class='${hiddenClassName}'>${moreInformationText}:</b><p class='${hiddenClassName}'>${normalizedThContent}</p>Table`
    }
    tableNode.setAttribute('style', '')
  }

  return (node.childNodes[0] as HTMLElement).innerHTML
}

const modifyHtmlText = (text, moreInformationText, lang): string => {
  const fixedImageUrlText = fixImageUrl(text, lang)
  return fixTableCaption(fixedImageUrlText, moreInformationText)
}

const convertPlainText = (str: string): string => {
  const dom = document.createElement('div')
  dom.innerHTML = str
  return dom.textContent
}

const extractReference = refNode => {
  const id = refNode.getAttribute('id')
  const [, number] = id.match(/.*?-(\d+)/)
  const refContentNode = refNode.querySelector('.mw-reference-text')
  const content = refContentNode ? refContentNode.outerHTML : ''
  return [id, { number, content }]
}

const extractPreview = doc => {
  const p = doc.querySelector('p')

  if (!p) {
    return ''
  }

  Array.from(p.querySelectorAll('a')).forEach((link: HTMLLinkElement) => {
    const span = document.createElement('span')
    span.textContent = link.textContent
    link.parentNode.replaceChild(span, link)
  })

  Array.from(p.querySelectorAll('.mw-ref')).forEach((ref: HTMLElement) => {
    ref.parentNode.removeChild(ref)
  })

  return p.outerHTML
}

const extractInfobox = (doc: Document) => {
  const infoboxNode: HTMLElement = doc.querySelector('[class^="infobox"]')
  if (infoboxNode) {
    // Clear a bunch of style that interfere with the layout
    infoboxNode.style.width = ''
    infoboxNode.style.fontSize = ''
    const blackListedProps = ['minWidth', 'whiteSpace', 'width']
    Array.from(infoboxNode.querySelectorAll('[style]')).forEach((n: HTMLElement) => {
      blackListedProps.forEach(propName => {
        if (n.style[propName]) {
          n.style[propName] = ''
        }
      })
    })

    // Long URLs in content make the table too wide
    Array.from(infoboxNode.querySelectorAll('a[href]')).forEach((a: HTMLLinkElement) => {
      if (a.href === a.textContent) {
        // Use a shorter text (strip protocol and path)
        const u = new URL(a.href)
        a.textContent = u.hostname;

        // Constrain the parent node and truncate if needed
        (a.parentNode as HTMLElement).classList.add('truncate')
      }
    })

    return infoboxNode.outerHTML
  }
}
