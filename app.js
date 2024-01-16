import $ from 'jquery';

interface DocumentWithCalcHeight extends Document {
  calcHeight(): void;
}

function setupMetadata(doc: Document): void {
  doc.charset = 'utf-8';
  $(doc.head).append(`<meta name="viewport" content="width=device-width,initial-scale=1.0">`);
}

function addStyles(doc: Document): void {
  $(doc.head).append(`
    <style>
      html, body {
        width: 100%;
        height: 100%;
        padding: 0px;
        margin: 0px;
        overflow: hidden;
        font-family: arial;
        font-size: 10px;
        color: #6e6e6e;
        background-color: #000;
      }
      #preview-frame {
        width: 100%;
        background-color: #fff;
      }
    </style>
  `);
}

function loadLibrary(doc: Document, url: string): Promise<void> {
  return new Promise((resolve) => {
    const script = doc.createElement('script');
    script.src = url;
    script.onload = resolve;
    doc.head.appendChild(script);
  });
}

class PreviewIframe {
  private readonly iframe_: HTMLIFrameElement;

  constructor(url: string) {
    this.iframe_ = document.createElement('iframe');
    this.iframe_.id = 'preview-frame';
    this.iframe_.src = url;
    this.iframe_.name = 'preview-frame';
    this.iframe_.frameBorder = '0';
    this.iframe_.setAttribute('noresize', 'noresize');
  }

  public appendToBody(doc: Document): void {
    doc.body.appendChild(this.iframe_);
  }

  public calculateHeight(doc: DocumentWithCalcHeight): void {
    const previewFrame = doc.getElementById('preview-frame') as HTMLIFrameElement;
    previewFrame.style.height = `${window.innerHeight}px`;
  }
}

async function initPreview(url: string): Promise<DocumentWithCalcHeight> {
  const doc = document.implementation.createHTMLDocument('Untitled');

  setupMetadata(doc);
  addStyles(doc);

  await loadLibrary(doc, '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js');

  const iframe = new PreviewIframe(url);
  iframe.appendToBody(doc);

  doc.calcHeight = (): void => {
    iframe.calculateHeight(doc);
  };

  window.addEventListener('resize', () => {
    doc.calcHeight();
  });

  window.addEventListener('load', () => {
    doc.calcHeight();
  });

  return doc;
}

(() => {
  initPreview('https://mrvero-notux-chat-ui.hf.space').then((doc) => console.log('Initialized successfully.', doc));
})();
